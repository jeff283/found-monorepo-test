"use server";
import { db } from "@/db/drizzle";
import z from "zod";
import { ApiResponse } from "@/api/lib/types";
import { eq, desc, and, sql } from "drizzle-orm";
import {
  requireInstitutionAuth,
  handleAuthError,
} from "@/utils/institution-auth-handler";
import { clerkClient } from "@clerk/nextjs/server";
import { agent, Agent } from "@/db/drizzle/schema/institution/agent";
import { location } from "@/db/drizzle/schema/institution/locations";
import { parseZodError } from "@/utils/zod-error-parse";
import { tenant } from "@/db/drizzle/schema/tenant";
// Get a list of agents

export type EnrichedAgent = Omit<Agent, "tenantClerkId"> & {
  email: string | null;
  name: string | null;
  location: string | null;
  avatarUrl: string | null;
  foundItems: number;
};

const getAgentsSchema = z
  .object({
    limit: z.number().min(1).max(100).optional().default(10),
    offset: z.number().min(0).optional().default(0),
    getAll: z.boolean().optional().default(false),
    locationId: z.uuid().optional(),
    // createdAfter: z.date().optional(),
    // createdBefore: z.date().optional(),
  })
  .default({
    limit: 10,
    offset: 0,
    getAll: false,
  });

export type getAgentsResponse = ApiResponse<{
  agents: EnrichedAgent[];
  total: number;
}>;

export async function getAgents(
  options?: z.infer<typeof getAgentsSchema>
): Promise<getAgentsResponse> {
  try {
    const { orgId } = await requireInstitutionAuth();
    const validatedOptions = getAgentsSchema.parse(options);

    // Build where conditions
    const whereConditions = [eq(agent.tenantClerkId, orgId)];
    if (validatedOptions.locationId) {
      whereConditions.push(eq(agent.locationId, validatedOptions.locationId));
    }

    // Single query: fetch agents + total count
    const baseQuery = db
      .select({
        id: agent.id,
        userClerkId: agent.userClerkId,
        locationId: agent.locationId,
        location: location.name,
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt,
        total: sql<number>`count(*) over()`, // window function
      })
      .from(agent)
      .where(and(...whereConditions))
      .orderBy(desc(agent.createdAt))
      .leftJoin(
        location,
        and(
          eq(location.id, agent.locationId),
          eq(location.tenantClerkId, orgId)
        )
      );

    const agents = validatedOptions.getAll
      ? await baseQuery
      : await baseQuery
          .limit(validatedOptions.limit)
          .offset(validatedOptions.offset);

    if (agents.length === 0) {
      return {
        success: true,
        data: { agents: [], total: 0 },
      };
    }

    // Clerk lookup
    const userIds = agents.map((a) => a.userClerkId);
    const users = await (
      await clerkClient()
    ).users.getUserList({
      userId: userIds,
    });

    const enrichedAgents: EnrichedAgent[] = agents.map((a) => {
      const user = users.data.find((u) => u.id === a.userClerkId);

      return {
        id: a.id,
        userClerkId: a.userClerkId,
        locationId: a.locationId,
        location: a.location,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        email: user?.primaryEmailAddress?.emailAddress || null,
        name: user?.fullName || null,
        avatarUrl: user?.imageUrl || null,
        foundItems: 0, // placeholder
      };
    });

    return {
      success: true,
      data: {
        agents: enrichedAgents,
        total: Number(agents[0].total), // same for all rows
      },
    };
  } catch (error) {
    console.error("Error retrieving agents:", error);

    const zodError = parseZodError(error);
    if (zodError) return zodError;

    const authError = handleAuthError(error);
    if (authError) return authError;

    return {
      success: false,
      error: "Failed to retrieve agents",
    };
  }
}

const getAgentSchema = z.object({
  id: z.uuid(),
});

export type getAgentResponse = ApiResponse<EnrichedAgent>;

