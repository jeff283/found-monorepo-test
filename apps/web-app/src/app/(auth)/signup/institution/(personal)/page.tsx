"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import {
  MailIcon,
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  PhoneIcon,
  InfoIcon,
  BriefcaseIcon,
} from "lucide-react";

import AuthLayout from "@/components/authentication/AuthLayout";
import AuthHeader from "@/components/authentication/AuthHeader";
import AuthInput from "@/components/authentication/AuthInput";
import AuthBackButton from "@/components/authentication/AuthBackButton";
import FoundlyButton from "@/components/authentication/FoundlyButton";
import AuthFooter from "@/components/authentication/AuthFooter";
import { createClient } from "@/database/supabase/client";
import {
  withErrorHandling,
  showSuccessToast,
} from "@/utils/auth-error-handler";
import ContactSupport from "@/components/authentication/ContactSupport";

/**
 * Comprehensive list of public email domains to prevent institution registration
 * with personal email addresses. Includes major providers (Gmail, Yahoo, etc.),
 * ISP domains, international providers, and temporary/disposable email services.
 * This ensures institutions register with their official organizational domains.
 */
const publicEmailDomains = [
  // Major US providers
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "aol.com",
  "outlook.com",
  "icloud.com",
  "mail.com",
  "gmx.com",
  "protonmail.com",
  "zoho.com",
  "yandex.com",
  "msn.com",
  "live.com",
  // US ISP providers
  "comcast.net",
  "verizon.net",
  "att.net",
  "sbcglobal.net",
  "cox.net",
  "rocketmail.com",
  "ymail.com",
  "me.com",
  "mac.com",
  "bellsouth.net",
  "charter.net",
  "earthlink.net",
  "juno.com",
  "aim.com",
  "optonline.net",
  "frontier.com",
  "windstream.net",
  "centurylink.net",
  "embarqmail.com",
  "roadrunner.com",
  "twc.com",
  "rr.com",
  // International providers
  "shaw.ca", // Canada
  "btinternet.com", // UK
  "ntlworld.com", // UK
  "talktalk.net", // UK
  "virginmedia.com", // UK
  "blueyonder.co.uk", // UK
  "sky.com", // UK
  "mail.ru", // Russia
  "qq.com", // China
  "naver.com", // South Korea
  "daum.net", // South Korea
  "hanmail.net", // South Korea
  "163.com", // China
  "126.com", // China
  "sina.com", // China
  "sohu.com", // China
  "yeah.net", // China
  "rediffmail.com", // India
  "indiatimes.com", // India
  "inbox.com",
  // Temporary/disposable email services
  "mailinator.com",
  "tempmail.com",
  "guerrillamail.com",
  "10minutemail.com",
  "trashmail.com",
  "maildrop.cc",
  "dispostable.com",
];

/**
 * Personal account creation form validation schema using Zod.
 * Enforces business email domains, strong password requirements,
 * and all required fields for personal account creation before organization setup.
 * Compatible with Clerk's sign-up requirements.
 */
const personalAccountSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),

  email: z
    .email("Please enter a valid email address")
    .min(1, "Business email is required")
    .refine((email) => {
      // Extract domain from email address (everything after @)
      const domain = email.split("@")[1]?.toLowerCase();
      // Check if the domain exists in our list of public email providers
      return !publicEmailDomains.includes(domain);
    }, "Please use your business email address (not a public email like Gmail, Yahoo, etc.)"),

  jobTitle: z.string().optional(),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

// Type inference from schema
type PersonalAccountForm = z.infer<typeof personalAccountSchema>;

/**
 * Saves additional user information to Supabase after Clerk account creation.
 * This includes job title and any other business-specific data.
 */
