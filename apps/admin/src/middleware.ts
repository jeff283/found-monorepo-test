import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

// Define a Zod schema for your domain check
const foundlyEmailSchema = z
  .email("Invalid email format")
  .refine((email) => email.endsWith("@foundlyhq.com"), {
    message: "Only @foundlyhq.com email addresses are allowed",
  });

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/login(.*)",
  "/unauthorized",
]);

export default clerkMiddleware(async (auth, req) => {
  // If it's a public route, allow access
  if (isPublicRoute(req)) {
    return;
  }

  const { userId, sessionClaims } = await auth();
  // Not signed in — redirect to login
  if (!userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Pull primary email from sessionClaims
  const email = sessionClaims?.primaryEmail;

  try {
    foundlyEmailSchema.parse(email);
  } catch (error) {
    const reason =
      error instanceof z.ZodError
        ? error.issues[0]?.message || "Email validation failed"
        : "Unknown validation error";

    console.warn(
      `Access denied for userId=${userId} with email=${email}: ${reason}`
    );

    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // All checks passed
  return NextResponse.next();

  // For all other routes, protect them
  // This will automatically redirect to sign-in if user is not authenticated
  // await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
