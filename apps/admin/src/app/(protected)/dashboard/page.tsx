"use client";

import Link from "next/link";
import { Button } from "@/admin/components/ui/button";
import { AdminHeader } from "@/admin/components/admin-header";
import {
  Building2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import {
  useAdminMetrics,
  useRecentApplications,
  type AdminApplication,
} from "@/admin/hooks/use-admin-api";

function MetricCard({
  title,
  value,
  change,
  icon: IconComponent,
  loading = false,
  color = "text-blue-600",
  bgColor = "bg-blue-50",
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  color?: string;
  bgColor?: string;
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div>
          <div className="h-8 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}
        >
          <IconComponent className={`h-6 w-6 ${color}`} />
        </div>
        {change && (
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span>{change}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
}

function ActivityItem({
  application,
  loading = false,
}: {
  application?: AdminApplication;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!application) return null;

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "pending_verification":
        return {
          icon: Clock,
          bgColor: "bg-orange-100",
          textColor: "text-orange-600",
          label: "Pending Review",
        };
      case "approved":
        return {
          icon: CheckCircle2,
          bgColor: "bg-green-100",
          textColor: "text-green-600",
          label: "Approved",
        };
      case "rejected":
        return {
          icon: XCircle,
          bgColor: "bg-red-100",
          textColor: "text-red-600",
          label: "Rejected",
        };
      default:
        return {
          icon: AlertCircle,
          bgColor: "bg-blue-100",
          textColor: "text-blue-600",
          label: status,
        };
    }
  };

  const statusDisplay = getStatusDisplay(application.status);
  const StatusIcon = statusDisplay.icon;

  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${statusDisplay.bgColor} ${statusDisplay.textColor}`}
      >
        <StatusIcon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">
          {application.institutionName}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Application from {application.userEmail}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(application.createdAt).toLocaleDateString()} •{" "}
          {statusDisplay.label}
        </p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useUser();
  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
  } = useAdminMetrics();
  const {
    data: recentApplications,
    isLoading: applicationsLoading,
    error: applicationsError,
  } = useRecentApplications();

  // Get the user's name
  const userName = user?.firstName || "Admin";

  const quickActions = [
    {
      title: "Review Applications",
      description: metrics
        ? `${metrics.pending_applications} pending reviews`
        : "Check pending reviews",
      href: "/applications",
      icon: Building2,
      primary: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader searchPlaceholder="Search applications, users..." />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Good morning, {userName}
              </h1>
              <p className="text-gray-600 mt-1">
                Here&apos;s what&apos;s happening with your platform today.
              </p>
            </div>
          </div>
        </div>

        {/* Error States */}
        {(metricsError || applicationsError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-sm text-red-800">
                Failed to load dashboard data. Please refresh the page or try
                again later.
              </p>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Applications"
            value={metrics?.total_applications ?? 0}
            change="+12%"
            icon={FileText}
            loading={metricsLoading}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <MetricCard
            title="Pending Reviews"
            value={metrics?.pending_applications ?? 0}
            change={
              metrics?.pending_applications
                ? `+${metrics.pending_applications > 10 ? "5" : metrics.pending_applications}`
                : undefined
            }
            icon={Clock}
            loading={metricsLoading}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
          <MetricCard
            title="Approved Today"
            value={metrics?.approved_applications ?? 0}
            change="+3"
            icon={CheckCircle2}
            loading={metricsLoading}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <MetricCard
            title="Approval Rate"
            value={metrics?.approval_rate ? `${metrics.approval_rate}%` : "0%"}
            change="+8%"
            icon={TrendingUp}
            loading={metricsLoading}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {quickActions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <Link key={action.title} href={action.href}>
                      <div className="group p-4 rounded-lg border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 transition-all cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              action.primary
                                ? "bg-cyan-100 text-cyan-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <h3 className="font-medium text-gray-900 group-hover:text-cyan-700">
                            {action.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          {action.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Applications
              </h2>
              <div className="space-y-4">
                {applicationsLoading ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, i) => (
                    <ActivityItem key={i} loading={true} />
                  ))
                ) : recentApplications?.applications &&
                  recentApplications.applications.length > 0 ? (
                  recentApplications.applications
                    .slice(0, 3)
                    .map((application) => (
                      <ActivityItem
                        key={application.id}
                        application={application}
                      />
                    ))
                ) : (
                  <div className="text-center py-4">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      No recent applications
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  className="w-full text-sm text-gray-600 hover:text-gray-900"
                  asChild
                >
                  <Link href="/applications">View all applications</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