export async function getAgent(
  agentId: z.infer<typeof getAgentSchema>
): Promise<getAgentResponse> {
  try {
    const { orgId } = await requireInstitutionAuth();
    const validatedAgentId = getAgentSchema.parse({ id: agentId });

    const agents = await db
      .select({
        id: agent.id,
        userClerkId: agent.userClerkId,
        locationId: agent.locationId,
        location: location.name,
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt,
      })
      .from(agent)
      .where(
        and(eq(agent.tenantClerkId, orgId), eq(agent.id, validatedAgentId.id))
      )
      .leftJoin(
        location,
        and(
          eq(location.id, agent.locationId),
          eq(location.tenantClerkId, orgId)
        )
      )
      .limit(1); // Ensure only one comes back

    const dbAgent = agents.at(0);
    if (!dbAgent) {
      return {
        success: false,
        error: "Agent not found",
      };
    }

    // Get email, name, avatar from clerk
    const user = await (await clerkClient()).users.getUser(dbAgent.userClerkId);

    const enrichedAgent: EnrichedAgent = {
      ...dbAgent,
      email: user?.primaryEmailAddress?.emailAddress || null,
      name: user?.fullName || null,
      avatarUrl: user?.imageUrl || null,
      foundItems: 0,
    };

    return {
      success: true,
      data: enrichedAgent,
    };
  } catch (error) {
    console.error("Error retrieving agent:", error);

    const zodError = parseZodError(error);
    if (zodError) {
      return zodError;
    }

    const authError = handleAuthError(error);
    if (authError) {
      return authError;
    }

    return {
      success: false,
      error: "Failed to retrieve agent",
    };
  }
}

// CREATE AGENT

// Get available members

// const getAvailableMembersSchema = z.object({}).default({});

export type GetAvailableMembersResponse = ApiResponse<{
  members: {
    userClerkId: string;
    email: string | null;
    name: string | null;
    avatarUrl: string | null;
  }[];
}>;

export async function getAvailableMembers(): Promise<GetAvailableMembersResponse> {
  // options?: z.infer<typeof getAvailableMembersSchema>
  try {
    const { orgId } = await requireInstitutionAuth();
    // getAvailableMembersSchema.parse(options ?? {});

    // 1) Fetch org memberships
    const membershipsResp = await (
      await clerkClient()
    ).organizations.getOrganizationMembershipList({ organizationId: orgId });

    // 2) Validate membership integrity (no null userIds)
    const memberships = membershipsResp.data;
    const membershipsMissingUserId = memberships.filter(
      (m) => !m?.publicUserData?.userId
    );
    if (membershipsMissingUserId.length > 0) {
      // Fail fast — this indicates inconsistent org data
      throw new Error(
        `Found ${membershipsMissingUserId.length} membership(s) without a userId`
      );
    }

    const orgUserIds = memberships.map(
      (m) => m.publicUserData!.userId as string
    );

    // // 3) Get existing agents for this org
    // const existingAgents = await db
    //   .select({ userClerkId: agent.userClerkId })
    //   .from(agent)
    //   .where(eq(agent.tenantClerkId, orgId));
    // const existingIds = new Set(existingAgents.map((a) => a.userClerkId));

    // // 4) Filter to users who are NOT already agents
    // const candidateIds = orgUserIds.filter((id) => !existingIds.has(id));

    // Filter to users who are NOT already agents
    // Convert JS array to Postgres array literal
    const pgArrayLiteral = `{${orgUserIds.map((id) => `"${id}"`).join(",")}}`;
    const rows = await db.execute<{
      user_clerk_id: string;
    }>(sql`
          SELECT unnest(${pgArrayLiteral}::text[]) AS "user_clerk_id"
          EXCEPT
          SELECT "user_clerk_id"
          FROM ${agent}
          WHERE "tenant_clerk_id" = ${orgId}
      `);

    const candidateIds = rows.map((r) => r.user_clerk_id);

    if (candidateIds.length === 0) {
      return { success: true, data: { members: [] } };
    }

    // 5) Batch fetch Clerk users to get email/name/avatar
    const usersResp = await (
      await clerkClient()
    ).users.getUserList({
      userId: candidateIds,
    });

    // Build quick lookup
    const usersById = new Map(usersResp.data.map((u) => [u.id, u]));

    // 6) Assemble response
    const members = candidateIds.map((id) => {
      const u = usersById.get(id);
      if (!u) {
        // If Clerk returned no user for an id we asked for, treat as error
        throw new Error(`Clerk user not found for id ${id}`);
      }
      return {
        userClerkId: u.id,
        email: u.primaryEmailAddress?.emailAddress ?? null,
        name: u.fullName ?? null,
        avatarUrl: u.imageUrl ?? null,
      };
    });

    return { success: true, data: { members } };
  } catch (error) {
    console.error("Error fetching available members:", error);

    const zodError = parseZodError(error);
    if (zodError) return zodError;

    const authError = handleAuthError(error);
    if (authError) return authError;

    return { success: false, error: "Failed to fetch available members" };
  }
}

// Add agent to db

const addAgentSchema = z.object({
  userMemberClerkId: z.string().min(1),
  locationId: z.uuid(),
});

export type AddAgentResponse = ApiResponse<EnrichedAgent>;

