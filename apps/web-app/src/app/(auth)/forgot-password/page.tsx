"use client";

import { MailIcon, LockIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

import AuthLayout from "@/components/authentication/AuthLayout";
import AuthHeader from "@/components/authentication/AuthHeader";
import FoundlyButton from "@/components/authentication/FoundlyButton";
import AuthBackButton from "@/components/authentication/AuthBackButton";
import AuthFooter from "@/components/authentication/AuthFooter";
import { Button } from "@/components/ui/button";
import { BeatLoader } from "react-spinners";

interface ForgotPasswordFormData {
  email: string;
}

interface ResetPasswordFormData {
  code: string;
  password: string;
  confirmPassword: string;
}

type FormStep = "request" | "verify" | "success";

interface ClerkError {
  code?: string;
  message: string;
  meta?: {
    paramName?: string;
  };
}

interface ClerkAPIError {
  errors?: ClerkError[];
  message?: string;
}

export default function ForgotPasswordPage() {
  const { isLoaded, signIn } = useSignIn();
  const router = useRouter();
  const [step, setStep] = useState<FormStep>("request");
  const [email, setEmail] = useState("");

  // Form for email input
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    setError: setEmailError,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
  } = useForm<ForgotPasswordFormData>();

  // Form for reset code and new password
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    setError: setResetError,
    watch,
    formState: { errors: resetErrors, isSubmitting: isResetSubmitting },
  } = useForm<ResetPasswordFormData>();

  const password = watch("password");

  // Step 1: Request password reset
  const onSubmitEmail: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    if (!isLoaded) return;

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      });

      setEmail(data.email);
      setStep("verify");
    } catch (err: unknown) {
      console.error("Password reset request error:", err);

      const error = err as ClerkAPIError;
      if (error.errors) {
        error.errors.forEach((error: ClerkError) => {
          if (error.meta?.paramName === "identifier") {
            setEmailError("email", {
              type: "manual",
              message: error.message,
            });
          }
        });
      } else {
        setEmailError("email", {
          type: "manual",
          message: "Failed to send reset email. Please try again.",
        });
      }
    }
  };

  // Step 2: Verify code and reset password
  const onSubmitReset: SubmitHandler<ResetPasswordFormData> = async (data) => {
    if (!isLoaded) return;

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: data.code,
        password: data.password,
      });

      if (result.status === "complete") {
        setStep("success");
      } else {
        console.log("Additional verification required:", result.status);
      }
    } catch (err: unknown) {
      console.error("Password reset error:", err);

      const error = err as ClerkAPIError;
      if (error.errors) {
        error.errors.forEach((error: ClerkError) => {
          if (error.code === "form_code_incorrect") {
            setResetError("code", {
              type: "manual",
              message: "Invalid verification code",
            });
          } else if (error.meta?.paramName === "password") {
            setResetError("password", {
              type: "manual",
              message: error.message,
            });
          }
        });
      } else {
        setResetError("code", {
          type: "manual",
          message: "Password reset failed. Please try again.",
        });
      }
    }
  };

  const handleBackToRequest = () => {
    setStep("request");
    setEmail("");
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  const renderRequestStep = () => (
    <>
      <AuthHeader
        title="Forgot Password"
        subtitle="Enter your email to receive a password reset code"
      />
      <form
        className="flex flex-col gap-y-4 w-full mb-4"
        onSubmit={handleSubmitEmail(onSubmitEmail)}
      >
        {/* Email */}
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-800 mb-1 block">
            Email
          </label>
          <div className="relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <MailIcon size={18} />
            </div>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full h-[49px] border border-input rounded-md outline-none placeholder-muted-foreground caption focus:ring-2 focus:ring-ring pl-10 pr-4"
              {...registerEmail("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email address",
                },
              })}
              disabled={isEmailSubmitting}
            />
          </div>
          {emailErrors.email && (
            <span className="text-xs text-red-500 mt-1 block">
              {emailErrors.email.message as string}
            </span>
          )}
        </div>

        {/* Send Reset Code Button */}
        <FoundlyButton
          as="button"
          type="submit"
          disabled={isEmailSubmitting || !isLoaded}
          className="w-full"
        >
          <div className="flex items-center justify-center gap-2">
            <span>{isEmailSubmitting ? "Sending..." : "Send Reset Code"}</span>
            <BeatLoader
              size={8}
              color="#ffffff"
              className="flex items-center justify-center"
              loading={isEmailSubmitting}
              aria-label="Sending reset code"
            />
          </div>
        </FoundlyButton>
      </form>

      {/* Back to Login */}
      <p className="text-sm text-center text-gray-500">
        Remember your password?{" "}
        <Link href="/login" className="text-[#00B5C3] hover:underline">
          Back to Login
        </Link>
      </p>
    </>
  );

  const renderVerifyStep = () => (
    <>
      <AuthHeader
        title="Reset Password"
        subtitle={`Enter the verification code sent to ${email}`}
      />
      <form
        className="flex flex-col gap-y-4 w-full mb-4"
        onSubmit={handleSubmitReset(onSubmitReset)}
      >
        {/* Verification Code */}
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-800 mb-1 block">
            Verification Code
          </label>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full h-[49px] border border-input rounded-md outline-none placeholder-muted-foreground caption focus:ring-2 focus:ring-ring px-4 text-center text-lg tracking-widest"
              {...registerReset("code", {
                required: "Verification code is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Code must be 6 digits",
                },
              })}
              disabled={isResetSubmitting}
            />
          </div>
          {resetErrors.code && (
            <span className="text-xs text-red-500 mt-1 block">
              {resetErrors.code.message as string}
            </span>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="text-sm font-medium text-gray-800 mb-1 block">
            New Password
          </label>
          <div className="relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <LockIcon size={18} />
            </div>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full h-[49px] border border-input rounded-md outline-none placeholder-muted-foreground caption focus:ring-2 focus:ring-ring pl-10 pr-4"
              {...registerReset("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message:
                    "Password must contain uppercase, lowercase, and number",
                },
              })}
              disabled={isResetSubmitting}
            />
          </div>
          {resetErrors.password && (
            <span className="text-xs text-red-500 mt-1 block">
              {resetErrors.password.message as string}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm font-medium text-gray-800 mb-1 block">
            Confirm Password
          </label>
          <div className="relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <LockIcon size={18} />
            </div>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full h-[49px] border border-input rounded-md outline-none placeholder-muted-foreground caption focus:ring-2 focus:ring-ring pl-10 pr-4"
              {...registerReset("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              disabled={isResetSubmitting}
            />
          </div>
          {resetErrors.confirmPassword && (
            <span className="text-xs text-red-500 mt-1 block">
              {resetErrors.confirmPassword.message as string}
            </span>
          )}
        </div>

        {/* Reset Password Button */}
        <FoundlyButton
          as="button"
          type="submit"
          disabled={isResetSubmitting || !isLoaded}
          className="w-full"
        >
          <div className="flex items-center justify-center gap-2">
            <span>{isResetSubmitting ? "Resetting..." : "Reset Password"}</span>
            <BeatLoader
              size={8}
              color="#ffffff"
              className="flex items-center justify-center"
              loading={isResetSubmitting}
              aria-label="Resetting password"
            />
          </div>
        </FoundlyButton>
      </form>

      {/* Back Button */}
      <button
        onClick={handleBackToRequest}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mx-auto"
      >
        <ArrowLeftIcon size={16} />
        Use different email
      </button>
    </>
  );

  const renderSuccessStep = () => (
    <>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Password Reset Successful
        </h1>
        <p className="text-gray-600">
          Your password has been successfully reset. You can now log in with
          your new password.
        </p>
      </div>

      <FoundlyButton as="button" onClick={handleGoToLogin} className="w-full">
        Continue to Login
      </FoundlyButton>
    </>
  );

  return (
    <AuthLayout topBar={topBar}>
      <div className="px-4 py-6 w-full max-w-md mx-auto">
        {step === "request" && renderRequestStep()}
        {step === "verify" && renderVerifyStep()}
        {step === "success" && renderSuccessStep()}

        {/* Footer */}
        <div className="mt-8">
          <AuthFooter />
        </div>
      </div>
    </AuthLayout>
  );
}

const topBar = (
  <div className="flex justify-between items-center w-full">
    <AuthBackButton />
    <Link href="mailto:support@foundlyhq.com">
      <Button
        variant="link"
        className="caption text-muted-foreground hover:underline"
      >
        Contact support
      </Button>
    </Link>
  </div>
);
