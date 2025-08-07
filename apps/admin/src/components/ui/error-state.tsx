"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/admin/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the data. Please try again.",
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          disabled={isRetrying}
          variant="outline"
          className="inline-flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
          />
          {isRetrying ? "Retrying..." : "Try Again"}
        </Button>
      )}
    </div>
  );
}
