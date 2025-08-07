import { Env } from "@/lib/bindings";
import type { InstitutionDraftData, InstitutionReference } from "@/lib/types";

// Helper functions to sync with Admin Registry using direct method calls
export class AdminRegistryClient {
  private env: Env;

  constructor(env: Env) {
    this.env = env;
  }

  // Get the admin registry DO stub
  private getAdminRegistryStub() {
    // Use a fixed ID for the admin registry (singleton pattern)
    const id = this.env.ADMIN_REGISTRY_DO.idFromName("admin-registry");
    return this.env.ADMIN_REGISTRY_DO.get(id);
  }

  // Register a new institution reference (simplified)
  async registerApplication(data: InstitutionDraftData): Promise<void> {
    try {
      const registryStub = this.getAdminRegistryStub();

      await registryStub.registerInstitutionReference(
        data.userId,
        data.userEmail,
        data.institutionName || "",
        data.status,
        data.institutionType
      );
    } catch (error) {
      console.error("Error registering institution reference:", error);
      // Don't throw - we don't want admin registry failures to break the main operation
    }
  }

  // Update institution reference status (simplified)
  async updateApplication(data: InstitutionDraftData): Promise<void> {
    try {
      const registryStub = this.getAdminRegistryStub();

      await registryStub.updateInstitutionReference(data.userId, {
        status: data.status,
        institutionName: data.institutionName,
        institutionType: data.institutionType,
      });
    } catch (error) {
      console.error("Error updating institution reference:", error);
      // Don't throw - we don't want admin registry failures to break the main operation
    }
  }

  // Remove an institution reference
  async removeApplication(userId: string): Promise<void> {
    try {
      const registryStub = this.getAdminRegistryStub();

      await registryStub.removeInstitutionReference(userId);
    } catch (error) {
      console.error("Error removing institution reference:", error);
      // Don't throw - we don't want admin registry failures to break the main operation
    }
  }

  // Find institution references by email domain
  async findInstitutionReferencesByDomain(
    emailDomain: string
  ): Promise<InstitutionReference[]> {
    try {
      const registryStub = this.getAdminRegistryStub();
      return await registryStub.getInstitutionReferencesByDomain(emailDomain);
    } catch (error) {
      console.error("Error finding institution references by domain:", error);
      return [];
    }
  }

  // Find institution references by domain and status (optimized)
  async findInstitutionReferencesByDomainAndStatus(
    emailDomain: string,
    status: string
  ): Promise<InstitutionReference[]> {
    try {
      const registryStub = this.getAdminRegistryStub();
      return await registryStub.getInstitutionReferencesByDomainAndStatus(
        emailDomain,
        status as any
      );
    } catch (error) {
      console.error(
        "Error finding institution references by domain and status:",
        error
      );
      return [];
    }
  }
}
