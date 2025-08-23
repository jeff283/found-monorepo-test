import * as tenantSchema from "./tenant";
import * as institutionSchema from "./institution";

export const schema = {
  // Tenant tables
  tenant: tenantSchema.tenant,

  // Institution tables
  institutionSchema,
};

// Re-export all types for convenience
export * from "./tenant";
export * from "./institution";
