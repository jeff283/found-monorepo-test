import {
  InstitutionDraftData,
  OrganizationStepData,
  VerificationStepData,
  organizationStepSchema,
  verificationStepSchema,
  createInstitutionDraftSchema,
  updateInstitutionDraftSchema,
} from "@/api/lib/schemas";

// Email domain extraction utility
export function extractEmailDomain(email: string): string {
  const parts = email.split("@");
  if (parts.length !== 2) {
    throw new Error("Invalid email format");
  }
  return parts[1];
}

// Type guards to determine which step data you're receiving
export function isOrganizationStepData(
  data: any
): data is OrganizationStepData {
  try {
    organizationStepSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

export function isVerificationStepData(
  data: any
): data is VerificationStepData {
  try {
    verificationStepSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

// Validation functions that return detailed error information
export function validateOrganizationData(data: any) {
  return organizationStepSchema.safeParse(data);
}

export function validateVerificationData(data: any) {
  return verificationStepSchema.safeParse(data);
}

export function validateCreateRequest(data: any) {
  return createInstitutionDraftSchema.safeParse(data);
}

export function validateUpdateRequest(data: any) {
  return updateInstitutionDraftSchema.safeParse(data);
}

// Create initial draft from organization data
export function createInitialDraft(
  orgData: OrganizationStepData,
  userId: string,
  userEmail: string
): InstitutionDraftData {
  const emailDomain = extractEmailDomain(userEmail);
  const now = new Date().toISOString();

  return {
    // User identification
    userId,
    userEmail,
    emailDomain,

    // Organization details
    institutionName: orgData.organizationName,
    institutionType: orgData.organizationType,
    organizationSize: orgData.organizationSize,

    // Status tracking
    status: "draft",
    currentStep: "organization",

    // Timestamps
    createdAt: now,
    updatedAt: now,
  };
}

// Update draft with verification data
export function updateDraftWithVerification(
  existingDraft: InstitutionDraftData,
  verificationData: VerificationStepData
): InstitutionDraftData {
  return {
    ...existingDraft,

    // Add verification details (map from request fields to storage fields)
    website: verificationData.institutionWebsite,
    description: verificationData.institutionDescription,
    streetAddress: verificationData.streetAddress,
    city: verificationData.city,
    state: verificationData.state,
    zipCode: verificationData.zipCode,
    country: verificationData.country,
    phoneNumber: verificationData.phoneNumber,
    expectedStudentCount: verificationData.expectedStudentCount,
    taxIdOrRegistrationNumber: verificationData.taxIdOrRegistrationNumber,

    // Update status and step
    status: "pending_verification",
    currentStep: "complete",
    updatedAt: new Date().toISOString(),
  };
}

// Check if a draft is in a valid state for a specific operation
export function canUpdateToVerification(draft: InstitutionDraftData): boolean {
  return draft.status === "draft" && draft.currentStep === "organization";
}

export function canBeApproved(draft: InstitutionDraftData): boolean {
  return (
    draft.status === "pending_verification" && draft.currentStep === "complete"
  );
}

export function canBeRejected(draft: InstitutionDraftData): boolean {
  return (
    draft.status === "pending_verification" && draft.currentStep === "complete"
  );
}

// Admin action helpers
export function approveDraft(
  existingDraft: InstitutionDraftData,
  reviewedBy: string
): InstitutionDraftData {
  return {
    ...existingDraft,
    status: "approved",
    reviewedBy,
    reviewedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function rejectDraft(
  existingDraft: InstitutionDraftData,
  reviewedBy: string,
  rejectionReason: string
): InstitutionDraftData {
  return {
    ...existingDraft,
    status: "rejected",
    reviewedBy,
    reviewedAt: new Date().toISOString(),
    rejectionReason,
    updatedAt: new Date().toISOString(),
  };
}

// Add Clerk organization details after approval
export function addClerkOrgDetails(
  existingDraft: InstitutionDraftData,
  clerkOrgId: string,
  clerkOrgSlug: string
): InstitutionDraftData {
  return {
    ...existingDraft,
    clerkOrgId,
    clerkOrgSlug,
    status: "created",
    updatedAt: new Date().toISOString(),
  };
}

// Mark as synced to Supabase
export function markAsSynced(
  existingDraft: InstitutionDraftData
): InstitutionDraftData {
  return {
    ...existingDraft,
    syncedToSupabase: true,
    syncedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Utility to get user-friendly status text
export function getStatusText(status: InstitutionDraftData["status"]): string {
  switch (status) {
    case "draft":
      return "Draft in progress";
    case "pending_verification":
      return "Pending verification";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return "Unknown status";
  }
}

// Utility to get user-friendly step text
export function getStepText(step: InstitutionDraftData["currentStep"]): string {
  switch (step) {
    case "organization":
      return "Organization details";
    case "verification":
      return "Verification";
    case "complete":
      return "Complete";
    default:
      return "Unknown step";
  }
}

// Progress calculation
export function calculateProgress(draft: InstitutionDraftData): number {
  if (draft.currentStep === "organization") return 33;
  if (draft.currentStep === "verification") return 66;
  if (draft.currentStep === "complete") return 100;
  return 0;
}

// Helper method to determine what action to take
export function determinePostAction(
  existingData: InstitutionDraftData | undefined,
  requestData: any
): string {
  const isOrgData = isOrganizationStepData(requestData);
  const isVerifData = isVerificationStepData(requestData);

  if (!isOrgData && !isVerifData) {
    return "INVALID_STEP_DATA";
  }

  if (!existingData && isOrgData) {
    return "CREATE_ORGANIZATION";
  }

  if (!existingData && isVerifData) {
    return "NO_EXISTING_DATA";
  }

  if (existingData && isOrgData) {
    return "ALREADY_EXISTS";
  }

  if (existingData && isVerifData && canUpdateToVerification(existingData)) {
    return "UPDATE_VERIFICATION";
  }

  if (existingData && isVerifData) {
    return "INVALID_STATE";
  }

  return "UNKNOWN";
}

// Helper to determine PUT action
export function determinePutAction(
  existingData: InstitutionDraftData | undefined,
  requestData: any
): string {
  if (!existingData) {
    return "NO_DATA_TO_UPDATE";
  }

  // Check for admin actions
  if ("action" in requestData && requestData.action === "approve") {
    return "ADMIN_APPROVE";
  }
  if ("action" in requestData && requestData.action === "reject") {
    return "ADMIN_REJECT";
  }
  if ("clerkOrgId" in requestData) {
    return "ADD_CLERK_DETAILS";
  }

  // Check for user updates (only allowed in draft status)
  if (isOrganizationStepData(requestData) && existingData.status === "draft") {
    return "UPDATE_ORGANIZATION";
  }
  if (isVerificationStepData(requestData) && existingData.status === "draft") {
    return "UPDATE_VERIFICATION_DATA";
  }

  // Data is locked (pending verification, approved, etc.)
  if (existingData.status !== "draft") {
    return "DATA_LOCKED";
  }

  return "INVALID_UPDATE";
}

// Update organization data only
export function updateOrganizationData(
  existingDraft: InstitutionDraftData,
  orgData: OrganizationStepData
): InstitutionDraftData {
  return {
    ...existingDraft,
    institutionName: orgData.organizationName,
    institutionType: orgData.organizationType,
    organizationSize: orgData.organizationSize,
    updatedAt: new Date().toISOString(),
  };
}

// Update verification data only (without changing status)
export function updateVerificationDataOnly(
  existingDraft: InstitutionDraftData,
  verificationData: VerificationStepData
): InstitutionDraftData {
  return {
    ...existingDraft,
    website: verificationData.institutionWebsite,
    description: verificationData.institutionDescription,
    streetAddress: verificationData.streetAddress,
    city: verificationData.city,
    state: verificationData.state,
    zipCode: verificationData.zipCode,
    country: verificationData.country,
    phoneNumber: verificationData.phoneNumber,
    expectedStudentCount: verificationData.expectedStudentCount,
    taxIdOrRegistrationNumber: verificationData.taxIdOrRegistrationNumber,
    updatedAt: new Date().toISOString(),
  };
}
