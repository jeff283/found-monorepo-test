import { InstitutionStatus } from "@/lib/schemas";

/**
 * Centralized business logic for determining if institution data can be updated
 */
export class InstitutionUpdatePermissions {
  /**
   * Check if a user can update their institution data based on current status
   * @param status Current institution status
   * @returns Object with canUpdate flag and reason if not allowed
   */
  static canUserUpdate(status: InstitutionStatus): {
    canUpdate: boolean;
    reason?: string;
  } {
    switch (status) {
      case "draft":
      case "pending_verification":
        return { canUpdate: true };

      case "verifying":
        return {
          canUpdate: false,
          reason: "Application is currently being reviewed by an administrator",
        };

      case "approved":
        return {
          canUpdate: false,
          reason: "Cannot modify approved application",
        };

      case "rejected":
        return {
          canUpdate: false,
          reason:
            "Cannot modify rejected application. Please contact support for appeals.",
        };

      default:
        return {
          canUpdate: false,
          reason: "Unknown status - update not permitted",
        };
    }
  }

  /**
   * Check if an admin can change the status of an institution
   * @param currentStatus Current institution status
   * @param newStatus Desired new status
   * @returns Object with canChange flag and reason if not allowed
   */
  static canAdminChangeStatus(
    currentStatus: InstitutionStatus,
    newStatus: InstitutionStatus
  ): {
    canChange: boolean;
    reason?: string;
  } {
    // Define valid status transitions
    const validTransitions: Record<InstitutionStatus, InstitutionStatus[]> = {
      draft: ["pending_verification"],
      pending_verification: ["verifying", "rejected"],
      verifying: ["approved", "rejected", "pending_verification"],
      approved: [], // Approved applications cannot be changed (would need special admin privileges)
      rejected: ["pending_verification"], // Allow re-opening for appeals
    };

    const allowedStatuses = validTransitions[currentStatus] || [];

    if (allowedStatuses.includes(newStatus)) {
      return { canChange: true };
    }

    return {
      canChange: false,
      reason: `Cannot change status from "${currentStatus}" to "${newStatus}"`,
    };
  }

  /**
   * Check if an admin can start reviewing an application (set to verifying)
   * @param status Current institution status
   * @returns Object with canReview flag and reason if not allowed
   */
  static canAdminStartReview(status: InstitutionStatus): {
    canReview: boolean;
    reason?: string;
  } {
    switch (status) {
      case "pending_verification":
        return { canReview: true };

      case "draft":
        return {
          canReview: false,
          reason: "Application is still in draft status",
        };

      case "verifying":
        return {
          canReview: false,
          reason: "Application is already being reviewed",
        };

      case "approved":
        return {
          canReview: false,
          reason: "Application has already been approved",
        };

      case "rejected":
        return {
          canReview: false,
          reason: "Application has been rejected",
        };

      default:
        return {
          canReview: false,
          reason: "Unknown status - review not permitted",
        };
    }
  }

  /**
   * Get user-friendly status descriptions
   * @param status Institution status
   * @returns Human-readable description
   */
  static getStatusDescription(status: InstitutionStatus): string {
    switch (status) {
      case "draft":
        return "Application is being prepared";
      case "pending_verification":
        return "Application submitted and awaiting review";
      case "verifying":
        return "Application is currently being reviewed by our team";
      case "approved":
        return "Application has been approved";
      case "rejected":
        return "Application has been rejected";
      default:
        return "Unknown status";
    }
  }

  /**
   * Get next possible actions for a user based on status
   * @param status Current institution status
   * @returns Array of possible actions
   */
  static getUserActions(status: InstitutionStatus): string[] {
    switch (status) {
      case "draft":
        return ["edit", "submit"];
      case "pending_verification":
        return ["view", "edit"]; // Can still edit while pending
      case "verifying":
        return ["view"]; // Read-only while being reviewed
      case "approved":
        return ["view"]; // Read-only once approved
      case "rejected":
        return ["view", "contact_support"]; // Read-only, but can appeal
      default:
        return ["view"];
    }
  }

  /**
   * Get next possible actions for an admin based on status
   * @param status Current institution status
   * @returns Array of possible admin actions
   */
  static getAdminActions(status: InstitutionStatus): string[] {
    switch (status) {
      case "draft":
        return ["view"]; // Wait for user to submit
      case "pending_verification":
        return ["view", "start_review"];
      case "verifying":
        return ["view", "approve", "reject", "return_to_pending"];
      case "approved":
        return ["view"]; // Maybe "revoke" in the future
      case "rejected":
        return ["view", "reopen"]; // Allow reopening for appeals
      default:
        return ["view"];
    }
  }
}

// Export convenience functions for common use cases
export const canUserUpdateInstitution =
  InstitutionUpdatePermissions.canUserUpdate;
export const canAdminChangeStatus =
  InstitutionUpdatePermissions.canAdminChangeStatus;
export const canAdminStartReview =
  InstitutionUpdatePermissions.canAdminStartReview;
export const getStatusDescription =
  InstitutionUpdatePermissions.getStatusDescription;
export const getUserActions = InstitutionUpdatePermissions.getUserActions;
export const getAdminActions = InstitutionUpdatePermissions.getAdminActions;
