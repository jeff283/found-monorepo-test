import { Hono } from "hono";
import { Env } from "@/api/lib/bindings";
import {
  organizationStepSchema,
  verificationStepSchema,
  clerkOrganizationDetailsSchema,
  OrganizationJoinRequest,
} from "@/api/lib/schemas";
import { z } from "zod";
import {
  getAuthenticatedAuth,
  getUserInfo,
  getUserInstitutionDO,
} from "@/api/lib/auth-helpers";
import { getInstitutionStatus } from "@/api/lib/utils/insitution-status-helper";
import { getDomainCacheKey } from "@/api/lib/utils/domain-cache-key";
import { db } from "@/api/db/drizzle";
import { tenantSchema } from "@/web-app/db/drizzle/schema/tenant";

const userInstitutionRoutes = new Hono<{ Bindings: Env }>();

// GET /api/user/institution/draft - Get current draft data
userInstitutionRoutes.get("/draft", async (c) => {
  try {
    const auth = getAuthenticatedAuth(c);
    const institutionDO = getUserInstitutionDO(c, auth.userId);
    const draftData = await institutionDO.getDraftData();

    return c.json({
      success: true,
      data: draftData,
      exists: !!draftData,
    });
  } catch (error) {
    console.error("Error fetching draft data:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch draft data",
      },
      500
    );
  }
});

// GET /api/user/institution/organization - Get organization info
userInstitutionRoutes.get("/organization", async (c) => {
  try {
    const auth = getAuthenticatedAuth(c);
    const institutionDO = getUserInstitutionDO(c, auth.userId);
    const draftData = await institutionDO.getDraftData();

    if (!draftData) {
      return c.json({
        success: true,
        data: null,
        exists: false,
      });
    }

    return c.json({
      success: true,
      data: {
        institutionName: draftData.institutionName,
        institutionType: draftData.institutionType,
        organizationSize: draftData.organizationSize,
        status: draftData.status,
        canEdit:
          draftData.status !== "approved" && draftData.status !== "created",
      },
      exists: true,
    });
  } catch (error) {
    console.error("Error fetching organization data:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch organization data",
      },
      500
    );
  }
});

// GET /api/user/institution/verification - Get verification info
userInstitutionRoutes.get("/verification", async (c) => {
  try {
    const auth = getAuthenticatedAuth(c);
    const institutionDO = getUserInstitutionDO(c, auth.userId);
    const draftData = await institutionDO.getDraftData();

    if (!draftData) {
      return c.json({
        success: true,
        data: null,
        exists: false,
      });
    }

    return c.json({
      success: true,
      data: {
        website: draftData.website,
        description: draftData.description,
        streetAddress: draftData.streetAddress,
        city: draftData.city,
        state: draftData.state,
        zipCode: draftData.zipCode,
        country: draftData.country,
        phoneNumber: draftData.phoneNumber,
        expectedStudentCount: draftData.expectedStudentCount,
        taxIdOrRegistrationNumber: draftData.taxIdOrRegistrationNumber,
        status: draftData.status,
        canEdit:
          draftData.status !== "approved" && draftData.status !== "created",
      },
      exists: true,
    });
  } catch (error) {
    console.error("Error fetching verification data:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch verification data",
      },
      500
    );
  }
});

// POST /api/user/institution/organization - Create/update organization info
userInstitutionRoutes.post("/organization", async (c) => {
  try {
    // Use getUserInfo to get auth, userEmail, and userId from clerk
    const { userEmail, userId } = await getUserInfo(c);
    // const { auth } = getUserInfo(c);
    // const auth = getAuthenticatedAuth(c);

    const body = await c.req.json();

    // Validate the organization data
    const validatedData = organizationStepSchema.parse(body);

    const institutionDO = getUserInstitutionDO(c, userId);

    // Get current data to check if this is create or update
    const currentData = await institutionDO.getDraftData();

    let result;
    if (currentData) {
      // Update existing organization data - DO will handle permission checking
      result = await institutionDO.updateOrganizationData(validatedData);
    } else {
      result = await institutionDO.createOrganizationDraft(
        validatedData,
        userId,
        userEmail
      );
    }

    return c.json({
      success: true,
      data: result,
      message: "Organization information saved successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          success: false,
          error: "Validation failed",
          details: error.issues,
        },
        400
      );
    }

    // Handle permission errors from DO
    if (error instanceof Error && error.message.includes("not permitted")) {
      return c.json(
        {
          success: false,
          error: error.message,
        },
        403
      );
    }

    console.error("Error saving organization data:", error);
    return c.json(
      {
        success: false,
        error: "Failed to save organization data",
      },
      500
    );
  }
});

