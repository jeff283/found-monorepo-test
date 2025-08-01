"use client";

import React, { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useApiCall } from "@/hooks/useApiCall";

import {
  Globe,
  MapPin,
  Phone,
  FileText,
  Shield,
  Check,
  ChevronsUpDown,
} from "lucide-react";

import BusinessSetupLayout from "@/components/authentication/BusinessSetupLayout";
import AuthInput from "@/components/authentication/AuthInput";
import FoundlyButton from "@/components/authentication/FoundlyButton";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Countries list for the combobox
const countries = [
  { value: "united-states", label: "United States" },
  { value: "canada", label: "Canada" },
  { value: "united-kingdom", label: "United Kingdom" },
  { value: "australia", label: "Australia" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "japan", label: "Japan" },
  { value: "south-korea", label: "South Korea" },
  { value: "singapore", label: "Singapore" },
  { value: "netherlands", label: "Netherlands" },
  { value: "sweden", label: "Sweden" },
  { value: "norway", label: "Norway" },
  { value: "denmark", label: "Denmark" },
  { value: "finland", label: "Finland" },
  { value: "switzerland", label: "Switzerland" },
  { value: "austria", label: "Austria" },
  { value: "belgium", label: "Belgium" },
  { value: "ireland", label: "Ireland" },
  { value: "new-zealand", label: "New Zealand" },
  { value: "spain", label: "Spain" },
  { value: "italy", label: "Italy" },
  { value: "portugal", label: "Portugal" },
  { value: "brazil", label: "Brazil" },
  { value: "mexico", label: "Mexico" },
  { value: "india", label: "India" },
  { value: "china", label: "China" },
  { value: "kenya", label: "Kenya" },
  { value: "south-africa", label: "South Africa" },
  { value: "other", label: "Other" },
].sort((a, b) => a.label.localeCompare(b.label));

/**
 * Verification details form validation schema using Zod.
 * This collects additional information needed for institution verification.
 */
const verificationDetailsSchema = z.object({
  // Institution website and description
  institutionWebsite: z
    .url("Please enter a valid website URL")
    .min(1, "Institution website is required"),

  institutionDescription: z
    .string()
    .min(5, "Please provide at least 5 characters describing your institution")
    .max(500, "Description must be less than 500 characters"),

  // Institution address
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  zipCode: z.string().min(1, "ZIP/Postal code is required"),
  country: z.string().min(1, "Country is required"),

  // Contact phone (since they're already the contact person)
  phoneNumber: z.string().min(1, "Phone number is required"),

  // Additional verification info
  expectedStudentCount: z
    .string()
    .min(1, "Expected student count is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Please enter a valid number"
    ),

  // Optional tax ID - won't cause form rejection if empty
  taxIdOrRegistrationNumber: z.string().optional(),
});

type VerificationDetailsForm = z.infer<typeof verificationDetailsSchema>;

