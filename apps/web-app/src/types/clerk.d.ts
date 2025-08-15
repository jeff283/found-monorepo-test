/**
 * Type definitions for Clerk public metadata used in the Foundly application
 */

export interface FoundlyUserPublicMetadata {
  jobTitle: string;
  // Add other public metadata fields as needed
}

export interface FoundlyOrganizationMetadata {
  emailDomain: string;
  // Add other organization metadata fields as needed
}

declare global {
  interface CustomJwtSessionClaims {
    metadata: FoundlyUserPublicMetadata;
    activeOrgMetadata: FoundlyOrganizationMetadata;
    primaryEmail: string;
  }
}
