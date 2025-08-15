import { z } from "zod";

// Centralized Institution Type Schema
export const institutionTypeSchema = z.enum([
  "university",
  "college",
  "research",
  "nonprofit",
  "government",
  "corporate",
  "other",
]);

// Export the inferred type for use throughout the codebase
export type InstitutionType = z.infer<typeof institutionTypeSchema>;

// Zod schemas for validation

// Organization step validation (Step 1)
export const organizationStepSchema = z.object({
  organizationName: z
    .string()
    .min(1, "Organization name is required")
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name must be less than 100 characters"),

  organizationType: institutionTypeSchema.refine(
    (val) => val !== undefined,
    "Please select an organization type"
  ),

  organizationSize: z
    .enum(["1-10", "11-100", "101-1000", "1001-10000", "10000+"])
    .refine((val) => val !== undefined, "Please select organization size"),
});

// Verification step validation (Step 2)
export const verificationStepSchema = z.object({
  institutionWebsite: z
    .url("Please enter a valid website URL")
    .min(1, "Institution website is required"),

  institutionDescription: z
    .string()
    .min(5, "Please provide at least 5 characters describing your institution")
    .max(500, "Description must be less than 500 characters"),

  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  zipCode: z.string().min(1, "ZIP/Postal code is required"),
  country: z.string().min(1, "Country is required"),

  phoneNumber: z.string().min(1, "Phone number is required"),

  expectedStudentCount: z
    .string()
    .min(1, "Expected student count is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Please enter a valid number"
    ),

  taxIdOrRegistrationNumber: z.string().optional(),
});

// Request schemas that include user context
export const createInstitutionDraftSchema = organizationStepSchema.extend({
  userId: z.string().min(1, "User ID is required"),
  userEmail: z.email("Valid email is required"),
});

export const updateInstitutionDraftSchema = verificationStepSchema;

// Clerk organization details schema
export const clerkOrganizationDetailsSchema = z.object({
  clerkOrgId: z.string().min(1, "Clerk organization ID is required"),
  clerkOrgSlug: z.string().min(1, "Clerk organization slug is required"),
});

// User context schema (for API route validation)
export const userContextSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  userEmail: z.string().email("Valid email is required"),
});

// Status and step schemas
export const institutionStatusSchema = z.enum([
  "draft",
  "pending_verification",
  "verifying", // Admin is actively reviewing/verifying
  "approved",
  "rejected",
  "created", // Organization has been created in Clerk
]);

export const institutionStepSchema = z.enum([
  "organization",
  "verification",
  "complete",
]);

// Full institution draft schema for storage validation
export const institutionDraftDataSchema = z.object({
  // User identification
  userId: z.string(),
  userEmail: z.email(),
  emailDomain: z.string(),

  // Organization details (Step 1)
  institutionName: z.string().optional(),
  institutionType: institutionTypeSchema.optional(),
  organizationSize: z
    .enum(["1-10", "11-100", "101-1000", "1001-10000", "10000+"])
    .optional(),

  // Verification details (Step 2)
  website: z.url().optional(),
  description: z.string().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z.string().optional(),
  expectedStudentCount: z.string().optional(),
  taxIdOrRegistrationNumber: z.string().optional(),

  // Status tracking
  status: institutionStatusSchema,
  currentStep: institutionStepSchema,

  // Timestamps
  createdAt: z.string(),
  updatedAt: z.string(),
  submittedAt: z.string().optional(),

  // Admin actions
  reviewedBy: z.string().optional(),
  reviewedAt: z.string().optional(),
  rejectionReason: z.string().optional(),

  // Clerk organization details
  clerkOrgId: z.string().optional(),
  clerkOrgSlug: z.string().optional(),

  // Supabase sync
  syncedToSupabase: z.boolean().optional(),
  syncedAt: z.string().optional(),
});

export const KVDomainCache = z.object({});

// Type inference from schemas
export type OrganizationStepData = z.infer<typeof organizationStepSchema>;
export type VerificationStepData = z.infer<typeof verificationStepSchema>;
export type CreateInstitutionDraftRequest = z.infer<
  typeof createInstitutionDraftSchema
>;
export type UpdateInstitutionDraftRequest = z.infer<
  typeof updateInstitutionDraftSchema
>;
export type ClerkOrganizationDetailsRequest = z.infer<
  typeof clerkOrganizationDetailsSchema
>;
export type InstitutionDraftData = z.infer<typeof institutionDraftDataSchema>;
export type InstitutionStatus = z.infer<typeof institutionStatusSchema>;
export type InstitutionStep = z.infer<typeof institutionStepSchema>;
export type ClerkOrganizationDetails = z.infer<
  typeof clerkOrganizationDetailsSchema
>;
