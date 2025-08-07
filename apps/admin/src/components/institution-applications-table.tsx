"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/admin/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/admin/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/admin/components/ui/select";
import {
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { type InstitutionApplication } from "@/api/lib/types";
import { type InstitutionStatus } from "@/api/lib/schemas";

type ApplicationStatus = InstitutionStatus;

interface InstitutionApplicationsTableProps {
  applications: InstitutionApplication[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onStatusFilter: (status: ApplicationStatus | null) => void;
  isLoading?: boolean;
}

const statusConfig: Record<
  ApplicationStatus,
  {
    label: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  draft: {
    label: "Draft",
    color: "bg-gray-50 text-gray-700 border-gray-200",
    icon: Clock,
  },
  pending_verification: {
    label: "Pending Verification",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  verifying: {
    label: "Verifying",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
  created: {
    label: "Created",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
};

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${config.color} caption font-medium`}
    >
      <IconComponent className="h-3 w-3" />
      {config.label}
    </div>
  );
}

export function InstitutionApplicationsTable({
  applications,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  onStatusFilter,
  isLoading = false,
}: InstitutionApplicationsTableProps) {
  const [selectedFilter, setSelectedFilter] =
    useState<ApplicationStatus | null>(null);

  const handleStatusFilter = (status: ApplicationStatus | null) => {
    setSelectedFilter(status);
    onStatusFilter(status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="headline-2 text-gray-900">
              Institution Applications
            </h2>
            <p className="caption text-gray-500 mt-1">
              {totalCount.toLocaleString()} applications found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select
              value={selectedFilter || "all"}
              onValueChange={(value) =>
                handleStatusFilter(
                  (value === "all" ? null : value) as ApplicationStatus | null
                )
              }
            >
              <SelectTrigger className="w-48 border-gray-200 rounded-xl">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending_verification">
                  Pending Verification
                </SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl flex items-center justify-center border border-gray-100 mx-auto">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-200 border-t-teal-600"></div>
              </div>
              <div className="space-y-2">
                <p className="body-small font-medium text-gray-900">
                  Loading applications
                </p>
                <p className="caption-small text-gray-500">
                  Please wait while we fetch the data...
                </p>
              </div>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 mx-auto mb-4">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="headline-2 text-gray-900 mb-2">
              No applications found
            </h3>
            <p className="body-small text-gray-600">
              There are no institution applications matching your current
              filters.
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-100">
                    <TableHead className="caption-small font-medium text-gray-500 uppercase tracking-wide">
                      Institution
                    </TableHead>
                    <TableHead className="caption-small font-medium text-gray-500 uppercase tracking-wide">
                      Email Domain
                    </TableHead>
                    <TableHead className="caption-small font-medium text-gray-500 uppercase tracking-wide">
                      Status
                    </TableHead>
                    <TableHead className="caption-small font-medium text-gray-500 uppercase tracking-wide">
                      Submitted
                    </TableHead>
                    <TableHead className="caption-small font-medium text-gray-500 uppercase tracking-wide">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow
                      key={application.id}
                      className="border-gray-50 hover:bg-gray-25 transition-colors"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl flex items-center justify-center border border-gray-100">
                            <Building2 className="h-5 w-5 text-teal-600" />
                          </div>
                          <div>
                            <p className="body-small font-medium text-gray-900">
                              {application.institutionName ||
                                "Unnamed Institution"}
                            </p>
                            <p className="caption-small text-gray-500 capitalize">
                              {application.institutionType || "Unknown Type"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="body-small font-mono text-teal-600 bg-teal-50 px-3 py-1 rounded-lg">
                          @{application.emailDomain}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <StatusBadge status={application.status} />
                      </TableCell>
                      <TableCell className="py-4">
                        <p className="caption text-gray-600">
                          {formatDate(application.createdAt)}
                        </p>
                      </TableCell>
                      <TableCell className="py-4">
                        <Link href={`/applications/${application.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Review
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-100 gap-4">
                <p className="caption text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
