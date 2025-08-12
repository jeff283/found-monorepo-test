import { Hono } from "hono";
import { Env } from "@/lib/bindings";
import { z } from "zod";
import type { ApplicationRecord } from "@/lib/types";
import {
  getUserInfo,
  getUserInstitutionDO,
  getAdminRegistryDO,
} from "@/lib/auth-helpers";
import { InstitutionDraftData } from "@/lib/schemas";
import { sendApplicationApproveStatus } from "@/emails/SendApplicationAction";
import { Resend } from "resend";

const adminInstitutionRoutes = new Hono<{ Bindings: Env }>();

// Validation schema for admin actions
const adminActionSchema = z.object({
  action: z.enum(["approve", "reject"]),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z
    .enum(["pending_verification", "approved", "rejected", "draft"])
    .optional(),
  search: z.string().optional(),
});

// GET /api/admin/institution/applications - Get all applications with pagination
adminInstitutionRoutes.get("/applications", async (c) => {
  try {
    // Parse query parameters
    const query = c.req.query();
    const { page, limit, status, search } = paginationSchema.parse(query);

    const adminRegistryDO = getAdminRegistryDO(c);

    let applications: ApplicationRecord[];
    if (status) {
      applications = await adminRegistryDO.getApplicationsByStatus(status);
    } else {
      applications = await adminRegistryDO.getAllApplications();
    }

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      applications = applications.filter(
        (app: ApplicationRecord) =>
          app.institutionName?.toLowerCase().includes(searchLower) ||
          app.userEmail?.toLowerCase().includes(searchLower) ||
          app.userId.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedApplications = applications.slice(startIndex, endIndex);

    // Transform ApplicationRecord to match admin UI expectations
    const transformedApplications = paginatedApplications.map(
      (app: ApplicationRecord) => ({
        id: app.userId, // Use userId as id for now
        userId: app.userId,
        userEmail: app.userEmail,
        emailDomain: app.userEmail.split("@")[1] || "", // Extract domain from email
        institutionName: app.institutionName,
        institutionType: app.institutionType, // Now available from ApplicationRecord
        status: app.status,
        currentStep: app.currentStep,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        reviewedBy: app.reviewedBy,
        reviewedAt: app.reviewedAt,
        rejectionReason: app.rejectionReason,
      })
    );

    return c.json({
      success: true,
      data: {
        applications: transformedApplications,
        pagination: {
          current_page: page,
          per_page: limit,
          total_count: applications.length,
          total_pages: Math.ceil(applications.length / limit),
          has_next_page: endIndex < applications.length,
          has_prev_page: page > 1,
        },
        filters: {
          status,
          search,
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          success: false,
          error: "Invalid query parameters",
          details: error.issues,
        },
        400
      );
    }

    console.error("Error fetching applications:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch applications",
      },
      500
    );
  }
});

// GET /api/admin/institution/applications/pending - Get pending applications
adminInstitutionRoutes.get("/applications/pending", async (c) => {
  try {
    const query = c.req.query();
    const { page, limit, search } = paginationSchema.parse(query);

    const adminRegistryDO = getAdminRegistryDO(c);
    let applications: ApplicationRecord[] =
      await adminRegistryDO.getApplicationsByStatus("pending_verification");

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      applications = applications.filter(
        (app: ApplicationRecord) =>
          app.institutionName?.toLowerCase().includes(searchLower) ||
          app.userEmail?.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedApplications = applications.slice(startIndex, endIndex);

    // Transform ApplicationRecord to match admin UI expectations
    const transformedApplications = paginatedApplications.map(
      (app: ApplicationRecord) => ({
        id: app.userId, // Use userId as id for now
        userId: app.userId,
        userEmail: app.userEmail,
        emailDomain: app.userEmail.split("@")[1] || "", // Extract domain from email
        institutionName: app.institutionName,
        institutionType: app.institutionType, // Now available from ApplicationRecord
        status: app.status,
        currentStep: app.currentStep,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        reviewedBy: app.reviewedBy,
        reviewedAt: app.reviewedAt,
        rejectionReason: app.rejectionReason,
      })
    );

    return c.json({
      success: true,
      data: {
        applications: transformedApplications,
        pagination: {
          current_page: page,
          per_page: limit,
          total_count: applications.length,
          total_pages: Math.ceil(applications.length / limit),
          has_next_page: endIndex < applications.length,
          has_prev_page: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching pending applications:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch pending applications",
      },
      500
    );
  }
});

// GET /api/admin/institution/applications/abandoned - Get abandoned applications
adminInstitutionRoutes.get("/applications/abandoned", async (c) => {
  try {
    const query = c.req.query();
    const { page, limit } = paginationSchema.parse(query);

    const adminRegistryDO = getAdminRegistryDO(c);
    const applications = await adminRegistryDO.getAbandonedApplications();

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedApplications = applications.slice(startIndex, endIndex);

    // Transform ApplicationRecord to match admin UI expectations
    const transformedApplications = paginatedApplications.map(
      (app: ApplicationRecord) => ({
        id: app.userId, // Use userId as id for now
        userId: app.userId,
        userEmail: app.userEmail,
        emailDomain: app.userEmail.split("@")[1] || "", // Extract domain from email
        institutionName: app.institutionName,
        institutionType: app.institutionType, // Now available from ApplicationRecord
        status: app.status,
        currentStep: app.currentStep,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        reviewedBy: app.reviewedBy,
        reviewedAt: app.reviewedAt,
        rejectionReason: app.rejectionReason,
      })
    );

    return c.json({
      success: true,
      data: {
        applications: transformedApplications,
        pagination: {
          current_page: page,
          per_page: limit,
          total_count: applications.length,
          total_pages: Math.ceil(applications.length / limit),
          has_next_page: endIndex < applications.length,
          has_prev_page: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching abandoned applications:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch abandoned applications",
      },
      500
    );
  }
});

// GET /api/admin/institution/applications/:userId - Get specific application
adminInstitutionRoutes.get("/applications/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");

    if (!userId) {
      return c.json(
        {
          success: false,
          error: "User ID is required",
        },
        400
      );
    }

    const institutionDO = getUserInstitutionDO(c, userId);
    const applicationData = await institutionDO.getDraftData();

    return c.json({
      success: true,
      data: applicationData,
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch application",
      },
      500
    );
  }
});

// POST /api/admin/institution/applications/:userId/action - Approve or reject application
adminInstitutionRoutes.post("/applications/:userId/action", async (c) => {
  const { userId: adminUserId } = await getUserInfo(c);

  try {
    const userId = c.req.param("userId");
    const body = await c.req.json();

    if (!adminUserId) {
      return c.json(
        {
          success: false,
          error: "User ID is required",
        },
        400
      );
    }

    // Validate the action data
    const { action, reason, notes } = adminActionSchema.parse(body);

    const institutionDO = getUserInstitutionDO(c, userId);

    let result: InstitutionDraftData;
    if (action === "approve") {
      result = await institutionDO.approveApplication(adminUserId);
      // send approval email
      // Todo: Handle email send errors
      const emailResult = await sendApplicationApproveStatus(c, result);
      console.log("Email send result:", emailResult);
    } else {
      result = await institutionDO.rejectApplication(
        adminUserId,
        reason || "No reason provided"
      );
    }

    return c.json({
      success: true,
      data: result,
      message: `Application ${action}d successfully`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          success: false,
          error: "Invalid action data",
          details: error.issues,
        },
        400
      );
    }

    console.error("Error processing admin action:", error);
    return c.json(
      {
        success: false,
        error: "Failed to process admin action",
      },
      500
    );
  }
});

// POST /api/admin/institution/applications/:userId/unapprove - Unapprove application
adminInstitutionRoutes.post("/applications/:userId/unapprove", async (c) => {
  const { userId: adminUserId } = await getUserInfo(c);

  try {
    const userId = c.req.param("userId");
    const body = await c.req.json();

    if (!adminUserId) {
      return c.json(
        {
          success: false,
          error: "User ID is required",
        },
        400
      );
    }

    const reason = body.reason || undefined;
    const institutionDO = getUserInstitutionDO(c, userId);
    const result = await institutionDO.unapproveApplication(
      adminUserId,
      reason
    );

    return c.json({
      success: true,
      data: result,
      message: "Application unapproved successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          success: false,
          error: "Invalid unapprove data",
          details: error.issues,
        },
        400
      );
    }

    console.error("Error processing admin unapprove action:", error);
    return c.json(
      {
        success: false,
        error: "Failed to process admin unapprove action",
      },
      500
    );
  }
});

// GET /api/admin/institution/metrics - Get application metrics
adminInstitutionRoutes.get("/metrics", async (c) => {
  try {
    const adminRegistryDO = getAdminRegistryDO(c);
    const allApplications = await adminRegistryDO.getAllApplications();

    // Calculate metrics
    const metrics = {
      total_applications: allApplications.length,
      pending_applications: allApplications.filter(
        (app: ApplicationRecord) => app.status === "pending_verification"
      ).length,
      approved_applications: allApplications.filter(
        (app: ApplicationRecord) => app.status === "approved"
      ).length,
      rejected_applications: allApplications.filter(
        (app: ApplicationRecord) => app.status === "rejected"
      ).length,
      abandoned_applications: await adminRegistryDO
        .getAbandonedApplications()
        .then((apps: ApplicationRecord[]) => apps.length),
      approval_rate:
        allApplications.length > 0
          ? (
              (allApplications.filter(
                (app: ApplicationRecord) => app.status === "approved"
              ).length /
                allApplications.length) *
              100
            ).toFixed(2)
          : "0.00",
    };

    return c.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch metrics",
      },
      500
    );
  }
});