async function saveUserToSupabase({
  userId,
  email,
  firstName,
  lastName,
  jobTitle,
}: {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
}) {
  const supabase = createClient();

  const { error } = await withErrorHandling(async () => {
    const { error } = await supabase.from("user_profiles").insert({
      clerk_user_id: userId,
      email,
      first_name: firstName,
      last_name: lastName,
      job_title: jobTitle || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw error;
    }

    return { success: true };
  }, "saving user profile to database");

  return { success: !error, error };
}

export default function CreatePersonalAccountPage() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<PersonalAccountForm>({
    resolver: zodResolver(personalAccountSchema),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      jobTitle: "",
      password: "",
    },
  });

  // Watch password for real-time strength validation
  const password = watch("password");

  // Password security requirements for UI indicators
  const MIN_PASSWORD_LENGTH = 8;

  // Real-time password validation checks using regex patterns
  const hasUppercase = /[A-Z]/.test(password); // At least one capital letter
  const hasNumber = /[0-9]/.test(password); // At least one digit
  const hasSpecial = /[^A-Za-z0-9]/.test(password); // At least one special character (non-alphanumeric)
  const isLongEnough = password?.length >= MIN_PASSWORD_LENGTH; // Minimum length requirement

  // Configuration for password strength indicator and validation messages
  const requirements = [
    { label: `At least ${MIN_PASSWORD_LENGTH} characters`, met: isLongEnough },
    { label: "One uppercase letter", met: hasUppercase },
    { label: "One number", met: hasNumber },
    { label: "One special character", met: hasSpecial },
  ];

  /**
   * Handles the personal account creation form submission using Clerk authentication.
   * Creates account with Clerk, sends email verification, and stores additional data in Supabase.
   */
  const onSubmit = async (data: PersonalAccountForm) => {
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    const { error } = await withErrorHandling(async () => {
      // Create account with Clerk
      const result = await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      // Send email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set the active session immediately after account creation
      if (setActive && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
      }

      // Store additional user data in Supabase using Clerk's user ID
      if (result.createdUserId) {
        const supabaseResult = await saveUserToSupabase({
          userId: result.createdUserId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          jobTitle: data.jobTitle,
        });

        if (!supabaseResult.success && supabaseResult.error) {
          console.warn(
            "Clerk account created but Supabase save failed:",
            supabaseResult.error
          );
          // We don't throw here since the main account was created successfully
          // The user can still proceed, and we can retry saving the profile later
        }
      }

      return result;
    }, "account creation");

    if (error) {
      setError(error);
    } else {
      showSuccessToast(
        "Account created successfully! Please check your email for verification."
      );
      // Navigate to verification page without URL parameters
      router.push("/signup/institution/verify-otp");
    }

    setLoading(false);
  };

  /**
   * Handles social authentication signup (Google, Microsoft).
   * Currently uses a mock implementation that directly navigates to dashboard.
   * In production, this should integrate with OAuth providers and validate
   * that the social account uses an institutional email domain.
   */
  // const handleSocialSignup = async () => {
  //   setLoading(true);

  //   // MOCK IMPLEMENTATION - Replace with actual OAuth integration
  //   // Simulates successful social authentication
  //   setTimeout(() => {
  //     setLoading(false);
  //     // Navigate directly to institution dashboard after successful social signup
  //     router.push("/institution-dashboard");
  //   }, 1000);

  //   // TODO: PRODUCTION IMPLEMENTATION
  //   // Uncomment below and comment out the setTimeout block above to use backend
  //   // You may need to add setError back to useForm destructuring for error handling
  //   // const result = await socialSignup({ provider });
  //   // setLoading(false);
  //   // if (result.success) {
  //   //   router.push('/institution-dashboard');
  //   // } else {
  //   //   // Add setError to useForm destructuring above to use this
  //   //   // setError("root", { message: result.error || 'Social signup failed. Please try again.' });
  //   // }
  // };

  const topBar = (
    <div className="flex justify-between items-center w-full">
      <AuthBackButton />

      <ContactSupport variant="minimal" />
    </div>
  );

  const FormContent = (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6 text-center">
      <AuthHeader
        title="Create Your Account"
        subtitle="First, let's set up your personal account"
      />

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm text-left">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        {/* First Name */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="firstName"
            className="text-sm text-left font-medium text-gray-700"
          >
            First Name
          </label>
          <AuthInput
            id="firstName"
            type="text"
            placeholder="First name"
            icon={UserIcon}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs text-left mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="lastName"
            className="text-sm text-left font-medium text-gray-700"
          >
            Last Name
          </label>
          <AuthInput
            id="lastName"
            type="text"
            placeholder="Last name"
            icon={UserIcon}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs text-left mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Business Email */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <label
              htmlFor="email"
              className="text-sm text-left font-medium text-gray-700"
            >
              Business Email
            </label>
            <div className="group relative">
              <InfoIcon
                size={14}
                className="text-gray-400 hover:text-gray-600 cursor-help"
              />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Use your business email address (.edu, .gov, .com, etc.)
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
          <AuthInput
            id="email"
            type="email"
            placeholder="your.name@company.com"
            icon={MailIcon}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs text-left mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Job Title (Optional) */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="jobTitle"
            className="text-sm text-left font-medium text-gray-700"
          >
            Job Title (Optional)
          </label>
          <AuthInput
            id="jobTitle"
            type="text"
            placeholder="Your job title"
            icon={BriefcaseIcon}
            {...register("jobTitle")}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700 text-left"
          >
            Password
          </label>
          <div className="relative w-full">
            <AuthInput
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create your password"
              icon={LockIcon}
              {...register("password")}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs text-left mt-1">
              {errors.password.message}
            </p>
          )}

          {/* Real-time password strength indicator - only show after user starts typing */}
          {dirtyFields.password && (
            <div className="mt-2">
              {/* Visual progress bar showing password strength */}
              <div className="w-full h-2 rounded bg-gray-200">
                <div
                  className={`h-2 rounded transition-all duration-300 ${
                    // Color-coded strength indicator based on requirements met
                    requirements.filter((r) => r.met).length === 4
                      ? "bg-green-600" // All requirements met - strong
                      : requirements.filter((r) => r.met).length === 3
                        ? "bg-green-400" // 3/4 requirements - good
                        : requirements.filter((r) => r.met).length === 2
                          ? "bg-yellow-400" // 2/4 requirements - fair
                          : requirements.filter((r) => r.met).length === 1
                            ? "bg-orange-400" // 1/4 requirements - weak
                            : "bg-red-400" // No requirements met - very weak
                  }`}
                  style={{
                    // Progress bar width based on percentage of requirements met
                    width: `${
                      (requirements.filter((r) => r.met).length /
                        requirements.length) *
                      100
                    }%`,
                  }}
                />
              </div>
              {/* Detailed requirements checklist */}
              <ul className="mt-2 text-xs text-gray-600 space-y-1 text-left">
                {requirements.map((req, idx) => (
                  <li key={idx} className="flex items-center gap-1">
                    {/* Visual checkmark indicator for each requirement */}
                    <span
                      className={`w-3 h-3 rounded-full flex items-center justify-center text-white text-[10px] ${
                        req.met ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {req.met ? "✓" : ""}
                    </span>
                    {/* Requirement text with conditional styling */}
                    <span className={req.met ? "text-green-600" : ""}>
                      {req.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Display root form errors */}
        {errors.root && (
          <div className="text-red-500 text-sm text-left mt-2">
            {errors.root.message}
          </div>
        )}

        {/* Submit Button */}
        <FoundlyButton
          text={loading ? "Creating Account..." : "Create Account"}
          className="w-full mt-4"
          as="button"
          type="submit"
          disabled={loading}
        />
        <div id="clerk-captcha" />
      </form>

      {/* Temporary pause on social auth sign up */}

      {/* OR Divider */}
      {/* <div className="relative text-center text-gray-400 my-2 sm:my-3">
        <span className="bg-white px-4 relative z-10">OR</span>
        <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-300" />
      </div> */}

      {/* Google SignUP */}
      {/* <SocialLoginButton
        icon={FcGoogle}
        text="Sign up with Google"
        onClick={handleSocialSignup}
      /> */}

      {/* Microsoft SignUP */}
      {/* <SocialLoginButton
        icon={MicrosoftLogo}
        text="Sign up with Microsoft"
        onClick={handleSocialSignup}
      /> */}

      {/* Sign-in Link */}
      <p className="text-sm text-center text-gray-500 mt-2">
        Already have an account?{" "}
        <a href="/login" className="text-[#00B5C3] hover:underline">
          Login
        </a>
      </p>
    </div>
  );

  return (
    <AuthLayout topBar={topBar}>
      <div className="px-4 pt-8 pb-4 min-h-[calc(100vh-9rem)] flex flex-col justify-between">
        <div className="flex-grow flex items-center justify-center">
          {FormContent}
        </div>
        <div className="mt-8">
          <AuthFooter />
        </div>
      </div>
    </AuthLayout>
  );
}