const VerificationDetailsContent = () => {
  const router = useRouter();
  const { post } = useApiCall();

  // Since we're no longer passing org data via URL params,
  // we'll use a generic title for now or fetch from Clerk organization data
  const orgName = "Your Organization";

  const [loading, setLoading] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<VerificationDetailsForm>({
    resolver: zodResolver(verificationDetailsSchema),
    mode: "onSubmit",
    defaultValues: {
      institutionWebsite: "",
      institutionDescription: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phoneNumber: "",
      expectedStudentCount: "",
      taxIdOrRegistrationNumber: "",
    },
  });

  const countryValue = watch("country");

  /**
   * Handles the verification details form submission.
   * Combines this data with the basic org data and submits for verification.
   */
  const onSubmit = async (data: VerificationDetailsForm) => {
    setLoading(true);

    try {
      // Map form data to API expected format to match verificationStepSchema
      const verificationData = {
        institutionWebsite: data.institutionWebsite,
        institutionDescription: data.institutionDescription,
        streetAddress: data.streetAddress,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        phoneNumber: data.phoneNumber,
        expectedStudentCount: data.expectedStudentCount,
        taxIdOrRegistrationNumber: data.taxIdOrRegistrationNumber || undefined,
      };

      // Call the API to save verification data
      const response = await post(
        "/api/user/institution/verification",
        verificationData
      );

      if (!response.ok) {
        toast.error("Failed to save verification data");

        // const errorData = await response.json();
        // console.error("Error saving verification data:", errorData);
        // throw new Error(errorData.error || "Failed to save verification data");
      }

      const result = await response.json();

      if (result.success) {
        toast.success("Verification information saved successfully!");
        // Navigate to pending verification page
        router.push("/signup/institution/pending-verification");
      } else {
        toast.error("Failed to save verification data");

        // throw new Error(result.error || "Failed to save verification data");
      }
    } catch (error) {
      console.error("Error saving verification data:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save verification data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Verification Details
        </h1>
        <p className="text-gray-600 text-lg">
          Help us verify {orgName} by providing additional information
        </p>
      </div>

      {/* Information notice */}
      <div className="bg-blue-50/50 border border-blue-200/50 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <Shield className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-left">
            <h3 className="font-semibold text-blue-900 text-base">
              Why do we need this information?
            </h3>
            <p className="text-blue-700 text-sm mt-2 leading-relaxed">
              This information helps our team verify your institution and ensure
              the security of our platform. All data is securely stored and only
              used for verification purposes.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        {/* Institution Details Section */}
        <div className="border-b border-gray-100 pb-8">
          <h3 className="text-xl font-semibold text-left mb-6 text-gray-900">
            Institution Details
          </h3>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="institutionWebsite"
                className="text-sm font-semibold text-gray-900"
              >
                Official Website
              </label>
              <AuthInput
                id="institutionWebsite"
                type="url"
                placeholder="https://www.yourorganization.edu"
                icon={Globe}
                {...register("institutionWebsite")}
              />
              {errors.institutionWebsite && (
                <p className="text-red-500 text-sm text-left">
                  {errors.institutionWebsite.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="institutionDescription"
                className="text-sm font-semibold text-gray-900"
              >
                Brief Description
              </label>
              <textarea
                id="institutionDescription"
                placeholder="Describe your institution, its mission, and primary activities..."
                {...register("institutionDescription")}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B5C3]/20 focus:border-[#00B5C3] min-h-[120px] resize-none transition-colors"
              />
              {errors.institutionDescription && (
                <p className="text-red-500 text-sm text-left">
                  {errors.institutionDescription.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="border-b border-gray-100 pb-8">
          <h3 className="text-xl font-semibold text-left mb-6 text-gray-900">
            Institution Address
          </h3>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="streetAddress"
                className="text-sm font-semibold text-gray-900"
              >
                Street Address
              </label>
              <AuthInput
                id="streetAddress"
                type="text"
                placeholder="123 University Ave"
                icon={MapPin}
                {...register("streetAddress")}
              />
              {errors.streetAddress && (
                <p className="text-red-500 text-sm text-left">
                  {errors.streetAddress.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="city"
                  className="text-sm font-semibold text-gray-900"
                >
                  City
                </label>
                <AuthInput
                  id="city"
                  type="text"
                  placeholder="City"
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm text-left">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="state"
                  className="text-sm font-semibold text-gray-900"
                >
                  State/Province
                </label>
                <AuthInput
                  id="state"
                  type="text"
                  placeholder="State"
                  {...register("state")}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm text-left">
                    {errors.state.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="zipCode"
                  className="text-sm font-semibold text-gray-900"
                >
                  ZIP/Postal Code
                </label>
                <AuthInput
                  id="zipCode"
                  type="text"
                  placeholder="12345"
                  {...register("zipCode")}
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-sm text-left">
                    {errors.zipCode.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="country"
                  className="text-sm font-semibold text-gray-900"
                >
                  Country
                </label>
                <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={countryOpen}
                      className="w-full justify-between h-12 px-4 py-3 text-left border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B5C3]/20 focus:border-[#00B5C3] transition-colors"
                    >
                      {countryValue
                        ? countries.find(
                            (country) => country.value === countryValue
                          )?.label
                        : "Select country..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search country..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {countries.map((country) => (
                            <CommandItem
                              key={country.value}
                              value={country.value}
                              onSelect={(currentValue) => {
                                setValue(
                                  "country",
                                  currentValue === countryValue
                                    ? ""
                                    : currentValue
                                );
                                setCountryOpen(false);
                              }}
                            >
                              {country.label}
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  countryValue === country.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.country && (
                  <p className="text-red-500 text-sm text-left">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Section - Simplified */}
        <div className="border-b border-gray-100 pb-8">
          <h3 className="text-xl font-semibold text-left mb-6 text-gray-900">
            Contact Information
          </h3>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="phoneNumber"
              className="text-sm font-semibold text-gray-900"
            >
              Phone Number
            </label>
            <p className="text-sm text-gray-500 text-left mb-3">
              We may call this number to verify your institution details
            </p>
            <AuthInput
              id="phoneNumber"
              type="tel"
              placeholder="+1 (555) 123-4567"
              icon={Phone}
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm text-left">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="pb-8">
          <h3 className="text-xl font-semibold text-left mb-6 text-gray-900">
            Additional Information
          </h3>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="expectedStudentCount"
                className="text-sm font-semibold text-gray-900"
              >
                Expected Number of Students/Users
              </label>
              <AuthInput
                id="expectedStudentCount"
                type="number"
                placeholder="500"
                {...register("expectedStudentCount")}
              />
              {errors.expectedStudentCount && (
                <p className="text-red-500 text-sm text-left">
                  {errors.expectedStudentCount.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="taxIdOrRegistrationNumber"
                className="text-sm font-semibold text-gray-900"
              >
                Tax ID / Registration Number{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <p className="text-sm text-gray-500 text-left mb-3">
                Providing this helps speed up verification, but it&apos;s not
                required
              </p>
              <AuthInput
                id="taxIdOrRegistrationNumber"
                type="text"
                placeholder="123-45-6789 (optional)"
                icon={FileText}
                {...register("taxIdOrRegistrationNumber")}
              />
              {errors.taxIdOrRegistrationNumber && (
                <p className="text-red-500 text-sm text-left">
                  {errors.taxIdOrRegistrationNumber.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <FoundlyButton
          text={
            loading
              ? "Submitting for Verification..."
              : "Submit for Verification"
          }
          className="w-full mt-6"
          as="button"
          type="submit"
          disabled={loading}
        />
      </form>
    </div>
  );
};

export default function VerificationDetailsPage() {
  return (
    <BusinessSetupLayout currentStep={2} totalSteps={3}>
      <Suspense>
        <VerificationDetailsContent />
      </Suspense>
    </BusinessSetupLayout>
  );
}
