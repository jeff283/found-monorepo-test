import { InstitutionDraftData } from "@/api/lib/schemas";
import { InstitutionStatusData } from "@/api/lib/types";

export function getInstitutionStatus(
  draftData: InstitutionDraftData | null
): InstitutionStatusData {
  if (!draftData) {
    return {
      status: "not_started",
      lastUpdated: null,
      canEdit: true,
      completionStatus: {
        organizationCompleted: false,
        verificationCompleted: false,
        readyForSubmission: false,
      },
    };
  }

  return {
    status: draftData.status,
    lastUpdated: draftData.updatedAt,
    canEdit: draftData.status !== "approved" && draftData.status !== "created",
    completionStatus: {
      organizationCompleted: !!draftData.institutionName,
      verificationCompleted: !!draftData.website,
      readyForSubmission: !!draftData.institutionName && !!draftData.website,
    },
  };
}
