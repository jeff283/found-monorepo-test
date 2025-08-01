"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";

import { cn } from "@/lib/utils";

function FoundlyInputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="foundly-input-otp"
      containerClassName={cn(
        "flex items-center gap-4 has-disabled:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function FoundlyInputOTPGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="foundly-input-otp-group"
      className={cn("flex items-center gap-4", className)}
      {...props}
    />
  );
}

function FoundlyInputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="foundly-input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex h-16 w-16 items-center justify-center rounded-xl border-2 border-gray-200 bg-white text-xl font-semibold text-gray-900 transition-all duration-200 outline-none shadow-sm",
        "focus-within:border-[#00B5C3] focus-within:ring-2 focus-within:ring-[#00B5C3]/20 focus-within:shadow-md",
        "data-[active=true]:border-[#00B5C3] data-[active=true]:ring-2 data-[active=true]:ring-[#00B5C3]/20 data-[active=true]:shadow-md",
        "aria-invalid:border-red-500 data-[active=true]:aria-invalid:border-red-500 data-[active=true]:aria-invalid:ring-red-500/20",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50",
        "hover:border-gray-300 hover:shadow-sm",
        "data-[active=true]:z-10",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-[#00B5C3] h-6 w-0.5 duration-1000" />
        </div>
      )}
    </div>
  );
}

export { FoundlyInputOTP, FoundlyInputOTPGroup, FoundlyInputOTPSlot };
