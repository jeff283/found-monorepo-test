// Re-export types from schemas for backward compatibility and central access
export {
  type InstitutionDraftData,
  type OrganizationStepData,
  type VerificationStepData,
  type CreateInstitutionDraftRequest,
  type UpdateInstitutionDraftRequest,
  type InstitutionStatus,
  type InstitutionStep,
  type InstitutionType,
} from "./schemas";

import type {
  InstitutionDraftData,
  InstitutionStatus,
  InstitutionStep,
  InstitutionType,
} from "./schemas";

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  exists?: boolean;
}

// GET response types
export type GetInstitutionDraftResponse =
  | { exists: false }
  | { exists: true; data: InstitutionDraftData };

// POST/PUT response types
export interface PostInstitutionDraftResponse {
  success: true;
  data: InstitutionDraftData;
}

// Error response type
export interface ErrorResponse {
  error: string;
  details?: any;
}

// Validation error response type
export interface ValidationErrorResponse extends ErrorResponse {
  validationErrors: Array<{
    field: string;
    message: string;
  }>;
}

// Admin Registry types - Reference-based (lightweight index)
export interface InstitutionReference {
  userId: string; // Reference to InstitutionDraft DO
  emailDomain: string; // For domain-based search
  userEmail: string; // Keep for admin display
  institutionName?: string; // Basic search metadata only
  institutionType?: InstitutionType; // For admin filtering and display
  status: InstitutionStatus; // For filtering
  createdAt: string;
  updatedAt: string;
}

// Legacy ApplicationRecord for backward compatibility during migration
export interface ApplicationRecord {
  userId: string;
  userEmail: string;
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

export interface RegistryData {
  references: Record<string, InstitutionReference>; // userId -> InstitutionReference
  lastUpdated: string;
}

// Legacy RegistryData for backward compatibility during migration
export interface LegacyRegistryData {
  applications: Record<string, ApplicationRecord>; // userId -> ApplicationRecord
  lastUpdated: string;
}

// Admin UI types - for frontend consumption
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

export interface InstitutionMetricsData {
  total_applications: number;
  pending_applications: number;
  approved_applications: number;
  rejected_applications: number;
  abandoned_applications: number;
  approval_rate: string;
}

export interface PaginationData {
  current_page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export interface ApplicationsResponse {
  applications: InstitutionApplication[];
  pagination: PaginationData;
  filters?: {
    status?: string;
    search?: string;
  };
}
