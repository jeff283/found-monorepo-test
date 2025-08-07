// Institution application types for admin UI
export interface InstitutionApplication {
  id: string;
  userId: string;
  userEmail: string;
  emailDomain: string;
  institutionName?: string;
  institutionType?:
    | "university"
    | "college"
    | "research"
    | "nonprofit"
    | "government"
    | "corporate"
    | "other";
  status: "draft" | "pending_verification" | "approved" | "rejected";
  currentStep: "organization" | "verification" | "complete";
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface InstitutionDraftData {
  id?: string; // Add id field for frontend use
  userId: string;
  userEmail: string;
  emailDomain: string;

  // Organization details
  institutionName?: string;
  institutionType?:
    | "university"
    | "college"
    | "research"
    | "nonprofit"
    | "government"
    | "corporate"
    | "other";
  organizationSize?: "1-10" | "11-100" | "101-1000" | "1001-10000" | "10000+";

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
  status: "draft" | "pending_verification" | "approved" | "rejected";
  currentStep: "organization" | "verification" | "complete";

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

export interface InstitutionMetricsData {
  total_applications: number;
  pending_applications: number;
  approved_applications: number;
  rejected_applications: number;
  abandoned_applications: number;
  approval_rate: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
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
