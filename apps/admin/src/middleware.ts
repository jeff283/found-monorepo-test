import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/login(.*)",
  "/unauthorized",
  "/", // Root page handles its own redirect logic
]);

export default clerkMiddleware(async (auth, req) => {
  // If it's a public route, allow access
  if (isPublicRoute(req)) {
    return;
  }

  // For all other routes, protect them
  // This will automatically redirect to sign-in if user is not authenticated
  await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
