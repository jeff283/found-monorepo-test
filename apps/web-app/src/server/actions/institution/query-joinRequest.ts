"use server";
import { db } from "@/db/drizzle";
import z from "zod";
import { ApiResponse } from "@/api/lib/types";
import { eq, desc, and, count } from "drizzle-orm";
import {
  requireInstitutionAuth,
  handleAuthError,
} from "@/utils/institution-auth-handler";
import { parseZodError } from "@/utils/zod-error-parse";
import { paginationInput, withDefaults } from "@/utils/paginated-schema";
import { clerkClient } from "@clerk/nextjs/server";
import {
  joinRequest,
  JoinRequest,
} from "@/db/drizzle/schema/institution/joinRequest";

export type EnrichedJoinRequest = Omit<
  JoinRequest,
  "tenantClerkId" | "email"
> & {
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
};

const getJoinRequestsInput = paginationInput;
const getJoinRequestsSchema = withDefaults(getJoinRequestsInput, {
  limit: 10,
  offset: 0,
  getAll: false,
});

export type GetJoinRequestsResponse = ApiResponse<{
  joinRequests: EnrichedJoinRequest[];
  total: number;
}>;

export async function getJoinRequests(
  options?: z.input<typeof getJoinRequestsInput>
): Promise<GetJoinRequestsResponse> {
  try {
    const { orgId } = await requireInstitutionAuth();
    const validated = getJoinRequestsSchema.parse(options ?? {});

    // Count query
    const [{ count: total }] = await db
      .select({ count: count() })
      .from(joinRequest)
      .where(eq(joinRequest.tenantClerkId, orgId));

    if (Number(total) === 0) {
      return { success: true, data: { joinRequests: [], total: 0 } };
    }

    // Base query
    const baseQuery = db
      .select()
      .from(joinRequest)
      .where(eq(joinRequest.tenantClerkId, orgId))
      .orderBy(desc(joinRequest.createdAt));

    const requests = validated.getAll
      ? await baseQuery
      : await baseQuery
          .limit(validated.limit ?? 20)
          .offset(validated.offset ?? 0);

    // Clerk lookup
    const userIds = requests.map((r) => r.userClerkId);
    const usersResp = await (
      await clerkClient()
    ).users.getUserList({
      userId: userIds,
    });

    const usersById = new Map(usersResp.data.map((u) => [u.id, u]));

    const enriched: EnrichedJoinRequest[] = requests.map((r) => {
      const u = usersById.get(r.userClerkId);
      return {
        ...r,
        email: u?.primaryEmailAddress?.emailAddress ?? null,
        name: u?.fullName ?? null,
        avatarUrl: u?.imageUrl ?? null,
      };
    });

    return {
      success: true,
      data: { joinRequests: enriched, total: Number(total) },
    };
  } catch (error) {
    console.error("Error retrieving join requests:", error);
    const zodError = parseZodError(error);
    if (zodError) return zodError;

    const authError = handleAuthError(error);
    if (authError) return authError;

    return { success: false, error: "Failed to retrieve join requests" };
  }
}

const updateJoinRequestSchema = z.object({
  id: z.uuid(),
  action: z.enum(["approve", "reject"]),
  role: z.enum(["org:admin", "org:member"]).optional(), // default "org:member"
});

export type UpdateJoinRequestResponse = ApiResponse<JoinRequest>;

export async function updateJoinRequest(
  input: z.infer<typeof updateJoinRequestSchema>
): Promise<UpdateJoinRequestResponse> {
  try {
    const { orgId, orgRole } = await requireInstitutionAuth();

    if (orgRole !== "org:admin") {
      return { success: false, error: "Insufficient permissions" };
    }

    const { id, action, role } = updateJoinRequestSchema.parse(input);

    // Find join request
    const [request] = await db
      .select()
      .from(joinRequest)
      .where(and(eq(joinRequest.id, id), eq(joinRequest.tenantClerkId, orgId)))
      .limit(1);

    if (!request) {
      return { success: false, error: "Join request not found" };
    }

    if (request.status !== "pending") {
      return { success: false, error: "Join request is not pending" };
    }

    if (action === "reject") {
      const [updated] = await db
        .update(joinRequest)
        .set({ status: "rejected" })
        .where(eq(joinRequest.id, id))
        .returning();
      return { success: true, data: updated };
    }

    // Approve
    const client = await clerkClient();

    await client.organizations.createOrganizationMembership({
      organizationId: orgId,
      userId: request.userClerkId,
      role: role ?? "org:member",
    });

    const [updated] = await db
      .update(joinRequest)
      .set({ status: "approved" })
      .where(eq(joinRequest.id, id))
      .returning();

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating join request:", error);
    const zodError = parseZodError(error);
    if (zodError) return zodError;

    const authError = handleAuthError(error);
    if (authError) return authError;

    return { success: false, error: "Failed to update join request" };
  }
}

export type GetJoinRequestsCountResponse = ApiResponse<{
  count: number;
}>;

export async function getJoinRequestsCount(): Promise<GetJoinRequestsCountResponse> {
  try {
    const { orgId } = await requireInstitutionAuth();

    const [{ joinCount }] = await db
      .select({ joinCount: count() })
      .from(joinRequest)
      .where(eq(joinRequest.tenantClerkId, orgId));

    return {
      success: true,
      data: { count: Number(joinCount) },
    };
  } catch (error) {
    console.error("Error retrieving join request count:", error);

    const authError = handleAuthError(error);
    if (authError) return authError;

    return { success: false, error: "Failed to retrieve join request count" };
  }
}
