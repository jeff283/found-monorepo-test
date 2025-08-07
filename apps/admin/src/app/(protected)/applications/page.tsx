"use client";

import { useState, useCallback, useEffect } from "react";
import { AdminHeader } from "@/admin/components/admin-header";
import { InstitutionMetricsCards } from "@/admin/components/institution-metrics";
import { InstitutionApplicationsTable } from "@/admin/components/institution-applications-table";
import { ErrorState } from "@/admin/components/ui/error-state";
import {
  useInstitutionApplications,
  useInstitutionMetrics,
} from "@/admin/hooks/useInstitutionQueries";
import type { InstitutionStatus } from "@/api/lib/schemas";

export default function InstitutionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<InstitutionStatus | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch data using React Query
  const {
    data: applicationsData,
    isLoading: isLoadingApplications,
    error: applicationsError,
    refetch: refetchApplications,
  } = useInstitutionApplications(
    currentPage,
    10, // per page
    statusFilter || undefined,
    debouncedSearch || undefined
  );

  const {
    data: metrics,
    error: metricsError,
    refetch: refetchMetrics,
  } = useInstitutionMetrics();

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Handle status filter
  const handleStatusFilter = useCallback((status: InstitutionStatus | null) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page
  }, []);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page
  }, []);

  // Handle retry for both queries
  const handleRetry = useCallback(() => {
    refetchApplications();
    refetchMetrics();
  }, [refetchApplications, refetchMetrics]);

  // Extract data from React Query response
  const applications = applicationsData?.applications || [];
  const pagination = applicationsData?.pagination || {
    current_page: 1,
    total_pages: 1,
    total_count: 0,
  };

  const defaultMetrics = {
    total_applications: 0,
    pending_applications: 0,
    approved_applications: 0,
    rejected_applications: 0,
    abandoned_applications: 0,
    approval_rate: "0%",
  };

  // Show error state if both queries failed
  if (applicationsError && metricsError) {
    return (
      <div className="min-h-screen bg-white">
        <AdminHeader
          onSearch={handleSearch}
          searchPlaceholder="Search applications..."
        />
        <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="max-w-7xl mx-auto">
            <ErrorState
              title="Failed to load institution data"
              message="We couldn't connect to the server. Please check your connection and try again."
              onRetry={handleRetry}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader
        onSearch={handleSearch}
        searchPlaceholder="Search applications..."
      />

      <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          {metricsError ? (
            <ErrorState
              title="Failed to load metrics"
              message="Metrics data is temporarily unavailable."
              onRetry={refetchMetrics}
            />
          ) : (
            <InstitutionMetricsCards metrics={metrics || defaultMetrics} />
          )}

          {applicationsError ? (
            <ErrorState
              title="Failed to load applications"
              message="Applications data is temporarily unavailable."
              onRetry={refetchApplications}
            />
          ) : (
            <InstitutionApplicationsTable
              applications={applications}
              currentPage={pagination.current_page}
              totalPages={pagination.total_pages}
              totalCount={pagination.total_count}
              onPageChange={handlePageChange}
              onStatusFilter={handleStatusFilter}
              isLoading={isLoadingApplications}
            />
          )}
        </div>
      </main>
    </div>
  );
}
