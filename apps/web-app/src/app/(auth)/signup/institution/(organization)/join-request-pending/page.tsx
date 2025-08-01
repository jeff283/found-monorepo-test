"use client";

import React, { Suspense } from "react";
import Link from "next/link";

import AuthLayout from "@/components/authentication/AuthLayout";
import AuthHeader from "@/components/authentication/AuthHeader";
import AuthBackButton from "@/components/authentication/AuthBackButton";
import { PhoneIcon, Clock, CheckCircle, Mail } from "lucide-react";

const JoinRequestPendingContent = () => {
  const organizationName = "the organization";

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6 text-center">
      <AuthHeader
        title="Request Sent Successfully!"
        subtitle="Your request to join has been submitted"
      />

      <div className="space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        {/* Organization Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            Join request sent to:
          </h3>
          <p className="text-blue-800 font-medium">{organizationName}</p>
        </div>

        {/* Status Information */}
        <div className="space-y-4 text-left">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900">Pending Approval</h4>
              <p className="text-sm text-gray-600">
                An administrator from {organizationName} will review your
                request and approve or decline it.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900">Email Notification</h4>
              <p className="text-sm text-gray-600">
                You&apos;ll receive an email notification once your request has
                been reviewed.
              </p>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
          <div className="text-sm text-gray-600 space-y-2 text-left">
            <p>• An administrator will review your request</p>
            <p>
              • If approved, you&apos;ll gain access to your organization&apos;s
              dashboard
            </p>
            <p>
              • If declined, you can contact your organization administrator or
              our support team
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-medium text-amber-900 mb-2">Important Note</h4>
          <p className="text-sm text-amber-800 text-left">
            Since an organization already exists for your email domain, you
            cannot create a new organization. You must either join the existing
            organization or contact your organization administrator if your
            request is declined.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="mailto:support@foundlyhq.com"
            target="_blank"
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Need help? Contact our support team
          </Link>
        </div>
      </div>
    </div>
  );
};

const topBar = (
  <div className="flex justify-between items-center w-full">
    <AuthBackButton />
    <button className="caption text-muted-foreground hover:underline flex items-center gap-1">
      <PhoneIcon size={16} className="inline-block mr-1" />
      Contact support
    </button>
  </div>
);

export default function JoinRequestPendingPage() {
  return (
    <AuthLayout topBar={topBar}>
      <div className="min-h-screen flex items-center justify-center px-4">
        <Suspense>
          <JoinRequestPendingContent />
        </Suspense>
      </div>
    </AuthLayout>
  );
}
