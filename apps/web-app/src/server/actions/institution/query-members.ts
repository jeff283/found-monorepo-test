"use server";
import z from "zod";
import { ApiResponse } from "@/api/lib/types";
import {
  requireInstitutionAuth,
  handleAuthError,
} from "@/utils/institution-auth-handler";
import { clerkClient } from "@clerk/nextjs/server";
import { parseZodError } from "@/utils/zod-error-parse";

// Types for organization members
export type OrganizationMember = {
  id: string;
  userId: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  role: string;
  joinedAt: Date;
  status: "active" | "pending";
};

export type OrganizationInvitation = {
  id: string;
  emailAddress: string;
  role: string;
  status: "pending" | "accepted" | "expired";
  createdAt: Date;
  expiresAt: Date;
};

// Get all organization members
const getMembersSchema = z
  .object({
    limit: z.number().min(1).max(100).optional().default(10),
    offset: z.number().min(0).optional().default(0),
    getAll: z.boolean().optional().default(false),
  })
  .default({
    limit: 10,
    offset: 0,
    getAll: false,
  });

export type GetMembersResponse = ApiResponse<{
  members: OrganizationMember[];
  total: number;
}>;

export async function getMembers(
  options?: z.infer<typeof getMembersSchema>
): Promise<GetMembersResponse> {
  try {
    const { orgId } = await requireInstitutionAuth();
    const validatedOptions = getMembersSchema.parse(options);

    // Get organization memberships from Clerk
    const membershipsResp = await (
      await clerkClient()
    ).organizations.getOrganizationMembershipList({
      organizationId: orgId,
      limit: validatedOptions.getAll ? 500 : validatedOptions.limit,
      offset: validatedOptions.getAll ? 0 : validatedOptions.offset,
    });

    const memberships = membershipsResp.data;

    // Get user details for all members
    const userIds = memberships
      .map((m) => m.publicUserData?.userId)
      .filter(Boolean);
    const users =
      userIds.length > 0
        ? await (
            await clerkClient()
          ).users.getUserList({
            userId: userIds as string[],
          })
        : { data: [] };

    // Create a map for quick user lookup
    const usersById = new Map(users.data.map((u) => [u.id, u]));

    // Transform memberships to our format
    const members: OrganizationMember[] = memberships
      .filter((m) => m.publicUserData?.userId) // Filter out any without userId
      .map((membership) => {
        const user = usersById.get(membership.publicUserData!.userId);
        return {
          id: membership.id,
          userId: membership.publicUserData!.userId,
          email: user?.primaryEmailAddress?.emailAddress || null,
          name: user?.fullName || null,
          avatarUrl: user?.imageUrl || null,
          role: membership.role,
          joinedAt: new Date(membership.createdAt),
          status: "active" as const,
        };
      });

    return {
      success: true,
      data: {
        members,
        total: memberships.length,
      },
    };
  } catch (error) {
    console.error("Error retrieving members:", error);

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
      error: "Failed to retrieve members",
    };
  }
}

// Get organization invitations
export type GetInvitationsResponse = ApiResponse<{
  invitations: OrganizationInvitation[];
  total: number;
}>;

export async function getInvitations(): Promise<GetInvitationsResponse> {
  try {
    const { orgId } = await requireInstitutionAuth();

    // Get organization invitations from Clerk
    const invitationsResp = await (
      await clerkClient()
    ).organizations.getOrganizationInvitationList({
      organizationId: orgId,
    });

    const invitations: OrganizationInvitation[] = invitationsResp.data.map(
      (inv) => ({
        id: inv.id,
        emailAddress: inv.emailAddress,
        role: inv.role,
        status: (inv.status as "pending" | "accepted" | "expired") || "pending",
        createdAt: new Date(inv.createdAt),
        expiresAt: new Date(inv.expiresAt),
      })
    );

    return {
      success: true,
      data: {
        invitations,
        total: invitations.length,
      },
    };
  } catch (error) {
    console.error("Error retrieving invitations:", error);

    const authError = handleAuthError(error);
    if (authError) {
      return authError;
    }

    return {
      success: false,
      error: "Failed to retrieve invitations",
    };
  }
}

