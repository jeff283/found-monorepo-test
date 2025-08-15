"use client";
import { useOrganizationList } from "@clerk/nextjs";
import { useApiCall } from "@/hooks/useApiCall";
import {
  InstitutionDraftData,
  InstitutionStatusData,
  ApiResponse,
} from "@/api/lib/types";
import {
  clerkOrganizationDetailsSchema,
  ClerkOrganizationDetails,
} from "@/api/lib/schemas";
import { getInstitutionStatus } from "@/api/lib/utils/insitution-status-helper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import slugify from "slugify";
import { CheckCircle, Clock, Building2, Zap, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateOrgEmailDomain } from "@/server/actions/org-metadata";

type LoadingStage =
  | "initializing"
  | "validating"
  | "creating-org"
  | "setting-active"
  | "saving-details"
  | "complete";

const LoadingAnimation = ({ stage }: { stage: LoadingStage }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const stageConfig = {
    initializing: {
      icon: Clock,
      title: "Initializing",
      description: "Preparing your organization setup",
      color: "text-teal-500",
    },
    validating: {
      icon: CheckCircle,
      title: "Validating",
      description: "Checking your institution details",
      color: "text-blue-500",
    },
    "creating-org": {
      icon: Building2,
      title: "Creating Organization",
      description: "Setting up your workspace",
      color: "text-purple-500",
    },
    "setting-active": {
      icon: Zap,
      title: "Activating",
      description: "Making your organization active",
      color: "text-orange-500",
    },
    "saving-details": {
      icon: CheckCircle,
      title: "Finalizing",
      description: "Saving organization details",
      color: "text-green-500",
    },
    complete: {
      icon: CheckCircle,
      title: "Complete!",
      description: "Redirecting to your dashboard",
      color: "text-green-600",
    },
  };

  const config = stageConfig[stage];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Animated Icon */}
      <div className="relative">
        <div
          className={`w-24 h-24 rounded-full bg-gradient-to-br from-teal-100 to-steel-blue-100 flex items-center justify-center ${stage === "complete" ? "animate-pulse" : ""}`}
        >
          <Icon
            className={`w-12 h-12 ${config.color} ${stage !== "complete" ? "animate-pulse" : ""}`}
          />
        </div>
        {stage !== "complete" && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-teal-500 rounded-full animate-ping"></div>
        )}
      </div>

      {/* Progress Ring */}
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-grey-200"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className={config.color}
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - getStageProgress(stage))}`}
            style={{
              transition: "stroke-dashoffset 0.5s ease-in-out",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-foreground">
            {Math.round(getStageProgress(stage) * 100)}%
          </span>
        </div>
      </div>

      {/* Stage Information */}
      <div className="text-center space-y-3">
        <h2 className="headline-1">
          {config.title}
          {stage !== "complete" && (
            <span className="text-teal-500">{dots}</span>
          )}
        </h2>
        <p className="body-1 text-muted-foreground max-w-md">
          {config.description}
        </p>

        {stage === "complete" && (
          <div className="flex items-center justify-center space-x-2 text-green-600 mt-4">
            <CheckCircle className="w-5 h-5" />
            <span className="button-text">Success!</span>
            <ArrowRight className="w-4 h-4 animate-pulse" />
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center space-x-2 mt-6">
        {Object.keys(stageConfig).map((stepStage, index) => {
          const isActive = stepStage === stage;
          const isComplete =
            getStageProgress(stepStage as LoadingStage) === 1 &&
            stage !== stepStage;

          return (
            <div key={stepStage} className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isComplete
                    ? "bg-green-500"
                    : isActive
                      ? "bg-teal-500 animate-pulse scale-125"
                      : "bg-grey-200"
                }`}
              />
              {index < Object.keys(stageConfig).length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-1 transition-colors duration-300 ${
                    isComplete ||
                    (isActive && index < Object.keys(stageConfig).length - 2)
                      ? "bg-teal-300"
                      : "bg-grey-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getStageProgress = (stage: LoadingStage): number => {
  const stages = [
    "initializing",
    "validating",
    "creating-org",
    "setting-active",
    "saving-details",
    "complete",
  ];
  const currentIndex = stages.indexOf(stage);
  return (currentIndex + 1) / stages.length;
};

const CreateApprovedOrg = () => {
  const router = useRouter();
  const { get, post } = useApiCall();
  const { createOrganization, setActive, isLoaded } = useOrganizationList();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] =
    useState<LoadingStage>("initializing");
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);

  const { data, isLoading, isError, error } = useQuery<{
    draft: ApiResponse<InstitutionDraftData> | null;
    status: InstitutionStatusData;
  }>({
    queryKey: ["institutionDraftAndStatus"],
    queryFn: async () => {
      const res = await get("/api/user/institution/draft");
      const draft: ApiResponse<InstitutionDraftData> | null = await res.json();
      const draftData = draft?.data as InstitutionDraftData | null;
      const status = getInstitutionStatus(draftData);
      return { draft, status };
    },
    staleTime: 1000 * 60 * 5,
  });

  const { mutateAsync: addClerkOrgDetails } = useMutation({
    mutationFn: async (details: ClerkOrganizationDetails) => {
      const validated = clerkOrganizationDetailsSchema.parse(details);
      const res = await post("/api/user/institution/clerk-details", validated);
      const json: ApiResponse = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.error || "Failed to add Clerk organization details"
        );
      }
      return json.data;
    },
  });

  const createSlug = (name: string, extraChars?: number) => {
    if (!name) {
      const errorMessage =
        "Error: Institution name is required to generate a slug.";
      setErrorMessage(errorMessage);
      console.error(errorMessage);
      return;
    }

    let orgSlug = slugify(name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: true,
    });

    if (extraChars && extraChars > 0) {
      const uuid = crypto.randomUUID().replace(/-/g, "");
      const randomSuffix = uuid.substring(0, Math.min(extraChars, uuid.length));
      orgSlug = `${orgSlug}-${randomSuffix}`;
    }

    return orgSlug;
  };

  const handleCreateOrg = async () => {
    setErrorMessage(null);
    setIsCreatingOrg(true);
    setLoadingStage("validating");

    try {
      // Stage 1: Validation
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!data?.draft) {
        setErrorMessage(
          "No institution found. Please create an institution before proceeding."
        );
        return;
      }

      if (!data.draft.data?.institutionName) {
        setErrorMessage(
          "Error: Institution name is required. Please provide a name or contact support."
        );
        return;
      }

      const orgSlug = createSlug(data.draft.data.institutionName);
      if (!orgSlug) {
        setErrorMessage("Error: Failed to generate organization slug.");
        return;
      }

      // Stage 2: Creating Organization
      setLoadingStage("creating-org");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (!createOrganization) {
        setErrorMessage(
          "Organization creation is currently unavailable. Please try again later or contact support."
        );
        return;
      }

      const org = await createOrganization({
        name: data.draft.data.institutionName,
        slug: orgSlug,
      });

      // Stage 3: Setting Active
      setLoadingStage("setting-active");
      await new Promise((resolve) => setTimeout(resolve, 800));

      await setActive({ organization: org.id });

      // Stage 4: Saving Details
      setLoadingStage("saving-details");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (org.slug) {
        await addClerkOrgDetails({
          clerkOrgId: org.id,
          clerkOrgSlug: org.slug,
        });
      }

      // Update org Metadata
      if (data.draft.data.emailDomain) {
        await updateOrgEmailDomain(org.id, data.draft.data.emailDomain);
      }

      // Stage 5: Complete
      setLoadingStage("complete");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Organization created successfully:", {
        name: org.name,
        slug: org.slug,
      });

      // Redirect to dashboard
      router.push("/institution/dashboard");
    } catch (err) {
      console.error("Failed to create organization", err);
      setErrorMessage("Something went wrong while creating the organization.");
      setIsCreatingOrg(false);
    }
  };

  // Auto-start organization creation when data is ready
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (data && !isCreatingOrg && !errorMessage) {
      handleCreateOrg();
    }
  }, [data]);

  if (isLoading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-teal-50/20 to-steel-blue-50/20 flex items-center justify-center p-8">
        <LoadingAnimation stage="initializing" />
      </div>
    );
  }

  if (isError || errorMessage) {
    const displayError =
      errorMessage || error?.message || "An unexpected error occurred";

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-red-50/20 to-orange-50/20 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <div className="w-12 h-12 text-red-600">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="headline-1 text-red-600">Setup Error</h2>
            <p className="body-1 text-muted-foreground">{displayError}</p>

            <button
              onClick={() => router.refresh()}
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors button-text"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-teal-50/20 to-steel-blue-50/20 flex items-center justify-center p-8">
      <LoadingAnimation stage={loadingStage} />
    </div>
  );
};

export default CreateApprovedOrg;
