"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.foundlyhq.com";

// API response wrapper type
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// Metrics data type based on API response
interface AdminMetrics {
  total_applications: number;
  pending_applications: number;
  approved_applications: number;
  rejected_applications: number;
  abandoned_applications: number;
  approval_rate: string;
}

// Application data type based on API response
interface AdminApplication {
  id: string;
  userId: string;
  userEmail: string;
  emailDomain: string;
  institutionName: string;
  institutionType: string;
  status: string;
  currentStep: string;
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

interface ApplicationsResponse {
  applications: AdminApplication[];
  pagination: {
    current_page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

// Hook to fetch admin metrics
export function useAdminMetrics() {
  return useQuery({
    queryKey: ["admin", "metrics"],
    queryFn: async (): Promise<AdminMetrics> => {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/institution/metrics`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch admin metrics");
      }

      const result = (await response.json()) as ApiResponse<AdminMetrics>;
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch admin metrics");
      }

      return result.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  });
}

// Hook to fetch pending applications
export function usePendingApplications() {
  return useQuery({
    queryKey: ["admin", "applications", "pending"],
    queryFn: async (): Promise<ApplicationsResponse> => {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/institution/applications?status=pending_verification&limit=5`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch pending applications");
      }

      const result =
        (await response.json()) as ApiResponse<ApplicationsResponse>;
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch pending applications");
      }

      return result.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  });
}

// Hook to fetch recent applications (all statuses, recent first)
export function useRecentApplications() {
  return useQuery({
    queryKey: ["admin", "applications", "recent"],
    queryFn: async (): Promise<ApplicationsResponse> => {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/institution/applications?limit=5&sort=created_at&order=desc`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recent applications");
      }

      const result =
        (await response.json()) as ApiResponse<ApplicationsResponse>;
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch recent applications");
      }

      return result.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  });
}

// Export types for use in components
export type { AdminMetrics, AdminApplication, ApplicationsResponse };
