import { Context } from "hono";
import { getAuth } from "@hono/clerk-auth";
import { Env } from "@/lib/bindings";

/**
 * Helper to require admin authentication
 * TODO: Implement proper admin role checking
 */
export function requireAdminAuth(c: Context<{ Bindings: Env }>) {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json(
      {
        success: false,
        error: "Authentication required",
        message: "You must be signed in to access this endpoint",
      },
      401
    );
  }

  // TODO: Add proper admin role checking here
  // For now, we'll just check authentication
  // In the future, you might check:
  // - if (auth.orgRole !== 'admin') return c.json({ error: "Admin access required" }, 403);
  // - or check against a list of admin user IDs
  // - or use Clerk's organization permissions

  return auth;
}

/**
 * Helper to get user ID and email address
 * Returns an object with userId and email, or null if not authenticated
 */
export async function getUserInfo(c: Context<{ Bindings: Env }>) {
  const auth = getAuth(c);

  if (!auth?.userId) {
    throw new Error(
      "User not authenticated - this should not happen after auth middleware"
    );
  }

  try {
    const clerk = c.get("clerk");
    const user = await clerk.users.getUser(auth.userId);

    const email =
      user.emailAddresses?.find((e) => e.verification?.status === "verified")
        ?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      throw new Error("User does not have a verified email address");
    }

    return {
      auth,
      userId: auth.userId,
      userEmail: email,
    };
  } catch (error) {
    throw new Error(`Failed to fetch user details: ${error}`);
  }
}

/**
 * Helper to get authenticated user info when you know the user is authenticated
 * (e.g., after auth middleware has run). This version doesn't return null.
 * Use this in routes that are protected by requireAuthMiddleware.
 */
export async function getAuthenticatedUserInfo(c: Context<{ Bindings: Env }>) {
  const auth = getAuth(c);

  // Since this is called after auth middleware, we know auth.userId exists
  // But we'll still check for safety and throw an error if something's wrong
  if (!auth?.userId) {
    throw new Error(
      "User not authenticated - this should not happen after auth middleware"
    );
  }

  try {
    const clerk = c.get("clerk");
    const user = await clerk.users.getUser(auth.userId);

    const email =
      user.emailAddresses?.find((e) => e.verification?.status === "verified")
        ?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress;

    return {
      userId: auth.userId,
      email: email || null,
    };
  } catch (error) {
    throw new Error(`Failed to fetch user details: ${error}`);
  }
}

/**
 * Helper to get just the auth object when you know the user is authenticated
 * (e.g., after auth middleware has run). This version doesn't return null.
 */
export function getAuthenticatedAuth(c: Context<{ Bindings: Env }>) {
  const auth = getAuth(c);

  if (!auth?.userId) {
    throw new Error(
      "User not authenticated - this should not happen after auth middleware"
    );
  }

  return auth;
}

/**
 * Helper to get user's institution draft DO
 */
export function getUserInstitutionDO(
  c: Context<{ Bindings: Env }>,
  userId: string
) {
  const doId = c.env.INSTITUTION_DRAFT.idFromName(userId);
  return c.env.INSTITUTION_DRAFT.get(doId);
}

/**
 * Helper to get admin registry DO
 */
export function getAdminRegistryDO(c: Context<{ Bindings: Env }>) {
  const doId = c.env.ADMIN_REGISTRY_DO.idFromName("admin-registry");
  return c.env.ADMIN_REGISTRY_DO.get(doId);
}