// POST /api/admin/institution/applications/bulk-action - Bulk approve/reject applications
adminInstitutionRoutes.post("/applications/bulk-action", async (c) => {
  const { userId: adminUserId } = await getUserInfo(c);

  try {
    const body = await c.req.json();

    const bulkActionSchema = z.object({
      userIds: z.array(z.string()).min(1).max(50), // Limit to 50 for performance
      action: z.enum(["approve", "reject"]),
      reason: z.string().optional(),
      notes: z.string().optional(),
    });

    const { userIds, action, reason, notes } = bulkActionSchema.parse(body);

    const results = [];
    const errors = [];

    // Process each application
    for (const userId of userIds) {
      try {
        const institutionDO = getUserInstitutionDO(c, userId);

        let result;
        if (action === "approve") {
          result = await institutionDO.approveApplication(adminUserId);
        } else {
          result = await institutionDO.rejectApplication(
            adminUserId,
            reason || "Bulk action"
          );
        }

        results.push({
          userId,
          success: true,
          data: result,
        });
      } catch (error) {
        console.error(
          `Error processing bulk action for user ${userId}:`,
          error
        );
        errors.push({
          userId,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return c.json({
      success: true,
      data: {
        processed: results.length + errors.length,
        successful: results.length,
        failed: errors.length,
        results,
        errors,
      },
      message: `Bulk ${action} completed. ${results.length} successful, ${errors.length} failed.`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          success: false,
          error: "Invalid bulk action data",
          details: error.issues,
        },
        400
      );
    }

    console.error("Error processing bulk action:", error);
    return c.json(
      {
        success: false,
        error: "Failed to process bulk action",
      },
      500
    );
  }
});

export { adminInstitutionRoutes };
