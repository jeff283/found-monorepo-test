import { auth } from "@clerk/nextjs/server";

export async function requireInstitutionAuth() {
  const { userId, orgId, orgRole, orgPermissions } = await auth();

  if (!userId) throw new Error("User not authenticated");
  if (!orgId) throw new Error("User must be part of an organization");

  return { userId, orgId, orgRole, orgPermissions };
}

export function handleAuthError(error: unknown) {
  if (
    error instanceof Error &&
    (error.message === "User not authenticated" ||
      error.message === "User must be part of an organization")
  ) {
    return { success: false, error: error.message };
  }
}
