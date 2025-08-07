"use client";

import React from "react";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ShieldIcon,
  AlertCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";

import AuthLayout from "@/admin/components/authentication/AuthLayout";
import AuthHeader from "@/admin/components/authentication/AuthHeader";
import FoundlyButton from "@/admin/components/custom/FoundlyButton";
import AuthBackButton from "@/admin/components/authentication/AuthBackButton";
import { Input } from "@/admin/components/ui/input";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const topBar = (
    <div className="flex justify-between items-center w-full">
      <AuthBackButton href="https://foundlyhq.com/" />
      <button className="caption text-muted-foreground hover:underline flex items-center gap-1">
        <ShieldIcon size={16} /> Admin Support
      </button>
    </div>
  );

  return (
    <AuthLayout topBar={topBar}>
      <div className="px-4 pt-8 pb-8 md:flex md:items-center md:justify-center md:pt-0 md:pb-0 min-h-[calc(100vh-9rem)]">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
          <AuthHeader
            title="Admin Portal"
            subtitle="Please enter your Foundly team credentials"
          />

          {/* Domain Restriction Notice */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircleIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Team Access Only</p>
                <p>
                  Only <strong>@foundlyhq.com</strong> email addresses can
                  access this admin portal.
                </p>
              </div>
            </div>
          </div>

          <SignIn.Root>
            <Clerk.Loading>
              {(isGlobalLoading) => (
                <SignIn.Step name="start">
                  <div className="flex flex-col gap-y-4 w-full mb-4">
                    <Clerk.GlobalError className="text-sm text-red-500 text-center" />

                    {/* Email Field */}
                    <div className="mt-4">
                      <Clerk.Field name="identifier">
                        <Clerk.Label className="text-sm font-medium text-gray-800 mb-1 block">
                          Email
                        </Clerk.Label>
                        <div className="relative w-full">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <MailIcon size={18} />
                          </div>
                          <Clerk.Input type="email" required asChild>
                            <Input
                              placeholder="your.name@foundlyhq.com"
                              className="pl-10 pr-4 h-[49px]"
                              disabled={isGlobalLoading}
                            />
                          </Clerk.Input>
                        </div>
                        <Clerk.FieldError className="text-xs text-red-500 mt-1 block" />
                      </Clerk.Field>
                    </div>

                    {/* Password Field */}
                    <div>
                      <Clerk.Field name="password">
                        <Clerk.Label className="text-sm font-medium text-gray-800 mb-1 block">
                          Password
                        </Clerk.Label>
                        <div className="relative w-full">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <LockIcon size={18} />
                          </div>
                          <Clerk.Input
                            type={showPassword ? "text" : "password"}
                            required
                            asChild
                          >
                            <Input
                              placeholder="Enter your admin password"
                              className="pl-10 pr-10 h-[49px]"
                              disabled={isGlobalLoading}
                            />
                          </Clerk.Input>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            tabIndex={-1}
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
                        <Clerk.FieldError className="text-xs text-red-500 mt-1 block" />
                      </Clerk.Field>
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right text-sm text-[#00B5C3] hover:underline cursor-pointer">
                      <Link href="/forgot-password">Forgot password?</Link>
                    </div>

                    {/* Log In Button */}
                    <SignIn.Action submit asChild>
                      <FoundlyButton
                        as="button"
                        type="submit"
                        disabled={isGlobalLoading}
                        className="w-full"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Clerk.Loading>
                            {(isLoading) =>
                              isLoading ? "Signing In..." : "Admin Sign In"
                            }
                          </Clerk.Loading>
                        </div>
                      </FoundlyButton>
                    </SignIn.Action>

                    <div id="clerk-captcha" />
                  </div>
                </SignIn.Step>
              )}
            </Clerk.Loading>

            {/* Verification Steps */}
            <SignIn.Step name="verifications">
              <SignIn.Strategy name="email_code">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">Check your email</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      We sent a verification code to your email address
                    </p>
                  </div>

                  <Clerk.Field name="code">
                    <Clerk.Label className="text-sm font-medium text-gray-800 mb-1 block">
                      Verification Code
                    </Clerk.Label>
                    <Clerk.Input type="text" required asChild>
                      <Input
                        placeholder="Enter verification code"
                        className="h-[49px] text-center tracking-widest"
                      />
                    </Clerk.Input>
                    <Clerk.FieldError className="text-xs text-red-500 mt-1 block" />
                  </Clerk.Field>

                  <SignIn.Action submit asChild>
                    <FoundlyButton as="button" type="submit" className="w-full">
                      <Clerk.Loading>
                        {(isLoading) =>
                          isLoading ? "Verifying..." : "Verify Code"
                        }
                      </Clerk.Loading>
                    </FoundlyButton>
                  </SignIn.Action>
                </div>
              </SignIn.Strategy>

              <SignIn.Strategy name="password">
                <div className="space-y-4">
                  <Clerk.Field name="password">
                    <Clerk.Label className="text-sm font-medium text-gray-800 mb-1 block">
                      Password
                    </Clerk.Label>
                    <div className="relative w-full">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <LockIcon size={18} />
                      </div>
                      <Clerk.Input type="password" required asChild>
                        <Input
                          placeholder="Enter your password"
                          className="pl-10 pr-4 h-[49px]"
                        />
                      </Clerk.Input>
                    </div>
                    <Clerk.FieldError className="text-xs text-red-500 mt-1 block" />
                  </Clerk.Field>

                  <SignIn.Action submit asChild>
                    <FoundlyButton as="button" type="submit" className="w-full">
                      <Clerk.Loading>
                        {(isLoading) =>
                          isLoading ? "Signing In..." : "Sign In"
                        }
                      </Clerk.Loading>
                    </FoundlyButton>
                  </SignIn.Action>
                </div>
              </SignIn.Strategy>
            </SignIn.Step>
          </SignIn.Root>

          {/* Footer Note */}
          <p className="text-xs text-center text-gray-500 mt-6">
            This is a secure admin portal restricted to Foundly team members.
            Only authorized personnel with @foundlyhq.com email addresses should
            access this system.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
