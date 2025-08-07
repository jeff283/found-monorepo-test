/**
 * Type definitions for Clerk public metadata used in the Foundly application
 */

export interface FoundlyUserPublicMetadata {
  jobTitle?: string;
  // Add other public metadata fields as needed
}

declare global {
  interface CustomJwtSessionClaims {
    metadata: FoundlyUserPublicMetadata;
  }
}
