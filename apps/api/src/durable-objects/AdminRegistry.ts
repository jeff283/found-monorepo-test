import { DurableObject } from "cloudflare:workers";
import { Env } from "@/lib/bindings";
import type {
  ApplicationRecord,
  RegistryData,
  LegacyRegistryData,
  InstitutionReference,
  InstitutionStatus,
} from "@/lib/types";

export class AdminRegistryDO extends DurableObject {
  storage: DurableObjectStorage;
  ctx: DurableObjectState;
  env: Env;

  private static readonly REGISTRY_KEY = "registry";

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.ctx = ctx;
    this.env = env;
    this.storage = ctx.storage;
  }

  // ==============================================
  // DIRECT METHODS - Reference-based, lightweight
  // ==============================================

  // Get all institution references
  async getAllInstitutionReferences(): Promise<InstitutionReference[]> {
    const registryData = await this.getRegistryData();
    const references = Object.values(registryData.references);

    // Sort by creation date (newest first)
    return references.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Get institution references by status
  async getInstitutionReferencesByStatus(
    status: InstitutionStatus
  ): Promise<InstitutionReference[]> {
    const allReferences = await this.getAllInstitutionReferences();
    return allReferences.filter((ref) => ref.status === status);
  }

  // Get institution references by email domain
  async getInstitutionReferencesByDomain(
    emailDomain: string
  ): Promise<InstitutionReference[]> {
    const allReferences = await this.getAllInstitutionReferences();
    return allReferences.filter((ref) => ref.emailDomain === emailDomain);
  }

  // Get institution references by domain and status (optimized query)
  async getInstitutionReferencesByDomainAndStatus(
    emailDomain: string,
    status: InstitutionStatus
  ): Promise<InstitutionReference[]> {
    const registryData = await this.getRegistryData();
    const references = Object.values(registryData.references);

    return references.filter(
      (ref) => ref.emailDomain === emailDomain && ref.status === status
    );
  }

  // Get a specific institution reference
  async getInstitutionReference(
    userId: string
  ): Promise<InstitutionReference | null> {
    const registryData = await this.getRegistryData();
    return registryData.references[userId] || null;
  }

  // Get full institution data by calling the InstitutionDraft DO
  async getFullInstitutionData(userId: string): Promise<any> {
    try {
      const institutionDOId = this.env.INSTITUTION_DRAFT.idFromString(userId);
      const institutionDOStub = this.env.INSTITUTION_DRAFT.get(institutionDOId);
      return await institutionDOStub.getDraftData();
    } catch (error) {
      console.error(
        `Error getting full institution data for user ${userId}:`,
        error
      );
      return null;
    }
  }

  // Register a new institution reference
  async registerInstitutionReference(
    userId: string,
    userEmail: string,
    institutionName: string,
    status: InstitutionStatus
  ): Promise<InstitutionReference> {
    const registryData = await this.getRegistryData();

    // Check if reference already exists
    if (registryData.references[userId]) {
      throw new Error("Institution reference already exists");
    }

    // Extract email domain
    const emailDomain = userEmail.split("@")[1];

    // Create new institution reference
    const newReference: InstitutionReference = {
      userId,
      userEmail,
      emailDomain,
      institutionName,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    registryData.references[userId] = newReference;
    registryData.lastUpdated = new Date().toISOString();

    await this.storage.put(AdminRegistryDO.REGISTRY_KEY, registryData);
    return newReference;
  }

  // Update an existing institution reference
  async updateInstitutionReference(
    userId: string,
    updates: Partial<Pick<InstitutionReference, "status" | "institutionName">>
  ): Promise<InstitutionReference> {
    const registryData = await this.getRegistryData();
    const existingReference = registryData.references[userId];

    if (!existingReference) {
      throw new Error("Institution reference not found");
    }

    // Update the reference (only allow specific fields)
    const updatedReference: InstitutionReference = {
      ...existingReference,
      ...updates,
      userId, // Ensure userId can't be changed
      updatedAt: new Date().toISOString(),
    };

    registryData.references[userId] = updatedReference;
    registryData.lastUpdated = new Date().toISOString();

    await this.storage.put(AdminRegistryDO.REGISTRY_KEY, registryData);
    return updatedReference;
  }

  // Remove an institution reference
  async removeInstitutionReference(userId: string): Promise<void> {
    const registryData = await this.getRegistryData();

    if (!registryData.references[userId]) {
      throw new Error("Institution reference not found");
    }

    delete registryData.references[userId];
    registryData.lastUpdated = new Date().toISOString();

    await this.storage.put(AdminRegistryDO.REGISTRY_KEY, registryData);
  }

  // Get abandoned references (older than 7 days with no update and still in draft)
  async getAbandonedInstitutionReferences(): Promise<InstitutionReference[]> {
    const allReferences = await this.getAllInstitutionReferences();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return allReferences.filter((ref) => {
      const updatedAt = new Date(ref.updatedAt);
      return ref.status === "draft" && updatedAt < sevenDaysAgo;
    });
  }

  // ==============================================
  // LEGACY METHODS - For backward compatibility
  // These will be removed after full migration
  // ==============================================

  async getAllApplications(): Promise<ApplicationRecord[]> {
    // Convert references to ApplicationRecord format
    const references = await this.getAllInstitutionReferences();
    return references.map((ref) => ({
      userId: ref.userId,
      userEmail: ref.userEmail,
      institutionName: ref.institutionName,
      status: ref.status,
      currentStep: "organization" as const, // Default fallback
      createdAt: ref.createdAt,
      updatedAt: ref.updatedAt,
    }));
  }

  async getApplicationsByStatus(status: string): Promise<ApplicationRecord[]> {
    const references = await this.getInstitutionReferencesByStatus(
      status as InstitutionStatus
    );
    return references.map((ref) => ({
      userId: ref.userId,
      userEmail: ref.userEmail,
      institutionName: ref.institutionName,
      status: ref.status,
      currentStep: "organization" as const, // Default fallback
      createdAt: ref.createdAt,
      updatedAt: ref.updatedAt,
    }));
  }

  async getApplicationsByStep(step: string): Promise<ApplicationRecord[]> {
    // Since we removed currentStep from references, this method will return empty
    // TODO: Remove this method after admin routes are updated
    return [];
  }

  async getAbandonedApplications(): Promise<ApplicationRecord[]> {
    const references = await this.getAbandonedInstitutionReferences();
    return references.map((ref) => ({
      userId: ref.userId,
      userEmail: ref.userEmail,
      institutionName: ref.institutionName,
      status: ref.status,
      currentStep: "organization" as const, // Default fallback
      createdAt: ref.createdAt,
      updatedAt: ref.updatedAt,
    }));
  }

  async getApplication(userId: string): Promise<ApplicationRecord | null> {
    const reference = await this.getInstitutionReference(userId);
    if (!reference) return null;

    return {
      userId: reference.userId,
      userEmail: reference.userEmail,
      institutionName: reference.institutionName,
      status: reference.status,
      currentStep: "organization" as const, // Default fallback
      createdAt: reference.createdAt,
      updatedAt: reference.updatedAt,
    };
  }

  async registerNewApplication(
    userId: string,
    userEmail: string,
    institutionName: string,
    status: InstitutionStatus,
    currentStep: string // Ignored in new system
  ): Promise<ApplicationRecord> {
    const reference = await this.registerInstitutionReference(
      userId,
      userEmail,
      institutionName,
      status
    );

    return {
      userId: reference.userId,
      userEmail: reference.userEmail,
      institutionName: reference.institutionName,
      status: reference.status,
      currentStep: "organization" as const,
      createdAt: reference.createdAt,
      updatedAt: reference.updatedAt,
    };
  }

  async updateExistingApplication(
    userId: string,
    updates: Partial<ApplicationRecord>
  ): Promise<ApplicationRecord> {
    // Only update status and institutionName from the updates
    const referenceUpdates: Partial<
      Pick<InstitutionReference, "status" | "institutionName">
    > = {};

    if (updates.status) referenceUpdates.status = updates.status;
    if (updates.institutionName)
      referenceUpdates.institutionName = updates.institutionName;

    const reference = await this.updateInstitutionReference(
      userId,
      referenceUpdates
    );

    return {
      userId: reference.userId,
      userEmail: reference.userEmail,
      institutionName: reference.institutionName,
      status: reference.status,
      currentStep: "organization" as const,
      createdAt: reference.createdAt,
      updatedAt: reference.updatedAt,
    };
  }

  async removeExistingApplication(userId: string): Promise<void> {
    await this.removeInstitutionReference(userId);
  }

  // ==============================================
  // HTTP HANDLERS - For web-based access
  // ==============================================

  async fetch(request: Request): Promise<Response> {
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
      console.error("Error in AdminRegistry fetch handler:", error);
      return this.createResponse({ error: "Internal Server Error" }, 500);
    }
  }

  // GET: List all applications with optional filtering
  private async handleGet(path: string, request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const status = url.searchParams.get("status");
      const emailDomain = url.searchParams.get("emailDomain");

      let applications: ApplicationRecord[];

      if (status && emailDomain) {
        // Get applications by domain and status (optimized)
        const references = await this.getInstitutionReferencesByDomainAndStatus(
          emailDomain,
          status as InstitutionStatus
        );
        applications = references.map((ref) => ({
          userId: ref.userId,
          userEmail: ref.userEmail,
          institutionName: ref.institutionName,
          status: ref.status,
          currentStep: "organization" as const,
          createdAt: ref.createdAt,
          updatedAt: ref.updatedAt,
        }));
      } else if (status) {
        applications = await this.getApplicationsByStatus(status);
      } else if (emailDomain) {
        const references = await this.getInstitutionReferencesByDomain(
          emailDomain
        );
        applications = references.map((ref) => ({
          userId: ref.userId,
          userEmail: ref.userEmail,
          institutionName: ref.institutionName,
          status: ref.status,
          currentStep: "organization" as const,
          createdAt: ref.createdAt,
          updatedAt: ref.updatedAt,
        }));
      } else {
        applications = await this.getAllApplications();
      }

      const registryData = await this.getRegistryData();

      return this.createResponse({
        success: true,
        applications,
        total: applications.length,
        lastUpdated: registryData.lastUpdated,
      });
    } catch (error) {
      console.error("Error in handleGet:", error);
      return this.createResponse(
        { error: "Failed to retrieve applications" },
        500
      );
    }
  }

  // POST: Register a new application
  private async handlePost(path: string, request: Request): Promise<Response> {
    try {
      const requestData = (await request.json()) as any;

      if (!requestData.userId || !requestData.userEmail) {
        return this.createResponse(
          { error: "userId and userEmail are required" },
          400
        );
      }

      // Use the new reference-based method
      const newReference = await this.registerInstitutionReference(
        requestData.userId,
        requestData.userEmail,
        requestData.institutionName || "",
        requestData.status || "draft"
      );

      // Convert to ApplicationRecord format for response
      const applicationRecord: ApplicationRecord = {
        userId: newReference.userId,
        userEmail: newReference.userEmail,
        institutionName: newReference.institutionName,
        status: newReference.status,
        currentStep: "organization",
        createdAt: newReference.createdAt,
        updatedAt: newReference.updatedAt,
      };

      return this.createResponse({
        success: true,
        message: "Application registered successfully",
        application: applicationRecord,
      });
    } catch (error) {
      console.error("Error in handlePost:", error);
      return this.createResponse(
        { error: "Failed to register application" },
        500
      );
    }
  }

  // PUT: Update an existing application
  private async handlePut(path: string, request: Request): Promise<Response> {
    try {
      const requestData = (await request.json()) as any;

      if (!requestData.userId) {
        return this.createResponse({ error: "userId is required" }, 400);
      }

      // Use the new reference-based method
      const referenceUpdates: Partial<
        Pick<InstitutionReference, "status" | "institutionName">
      > = {};

      if (requestData.status) referenceUpdates.status = requestData.status;
      if (requestData.institutionName)
        referenceUpdates.institutionName = requestData.institutionName;

      const updatedReference = await this.updateInstitutionReference(
        requestData.userId,
        referenceUpdates
      );

      // Convert to ApplicationRecord format for response
      const applicationRecord: ApplicationRecord = {
        userId: updatedReference.userId,
        userEmail: updatedReference.userEmail,
        institutionName: updatedReference.institutionName,
        status: updatedReference.status,
        currentStep: "organization",
        createdAt: updatedReference.createdAt,
        updatedAt: updatedReference.updatedAt,
      };

      return this.createResponse({
        success: true,
        message: "Application updated successfully",
        application: applicationRecord,
      });
    } catch (error) {
      console.error("Error in handlePut:", error);
      return this.createResponse(
        { error: "Failed to update application" },
        500
      );
    }
  }

  // DELETE: Remove an application
  private async handleDelete(
    path: string,
    request: Request
  ): Promise<Response> {
    try {
      const url = new URL(request.url);
      const userId = url.searchParams.get("userId");

      if (!userId) {
        return this.createResponse(
          { error: "userId parameter is required" },
          400
        );
      }

      // Use the new reference-based method
      await this.removeInstitutionReference(userId);

      return this.createResponse({
        success: true,
        message: "Application removed successfully",
      });
    } catch (error) {
      console.error("Error in handleDelete:", error);
      return this.createResponse(
        { error: "Failed to remove application" },
        500
      );
    }
  }

  // Helper methods
  private async getRegistryData(): Promise<RegistryData> {
    const data = (await this.storage.get(AdminRegistryDO.REGISTRY_KEY)) as
      | RegistryData
      | LegacyRegistryData
      | undefined;

    if (!data) {
      return {
        references: {},
        lastUpdated: new Date().toISOString(),
      };
    }

    // Handle migration from legacy format
    if ("applications" in data) {
      // Convert legacy format to new format
      const legacyData = data as LegacyRegistryData;
      const references: Record<string, InstitutionReference> = {};

      for (const [userId, app] of Object.entries(legacyData.applications)) {
        const emailDomain = app.userEmail.split("@")[1];
        references[userId] = {
          userId: app.userId,
          userEmail: app.userEmail,
          emailDomain,
          institutionName: app.institutionName,
          status: app.status,
          createdAt: app.createdAt,
          updatedAt: app.updatedAt,
        };
      }

      const newData: RegistryData = {
        references,
        lastUpdated: legacyData.lastUpdated,
      };

      // Save the migrated data
      await this.storage.put(AdminRegistryDO.REGISTRY_KEY, newData);
      return newData;
    }

    return data as RegistryData;
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

  // List all cached domains (for admin purposes)
  async listCachedDomains(): Promise<string[]> {
    try {
      // KV list operation to get all keys with "domain:" prefix
      const list = await this.env.DOMAIN_CACHE.list({ prefix: "domain:" });
      return list.keys.map((key) => key.name.replace("domain:", ""));
    } catch (error) {
      console.error("Failed to list cached domains:", error);
      return [];
    }
  }

  // Admin method to manually remove domain from cache
  async adminRemoveDomainFromCache(
    emailDomain: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const cacheKey = `domain:${emailDomain}`;
      await this.env.DOMAIN_CACHE.delete(cacheKey);
      console.log(`🗑️ Admin removed cached domain: ${emailDomain}`);
      return {
        success: true,
        message: `Domain cache cleared for ${emailDomain}`,
      };
    } catch (error) {
      console.error(`❌ Failed to remove cached domain ${emailDomain}:`, error);
      return {
        success: false,
        message: `Failed to clear domain cache: ${error}`,
      };
    }
  }

  // Get cached domain data (for debugging)
  async getCachedDomainData(emailDomain: string): Promise<any> {
    try {
      const cacheKey = `domain:${emailDomain}`;
      const cachedData = await this.env.DOMAIN_CACHE.get(cacheKey, "json");
      return cachedData;
    } catch (error) {
      console.error(
        `❌ Failed to get cached domain data for ${emailDomain}:`,
        error
      );
      return null;
    }
  }
}
