"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useApiCall } from "@/hooks/useApiCall";

import AuthLayout from "@/components/authentication/AuthLayout";
import AuthHeader from "@/components/authentication/AuthHeader";
import AuthBackButton from "@/components/authentication/AuthBackButton";
import FoundlyButton from "@/components/authentication/FoundlyButton";
import { PhoneIcon, Building2 } from "lucide-react";
import { ApiResponse } from "@/api/lib/types";

// Types for organization data
interface Organization {
  institutionName: string;
  clerkOrgId: string;
  clerkOrgSlug: string;
  status: string;
}

const OrganizationSelectionContent = () => {
  const router = useRouter();
  const { user } = useUser();
  const { callAPI, post } = useApiCall();

  // Get user data from Clerk session
  const email = user?.emailAddresses[0]?.emailAddress || "";

  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [existingOrganization, setExistingOrganization] =
    useState<Organization | null>(null);
  const [hasExistingRequest, setHasExistingRequest] = useState(false);
  const [emailDomain, setEmailDomain] = useState("");

  type CheckDomainSuccessResponse =
    | {
        emailDomain: string;
        organizationExists: true;
        organizationDetails: {
          institutionName: string;
          clerkOrgId: string;
          clerkOrgSlug: string;
          status: string;
        };
        canJoin: true;
        fromCache: boolean;
        cacheTimestamp: string;
      }
    | {
        emailDomain: string;
        organizationExists: false;
        organizationDetails: null;
        canJoin: false;
        fromCache: false;
      };
  type CheckDomainResponse = ApiResponse<CheckDomainSuccessResponse>;

  const checkExistingOrganization = useCallback(async () => {
    try {
      setLoading(true);

      // Check if there's an organization for this domain
      const domainCheckResponse = await callAPI(
        "/api/user/institution/check-domain"
      );

      if (domainCheckResponse.ok) {
        const domainResult: CheckDomainResponse =
          await domainCheckResponse.json();

        if (domainResult.success && domainResult?.data?.organizationExists) {
          setExistingOrganization(domainResult.data.organizationDetails);

          // For now, we'll assume they don't have an existing request
          // You might want to add this to your API later
          setHasExistingRequest(false);
        }
      }
    } catch (error) {
      console.error("Error checking organization:", error);
      toast.error("Failed to check organization status");
    } finally {
      setLoading(false);
    }
  }, [callAPI]);

  useEffect(() => {
    if (email) {
      const domain = email.split("@")[1];
      setEmailDomain(domain);
      checkExistingOrganization();
    }
  }, [email, checkExistingOrganization]);

  const handleRequestToJoin = async () => {
    if (!existingOrganization || !user) return;

    setRequestLoading(true);

    try {
      const clerkOrgID = existingOrganization.clerkOrgId;
      const response = await post("/api/user/institution/join-request", {
        organizationId: clerkOrgID,
      });
      if (response.ok) {
        toast.success("Join request sent successfully!");
      } else {
        toast.error("Failed to send join request.");
      }
    } catch (error) {
      console.error("Error sending join request:", error);
      toast.error("Failed to send join request. Please try again.");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleCreateOrganization = () => {
    router.push("/signup/institution/create-organization");
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col gap-6 text-center">
        <AuthHeader
          title="Setting up your account..."
          subtitle="Please wait while we check your organization"
        />
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const FormContent = (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6 text-center">
      <AuthHeader
        title="Join or Create Organization"
        subtitle={`We found your email domain: ${emailDomain}`}
      />

      {existingOrganization ? (
        // Organization exists - show join option
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="h-6 w-6 text-blue-600" />
              <div className="text-left">
                <h3 className="font-semibold text-blue-900">
                  {existingOrganization.institutionName}
                </h3>
                <p className="text-sm text-blue-600">@{emailDomain}</p>
              </div>
            </div>
            <p className="text-sm text-blue-800 text-left">
              An organization with your email domain already exists on Foundly.
            </p>
          </div>

          {hasExistingRequest ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                You already have a pending request to join{" "}
                {existingOrganization.institutionName}. Please wait for approval
                from an administrator.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <FoundlyButton
                text={
                  requestLoading
                    ? "Sending Request..."
                    : "Request to Join Organization"
                }
                onClick={handleRequestToJoin}
                disabled={requestLoading}
                className="w-full"
                as="button"
              />

              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <FoundlyButton
                text="Create New Organization"
                onClick={handleCreateOrganization}
                variant="outline"
                className="w-full"
                as="button"
              /> */}
            </div>
          )}
        </div>
      ) : (
        // No organization exists - show create options
        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="h-6 w-6 text-gray-600" />
              <h3 className="font-semibold text-gray-900">
                No Organization Found
              </h3>
            </div>
            <p className="text-sm text-gray-600 text-left">
              We couldn&apos;t find an organization with the domain{" "}
              <strong>@{emailDomain}</strong> on Foundly.
            </p>
          </div>

          <div className="space-y-4">
            <FoundlyButton
              text="Create Organization"
              onClick={handleCreateOrganization}
              className="w-full"
              as="button"
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Are you not the administrator?</strong>
                <br />
                If someone else at your institution should create the
                organization, you can ask them to sign up first or contact them
                to join Foundly.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return FormContent;
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

export default function OrganizationSelectionPage() {
  return (
    <AuthLayout topBar={topBar}>
      <div className="min-h-screen flex items-center justify-center px-4">
        <Suspense>
          <OrganizationSelectionContent />
        </Suspense>
      </div>
    </AuthLayout>
  );
}
