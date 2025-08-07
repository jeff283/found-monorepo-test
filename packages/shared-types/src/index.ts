// Re-export schemas and types for validation and type inference
export * from "./schemas.js";
import type {
  InstitutionStatus,
  InstitutionStep,
  InstitutionType,
  OrganizationSize,
} from "./schemas.js";

// Re-export common types that are shared between API and frontend
// (These are now inferred from schemas for consistency)
export type {
  InstitutionStatus,
  InstitutionStep,
  InstitutionType,
  OrganizationSize,
};

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  exists?: boolean;
}

// Institution Application types (transformed for admin UI)
export interface InstitutionApplication {
  id: string;
  userId: string;
  userEmail: string;
  emailDomain: string;
  institutionName?: string;
  institutionType?: InstitutionType;
  status: InstitutionStatus;
  currentStep: InstitutionStep;
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

// Institution Metrics for admin dashboard
export interface InstitutionMetricsData {
  total_applications: number;
  pending_applications: number;
  approved_applications: number;
  rejected_applications: number;
  abandoned_applications: number;
  approval_rate: string;
}

// Pagination data structure
export interface PaginationData {
  current_page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

// API response for applications list
export interface ApplicationsResponse {
  applications: InstitutionApplication[];
  pagination: PaginationData;
  filters?: {
    status?: string;
    search?: string;
  };
}

// Raw Application Record from API (before transformation)
export interface ApplicationRecord {
  userId: string;
  userEmail: string;
  institutionName?: string;
  status: InstitutionStatus;
  currentStep: InstitutionStep;
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

// Organization step data
export interface OrganizationStepData {
  organizationName: string;
  organizationType: InstitutionType;
  organizationSize: "1-10" | "11-100" | "101-1000" | "1001-10000" | "10000+";
}

// Verification step data
export interface VerificationStepData {
  institutionWebsite: string;
  institutionDescription: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
  expectedStudentCount: string;
}

// Complete institution draft data
export interface InstitutionDraftData {
  userId: string;
  userEmail: string;
  emailDomain: string;

  // Organization details
  institutionName?: string;
  institutionType?: OrganizationStepData["organizationType"];
  organizationSize?: OrganizationStepData["organizationSize"];

  // Verification details
  website?: string;
  description?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phoneNumber?: string;

  // Status tracking
  status: InstitutionStatus;
  currentStep: InstitutionStep;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  reviewedAt?: string;

  // Admin review
  reviewedBy?: string;
  rejectionReason?: string;

  // Clerk organization details
  clerkOrgId?: string;
  clerkOrgSlug?: string;
  orgCreatedAt?: string;

  // Supabase sync status
  supabaseSynced?: boolean;
  supabaseSyncedAt?: string;
}

// Error response types
export interface ErrorResponse {
  error: string;
  details?: any;
}

export interface ValidationErrorResponse extends ErrorResponse {
  validationErrors: Array<{
    field: string;
    message: string;
  }>;
}

// Admin action types
export interface AdminActionRequest {
  action: "approve" | "reject";
  reason?: string;
  notes?: string;
}

export interface BulkAdminActionRequest {
  userIds: string[];
  action: "approve" | "reject";
  reason?: string;
  notes?: string;
}
