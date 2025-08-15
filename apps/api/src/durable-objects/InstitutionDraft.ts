import { DurableObject } from "cloudflare:workers";

import { Env } from "@/api/lib/bindings";
import {
  InstitutionDraftData,
  OrganizationStepData,
  VerificationStepData,
} from "@/api/lib/types";
import {
  validateCreateRequest,
  validateUpdateRequest,
  validateOrganizationData,
  validateVerificationData,
  createInitialDraft,
  updateDraftWithVerification,
  canUpdateToVerification,
  determinePostAction,
  determinePutAction,
  updateOrganizationData,
  updateVerificationDataOnly,
  approveDraft,
  rejectDraft,
  addClerkOrgDetails,
  canBeApproved,
  canBeRejected,
} from "@/api/lib/institution-helpers";
import { formatValidationErrors } from "@/api/lib/validation-utils";
import { AdminRegistryClient } from "@/api/lib/admin-registry-client";
import { canUserUpdateInstitution } from "@/api/lib/update-permissions";

export class InstitutionDraftDO extends DurableObject {
  storage: DurableObjectStorage;
  ctx: DurableObjectState;
  env: Env;
  userID: string; // User ID for the draft
  private adminRegistry: AdminRegistryClient;
  // private sql: SqlStorage;

  private static readonly DATA_KEY = "data";

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);

    this.ctx = ctx; // Store context reference
    this.env = env; // Store environment reference
    this.storage = ctx.storage; // Initialize storage

    // Extract user ID from the Durable Object ID
    // The DO ID is created using the user ID, so we can extract it
    this.userID = ctx.id.toString();

    // Initialize admin registry client
    this.adminRegistry = new AdminRegistryClient(env);

    // this.sql = ctx.storage.sql; // Initialize SQL storage
  }

  // Main HTTP handler
  async fetch(request: Request): Promise<Response> {
    // Route based on HTTP method and URL

    // Get the method and URL
    const method = request.method.toUpperCase();
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      switch (method) {
        case "GET":
          return await this.handleGet(path, request);
        case "POST":
          return await this.handlePost(path, request);
        case "PUT":
          return await this.handlePut(path, request);
        case "DELETE":
          return await this.handleDelete(path, request);

        default:
          return this.createResponse({ error: "Method not allowed" }, 405);
      }
    } catch (error) {
      console.error("Error in Durable Object fetch handler:", error);
      return this.createResponse({ error: "Internal Server Error" }, 500);
    }
  }

  // Alarm handler for scheduled tasks
  async alarm(): Promise<void> {
    // Triggered when scheduled alarm fires
  }

  // ==============================================
  // DIRECT METHODS - Type-safe, no HTTP overhead
  // ==============================================

  // Get draft data directly
  async getDraftData(): Promise<InstitutionDraftData | null> {
    const data = (await this.storage.get(InstitutionDraftDO.DATA_KEY)) as
      | InstitutionDraftData
      | undefined;
    return data || null;
  }

  // Centralized permission check for user updates
  private async checkUserUpdatePermission(): Promise<{
    canUpdate: boolean;
    reason?: string;
    currentData: InstitutionDraftData | null;
  }> {
    const currentData = await this.getDraftData();

    if (!currentData) {
      return { canUpdate: true, currentData: null }; // Can create new
    }

    const permission = canUserUpdateInstitution(currentData.status);
    return {
      canUpdate: permission.canUpdate,
      reason: permission.reason,
      currentData,
    };
  }

  // Create a new organization draft
  async createOrganizationDraft(
    orgData: OrganizationStepData,
    userId: string,
    userEmail: string
  ): Promise<InstitutionDraftData> {
    // Check if draft already exists
    const existingData = (await this.storage.get(
      InstitutionDraftDO.DATA_KEY
    )) as InstitutionDraftData | undefined;
    if (existingData) {
      throw new Error(
        "Organization data already exists. Cannot create duplicate."
      );
    }

    const newDraft = createInitialDraft(orgData, userId, userEmail);

    // Run storage and admin registry operations in parallel
    await Promise.all([
      this.storage.put(InstitutionDraftDO.DATA_KEY, newDraft),
      this.adminRegistry.registerApplication(newDraft),
    ]);

    return newDraft;
  }

  // Update verification data
  async updateVerificationData(
    verificationData: VerificationStepData
  ): Promise<InstitutionDraftData> {
    // Check permissions first
    const permission = await this.checkUserUpdatePermission();

    if (!permission.canUpdate) {
      throw new Error(permission.reason || "Update not permitted");
    }

    if (!permission.currentData) {
      throw new Error(
        "No organization data found. Please complete step 1 first."
      );
    }

    if (!canUpdateToVerification(permission.currentData)) {
      throw new Error(
        "Application not in correct state for verification update"
      );
    }

    const updatedDraft = updateDraftWithVerification(
      permission.currentData,
      verificationData
    );

    // Run storage and admin registry operations in parallel
    await Promise.all([
      this.storage.put(InstitutionDraftDO.DATA_KEY, updatedDraft),
      this.adminRegistry.updateApplication(updatedDraft),
    ]);

    return updatedDraft;
  }

  // Update organization data (for existing drafts)
  async updateOrganizationData(
    orgData: OrganizationStepData
  ): Promise<InstitutionDraftData> {
    // Check permissions first
    const permission = await this.checkUserUpdatePermission();

    if (!permission.canUpdate) {
      throw new Error(permission.reason || "Update not permitted");
    }

    if (!permission.currentData) {
      throw new Error("No institution draft found to update");
    }

    const updatedDraft = updateOrganizationData(
      permission.currentData,
      orgData
    );

    // Run storage and admin registry operations in parallel
    await Promise.all([
      this.storage.put(InstitutionDraftDO.DATA_KEY, updatedDraft),
      this.adminRegistry.updateApplication(updatedDraft),
    ]);

    return updatedDraft;
  }

  // Update verification data only (for existing drafts)
  async updateVerificationDataOnly(
    verificationData: VerificationStepData
  ): Promise<InstitutionDraftData> {
    // Check permissions first
    const permission = await this.checkUserUpdatePermission();

    if (!permission.canUpdate) {
      throw new Error(permission.reason || "Update not permitted");
    }

    if (!permission.currentData) {
      throw new Error("No institution draft found to update");
    }

    const updatedDraft = updateVerificationDataOnly(
      permission.currentData,
      verificationData
    );

    // Run storage and admin registry operations in parallel
    await Promise.all([
      this.storage.put(InstitutionDraftDO.DATA_KEY, updatedDraft),
      this.adminRegistry.updateApplication(updatedDraft),
    ]);

    return updatedDraft;
  }

  // Admin approve application
  async approveApplication(reviewedBy: string): Promise<InstitutionDraftData> {
    const existingData = (await this.storage.get(
      InstitutionDraftDO.DATA_KEY
    )) as InstitutionDraftData | undefined;

    if (!existingData) {
      throw new Error("No institution draft found to approve");
    }

    if (!canBeApproved(existingData)) {
      throw new Error("Application is not in a state that can be approved");
    }

    const approvedDraft = approveDraft(existingData, reviewedBy);

    // Run storage and admin registry operations in parallel
    await Promise.all([
      this.storage.put(InstitutionDraftDO.DATA_KEY, approvedDraft),
      this.adminRegistry.updateApplication(approvedDraft),
    ]);

    return approvedDraft;
  }

  // Admin reject application
  async rejectApplication(
    reviewedBy: string,
    rejectionReason: string
  ): Promise<InstitutionDraftData> {
    const existingData = (await this.storage.get(
      InstitutionDraftDO.DATA_KEY
    )) as InstitutionDraftData | undefined;

    if (!existingData) {
      throw new Error("No institution draft found to reject");
    }

    if (!canBeRejected(existingData)) {
      throw new Error("Application is not in a state that can be rejected");
    }

    const rejectedDraft = rejectDraft(
      existingData,
      reviewedBy,
      rejectionReason
    );

    // Run storage and admin registry operations in parallel
    await Promise.all([
      this.storage.put(InstitutionDraftDO.DATA_KEY, rejectedDraft),
      this.adminRegistry.updateApplication(rejectedDraft),
    ]);

    return rejectedDraft;
  }

  // Admin unapprove application
  async unapproveApplication(
    reviewedBy: string,
    reason?: string
  ): Promise<InstitutionDraftData> {
    const existingData = (await this.storage.get(
      InstitutionDraftDO.DATA_KEY
    )) as InstitutionDraftData | undefined;

    if (!existingData) {
      throw new Error("No institution draft found to unapprove");
    }

    if (
      existingData.status !== "approved" &&
      existingData.status !== "created"
    ) {
      throw new Error(
        "Only approved or created applications can be unapproved"
      );
    }

    // Revert to pending_verification
    const unapprovedDraft: InstitutionDraftData = {
      ...existingData,
      status: "pending_verification",
      reviewedBy,
      reviewedAt: new Date().toISOString(),
      rejectionReason: reason || undefined,
      updatedAt: new Date().toISOString(),
    };

    // Remove Clerk org details if present
    // delete unapprovedDraft.clerkOrgId;
    // delete unapprovedDraft.clerkOrgSlug;

    await Promise.all([
      this.storage.put(InstitutionDraftDO.DATA_KEY, unapprovedDraft),
      this.adminRegistry.updateApplication(unapprovedDraft),
    ]);

    return unapprovedDraft;
  }
  // Add Clerk organization details
  async addClerkOrganizationDetails(
    clerkOrgId: string,
    clerkOrgSlug: string
  ): Promise<InstitutionDraftData> {
    const existingData = (await this.storage.get(
      InstitutionDraftDO.DATA_KEY
    )) as InstitutionDraftData | undefined;

    if (!existingData) {
      throw new Error("No institution draft found");
    }

    if (existingData.status !== "approved") {
      throw new Error(
        "Clerk organization details can only be added to approved applications"
      );
    }

    const updatedDraft = addClerkOrgDetails(
      existingData,
      clerkOrgId,
      clerkOrgSlug
    );

    // Update storage, admin registry, and permanently cache domain in parallel
    await Promise.all([
      this.storage.put(InstitutionDraftDO.DATA_KEY, updatedDraft),
      this.adminRegistry.updateApplication(updatedDraft),
      this.cacheDomainPermanently(updatedDraft),
    ]);

    // Schedule alarm for Supabase sync (5 minutes from now)
    // const alarmTime = new Date(Date.now() + 5 * 60 * 1000);
    // await this.ctx.storage.setAlarm(alarmTime);

    return updatedDraft;
  }

  // Delete draft application
  async deleteDraftApplication(): Promise<{
    institutionName?: string;
    status: string;
    deletedAt: string;
  }> {
    const existingData = (await this.storage.get(
      InstitutionDraftDO.DATA_KEY
    )) as InstitutionDraftData | undefined;

    if (!existingData) {
      throw new Error("No institution draft found to delete");
    }

    if (existingData.status === "approved") {
      throw new Error(
        "Cannot delete approved applications. Contact administrator."
      );
    }

    // Only clear cache if it was a "created" organization (had been cached)
    const shouldClearCache =
      existingData.status === "created" &&
      existingData.clerkOrgId &&
      existingData.clerkOrgSlug;

    const operations = [
      this.storage.delete(InstitutionDraftDO.DATA_KEY),
      this.adminRegistry.removeApplication(this.userID),
    ];

    if (shouldClearCache) {
      operations.push(this.removeDomainFromCache(existingData.emailDomain));
    }

    await Promise.all(operations);

    return {
      institutionName: existingData.institutionName,
      status: existingData.status,
      deletedAt: new Date().toISOString(),
    };
  }

  // Fetch handlers for different HTTP methods

  // GET handler to retrieve institution draft data
  // Returns existing draft data or indicates no data exists

  private async handleGet(path: string, request: Request): Promise<Response> {
    // TODO: Implement GET logic
    try {
      // Basic pattern for reading from storage
      const data = (await this.storage.get(InstitutionDraftDO.DATA_KEY)) as
        | InstitutionDraftData
        | undefined;
      if (data) {
        // Data exists - return it
        return this.createResponse({
          exists: true,
          data: data,
        });
      } else {
        return this.createResponse({
          exists: false,
        });
      }
    } catch (error) {
      console.error("Error in handleGet:", error);
      return this.createResponse(
        { error: "Failed to retrieve institution draft data" },
        500
      );
    }
  }

  // POST handler to create or update institution draft data
  // Determines action based on request data and existing draft state
  // Handles creation of new draft or updates to existing draft

  private async handlePost(path: string, request: Request): Promise<Response> {
    try {
      // Parse request body
      if (!request.body) {
        return this.createResponse({ error: "Invalid request body" }, 400);
      }
      const requestData = await request.json();

      // Get existing data
      const existingData = (await this.storage.get(
        InstitutionDraftDO.DATA_KEY
      )) as InstitutionDraftData | undefined;

      // Determine current state and action
      const action = determinePostAction(existingData, requestData);

      switch (action) {
        case "CREATE_ORGANIZATION":
          return await this.handleCreateOrganization(requestData);

        case "UPDATE_VERIFICATION":
          return await this.handleUpdateVerification(
            existingData!,
            requestData
          );

        case "INVALID_STEP_DATA":
          return this.createResponse(
            {
              error: "Request data doesn't match any valid step format",
            },
            400
          );

        case "ALREADY_EXISTS":
          return this.createResponse(
            {
              error:
                "Organization data already exists. Cannot create duplicate.",
            },
            409
          );

        case "INVALID_STATE":
          return this.createResponse(
            {
              error: "Application not in correct state for verification update",
            },
            400
          );

        case "NO_EXISTING_DATA":
          return this.createResponse(
            {
              error:
                "No organization data found. Please complete step 1 first.",
            },
            400
          );

        default:
          return this.createResponse(
            {
              error: "Invalid request or application state",
            },
            400
          );
      }
    } catch (error) {
      console.error("Error in handlePost:", error);
      return this.createResponse({ error: "Failed to process request" }, 500);
    }
  }

  // PUT handler to update institution draft data
  // Determines action based on request data and existing draft state
  // Handles updates to organization or verification data, admin actions, etc.

  private async handlePut(path: string, request: Request): Promise<Response> {
    try {
      // Parse request body
      if (!request.body) {
        return this.createResponse({ error: "Invalid request body" }, 400);
      }
      const requestData = await request.json();

      // Get existing data
      const existingData = (await this.storage.get(
        InstitutionDraftDO.DATA_KEY
      )) as InstitutionDraftData | undefined;

      // Determine what type of update this is
      const action = determinePutAction(existingData, requestData);

      switch (action) {
        case "UPDATE_ORGANIZATION":
          return await this.handleUpdateOrganization(
            existingData!,
            requestData
          );

        case "UPDATE_VERIFICATION_DATA":
          return await this.handleUpdateVerificationData(
            existingData!,
            requestData
          );

        case "ADMIN_APPROVE":
          return await this.handleAdminApprove(existingData!, requestData);

        case "ADMIN_REJECT":
          return await this.handleAdminReject(existingData!, requestData);

        case "ADD_CLERK_DETAILS":
          return await this.handleAddClerkDetails(existingData!, requestData);

        case "NO_DATA_TO_UPDATE":
          return this.createResponse(
            {
              error: "No institution draft found to update",
            },
            404
          );

        case "DATA_LOCKED":
          return this.createResponse(
            {
              error:
                "Application cannot be edited in current status. Only draft applications can be modified.",
            },
            403
          );

        default:
          return this.createResponse(
            {
              error: "Invalid update request",
            },
            400
          );
      }
    } catch (error) {
      console.error("Error in handlePut:", error);
      return this.createResponse(
        { error: "Failed to update institution draft" },
        500
      );
    }
  }

  // DELETE handler to remove institution draft data
  // Allows users to completely remove their draft application
  private async handleDelete(
    path: string,
    request: Request
  ): Promise<Response> {
    try {
      // Check if data exists
      const existingData = (await this.storage.get(
        InstitutionDraftDO.DATA_KEY
      )) as InstitutionDraftData | undefined;

      if (!existingData) {
        return this.createResponse(
          {
            error: "No institution draft found to delete",
          },
          404
        );
      }

      // Optional: Check if deletion is allowed based on status
      // For example, you might not want to allow deletion of approved applications
      if (existingData.status === "approved") {
        return this.createResponse(
          {
            error:
              "Cannot delete approved applications. Contact administrator.",
          },
          403
        );
      }

      // Perform the deletion and remove from admin registry in parallel
      await Promise.all([
        this.storage.delete(InstitutionDraftDO.DATA_KEY),
        this.adminRegistry.removeApplication(this.userID),
      ]);

      // Return success response
      return this.createResponse({
        success: true,
        message: "Institution draft deleted successfully",
        deletedData: {
          institutionName: existingData.institutionName,
          status: existingData.status,
          deletedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error in handleDelete:", error);
      return this.createResponse(
        { error: "Failed to delete institution draft" },
        500
      );
    }
  }

  // PUT handler methods
  private async handleUpdateOrganization(
    existingData: InstitutionDraftData,
    requestData: any
  ): Promise<Response> {
    const validation = validateOrganizationData(requestData);
    if (!validation.success) {
      return this.createResponse(formatValidationErrors(validation.error), 400);
    }

    const updatedDraft = updateOrganizationData(existingData, validation.data);

    // Run storage and admin registry operations in parallel
    await Promise.all([
      this.storage.put(InstitutionDraftDO.DATA_KEY, updatedDraft),
      this.adminRegistry.updateApplication(updatedDraft),
    ]);

    return this.createResponse({ success: true, data: updatedDraft });
  }

  private async handleUpdateVerificationData(
    existingData: InstitutionDraftData,
    requestData: any
  ): Promise<Response> {
    const validation = validateVerificationData(requestData);
    if (!validation.success) {
      return this.createResponse(formatValidationErrors(validation.error), 400);
    }

    const updatedDraft = updateVerificationDataOnly(
      existingData,
      validation.data
    );

    // Run storage and admin registry operations in parallel
    await Promise.all([
      this.storage.put(InstitutionDraftDO.DATA_KEY, updatedDraft),
      this.adminRegistry.updateApplication(updatedDraft),
    ]);

    return this.createResponse({ success: true, data: updatedDraft });
  }

  private async handleAdminApprove(
    existingData: InstitutionDraftData,
    requestData: any
  ): Promise<Response> {
    if (!canBeApproved(existingData)) {
      return this.createResponse(
        {
          error: "Application is not in a state that can be approved",
        },
        400
      );
    }

    if (!requestData.reviewedBy) {
      return this.createResponse(
        {
          error: "reviewedBy field is required for approval",
        },
        400
      );
    }

    const approvedDraft = approveDraft(existingData, requestData.reviewedBy);

    // Run storage and admin registry operations in parallel
    await Promise.all([
      this.storage.put(InstitutionDraftDO.DATA_KEY, approvedDraft),
      this.adminRegistry.updateApplication(approvedDraft),
    ]);

    return this.createResponse({ success: true, data: approvedDraft });
  }

  private async handleAdminReject(
    existingData: InstitutionDraftData,
    requestData: any
  ): Promise<Response> {
    if (!canBeRejected(existingData)) {
      return this.createResponse(
        {
          error: "Application is not in a state that can be rejected",
        },
        400
      );
    }

    if (!requestData.reviewedBy || !requestData.rejectionReason) {
      return this.createResponse(
        {
          error:
            "reviewedBy and rejectionReason fields are required for rejection",
        },
        400
      );
    }

    const rejectedDraft = rejectDraft(
      existingData,
      requestData.reviewedBy,
      requestData.rejectionReason
    );

    // Run storage and admin registry operations in parallel
    await Promise.all([
      this.storage.put(InstitutionDraftDO.DATA_KEY, rejectedDraft),
      this.adminRegistry.updateApplication(rejectedDraft),
    ]);

    return this.createResponse({ success: true, data: rejectedDraft });
  }

  private async handleAddClerkDetails(
    existingData: InstitutionDraftData,
    requestData: any
  ): Promise<Response> {
    if (existingData.status !== "approved") {
      return this.createResponse(
        {
          error:
            "Clerk organization details can only be added to approved applications",
        },
        400
      );
    }

    if (!requestData.clerkOrgId || !requestData.clerkOrgSlug) {
      return this.createResponse(
        {
          error: "clerkOrgId and clerkOrgSlug are required",
        },
        400
      );
    }

    const updatedDraft = addClerkOrgDetails(
      existingData,
      requestData.clerkOrgId,
      requestData.clerkOrgSlug
    );

    // Update storage, admin registry, and permanently cache domain in parallel
    await Promise.all([
      this.storage.put(InstitutionDraftDO.DATA_KEY, updatedDraft),
      this.adminRegistry.updateApplication(updatedDraft),
      this.cacheDomainPermanently(updatedDraft),
    ]);

    // Schedule alarm for Supabase sync (5 minutes from now)
    const alarmTime = new Date(Date.now() + 5 * 60 * 1000);
    await this.ctx.storage.setAlarm(alarmTime);

    return this.createResponse({ success: true, data: updatedDraft });
  }

  // GET Helper Methods

  // Separate handler methods for clarity
  private async handleCreateOrganization(requestData: any): Promise<Response> {
    const validation = validateCreateRequest(requestData);
    if (!validation.success) {
      return this.createResponse(formatValidationErrors(validation.error), 400);
    }

    const newDraft = createInitialDraft(
      validation.data,
      validation.data.userId,
      validation.data.userEmail
    );

    // Run storage and admin registry operations in parallel
    await Promise.all([
      this.storage.put(InstitutionDraftDO.DATA_KEY, newDraft),
      this.adminRegistry.registerApplication(newDraft),
    ]);

    return this.createResponse({ success: true, data: newDraft });
  }

  // Fetch Helper Methods
  private async handleUpdateVerification(
    existingData: InstitutionDraftData,
    requestData: any
  ): Promise<Response> {
    const validation = validateUpdateRequest(requestData);
    if (!validation.success) {
      return this.createResponse(formatValidationErrors(validation.error), 400);
    }

    const updatedDraft = updateDraftWithVerification(
      existingData,
      validation.data
    );

    // Run storage and admin registry operations in parallel
    await Promise.all([
      this.storage.put(InstitutionDraftDO.DATA_KEY, updatedDraft),
      this.adminRegistry.updateApplication(updatedDraft),
    ]);

    return this.createResponse({ success: true, data: updatedDraft });
  }

  private createResponse(data: any, status: number = 200): Response {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // ===============================
  // KV CACHE MANAGEMENT METHODS
  // ===============================

  // Private method to permanently cache approved domains
  private async cacheDomainPermanently(
    draftData: InstitutionDraftData
  ): Promise<void> {
    // Only cache if status is "created" (has Clerk org details)
    if (
      draftData.status === "created" &&
      draftData.clerkOrgId &&
      draftData.clerkOrgSlug
    ) {
      const cacheKey = `domain:${draftData.emailDomain}`;
      const cacheData = {
        emailDomain: draftData.emailDomain,
        institutionName: draftData.institutionName,
        clerkOrgId: draftData.clerkOrgId,
        clerkOrgSlug: draftData.clerkOrgSlug,
        status: draftData.status,
        userId: draftData.userId,
        cachedAt: new Date().toISOString(),
        permanent: true, // Flag to indicate permanent cache entry
      };

      try {
        // No TTL = permanent storage in KV
        await this.env.DOMAIN_CACHE.put(cacheKey, JSON.stringify(cacheData));
        console.log(
          `✅ Permanently cached domain: ${draftData.emailDomain} for organization discovery`
        );
      } catch (error) {
        console.error(
          `❌ Failed to cache domain ${draftData.emailDomain}:`,
          error
        );
        // Don't throw - caching failure shouldn't break the main operation
      }
    }
  }

  // Private method to manually remove domain from cache
  private async removeDomainFromCache(emailDomain: string): Promise<void> {
    const cacheKey = `domain:${emailDomain}`;
    try {
      await this.env.DOMAIN_CACHE.delete(cacheKey);
      console.log(`🗑️ Removed cached domain: ${emailDomain}`);
    } catch (error) {
      console.error(`❌ Failed to remove cached domain ${emailDomain}:`, error);
      // Don't throw - cache removal failure shouldn't break the main operation
    }
  }

  // Public method for admin to manually remove domain cache
  async adminRemoveDomainCache(): Promise<{
    success: boolean;
    message: string;
  }> {
    const existingData = (await this.storage.get(
      InstitutionDraftDO.DATA_KEY
    )) as InstitutionDraftData | undefined;

    if (!existingData) {
      throw new Error("No institution draft found");
    }

    try {
      await this.removeDomainFromCache(existingData.emailDomain);
      return {
        success: true,
        message: `Domain cache cleared for ${existingData.emailDomain}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to clear domain cache: ${error}`,
      };
    }
  }
}