// POST /api/user/institution/verification - Create/update verification info
userInstitutionRoutes.post("/verification", async (c) => {
  try {
    const auth = getAuthenticatedAuth(c);
    const body = await c.req.json();

    // Validate the verification data
    const validatedData = verificationStepSchema.parse(body);

    const institutionDO = getUserInstitutionDO(c, auth.userId);

    // The DO will handle all permission and prerequisite checks
    const result = await institutionDO.updateVerificationData(validatedData);

    return c.json({
      success: true,
      data: result,
      message: "Verification information saved successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          success: false,
          error: "Validation failed",
          details: error.issues,
        },
        400
      );
    }

    // Handle permission errors from DO
    if (error instanceof Error) {
      if (
        error.message.includes("not permitted") ||
        error.message.includes("cannot be edited")
      ) {
        return c.json(
          {
            success: false,
            error: error.message,
          },
          403
        );
      }

      if (
        error.message.includes("complete step 1 first") ||
        error.message.includes("organization data")
      ) {
        return c.json(
          {
            success: false,
            error: error.message,
          },
          400
        );
      }
    }

    console.error("Error saving verification data:", error);
    return c.json(
      {
        success: false,
        error: "Failed to save verification data",
      },
      500
    );
  }
});

// PUT /api/user/institution/organization - Update organization info (alias for POST)
userInstitutionRoutes.put("/organization", async (c) => {
  try {
    const auth = getAuthenticatedAuth(c);
    const body = await c.req.json();

    // Validate the organization data
    const validatedData = organizationStepSchema.parse(body);

    const institutionDO = getUserInstitutionDO(c, auth.userId);

    // Always treat PUT as update for existing data - DO will handle permission checking
    const result = await institutionDO.updateOrganizationData(validatedData);

    return c.json({
      success: true,
      data: result,
      message: "Organization details updated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          success: false,
          error: "Validation failed",
          details: error.issues,
        },
        400
      );
    }

    // Handle permission errors from DO
    if (error instanceof Error && error.message.includes("not permitted")) {
      return c.json(
        {
          success: false,
          error: error.message,
        },
        403
      );
    }

    console.error("Error updating organization data:", error);
    return c.json(
      {
        success: false,
        error: "Failed to update organization data",
      },
      500
    );
  }
});

// PUT /api/user/institution/verification - Update verification info (alias for POST)
userInstitutionRoutes.put("/verification", async (c) => {
  try {
    const auth = getAuthenticatedAuth(c);
    const body = await c.req.json();

    // Validate the verification data
    const validatedData = verificationStepSchema.parse(body);

    const institutionDO = getUserInstitutionDO(c, auth.userId);

    // The DO will handle all permission and prerequisite checks
    const result =
      await institutionDO.updateVerificationDataOnly(validatedData);

    return c.json({
      success: true,
      data: result,
      message: "Verification data updated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          success: false,
          error: "Validation failed",
          details: error.issues,
        },
        400
      );
    }

    // Handle permission errors from DO
    if (error instanceof Error) {
      if (
        error.message.includes("not permitted") ||
        error.message.includes("cannot be edited")
      ) {
        return c.json(
          {
            success: false,
            error: error.message,
          },
          403
        );
      }

      if (
        error.message.includes("complete step 1 first") ||
        error.message.includes("organization data")
      ) {
        return c.json(
          {
            success: false,
            error: error.message,
          },
          400
        );
      }
    }

    console.error("Error updating verification data:", error);
    return c.json(
      {
        success: false,
        error: "Failed to update verification data",
      },
      500
    );
  }
});

// GET /api/user/institution/status - Get application status
userInstitutionRoutes.get("/status", async (c) => {
  try {
    const auth = getAuthenticatedAuth(c);
    const institutionDO = getUserInstitutionDO(c, auth.userId);
    const draftData = await institutionDO.getDraftData();

    // Compute status data from draft data
    const statusData = getInstitutionStatus(draftData);
    return c.json({ success: true, data: statusData });
  } catch (error) {
    console.error("Error fetching status:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch application status",
      },
      500
    );
  }
});

