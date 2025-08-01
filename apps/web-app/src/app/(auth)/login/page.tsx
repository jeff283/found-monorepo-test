"use client";

import React, { useState } from "react";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  PhoneIcon,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { BeatLoader } from "react-spinners";
import { useSignIn, useAuth } from "@clerk/nextjs";

import AuthLayout from "@/components/authentication/AuthLayout";
import AuthHeader from "@/components/authentication/AuthHeader";
import FoundlyButton from "@/components/authentication/FoundlyButton";
import AuthBackButton from "@/components/authentication/AuthBackButton";
import SocialLoginButton from "@/components/authentication/SocialLoginButton";
import AuthFooter from "@/components/authentication/AuthFooter";
import MicrosoftLogo from "@/components/microsoft-logo";

interface LoginFormData {
  email: string;
  password: string;
}

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

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(
    null
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  // Redirect if already signed in
  if (isSignedIn) {
    router.push("/institution/dashboard");
    return null;
  }

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    if (!isLoaded) return;

    // Clear any previous verification message
    setVerificationMessage(null);

    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/institution/dashboard");
      } else {
        // Handle additional verification steps based on status
        switch (signInAttempt.status) {
          case "needs_first_factor":
            const message1 =
              "Additional verification required. Please check your email or phone for a verification code.";
            setVerificationMessage(message1);
            setError("email", { type: "manual", message: message1 });
            break;

          case "needs_second_factor":
            const message2 =
              "Two-factor authentication required. Please enter your 2FA code.";
            setVerificationMessage(message2);
            setError("email", { type: "manual", message: message2 });
            break;

          case "needs_identifier":
            const message3 = "Please verify your identity to continue.";
            setVerificationMessage(message3);
            setError("email", { type: "manual", message: message3 });
            break;

          case "needs_new_password":
            const message4 = "You need to set a new password to continue.";
            setVerificationMessage(message4);
            setError("password", { type: "manual", message: message4 });
            break;

          default:
            console.log(
              "Additional verification required:",
              signInAttempt.status
            );
            const defaultMessage =
              "Additional verification required. Please complete the verification process.";
            setVerificationMessage(defaultMessage);
            setError("email", { type: "manual", message: defaultMessage });
        }
      }
    } catch (err: unknown) {
      console.error("Login error:", err);

      const error = err as ClerkAPIError;
      // Handle Clerk-specific errors and map them to react-hook-form
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((error: ClerkError) => {
          const fieldName = error.meta?.paramName;

          if (fieldName === "identifier") {
            setError("email", {
              type: "manual",
              message: error.message || "Invalid email address",
            });
          } else if (fieldName === "password") {
            setError("password", {
              type: "manual",
              message: error.message || "Invalid password",
            });
          } else {
            // For general errors, show on email field
            setError("email", {
              type: "manual",
              message: error.message || "Authentication failed",
            });
          }
        });
      } else {
        // Generic error fallback
        setError("email", {
          type: "manual",
          message: "Login failed. Please check your credentials and try again.",
        });
      }
    }
  };

  const handleSocialLogin = async (
    strategy: "oauth_google" | "oauth_microsoft"
  ) => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/institution/dashboard",
      });
    } catch (err: unknown) {
      console.error("Social login error:", err);
    }
  };

  const handleSignWithGoogle = () => {
    handleSocialLogin("oauth_google");
  };

  const handleSignWithMicrosoft = () => {
    handleSocialLogin("oauth_microsoft");
  };

  const topBar = (
    <div className="flex justify-between items-center w-full">
      <AuthBackButton href="https://foundlyhq.com/" />
      <button className="caption text-muted-foreground hover:underline flex items-center gap-1">
        <PhoneIcon size={16} /> Contact support
      </button>
    </div>
  );

  return (
    <AuthLayout topBar={topBar}>
      <div className="px-4 pt-8 pb-8 md:flex md:items-center md:justify-center md:pt-0 md:pb-0 min-h-[calc(100vh-9rem)]">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
          <AuthHeader
            title="Welcome to Foundly"
            subtitle="Please enter your details"
          />

          {/* Verification Message */}
          {verificationMessage && (
            <div className="m-4 p-3 bg-primary/5 border border-primary/30 rounded-md text-center font-medium">
              <p className="text-sm text-secondary">{verificationMessage}</p>
            </div>
          )}

          <form
            className="flex flex-col gap-y-4 w-full mb-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email Field */}
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
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email address",
                    },
                  })}
                  disabled={isSubmitting || !isLoaded}
                />
              </div>
              {errors.email && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="text-sm font-medium text-gray-800 mb-1 block">
                Password
              </label>
              <div className="relative w-full">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <LockIcon size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full h-[49px] border border-input rounded-md outline-none placeholder-muted-foreground caption focus:ring-2 focus:ring-ring pl-10 pr-10"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 4,
                      message: "Password must be at least 4 characters",
                    },
                  })}
                  disabled={isSubmitting || !isLoaded}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon size={18} />
                  ) : (
                    <EyeIcon size={18} />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right text-sm text-[#00B5C3] hover:underline cursor-pointer">
              <Link href="/forgot-password">Forgot password?</Link>
            </div>

            {/* Log In Button */}
            <FoundlyButton
              as="button"
              type="submit"
              disabled={isSubmitting || !isLoaded}
              className="w-full"
            >
              <div className="flex items-center justify-center gap-2">
                <span>{isSubmitting ? "Logging In" : "Log in"}</span>
                <BeatLoader
                  size={8}
                  color="#ffffff"
                  loading={isSubmitting}
                  aria-label="Submitting your information"
                />
              </div>
            </FoundlyButton>
            <div id="clerk-captcha" />
          </form>

          {/* Sign Up Link */}
          <p className="text-sm text-center text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#00B5C3] hover:underline">
              Sign Up
            </Link>
          </p>

          {/* Divider */}
          <div className="relative text-center text-gray-400 my-4 sm:my-6">
            <span className="bg-white px-4 relative z-10">OR</span>
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-300" />
          </div>

          {/* Social Logins */}
          <SocialLoginButton
            icon={FcGoogle}
            text="Log in with Google"
            onClick={handleSignWithGoogle}
          />
          <SocialLoginButton
            icon={MicrosoftLogo}
            text="Log in with Microsoft"
            onClick={handleSignWithMicrosoft}
          />

          {/* Footer */}
          <div className="mt-8">
            <AuthFooter />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
