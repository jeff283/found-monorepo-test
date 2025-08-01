"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  FileText,
  Phone,
  ExternalLink,
  Sparkles,
} from "lucide-react";

import FoundlyButton from "@/components/authentication/FoundlyButton";

const VerificationApprovedContent = () => {
  const searchParams = useSearchParams();
  const orgName = searchParams.get("orgName") || "your organization";
  const firstName = searchParams.get("firstName") || "";

  const handleOpenResource = (url: string) => {
    window.open(url, "_blank");
  };

  const quickStartGuides = [
    {
      icon: Users,
      title: "Managing Team Members",
      description:
        "Learn how to invite team members and set up user permissions",
      action: () => handleOpenResource("/help/team-management"),
    },
    {
      icon: Settings,
      title: "Platform Configuration",
      description:
        "Set up your organization settings and customize your workspace",
      action: () => handleOpenResource("/help/platform-setup"),
    },
    {
      icon: BarChart3,
      title: "Reports & Analytics",
      description:
        "Understanding your dashboard metrics and generating reports",
      action: () => handleOpenResource("/help/reports"),
    },
    {
      icon: FileText,
      title: "Lost & Found Management",
      description:
        "Complete guide to managing lost and found items effectively",
      action: () => handleOpenResource("/help/lost-found-guide"),
    },
  ];

  const supportResources = [
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description: "Comprehensive guides and tutorials",
      url: "/help",
    },
    {
      icon: MessageSquare,
      title: "Community Forum",
      description: "Connect with other institutions and share best practices",
      url: "/community",
    },
    {
      icon: HelpCircle,
      title: "FAQ",
      description: "Frequently asked questions and quick answers",
      url: "/help/faq",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Dashboard CTA */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Welcome to Foundly!
              </h1>
              <p className="text-sm text-gray-600">
                {orgName} is now verified and active
              </p>
            </div>
          </div>

          <FoundlyButton
            text="Go to Dashboard"
            href="/institution/dashboard"
            as="link"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <Sparkles className="w-4 h-4 text-green-400 absolute -top-1 -right-1" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            🎉 Congratulations{firstName && `, ${firstName}`}!
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your organization is now verified and ready to use Foundly.
            Everything is set up for you to start managing lost and found
            operations efficiently.
          </p>
        </div>

        {/* Optional: Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Quick Start Guides
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Get up and running quickly with these essential guides
            </p>
            <div className="space-y-3">
              {quickStartGuides.map((guide, index) => (
                <button
                  key={index}
                  onClick={guide.action}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <guide.icon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {guide.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {guide.description}
                      </p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-green-600" />
              Support Resources
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Need help? We&apos;ve got comprehensive support available
            </p>
            <div className="space-y-3 mb-4">
              {supportResources.map((resource, index) => (
                <button
                  key={index}
                  onClick={() => handleOpenResource(resource.url)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <resource.icon className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {resource.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {resource.description}
                      </p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>

            {/* Direct Support */}
            <div className="border-t pt-4">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() =>
                    window.open("mailto:support@foundlyhq.com", "_blank")
                  }
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Email Support
                </button>
                <button
                  onClick={() => handleOpenResource("/help/contact")}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Schedule a Call
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* What You Can Do Section */}
        <div className="bg-white rounded-lg border p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            What You Can Do with Foundly
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="flex items-start gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">
                Track and manage lost & found items efficiently
              </span>
            </div>
            <div className="flex items-start gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">
                Generate detailed reports and analytics
              </span>
            </div>
            <div className="flex items-start gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">
                Manage team members and permissions
              </span>
            </div>
            <div className="flex items-start gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">
                Set up automated notifications and alerts
              </span>
            </div>
            <div className="flex items-start gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">
                Integrate with your existing systems
              </span>
            </div>
            <div className="flex items-start gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">
                Access 24/7 support and resources
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-sm text-gray-500">
            You can always access these resources from your dashboard help
            section
          </p>
        </div>
      </div>
    </div>
  );
};

export default function VerificationApprovedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerificationApprovedContent />
    </Suspense>
  );
}