// POST /api/user/institution/clerk-details - Report Clerk organization details
userInstitutionRoutes.post("/clerk-details", async (c) => {
  try {
    const auth = getAuthenticatedAuth(c);
    const body = await c.req.json();

    // Validate the Clerk organization details
    const validatedData = clerkOrganizationDetailsSchema.parse(body);

    const institutionDO = getUserInstitutionDO(c, auth.userId);

    // Add Clerk organization details - the DO will handle permission and status checks
    const result = await institutionDO.addClerkOrganizationDetails(
      validatedData.clerkOrgId,
      validatedData.clerkOrgSlug
    );

    if (result) {
      console.log(
        "ROUTE(/clerk-details): Clerk organization details added successfully",
        result
      );
    } else {
      console.log(
        "ROUTE(/clerk-details): Failed to add Clerk organization details",
        validatedData
      );
    }

    const draftData = await institutionDO.getDraftData();

    const emailDomain = draftData?.emailDomain || "";

    const cacheKey = getDomainCacheKey(emailDomain);

    const cacheData = JSON.stringify({
      institutionName: draftData?.institutionName || "",
      clerkOrgId: validatedData.clerkOrgId,
      clerkOrgSlug: validatedData.clerkOrgSlug,
      status: "pending",
      cachedAt: new Date().toISOString(),
    });

    // Cache the result
    await c.env.DOMAIN_CACHE.put(cacheKey, cacheData);
    console.log("ROUTE(/clerk-details): Cached email domain", emailDomain);

    // Add Org to db
    const dbResult = await db.insert(tenantSchema).values({
      name: draftData?.institutionName || "",
      clerkId: validatedData.clerkOrgId,
      emailDomain,
    });

    if (dbResult) {
      console.log(
        "ROUTE(/clerk-details): Clerk organization details added to DB",
        dbResult
      );
    } else {
      console.log(
        "ROUTE(/clerk-details): Failed to add Clerk organization details to DB",
        validatedData
      );
    }

    return c.json({
      success: true,
      data: result,
      message: "Clerk organization details added successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          success: false,
          error: "Validation failed",
          details: error.issues,
        },
        400
      );
    }

    // Handle permission errors from DO
    if (error instanceof Error) {
      if (
        error.message.includes("not permitted") ||
        error.message.includes("not approved")
      ) {
        return c.json(
          {
            success: false,
            error: error.message,
          },
          403
        );
      }
    }

    console.error("Error adding Clerk organization details:", error);
    return c.json(
      {
        success: false,
        error: "Failed to add Clerk organization details",
      },
      500
    );
  }
});

// GET /api/user/institution/check-domain - Check if organization exists for email domain
userInstitutionRoutes.get("/check-domain", async (c) => {
  try {
    const { userEmail } = await getUserInfo(c);

    // Extract email domain
    const emailDomain = userEmail.split("@")[1];

    if (!emailDomain) {
      return c.json(
        {
          success: false,
          error: "Invalid email format",
        },
        400
      );
    }

    // 🎯 CACHE READ: Check KV cache first for instant lookup
    const cacheKey = getDomainCacheKey(emailDomain);

    try {
      const cachedData = (await c.env.DOMAIN_CACHE.get(
        cacheKey,
        "json"
      )) as any;

      if (cachedData) {
        console.log(`🎯 Cache HIT for domain: ${emailDomain}`);
        // Found in cache - organization exists and is ready for joining
        return c.json({
          success: true,
          data: {
            emailDomain,
            organizationExists: true,
            organizationDetails: {
              institutionName: cachedData.institutionName,
              clerkOrgId: cachedData.clerkOrgId,
              clerkOrgSlug: cachedData.clerkOrgSlug,
              status: cachedData.status,
            },
            canJoin: true,
            fromCache: true,
            cacheTimestamp: cachedData.cachedAt,
          },
        });
      }
    } catch (cacheError) {
      console.error(`⚠️ KV cache error for ${emailDomain}:`, cacheError);
      // Fall through to assume not found - don't break on cache errors
    }

    console.log(
      `❌ Cache MISS for domain: ${emailDomain} - assuming organization doesn't exist`
    );

    // 🚫 NOT in cache = Organization doesn't exist or isn't ready for joining
    // This handles: 1) Truly doesn't exist, 2) Recently created (propagation delay)
    return c.json({
      success: true,
      data: {
        emailDomain,
        organizationExists: false,
        organizationDetails: null,
        canJoin: false, // User should create new organization
        fromCache: false,
      },
    });
  } catch (error) {
    console.error("Error checking domain organization:", error);
    return c.json(
      {
        success: false,
        error: "Failed to check domain organization",
      },
      500
    );
  }
});

