import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Context, Next } from "hono";
import { Env } from "@/lib/bindings";

/**
 * 🌐 CORS middleware with default settings
 */
export const corsMiddleware = cors({
  origin: [
    "https://foundlyhq.com",
    "https://app.foundlyhq.com",
    "http://localhost:3000",
    "https://*.foundlyhq.com",
    "https://*.foundlyhq.workers.dev",
  ],
});

/**
 * 📝 Request logging middleware
 */
export const loggerMiddleware = logger();

export const clerkAuthMiddleware = clerkMiddleware();

/**
 * 🔐 Authentication middleware that requires user to be logged in
 * Acts as a gate - returns 401 if not authenticated, otherwise continues
 */
export const requireAuthMiddleware = async (
  c: Context<{ Bindings: Env }>,
  next: Next
) => {
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

  await next();
};

/**
 * 🔐 Admin authentication middleware that requires admin privileges
 * TODO: Implement proper admin role checking
 */
export const requireAdminMiddleware = async (
  c: Context<{ Bindings: Env }>,
  next: Next
) => {
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
  // - Check user role from database
  // - Check Clerk organization permissions
  // - Check against allowlist of admin user IDs

  await next();
};
