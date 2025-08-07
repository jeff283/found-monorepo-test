import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Context, Next } from "hono";
import { Env } from "@/lib/bindings";

/**
 * 🌐 CORS middleware with security-focused origin validation
 * Using function-based validation for wildcard domains as recommended by Hono docs
 */
export const corsMiddleware = cors({
  origin: (origin, c) => {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return "*";

    // Production domains
    if (
      origin === "https://foundlyhq.com" ||
      origin === "https://app.foundlyhq.com"
    ) {
      return origin;
    }

    // Development - localhost on any port
    if (origin.match(/^http:\/\/localhost(:\d+)?$/)) {
      return origin;
    }

    // Wildcard subdomains for foundlyhq.com (with protocol verification)
    if (/^https:\/\/[\w\-]+\.foundlyhq\.com$/.test(origin)) {
      return origin;
    }

    // Wildcard subdomains for foundlyhq.workers.dev (with protocol verification)
    if (/^https:\/\/[\w\-]+\.foundlyhq\.workers\.dev$/.test(origin)) {
      return origin;
    }

    // Preview deployments (Cloudflare Pages pattern)
    // if (/^https:\/\/[\w\-]+\.foundly-monorepo\.pages\.dev$/.test(origin)) {
    //   return origin;
    // }

    // Reject all other origins
    return null;
  },
  credentials: true, // Allow credentials for authenticated requests
  allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposeHeaders: ["X-Request-Id"], // Expose custom headers if you use them
  maxAge: 86400, // Cache preflight for 24 hours
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
