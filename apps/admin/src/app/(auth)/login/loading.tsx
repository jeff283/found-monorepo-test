import { ShieldIcon } from "lucide-react";
import AuthLayout from "@/admin/components/authentication/AuthLayout";
import AuthBackButton from "@/admin/components/authentication/AuthBackButton";
import { Skeleton } from "@/admin/components/ui/skeleton";

export default function Loading() {
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
          {/* Header Skeleton */}
          <div className="flex flex-col items-center text-center mb-6">
            <Skeleton className="w-12 h-12 rounded-lg mb-2" />
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Form Skeleton */}
          <div className="flex flex-col gap-y-4 w-full mb-4">
            {/* Email Field Skeleton */}
            <div className="mt-4">
              <Skeleton className="h-4 w-12 mb-2" />
              <Skeleton className="h-[49px] w-full rounded-md" />
            </div>

            {/* Password Field Skeleton */}
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-[49px] w-full rounded-md" />
            </div>

            {/* Forgot Password Link Skeleton */}
            <div className="text-right">
              <Skeleton className="h-4 w-24 ml-auto" />
            </div>

            {/* Login Button Skeleton */}
            <Skeleton className="h-12 w-full rounded-full" />
          </div>

          {/* Footer Note Skeleton */}
          <div className="flex justify-center mt-6">
            <Skeleton className="h-3 w-80" />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
