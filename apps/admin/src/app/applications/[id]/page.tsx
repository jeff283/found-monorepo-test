"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/admin/components/admin-header";
import { Badge } from "@/admin/components/ui/badge";
import { Button } from "@/admin/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Mail,
  Globe,
  MapPin,
  Calendar,
  User,
  AlertTriangle,
} from "lucide-react";
import FoundlyButton from "@/admin/components/custom/FoundlyButton";
import { type InstitutionStatus } from "@/api/lib/schemas";
import {
  useInstitutionApplicationDetail,
  useApplicationAction,
} from "@/admin/hooks/useInstitutionQueries";

interface InstitutionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const statusConfig: Record<
  InstitutionStatus,
  {
    label: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800", icon: Clock },
  pending_verification: {
    label: "Pending Verification",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  verifying: {
    label: "Verifying",
    color: "bg-blue-100 text-blue-800",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
  created: {
    label: "Created",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
};

export default function InstitutionDetailPage({
  params,
}: InstitutionDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);

  // React Query hooks replace manual state management
  const {
    data: institution,
    isLoading,
    error,
  } = useInstitutionApplicationDetail(resolvedParams.id);

  const { mutate: performAction, isPending: isProcessing } =
    useApplicationAction();

  const handleApprove = () => {
    if (!institution) return;

    performAction({
      userId: resolvedParams.id,
      action: "approve",
    });
  };

  const handleReject = () => {
    if (!institution) return;

    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;

    performAction({
      userId: resolvedParams.id,
      action: "reject",
      reason,
    });
  };

  const handleUnapprove = () => {
    if (!institution) return;

    const reason = prompt(
      "Please provide a reason for unapproving this institution:"
    );
    if (!reason) return;

    performAction({
      userId: resolvedParams.id,
      action: "unapprove",
      reason,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <AdminHeader />
        <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center h-96">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100 mx-auto">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <div className="space-y-3">
                  <h2 className="headline-2 text-gray-900">
                    Error Loading Institution
                  </h2>
                  <p className="body-small text-gray-600 max-w-md mx-auto">
                    {error instanceof Error
                      ? error.message
                      : "Failed to load institution details"}
                  </p>
                </div>
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="mt-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <AdminHeader />
        <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center h-96">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl flex items-center justify-center border border-gray-100 mx-auto">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-200 border-t-teal-600"></div>
                </div>
                <div className="space-y-2">
                  <p className="body-small font-medium text-gray-900">
                    Loading institution details
                  </p>
                  <p className="caption-small text-gray-500">
                    Please wait while we fetch the information...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="min-h-screen bg-white">
        <AdminHeader />
        <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center h-96">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100 mx-auto">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <div className="space-y-3">
                  <h2 className="headline-2 text-gray-900">
                    Institution Not Found
                  </h2>
                  <p className="body-small text-gray-600 max-w-md mx-auto">
                    The requested institution could not be found. It may have
                    been removed or the link may be incorrect.
                  </p>
                </div>
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="mt-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const statusInfo = statusConfig[institution.status as InstitutionStatus];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />

      <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
          {/* Header Section */}
          <div className="space-y-6">
            {/* Back Button */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="hover:bg-gray-50 text-gray-600 hover:text-gray-900 -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Applications
              </Button>
            </div>

            {/* Institution Header */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl flex items-center justify-center border border-gray-100">
                      <Building2 className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h1 className="headline-1 text-gray-900">
                        {institution.institutionName || "Unnamed Institution"}
                      </h1>
                      <p className="caption text-gray-500">
                        ID: {resolvedParams.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      className={`${statusInfo.color} border-0 px-3 py-1 rounded-full font-medium text-sm`}
                    >
                      <StatusIcon className="h-3 w-3 mr-1.5" />
                      {statusInfo.label}
                    </Badge>
                    <span className="caption-small text-gray-400">•</span>
                    <span className="caption-small text-gray-500">
                      @{institution.emailDomain}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                {institution.status === "pending_verification" && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={handleReject}
                      disabled={isProcessing}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <FoundlyButton
                      as="button"
                      text="Approve Institution"
                      variant="default"
                      onClick={handleApprove}
                      disabled={isProcessing}
                      className="shadow-sm"
                    />
                  </div>
                )}
                {/* Unapprove Button for Approved Applications  */}
                {(institution.status === "approved" ||
                  institution.status === "created") && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={handleUnapprove}
                      disabled={isProcessing}
                      className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Unapprove Institution
                    </Button>
                  </div>
                )}
              </div>

              {/* Description */}
              {institution.description && (
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                  <p className="body-small text-gray-700 leading-relaxed">
                    {institution.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Institution Information */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-gray-50">
                  <h3 className="headline-2 text-gray-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-gray-600" />
                    Institution Information
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="caption-small font-medium text-gray-500 uppercase tracking-wide">
                        Institution Name
                      </label>
                      <p className="body-small font-medium text-gray-900">
                        {institution.institutionName || "Not provided"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="caption-small font-medium text-gray-500 uppercase tracking-wide">
                        Type
                      </label>
                      <p className="body-small text-gray-700 capitalize">
                        {institution.institutionType || "Not specified"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="caption-small font-medium text-gray-500 uppercase tracking-wide">
                        Organization Size
                      </label>
                      <p className="body-small text-gray-700">
                        {institution.organizationSize || "Not specified"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="caption-small font-medium text-gray-500 uppercase tracking-wide">
                        Email Domain
                      </label>
                      <p className="body-small font-mono text-teal-600 bg-teal-50 px-3 py-1 rounded-lg inline-block">
                        @{institution.emailDomain}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-gray-50">
                  <h3 className="headline-2 text-gray-900 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-600" />
                    Contact Information
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="caption-small font-medium text-gray-500 uppercase tracking-wide">
                        Contact Email
                      </label>
                      <p className="body-small text-gray-900">
                        {institution.userEmail}
                      </p>
                    </div>
                    {institution.phoneNumber && (
                      <div className="space-y-2">
                        <label className="caption-small font-medium text-gray-500 uppercase tracking-wide">
                          Phone Number
                        </label>
                        <p className="body-small text-gray-900">
                          {institution.phoneNumber}
                        </p>
                      </div>
                    )}
                  </div>
                  {institution.website && (
                    <div className="space-y-2">
                      <label className="caption-small font-medium text-gray-500 uppercase tracking-wide">
                        Website
                      </label>
                      <a
                        href={institution.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 body-small font-medium transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        {institution.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              {(institution.streetAddress ||
                institution.city ||
                institution.state ||
                institution.country) && (
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-5 border-b border-gray-50">
                    <h3 className="headline-2 text-gray-900 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      Address
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-1 text-gray-700">
                      {institution.streetAddress && (
                        <p className="body-small">
                          {institution.streetAddress}
                        </p>
                      )}
                      <p className="body-small">
                        {[
                          institution.city,
                          institution.state,
                          institution.zipCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      {institution.country && (
                        <p className="body-small">{institution.country}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-6">
              {/* Application Timeline */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-gray-50">
                  <h3 className="headline-2 text-gray-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    Timeline
                  </h3>
                </div>
                <div className="p-6 space-y-5">
                  <div className="space-y-2">
                    <label className="caption-small font-medium text-gray-500 uppercase tracking-wide">
                      Created
                    </label>
                    <p className="body-small text-gray-900">
                      {formatDate(institution.createdAt)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="caption-small font-medium text-gray-500 uppercase tracking-wide">
                      Last Updated
                    </label>
                    <p className="body-small text-gray-900">
                      {formatDate(institution.updatedAt)}
                    </p>
                  </div>
                  {institution.submittedAt && (
                    <div className="space-y-2">
                      <label className="caption-small font-medium text-gray-500 uppercase tracking-wide">
                        Submitted
                      </label>
                      <p className="body-small text-gray-900">
                        {formatDate(institution.submittedAt)}
                      </p>
                    </div>
                  )}
                  {institution.reviewedAt && (
                    <div className="space-y-2">
                      <label className="caption-small font-medium text-gray-500 uppercase tracking-wide">
                        Reviewed
                      </label>
                      <p className="body-small text-gray-900">
                        {formatDate(institution.reviewedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Application Progress */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-gray-50">
                  <h3 className="headline-2 text-gray-900">Progress</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-teal-500 flex-shrink-0"></div>
                      <span className="body-small text-gray-700">
                        Organization Details
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          institution.currentStep === "verification" ||
                          institution.currentStep === "complete"
                            ? "bg-teal-500"
                            : "bg-gray-200"
                        }`}
                      ></div>
                      <span className="body-small text-gray-700">
                        Verification
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          institution.currentStep === "complete"
                            ? "bg-teal-500"
                            : "bg-gray-200"
                        }`}
                      ></div>
                      <span className="body-small text-gray-700">Complete</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Information */}
              {(institution.reviewedBy || institution.rejectionReason) && (
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-5 border-b border-gray-50">
                    <h3 className="headline-2 text-gray-900 flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-600" />
                      Review
                    </h3>
                  </div>
                  <div className="p-6 space-y-5">
                    {institution.reviewedBy && (
                      <div className="space-y-2">
                        <label className="caption-small font-medium text-gray-500 uppercase tracking-wide">
                          Reviewed By
                        </label>
                        <p className="body-small text-gray-900">
                          {institution.reviewedBy}
                        </p>
                      </div>
                    )}
                    {institution.rejectionReason && (
                      <div className="space-y-2">
                        <label className="caption-small font-medium text-gray-500 uppercase tracking-wide">
                          Rejection Reason
                        </label>
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                          <p className="body-small text-red-700 leading-relaxed">
                            {institution.rejectionReason}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
