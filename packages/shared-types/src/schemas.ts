import { z } from "zod";

// Centralized Institution Type Schema that can be used for validation
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

// Organization size schema
export const organizationSizeSchema = z.enum([
  "1-10",
  "11-100",
  "101-1000",
  "1001-10000",
  "10000+",
]);

export type OrganizationSize = z.infer<typeof organizationSizeSchema>;

// Institution status schema
export const institutionStatusSchema = z.enum([
  "draft",
  "pending_verification",
  "approved",
  "rejected",
]);

export type InstitutionStatus = z.infer<typeof institutionStatusSchema>;

// Institution step schema
export const institutionStepSchema = z.enum([
  "organization",
  "verification",
  "complete",
]);

export type InstitutionStep = z.infer<typeof institutionStepSchema>;
