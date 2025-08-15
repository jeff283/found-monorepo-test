"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

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
