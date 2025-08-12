import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiCall } from "@/admin/hooks/useApiCall";
import {
  type InstitutionApplication,
  type InstitutionMetricsData,
  type ApiResponse,
  type ApplicationsResponse,
  type InstitutionDraftData,
} from "@/api/lib/types";

// Query Keys
export const institutionKeys = {
  all: ["institutions"] as const,
  applications: () => [...institutionKeys.all, "applications"] as const,
  applicationsList: (filters: Record<string, string | number>) =>
    [...institutionKeys.applications(), "list", filters] as const,
  applicationDetail: (userId: string) =>
    [...institutionKeys.applications(), "detail", userId] as const,
  metrics: () => [...institutionKeys.all, "metrics"] as const,
} as const;

// Hook for fetching applications
export function useInstitutionApplications(
  page: number = 1,
  perPage: number = 10,
  status?: string,
  search?: string
) {
  const { get } = useApiCall();

  return useQuery({
    queryKey: institutionKeys.applicationsList({
      page,
      per_page: perPage,
      ...(status && { status }),
      ...(search && { search }),
    }),
    queryFn: async (): Promise<ApplicationsResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });

      if (status) params.append("status", status);
      if (search) params.append("search", search);

      const response = await get(
        `/api/admin/institution/applications?${params}`
      );
      const data: ApiResponse<ApplicationsResponse> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch applications");
      }

      return data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook for fetching application metrics
export function useInstitutionMetrics() {
  const { get } = useApiCall();

  return useQuery({
    queryKey: institutionKeys.metrics(),
    queryFn: async (): Promise<InstitutionMetricsData> => {
      const response = await get("/api/admin/institution/metrics");
      const data: ApiResponse<InstitutionMetricsData> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch metrics");
      }

      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching a single application (detailed view)
export function useInstitutionApplicationDetail(userId: string) {
  const { get } = useApiCall();

  return useQuery({
    queryKey: institutionKeys.applicationDetail(userId),
    queryFn: async (): Promise<InstitutionDraftData> => {
      const response = await get(
        `/api/admin/institution/applications/${userId}`
      );
      const data: ApiResponse<InstitutionDraftData> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch application");
      }

      return data.data;
    },
    enabled: !!userId,
  });
}

// Hook for fetching a single application (list view)
export function useInstitutionApplication(userId: string) {
  const { get } = useApiCall();

  return useQuery({
    queryKey: institutionKeys.applicationDetail(userId),
    queryFn: async (): Promise<InstitutionApplication> => {
      const response = await get(
        `/api/admin/institution/applications/${userId}`
      );
      const data: ApiResponse<InstitutionApplication> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch application");
      }

      return data.data;
    },
    enabled: !!userId,
  });
}

// Hook for approving/rejecting/unapproving applications
export function useApplicationAction() {
  const { post } = useApiCall();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      action,
      reason,
      notes,
    }: {
      userId: string;
      action: "approve" | "reject" | "unapprove";
      reason?: string;
      notes?: string;
    }) => {
      let response: Response;

      if (action === "unapprove") {
        response = await post(
          `/api/admin/institution/applications/${userId}/unapprove`,
          {
            reason,
          }
        );
      } else {
        response = await post(
          `/api/admin/institution/applications/${userId}/action`,
          {
            action,
            reason,
            notes,
          }
        );
      }

      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || `Failed to ${action} application`);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch applications list
      queryClient.invalidateQueries({
        queryKey: institutionKeys.applications(),
      });
      // Invalidate metrics
      queryClient.invalidateQueries({ queryKey: institutionKeys.metrics() });
      // Invalidate the specific application
      queryClient.invalidateQueries({
        queryKey: institutionKeys.applicationDetail(variables.userId),
      });
    },
  });
}

// Hook for bulk actions
export function useBulkApplicationAction() {
  const { post } = useApiCall();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userIds,
      action,
      reason,
      notes,
    }: {
      userIds: string[];
      action: "approve" | "reject";
      reason?: string;
      notes?: string;
    }) => {
      const response = await post(
        "/api/admin/institution/applications/bulk-action",
        {
          userIds,
          action,
          reason,
          notes,
        }
      );
      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || `Failed to ${action} applications`);
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate all applications and metrics queries
      queryClient.invalidateQueries({ queryKey: institutionKeys.all });
    },
  });
}