// GET /api/user/institution/check-domain-fallback - Fallback to DO lookup (for debugging)
userInstitutionRoutes.get("/check-domain-fallback", async (c) => {
  try {
    const { userEmail } = await getUserInfo(c);

    // Extract email domain
    const emailDomain = userEmail.split("@")[1];

    if (!emailDomain) {
      return c.json(
        {
          success: false,
          error: "Invalid email format",
        },
        400
      );
    }

    console.log(
      `🔍 Fallback lookup for domain: ${emailDomain} - using DO lookup`
    );

    // Force DO lookup (original implementation)
    const adminRegistryId =
      c.env.ADMIN_REGISTRY_DO.idFromName("admin-registry");
    const adminRegistryStub = c.env.ADMIN_REGISTRY_DO.get(adminRegistryId);

    // Only get created applications (organizations that exist in Clerk)
    const createdRefs =
      await adminRegistryStub.getInstitutionReferencesByDomainAndStatus(
        emailDomain,
        "created"
      );

    let organizationExists = false;
    let organizationDetails = null;

    if (createdRefs.length > 0) {
      const orgRef = createdRefs[0]; // Take the first one if multiple exist
      organizationExists = true;

      // Get full organization details from the institution DO to access Clerk info
      const institutionDOId = c.env.INSTITUTION_DRAFT.idFromString(
        orgRef.userId
      );
      const institutionDOStub = c.env.INSTITUTION_DRAFT.get(institutionDOId);
      const fullOrgData = await institutionDOStub.getDraftData();

      organizationDetails = {
        institutionName: orgRef.institutionName,
        clerkOrgId: fullOrgData?.clerkOrgId || null,
        clerkOrgSlug: fullOrgData?.clerkOrgSlug || null,
        status: orgRef.status,
      };
    }

    return c.json({
      success: true,
      data: {
        emailDomain,
        organizationExists,
        organizationDetails,
        canJoin: organizationExists,
        fromCache: false,
        fallbackUsed: true,
      },
    });
  } catch (error) {
    console.error("Error in fallback domain check:", error);
    return c.json(
      {
        success: false,
        error: "Fallback lookup failed",
      },
      500
    );
  }
});

// GET /api/user/institution/clerk-details - Get Clerk organization details
userInstitutionRoutes.get("/clerk-details", async (c) => {
  try {
    const auth = getAuthenticatedAuth(c);
    const institutionDO = getUserInstitutionDO(c, auth.userId);
    const draftData = await institutionDO.getDraftData();

    if (!draftData) {
      return c.json({
        success: true,
        data: {
          hasClerkDetails: false,
          clerkOrgId: null,
          clerkOrgSlug: null,
          status: "not_started",
        },
      });
    }

    return c.json({
      success: true,
      data: {
        hasClerkDetails: !!(draftData.clerkOrgId && draftData.clerkOrgSlug),
        clerkOrgId: draftData.clerkOrgId || null,
        clerkOrgSlug: draftData.clerkOrgSlug || null,
        status: draftData.status,
        institutionName: draftData.institutionName,
      },
    });
  } catch (error) {
    console.error("Error fetching Clerk details:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch Clerk organization details",
      },
      500
    );
  }
});

// POST /api/user/institution/join-request - Send a join request to an organization
userInstitutionRoutes.post("/join-request", async (c) => {
  try {
    const clerk = c.get("clerk");
    const { userId, userEmail } = await getUserInfo(c);
    // Parse the request body
    const body = await c.req.json();
    const parsed = OrganizationJoinRequest.parse(body);

    const organization = await clerk.organizations.getOrganization({
      organizationId: parsed.organizationId,
    });

    const orgEmailDomain = organization.publicMetadata?.emailDomain;

    // check if the user's email domain matches the org
    if (orgEmailDomain && userEmail.endsWith(`@${orgEmailDomain}`)) {
      // Create the organization invitation
      const createdOrgInvitation =
        await clerk.organizations.createOrganizationInvitation({
          inviterUserId: userId,
          emailAddress: userEmail,
          organizationId: organization.id,
          role: "org:member",
          redirectUrl: "https://app.foundlyhq.com/institution/dashboard",
        });

      return c.json({
        success: true,
        message: "Organization invitation created successfully",
      });
    } else {
      return c.json(
        {
          success: false,
          error: "Email domain does not match organization",
        },
        400
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          success: false,
          error: "Validation failed",
          message: error.issues,
        },
        400
      );
    }

    // Handle permission errors from DO
    if (error instanceof Error && error.message.includes("not permitted")) {
      return c.json(
        {
          success: false,
          error: error.message,
        },
        403
      );
    }

    console.error("Error sending an organization join request:", error);
    return c.json(
      {
        success: false,
        error: "Failed to send organization join request",
      },
      500
    );
  }
});

export { userInstitutionRoutes };