// Invite a new member to the organization
const inviteMemberSchema = z.object({
  email: z.email("Please enter a valid email address"),
  role: z.enum(["org:member", "org:admin"]).default("org:member"),
});

export type InviteMemberResponse = ApiResponse<{
  invited: boolean;
  invitationId?: string;
}>;

export async function inviteMember(
  input: z.infer<typeof inviteMemberSchema>
): Promise<InviteMemberResponse> {
  try {
    const { orgId } = await requireInstitutionAuth();
    const { email, role } = inviteMemberSchema.parse(input);

    const client = await clerkClient();

    // Get organization email domain from metadata
    const org = await client.organizations.getOrganization({
      organizationId: orgId,
    });
    const emailDomain = org.publicMetadata?.emailDomain as string;

    if (emailDomain) {
      const userDomain = email.split("@")[1]?.toLowerCase();
      if (!userDomain || userDomain !== emailDomain.toLowerCase()) {
        return {
          success: false,
          error: `Only users with @${emailDomain} email addresses can be invited to this organization`,
        };
      }
    }

    // Check if user already exists
    const existingUsers = await client.users.getUserList({
      emailAddress: [email],
    });
    const existing = existingUsers.data[0];

    if (existing) {
      // Check if user is already a member
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

      // Add existing user directly
      await client.organizations.createOrganizationMembership({
        organizationId: orgId,
        userId: existing.id,
        role,
      });

      return {
        success: true,
        data: { invited: false },
      };
    }

    // Send invitation to new user
    const invitation = await client.organizations.createOrganizationInvitation({
      organizationId: orgId,
      emailAddress: email,
      role,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`,
    });

    return {
      success: true,
      data: {
        invited: true,
        invitationId: invitation.id,
      },
    };
  } catch (error) {
    console.error("Error inviting member:", error);
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
      error: "Failed to invite member",
    };
  }
}

// Remove a member from the organization
const removeMemberSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export type RemoveMemberResponse = ApiResponse<{
  removed: boolean;
}>;

export async function removeMember(
  input: z.infer<typeof removeMemberSchema>
): Promise<RemoveMemberResponse> {
  try {
    const { orgId } = await requireInstitutionAuth();
    const { userId } = removeMemberSchema.parse(input);

    // Get the membership to remove
    const memberships = await (
      await clerkClient()
    ).organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

    const membership = memberships.data.find(
      (m) => m.publicUserData?.userId === userId
    );

    if (!membership) {
      return {
        success: false,
        error: "User is not a member of this organization",
      };
    }

    // Remove the membership

    await (
      await clerkClient()
    ).organizations.deleteOrganizationMembership({
      organizationId: orgId,
      userId: membership.id,
    });

    return {
      success: true,
      data: { removed: true },
    };
  } catch (error) {
    console.error("Error removing member:", error);

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
      error: "Failed to remove member",
    };
  }
}

// Cancel an invitation
const cancelInvitationSchema = z.object({
  invitationId: z.string().min(1, "Invitation ID is required"),
});

export type CancelInvitationResponse = ApiResponse<{
  cancelled: boolean;
}>;

export async function cancelInvitation(
  input: z.infer<typeof cancelInvitationSchema>
): Promise<CancelInvitationResponse> {
  try {
    const { orgId } = await requireInstitutionAuth();
    const { invitationId } = cancelInvitationSchema.parse(input);

    await (
      await clerkClient()
    ).organizations.revokeOrganizationInvitation({
      organizationId: orgId,
      invitationId,
    });

    return {
      success: true,
      data: { cancelled: true },
    };
  } catch (error) {
    console.error("Error cancelling invitation:", error);

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
      error: "Failed to cancel invitation",
    };
  }
}
