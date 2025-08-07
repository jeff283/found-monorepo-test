import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Context, Next } from "hono";
import { Env } from "@/lib/bindings";
import { getUserInfo } from "@/lib/auth-helpers";
import { z } from "zod";

// Lightweight Zod schema for admin email validation
const adminEmailSchema = z
  .string()
  .email("Invalid email format")
  .refine((email) => email.endsWith("@foundlyhq.com"), {
    message: "Admin access requires @foundlyhq.com email address",
  });
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
 * Only allows users with @foundlyhq.com email addresses
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

  try {
    // Get user info to check if they are an admin
    const { userEmail } = await getUserInfo(c);

    // Validate email domain using Zod schema
    const validationResult = adminEmailSchema.safeParse(userEmail);

    if (!validationResult.success) {
      // Log unauthorized access attempt
      console.warn(
        `Admin access denied for user ${auth.userId} with email ${userEmail}: ${validationResult.error.issues[0]?.message}`
      );

      return c.json(
        {
          success: false,
          error: "Admin access denied",
          message:
            "Only @foundlyhq.com email addresses are authorized for admin access",
        },
        403
      );
    }

    // User has valid admin email, proceed
    await next();
  } catch (error) {
    console.error(`Admin middleware error for user ${auth.userId}:`, error);

    return c.json(
      {
        success: false,
        error: "Admin validation failed",
        message: "Unable to verify admin privileges",
      },
      500
    );
  }
};
