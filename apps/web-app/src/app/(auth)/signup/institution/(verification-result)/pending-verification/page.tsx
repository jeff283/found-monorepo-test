"use client";

import React from "react";
import { Clock, CheckCircle, Mail } from "lucide-react";

import BusinessSetupLayout from "@/components/authentication/BusinessSetupLayout";
import FoundlyButton from "@/components/authentication/FoundlyButton";

export default function PendingVerificationPage() {
  return (
    <BusinessSetupLayout currentStep={3} totalSteps={3} showBackButton={false}>
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 text-center">
        {/* Status Icon */}
        <div className="mb-4">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-yellow-600" />
          </div>

          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            Verification Pending
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Thank you for submitting your institution details! Our team is now
            reviewing your application and will notify you once the verification
            is complete.
          </p>
        </div>

        {/* What happens next */}
        <div className="bg-blue-50/50 border border-blue-200/50 rounded-xl p-8">
          <h3 className="font-semibold text-blue-900 mb-6 flex items-center justify-center gap-3 text-lg">
            <CheckCircle className="w-6 h-6" />
            What happens next?
          </h3>
          <ul className="text-sm text-left text-blue-800 space-y-4 max-w-lg mx-auto">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Our verification team will review your institution details
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                We may contact your institution directly for additional
                verification
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Verification typically takes 1-3 business days</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                You&apos;ll receive an email notification with the outcome
              </span>
            </li>
          </ul>
        </div>

        {/* Email notification info */}
        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-gray-600" />
            <h4 className="font-semibold text-gray-900 text-lg">
              Check Your Email
            </h4>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed max-w-lg mx-auto">
            We&apos;ll send verification updates to the email address you
            provided during registration. Make sure to check your spam folder if
            you don&apos;t see our emails.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-4 max-w-sm mx-auto w-full">
          <FoundlyButton
            text="Contact Support"
            variant="outline"
            className="w-full"
            onClick={() =>
              window.open("mailto:support@foundlyhq.com", "_blank")
            }
          />

          <button
            onClick={() => (window.location.href = "/")}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
          >
            Return to Home
          </button>
        </div>

        {/* Additional info */}
        <div className="mt-4 p-6 bg-yellow-50/50 border border-yellow-200/50 rounded-xl">
          <p className="text-sm text-yellow-800 leading-relaxed">
            <strong>Need faster verification?</strong> If you have an urgent
            timeline, please contact our support team and we&apos;ll prioritize
            your application.
          </p>
        </div>
      </div>
    </BusinessSetupLayout>
  );
}
