"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSignUp, useUser } from "@clerk/nextjs";

import AuthLayout from "@/components/authentication/AuthLayout";
import AuthHeader from "@/components/authentication/AuthHeader";
import AuthBackButton from "@/components/authentication/AuthBackButton";
import { PhoneIcon } from "lucide-react";
import FoundlyButton from "@/components/authentication/FoundlyButton";
import AuthFooter from "@/components/authentication/AuthFooter";
import {
  FoundlyInputOTP,
  FoundlyInputOTPGroup,
  FoundlyInputOTPSlot,
} from "@/components/authentication/FoundlyInputOTP";
import {
  showSuccessToast,
  withErrorHandling,
} from "@/utils/auth-error-handler";

// Zod schema for OTP validation - changed to 6 digits to match Clerk's default
const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "Verification code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Verification code must contain only numbers"),
});

type OtpFormData = z.infer<typeof otpSchema>;

const IndividualVerificationContent = () => {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { user } = useUser();

  // Get user data from Clerk session instead of URL parameters
  const email = user?.emailAddresses[0]?.emailAddress || "";

  const [seconds, setSeconds] = useState(132);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // React Hook Form setup
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError: setFormError,
    clearErrors,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const otpValue = watch("otp") || "";

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const onSubmit = async (data: OtpFormData) => {
    if (!isLoaded || !signUp) return;

    setLoading(true);
    clearErrors("otp");

    const { data: result, error } = await withErrorHandling(async () => {
      // Attempt email verification with Clerk
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: data.otp,
      });

      if (completeSignUp.status === "complete") {
        // Set the session as active
        await setActive({ session: completeSignUp.createdSessionId });
        return completeSignUp;
      } else {
        // If verification is not complete, throw error
        throw new Error("verification_invalid");
      }
    }, "email verification");

    if (error) {
      setFormError("otp", {
        type: "manual",
        message: error,
      });
    } else if (result) {
      showSuccessToast("Verification successful! Redirecting...");
      setTimeout(() => {
        // Navigate to individual dashboard or onboarding
        // Temporarily redirecting to report lost page
        // Replace with actual dashboard or onboarding page later
        router.push("/report-lost");
      }, 1200);
    }

    setLoading(false);
  };

  const handleResend = async () => {
    if (!isLoaded || !signUp) return;

    setResendLoading(true);

    const { error } = await withErrorHandling(async () => {
      // Resend verification email with Clerk
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    }, "resend verification code");

    if (error) {
      // Error is already handled by withErrorHandling (toast shown)
    } else {
      setSeconds(132);
      showSuccessToast("A new code has been sent to your email.");
      clearErrors("otp");
    }

    setResendLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full max-w-[432px] flex flex-col justify-center gap-10 text-center mx-auto min-h-[70vh]">
        {/* Header */}
        <div className="flex flex-col gap-2 items-center">
          <AuthHeader title="Verify your email" />
          <p className="text-sm text-muted-foreground">
            Check the verification code we sent to <br />
            <span className="font-medium text-black">
              {email || "your email"}
            </span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center w-full max-w-[440px] mx-auto">
          <FoundlyInputOTP
            maxLength={6}
            value={otpValue}
            onChange={(value: string) => {
              setValue("otp", value);
              clearErrors("otp");
            }}
            disabled={loading}
          >
            <FoundlyInputOTPGroup>
              <FoundlyInputOTPSlot index={0} />
              <FoundlyInputOTPSlot index={1} />
              <FoundlyInputOTPSlot index={2} />
              <FoundlyInputOTPSlot index={3} />
              <FoundlyInputOTPSlot index={4} />
              <FoundlyInputOTPSlot index={5} />
            </FoundlyInputOTPGroup>
          </FoundlyInputOTP>
        </div>

        {/* Error */}
        {errors.otp && (
          <div className="text-red-500 text-sm mt-2">{errors.otp.message}</div>
        )}

        {/* Countdown & Resend */}
        <div className="text-sm text-muted-foreground space-y-2 flex flex-col items-center">
          <p>
            Code expires in{" "}
            <span className="text-black font-medium">
              {formatTime(seconds)}
            </span>
          </p>
          <p>
            You did not receive an OTP?{" "}
            <button
              type="button"
              className="text-[#00B5C3] hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleResend}
              disabled={seconds > 120 || resendLoading}
            >
              {resendLoading ? "Sending..." : "Resend code"}
            </button>
          </p>
        </div>

        {/* Continue Button */}
        <div className="w-full flex justify-center">
          <FoundlyButton
            text={loading ? "Verifying..." : "Continue"}
            className="w-full max-w-[300px]"
            as="button"
            type="submit"
            disabled={loading || otpValue.length !== 6}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-center">
          <AuthFooter />
        </div>
      </div>
    </form>
  );
};

const topBar = (
  <div className="flex justify-between items-center w-full">
    <AuthBackButton href="/signup/individual" />
    <button className="caption text-muted-foreground hover:underline flex items-center gap-1">
      <PhoneIcon size={16} className="inline-block mr-1" />
      Contact support
    </button>
  </div>
);

export default function IndividualVerificationPage() {
  return (
    <AuthLayout topBar={topBar}>
      <div className="min-h-screen flex items-center justify-center px-4">
        <Suspense>
          <IndividualVerificationContent />
        </Suspense>
      </div>
    </AuthLayout>
  );
}
