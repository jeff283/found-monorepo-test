"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  requireInstitutionAuth,
  handleAuthError,
} from "@/utils/institution-auth-handler";
import { ApiResponse } from "@/api/lib/types";

/**
 * Server action to update user's public metadata with job title
 * This follows Clerk's best practices for storing custom user data
 * that should be accessible to both frontend and backend
 */

export async function updateOrgEmailDomain(orgId: string, emailDomain: string) {
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      error: "User not authenticated",
    };
  }

  if (!emailDomain || emailDomain.trim() === "") {
    return {
      success: false,
      error: "Email domain is required",
    };
  }

  const client = await clerkClient();

  try {
    await client.organizations.updateOrganization(orgId, {
      publicMetadata: {
        emailDomain: emailDomain.trim(),
      },
    });
    return {
      success: true,
      message: "Organization email domain updated successfully",
    };
  } catch (error) {
    console.error("Error updating organization email domain:", error);
    return {
      success: false,
      error: "Failed to update organization email domain. Please try again.",
    };
  }
}

export type GetOrgInfoResponse = ApiResponse<{
  id: string;
  name: string | null;
  imageUrl: string | null;
  emailDomain: string | null;
}>;

/**
 * Server action to fetch current organization basic info (name, image, public email domain)
 */
export async function getOrganizationInfo(): Promise<GetOrgInfoResponse> {
  try {
    const { orgId } = await requireInstitutionAuth();

    const client = await clerkClient();

    const org = await client.organizations.getOrganization({
      organizationId: orgId,
    });

    return {
      success: true,
      data: {
        id: org.id,
        name: org.name ?? null,
        imageUrl: (org.imageUrl as string) ?? null,
        emailDomain:
          typeof org.publicMetadata?.emailDomain === "string"
            ? org.publicMetadata.emailDomain
            : org.publicMetadata?.emailDomain
              ? String(org.publicMetadata.emailDomain)
              : null,
      },
    };
  } catch (error) {
    console.error("Error fetching organization info:", error);

    const authError = handleAuthError(error);
    if (authError) return authError as GetOrgInfoResponse;

    return {
      success: false,
      error: "Failed to retrieve organization info",
    };
  }
}
