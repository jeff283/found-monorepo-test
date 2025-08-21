"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * Server action to update user's public metadata with job title
 * This follows Clerk's best practices for storing custom user data
 * that should be accessible to both frontend and backend
 */
export async function updateUserJobTitle(jobTitle: string) {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      error: "User not authenticated",
    };
  }

  if (!jobTitle || jobTitle.trim() === "") {
    return {
      success: false,
      error: "Job title is required",
    };
  }

  try {
    const client = await clerkClient();

    const result = await client.users.updateUser(userId, {
      publicMetadata: {
        jobTitle: jobTitle.trim(),
      },
    });

    return {
      success: true,
      message: "Job title updated successfully",
      publicMetadata: result.publicMetadata,
    };
  } catch (error) {
    console.error("Error updating user job title:", error);
    return {
      success: false,
      error: "Failed to update job title. Please try again.",
    };
  }
}
