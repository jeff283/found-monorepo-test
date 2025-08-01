"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  FileText,
  RefreshCw,
} from "lucide-react";

import AuthLayout from "@/components/authentication/AuthLayout";
import FoundlyButton from "@/components/authentication/FoundlyButton";
import AuthFooter from "@/components/authentication/AuthFooter";

const VerificationRejectedContent = () => {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "";
  const orgName = searchParams.get("orgName") || "your organization";

  const handleAppeal = () => {
    const subject = encodeURIComponent(
      `Appeal Request - ${orgName} Verification`
    );
    const body = encodeURIComponent(
      `Dear Foundly Support Team,\n\nI would like to appeal the verification decision for ${orgName}.\n\nReason for appeal:\n[Please provide your reason for the appeal]\n\nAdditional information:\n[Any additional documentation or clarification]\n\nThank you for your consideration.\n\nBest regards,`
    );
    window.open(
      `mailto:support@foundlyhq.com?subject=${subject}&body=${body}`,
      "_blank"
    );
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent(`Verification Question - ${orgName}`);
    const body = encodeURIComponent(
      `Dear Foundly Support Team,\n\nI have questions about the verification process for ${orgName}.\n\nMy question:\n[Please describe your question or concern]\n\nThank you for your assistance.\n\nBest regards,`
    );
    window.open(
      `mailto:support@foundlyhq.com?subject=${subject}&body=${body}`,
      "_blank"
    );
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6 text-center">
      {/* Status Icon */}
      <div className="mb-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold mb-3 text-red-900">
          Verification Rejected
        </h1>
        <p className="text-gray-600 mb-6">
          Unfortunately, we were unable to verify {orgName} at this time. Please
          review the details below and consider your next steps.
        </p>
      </div>

      {/* Rejection Reason */}
      {reason && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Reason for Rejection
          </h3>
          <p className="text-sm text-red-800 text-left bg-white p-3 rounded border">
            {reason}
          </p>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-blue-900 mb-4">
          What can you do next?
        </h3>
        <ul className="text-sm text-left text-blue-800 space-y-3">
          <li className="flex items-start gap-2">
            <RefreshCw className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Appeal the Decision:</strong> If you believe this decision
              was made in error, you can submit an appeal with additional
              documentation or clarification.
            </div>
          </li>
          <li className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Provide Additional Information:</strong> Contact our
              support team to discuss what additional documentation might help
              verify your institution.
            </div>
          </li>
          <li className="flex items-start gap-2">
            <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Get Clarification:</strong> Reach out to our team to
              better understand the verification requirements for your type of
              institution.
            </div>
          </li>
        </ul>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <FoundlyButton
          text="Submit an Appeal"
          className="w-full"
          onClick={handleAppeal}
        />

        <FoundlyButton
          text="Contact Support"
          variant="outline"
          className="w-full"
          onClick={handleContactSupport}
        />
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 border rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Mail className="w-5 h-5 text-gray-600" />
          <h4 className="font-medium text-gray-900">Direct Contact</h4>
        </div>
        <p className="text-sm text-gray-600 text-left mb-2">
          For immediate assistance, you can reach our verification team
          directly:
        </p>
        <div className="text-sm text-gray-800">
          <strong>Email:</strong> support@foundlyhq.com
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">Important Notes</h4>
        <ul className="text-xs text-yellow-800 text-left space-y-1">
          <li>• Appeals are typically reviewed within 2-3 business days</li>
          <li>• Providing additional documentation can strengthen your case</li>
          <li>
            • Our team is here to help you through the verification process
          </li>
          <li>• You can reapply with corrected information if needed</li>
        </ul>
      </div>

      {/* Footer actions */}
      <div className="flex flex-col gap-2 mt-6">
        <button
          onClick={() => (window.location.href = "/")}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default function VerificationRejectedPage() {
  const topBar = (
    <div className="flex justify-between items-center w-full">
      <div></div> {/* Empty div for spacing */}
      <button className="caption text-muted-foreground hover:underline flex items-center gap-1">
        <Phone size={16} className="inline-block mr-1" />
        Contact support
      </button>
    </div>
  );

  return (
    <AuthLayout topBar={topBar}>
      <div className="px-4 pt-8 pb-4 min-h-[calc(100vh-9rem)] flex flex-col justify-between">
        <div className="flex-grow flex items-center justify-center">
          <Suspense>
            <VerificationRejectedContent />
          </Suspense>
        </div>

        <div className="mt-8">
          <AuthFooter />
        </div>
      </div>
    </AuthLayout>
  );
}