export async function addAgent(
  input: z.infer<typeof addAgentSchema>
): Promise<AddAgentResponse> {
  try {
    const { orgId } = await requireInstitutionAuth();
    const { userMemberClerkId, locationId } = addAgentSchema.parse(input);

    // 1. Validate location belongs to org
    const loc = await db
      .select({ id: location.id })
      .from(location)
      .where(
        and(eq(location.id, locationId), eq(location.tenantClerkId, orgId))
      )
      .limit(1);

    if (loc.length === 0) {
      return { success: false, error: "Invalid location for this org" };
    }

    // 2. Verify user is in org
    const membership = await (
      await clerkClient()
    ).organizations.getOrganizationMembershipList({ organizationId: orgId });
    const isMember = membership.data.some(
      (m) => m.publicUserData?.userId === userMemberClerkId
    );
    if (!isMember) {
      return { success: false, error: "User is not a member of this org" };
    }

    // 3. Check if already an agent
    const existing = await db
      .select()
      .from(agent)
      .where(
        and(
          eq(agent.tenantClerkId, orgId),
          eq(agent.userClerkId, userMemberClerkId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return { success: false, error: "Agent already exists for this user" };
    }

    // 4. Insert agent
    const [inserted] = await db
      .insert(agent)
      .values({
        userClerkId: userMemberClerkId,
        tenantClerkId: orgId,
        locationId,
      })
      .returning();

    // 5. Enrich with Clerk user
    const user = await (await clerkClient()).users.getUser(userMemberClerkId);

    const enriched: EnrichedAgent = {
      ...inserted,
      location: null, // could fetch location name if needed
      email: user?.primaryEmailAddress?.emailAddress || null,
      name: user?.fullName || null,
      avatarUrl: user?.imageUrl || null,
      foundItems: 0,
    };

    return { success: true, data: enriched };
  } catch (error) {
    console.error("Error adding agent:", error);
    return { success: false, error: "Failed to add agent" };
  }
}

// Invite agent to join platform / organization

const inviteUserSchema = z.object({
  email: z.email(),
});

export type InviteUserResponse = ApiResponse<{
  invited: boolean;
  added?: boolean;
}>;

export async function inviteUserToOrg(
  input: z.infer<typeof inviteUserSchema>
): Promise<InviteUserResponse> {
  try {
    const { orgId } = await requireInstitutionAuth();
    if (!orgId) {
      return { success: false, error: "No active organization" };
    }

    const { email } = inviteUserSchema.parse(input);

    // 🔎 1. Get email domain (first from DB, fallback to Clerk org metadata)
    let emailDomain: string | null = null;

    const [tenantRow] = await db
      .select({ emailDomain: tenant.emailDomain })
      .from(tenant)
      .where(eq(tenant.clerkId, orgId))
      .limit(1);

    if (tenantRow?.emailDomain) {
      emailDomain = tenantRow.emailDomain;
    } else {
      const org = await (
        await clerkClient()
      ).organizations.getOrganization({ organizationId: orgId });
      const md = (org?.publicMetadata ?? org?.privateMetadata ?? {}) as Record<
        string,
        unknown
      >;
      emailDomain = typeof md.emailDomain === "string" ? md.emailDomain : null;
    }

    // 🔒 2. Strict domain enforcement
    if (emailDomain) {
      const domain = email.split("@").pop()?.toLowerCase();
      if (!domain || domain !== emailDomain.toLowerCase()) {
        return { success: false, error: "Invalid email domain" };
      }
    }

    const client = await clerkClient();

    // 👤 3. If the user already exists in Clerk, add them directly
    const existingUsers = await client.users.getUserList({
      emailAddress: [email],
    });
    const existing = existingUsers.data[0];

    if (existing) {
      const { data: memberships } =
        await client.users.getOrganizationMembershipList({
          userId: existing.id,
          limit: 500,
        });

      if (memberships.some((m) => m.organization.id === orgId)) {
        return {
          success: false,
          error: "User is already a member of this organization",
        };
      }

      await client.organizations.createOrganizationMembership({
        organizationId: orgId,
        userId: existing.id,
        role: "org:member",
      });

      return { success: true, data: { invited: false, added: true } };
    }

    // 📧 4. Otherwise, send an organization invitation
    await client.organizations.createOrganizationInvitation({
      organizationId: orgId,
      emailAddress: email,
      role: "org:member",
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`,
    });

    return { success: true, data: { invited: true } };
  } catch (error) {
    console.error("Error inviting user:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error as { status?: number }).status === 409
    ) {
      return {
        success: false,
        error: "An active invitation already exists for this email",
      };
    }
    return { success: false, error: "Failed to invite user" };
  }
}
