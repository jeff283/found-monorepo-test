"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useApiCall } from "@/hooks/useApiCall";

import { Building2, Users } from "lucide-react";

import BusinessSetupLayout from "@/components/authentication/BusinessSetupLayout";
import AuthInput from "@/components/authentication/AuthInput";
import FoundlyButton from "@/components/authentication/FoundlyButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Basic organization setup form validation schema using Zod.
 * This is the first step - collecting essential organization info only.
 */
const basicOrganizationSchema = z.object({
  organizationName: z
    .string()
    .min(1, "Organization name is required")
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name must be less than 100 characters"),

  organizationType: z
    .enum([
      "university",
      "college",
      "research",
      "nonprofit",
      "government",
      "corporate",
      "other",
    ])
    .refine((val) => val !== undefined, "Please select an organization type"),

  organizationSize: z
    .enum(["1-10", "11-100", "101-1000", "1001-10000", "10000+"])
    .refine((val) => val !== undefined, "Please select organization size"),
});

// Type inference from schema
type BasicOrganizationForm = z.infer<typeof basicOrganizationSchema>;

const OrganizationSetupContent = () => {
  const router = useRouter();
  const { user } = useUser();
  const { post } = useApiCall();
  const firstName = user?.firstName || "";

  const [loading, setLoading] = useState(false);

  // Initialize react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BasicOrganizationForm>({
    resolver: zodResolver(basicOrganizationSchema),
    mode: "onSubmit",
    defaultValues: {
      organizationName: "",
      organizationType: undefined,
      organizationSize: undefined,
    },
  });

  const onSubmit = async (data: BasicOrganizationForm) => {
    setLoading(true);

    try {
      // Map form data to API expected format
      const organizationData = {
        organizationName: data.organizationName,
        organizationType: data.organizationType,
        organizationSize: data.organizationSize,
      };

      // Call the API to create/update organization
      const response = await post(
        "/api/user/institution/organization",
        organizationData
      );

      if (!response.ok) {
        toast.error("Failed to save organization data");
        // TODO : Log error details for debugging
        // const errorData = await response.json();
        // console.log("Error saving organization data:", errorData);
        // throw new Error(errorData.error || "Failed to save organization data");
      }

      const result = await response.json();

      if (result.success) {
        toast.success("Organization information saved successfully!");
        // Navigate to verification details page
        router.push("/signup/institution/verification-details");
      } else {
        toast.error("Failed to save organization data");
        // Log error details for debugging
        // console.log("Error saving organization data:", result);
        // throw new Error(result.error || "Failed to save organization data");
      }
    } catch (error) {
      console.error("Error saving organization data:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save organization data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const organizationTypes = [
    { value: "university", label: "University" },
    { value: "college", label: "College" },
    { value: "research", label: "Research Institution" },
    { value: "nonprofit", label: "Non-Profit Organization" },
    { value: "government", label: "Government Agency" },
    { value: "corporate", label: "Corporate" },
    { value: "other", label: "Other" },
  ];

  const organizationSizes = [
    { value: "1-10", label: "1-10 employees" },
    { value: "11-100", label: "11-100 employees" },
    { value: "101-1000", label: "101-1,000 employees" },
    { value: "1001-10000", label: "1,001-10,000 employees" },
    { value: "10000+", label: "10,000+ employees" },
  ];

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Welcome, {firstName}!
        </h1>
        <p className="text-gray-600 text-lg">
          Let&apos;s set up your organization workspace
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Organization Name */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="organizationName"
            className="text-sm font-semibold text-gray-900"
          >
            Organization Name
          </label>
          <AuthInput
            id="organizationName"
            type="text"
            placeholder="Your organization name"
            icon={Building2}
            {...register("organizationName")}
          />
          {errors.organizationName && (
            <p className="text-red-500 text-sm text-left">
              {errors.organizationName.message}
            </p>
          )}
        </div>

        {/* Organization Type */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="organizationType"
            className="text-sm font-semibold text-gray-900"
          >
            Organization Type
          </label>
          <div className="relative">
            <Select
              onValueChange={(value) =>
                setValue(
                  "organizationType",
                  value as
                    | "university"
                    | "college"
                    | "research"
                    | "nonprofit"
                    | "government"
                    | "corporate"
                    | "other"
                )
              }
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-3">
                  <Building2 className="h-[18px] w-[18px] text-gray-400" />
                  <SelectValue placeholder="Select organization type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {organizationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.organizationType && (
            <p className="text-red-500 text-sm text-left">
              {errors.organizationType.message}
            </p>
          )}
        </div>

        {/* Organization Size */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="organizationSize"
            className="text-sm font-semibold text-gray-900"
          >
            Organization Size
          </label>
          <div className="relative">
            <Select
              onValueChange={(value) =>
                setValue(
                  "organizationSize",
                  value as
                    | "1-10"
                    | "11-100"
                    | "101-1000"
                    | "1001-10000"
                    | "10000+"
                )
              }
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-3">
                  <Users className="h-[18px] w-[18px] text-gray-400" />
                  <SelectValue placeholder="Select organization size" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {organizationSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.organizationSize && (
            <p className="text-red-500 text-sm text-left">
              {errors.organizationSize.message}
            </p>
          )}
        </div>

        {/* Display root form errors */}
        {errors.root && (
          <div className="text-red-500 text-sm text-left">
            {errors.root.message}
          </div>
        )}

        {/* Submit Button */}
        <FoundlyButton
          text={loading ? "Creating Organization..." : "Continue"}
          className="w-full mt-6"
          as="button"
          type="submit"
          disabled={loading}
        />
      </form>
    </div>
  );
};

export default function CreateOrganizationPage() {
  return (
    <BusinessSetupLayout currentStep={1} totalSteps={3}>
      <Suspense>
        <OrganizationSetupContent />
      </Suspense>
    </BusinessSetupLayout>
  );
}
