import { Hono } from "hono";
import {
  corsMiddleware,
  loggerMiddleware,
  requireAuthMiddleware,
  requireAdminMiddleware,
} from "@/api/middleware";
import { Env } from "@/lib/bindings";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { userInstitutionRoutes } from "@/api/routes/user-institution";
import { adminInstitutionRoutes } from "@/api/routes/admin-institution";
import { getAuthenticatedUserInfo } from "@/lib/auth-helpers";

const app = new Hono<{ Bindings: Env }>();

// 🔧 Global middleware
app.use("*", corsMiddleware);
app.use("*", loggerMiddleware);
app.use("/api/*", clerkMiddleware());

// 🔐 Require authentication on ALL routes to prevent API abuse
app.use("/api/*", requireAuthMiddleware);

// Health check - now requires authentication
// app.get("/", (c) => {
//   // return 404
//   return c.text("Foundly API is running! 🚀");
// });

// Health check with environment info - now requires authentication
app.get("/api/health", (c) => {
  return c.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.get("/api/auth", async (c) => {
  const userInfo = await getAuthenticatedUserInfo(c);

  return c.json({
    message: "You are logged in!",
    userId: userInfo.userId,
    email: userInfo.email,
  });
});

//  API Route
app.route("/api/user/institution", userInstitutionRoutes);

// 🔐 Apply additional admin middleware to admin routes
app.use("/api/admin/*", requireAdminMiddleware);
//  API Route
// TODO: Implement admin authentication and authorization
// app.route("/api/admin/institution", adminInstitutionRoutes);

export default app;

export { InstitutionDraftDO } from "@/durable-objects/InstitutionDraft";

export { AdminRegistryDO } from "@/durable-objects/AdminRegistry";
