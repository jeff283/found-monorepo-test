"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MailIcon,
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  PhoneIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";

import AuthLayout from "@/components/authentication/AuthLayout";
import AuthHeader from "@/components/authentication/AuthHeader";
import AuthBackButton from "@/components/authentication/AuthBackButton";
import FoundlyButton from "@/components/authentication/FoundlyButton";
import AuthFooter from "@/components/authentication/AuthFooter";
import MicrosoftLogo from "@/components/microsoft-logo";
import { FcGoogle } from "react-icons/fc";
import {
  handleClerkError,
  showSuccessToast,
  withErrorHandling,
} from "@/utils/auth-error-handler";

/**
 * Individual account registration form validation schema using Zod.
 * Enforces email format, strong password requirements, and all required fields
 * for individual user registration.
 */
const individualAccountSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),

  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required"),

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
type IndividualAccountForm = z.infer<typeof individualAccountSchema>;

export default function IndividualRegisterPage() {
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
  } = useForm<IndividualAccountForm>({
    resolver: zodResolver(individualAccountSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  // Watch password for real-time strength validation
  const password = watch("password");

  // Password security requirements for UI indicators
  const MIN_PASSWORD_LENGTH = 8;

  // Real-time password validation checks using regex patterns
  const hasUppercase = /[A-Z]/.test(password || ""); // At least one capital letter
  const hasNumber = /[0-9]/.test(password || ""); // At least one digit
  const hasSpecial = /[^A-Za-z0-9]/.test(password || ""); // At least one special character (non-alphanumeric)
  const isLongEnough = (password?.length || 0) >= MIN_PASSWORD_LENGTH; // Minimum length requirement

  // Configuration for password strength indicator and validation messages
  const requirements = [
    { label: `At least ${MIN_PASSWORD_LENGTH} characters`, met: isLongEnough },
    { label: "One uppercase letter", met: hasUppercase },
    { label: "One number", met: hasNumber },
    { label: "One special character", met: hasSpecial },
  ];

  const strength = requirements.reduce(
    (acc, req) => acc + (req.met ? 1 : 0),
    0
  );
  const strengthLabels = [
    "Very weak",
    "Weak",
    "Medium",
    "Strong",
    "Very strong",
  ];
  const strengthColors = [
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-400",
    "bg-green-600",
  ];

  /**
   * Handles the individual account registration form submission using Clerk.
   * Creates account with email/password and navigates to verification.
   */
  const onSubmit = async (data: IndividualAccountForm) => {
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    const { error } = await withErrorHandling(async () => {
      // Split full name into first and last name
      const nameParts = data.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Create account with Clerk
      const result = await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName,
        lastName,
      });

      // Send email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set the active session immediately after account creation
      if (setActive && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
      }

      return result;
    }, "account creation");

    if (error) {
      setError(error);
    } else {
      showSuccessToast(
        "Account created! Please check your email for verification code."
      );
      router.push("/signup/individual/verify-otp");
    }

    setLoading(false);
  };

  const handleSocialSignup = async (
    strategy: "oauth_google" | "oauth_microsoft"
  ) => {
    if (!isLoaded) return;

    setLoading(true);

    try {
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/institution/dashboard",
      });
    } catch (err: unknown) {
      console.error("Social signup error:", err);
      const errorMessage = handleClerkError(err);
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleSignUpWithGoogle = () => {
    handleSocialSignup("oauth_google");
  };

  const handleSignUpWithMicrosoft = () => {
    handleSocialSignup("oauth_microsoft");
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

  return (
    <AuthLayout topBar={topBar}>
      <div className="px-4 pt-8 pb-4 min-h-[calc(100vh-9rem)] md:flex md:items-center md:justify-center md:pt-0 md:pb-0">
        <div className="w-full max-w-[400px] mx-auto flex flex-col gap-6">
          <AuthHeader title="Register" />

          <div className="flex flex-col gap-6">
            {/* Social Login Buttons - Moved to top */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSignUpWithGoogle}
                disabled={loading}
                className="flex items-center w-full justify-center gap-3 border border-border rounded-full py-2 caption text-foreground hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FcGoogle size={24} />
                Sign up with Google
              </button>

              <button
                onClick={handleSignUpWithMicrosoft}
                disabled={loading}
                className="flex items-center w-full justify-center gap-3 border border-border rounded-full py-2 caption text-foreground hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MicrosoftLogo className="w-6 h-6" />
                Sign up with Microsoft
              </button>
            </div>

            {/* OR Divider */}
            <div className="relative text-center text-gray-400 my-2">
              <span className="bg-white px-4 relative z-10">OR</span>
              <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-300" />
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {/* Full Name Field */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="fullName"
                  className="text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <div className="relative w-full">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <UserIcon size={18} />
                  </div>
                  <input
                    {...register("fullName")}
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full h-[49px] border border-input rounded-md outline-none placeholder-muted-foreground text-sm focus:ring-2 focus:ring-ring pl-10 pr-4"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-xs text-left mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="relative w-full">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <MailIcon size={18} />
                  </div>
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full h-[49px] border border-input rounded-md outline-none placeholder-muted-foreground text-sm focus:ring-2 focus:ring-ring pl-10 pr-4"
                    autoComplete="username"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs text-left mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative w-full">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <LockIcon size={18} />
                  </div>
                  <input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create your password"
                    className="w-full h-[49px] border border-input rounded-md outline-none placeholder-muted-foreground text-sm focus:ring-2 focus:ring-ring pl-10 pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
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
                        className={`h-2 rounded transition-all duration-300 ${strengthColors[strength]}`}
                        style={{
                          width: `${(strength / requirements.length) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="text-xs mt-1 text-gray-600">
                      {password ? strengthLabels[strength] : "Enter a password"}
                    </div>
                    {/* Detailed requirements checklist */}
                    <ul className="mt-2 text-xs text-gray-600 space-y-1">
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

              {/* Display error messages */}
              {(error || errors.root) && (
                <div className="text-red-500 text-sm text-left">
                  {error || errors.root?.message}
                </div>
              )}

              {/* Submit Button */}
              <FoundlyButton
                text={loading ? "Processing..." : "Continue"}
                className="w-full"
                as="button"
                type="submit"
                disabled={loading}
              />
            </form>

            {/* Sign-in Link */}
            <p className="text-sm text-center text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="text-[#00B5C3] hover:underline">
                Login
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-0 flex justify-center">
            <AuthFooter />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
