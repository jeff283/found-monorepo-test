import { toast } from "sonner";

// Clerk Error Types
interface ClerkError {
  code: string;
  message: string;
  longMessage?: string;
}

interface ClerkAPIResponseError {
  errors: ClerkError[];
}

// Type guard for Clerk API response errors
export function isClerkAPIResponseError(
  err: unknown
): err is ClerkAPIResponseError {
  return (
    typeof err === "object" &&
    err !== null &&
    "errors" in err &&
    Array.isArray((err as Record<string, unknown>).errors)
  );
}

// Common error messages for better UX
const CLERK_ERROR_MESSAGES = {
  // Authentication errors
  authentication_invalid:
    "Invalid credentials. Please check your email and password.",
  user_locked:
    "Your account has been temporarily locked. Please try again later.",
  signin_blocked: "Sign in is currently blocked. Please contact support.",
  password_invalid: "Invalid password. Please try again.",
  email_not_found: "No account found with this email address.",
  verification_expired:
    "Verification code has expired. Please request a new one.",
  verification_failed: "Invalid verification code. Please try again.",
  verification_invalid: "Invalid verification code. Please try again.",
  too_many_requests:
    "Too many requests. Please wait a moment before trying again.",

  // Account creation errors
  email_already_exists:
    "An account with this email already exists. Please sign in instead.",
  identifier_already_exists:
    "This email is already registered. Please use a different email.",
  password_too_short: "Password must be at least 8 characters long.",
  password_too_common:
    "This password is too common. Please choose a stronger password.",
  email_invalid: "Please enter a valid email address.",

  // Organization errors
  organization_invitation_invalid: "Invalid organization invitation.",
  organization_not_found: "Organization not found.",
  organization_already_exists: "An organization with this name already exists.",

  // Rate limiting
  rate_limit_exceeded: "Too many attempts. Please wait before trying again.",

  // Generic fallback
  generic: "An unexpected error occurred. Please try again.",
} as const;

// Supabase Error Types
interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

// Common Supabase error codes and messages
const SUPABASE_ERROR_MESSAGES = {
  // Database errors
  "23505": "This email is already registered. Please use a different email.",
  "23503": "Invalid reference data. Please check your input.",
  "42501": "Insufficient permissions to perform this operation.",
  "42P01": "Database table not found. Please contact support.",

  // Connection errors
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  TIMEOUT: "Request timed out. Please try again.",

  // Auth errors
  SIGNUP_DISABLED: "Account registration is currently disabled.",
  EMAIL_NOT_CONFIRMED: "Please verify your email address before continuing.",
  INVALID_CREDENTIALS: "Invalid email or password.",

  // Generic fallback
  generic: "A database error occurred. Please try again.",
} as const;

/**
 * Handle Clerk authentication errors with user-friendly messages
 */
export function handleClerkError(error: unknown): string {
  console.error("Clerk error:", error);

  // Handle ClerkAPIError
  if (isClerkAPIResponseError(error)) {
    const firstError = error.errors[0];
    if (firstError) {
      const errorCode = firstError.code as keyof typeof CLERK_ERROR_MESSAGES;
      const message =
        CLERK_ERROR_MESSAGES[errorCode] ||
        firstError.longMessage ||
        firstError.message;
      return message;
    }
  }

  // Handle string error codes
  if (typeof error === "string") {
    const errorCode = error as keyof typeof CLERK_ERROR_MESSAGES;
    return CLERK_ERROR_MESSAGES[errorCode] || CLERK_ERROR_MESSAGES.generic;
  }

  // Handle error objects with message
  if (error && typeof error === "object" && "message" in error) {
    // Check if the message matches any known error codes
    const errorMessage = (error as { message: string }).message;
    for (const [code, message] of Object.entries(CLERK_ERROR_MESSAGES)) {
      if (errorMessage.toLowerCase().includes(code.toLowerCase())) {
        return message;
      }
    }
    return errorMessage;
  }

  return CLERK_ERROR_MESSAGES.generic;
}

/**
 * Handle Supabase database errors with user-friendly messages
 */
export function handleSupabaseError(error: SupabaseError): string {
  console.error("Supabase error:", error);

  // Handle PostgreSQL error codes
  if (error.code) {
    const errorCode = error.code as keyof typeof SUPABASE_ERROR_MESSAGES;
    if (SUPABASE_ERROR_MESSAGES[errorCode]) {
      return SUPABASE_ERROR_MESSAGES[errorCode];
    }
  }

  // Handle common error message patterns
  const message = error.message?.toLowerCase() || "";

  if (message.includes("duplicate") || message.includes("already exists")) {
    return SUPABASE_ERROR_MESSAGES["23505"];
  }

  if (message.includes("network") || message.includes("connection")) {
    return SUPABASE_ERROR_MESSAGES.NETWORK_ERROR;
  }

  if (message.includes("timeout")) {
    return SUPABASE_ERROR_MESSAGES.TIMEOUT;
  }

  if (message.includes("permission") || message.includes("unauthorized")) {
    return SUPABASE_ERROR_MESSAGES["42501"];
  }

  // Return the original message if it's user-friendly, otherwise use generic
  if (
    error.message &&
    error.message.length < 100 &&
    !error.message.includes("Error:")
  ) {
    return error.message;
  }

  return SUPABASE_ERROR_MESSAGES.generic;
}

/**
 * Show error toast with consistent styling
 */
export function showErrorToast(message: string) {
  toast.error(message, {
    duration: 5000,
    position: "top-center",
  });
}

/**
 * Show success toast with consistent styling
 */
export function showSuccessToast(message: string) {
  toast.success(message, {
    duration: 4000,
    position: "top-center",
  });
}

/**
 * Comprehensive error handler for authentication operations
 */
export function handleAuthError(error: unknown) {
  let errorMessage: string;

  // Determine error type and get appropriate message
  if (isClerkAPIResponseError(error)) {
    errorMessage = handleClerkError(error);
  } else if (
    error &&
    typeof error === "object" &&
    ("code" in error || "message" in error)
  ) {
    // Assume Supabase error if it has code or message properties
    errorMessage = handleSupabaseError(error as SupabaseError);
  } else {
    errorMessage = handleClerkError(error);
  }

  // Show error toast
  showErrorToast(errorMessage);

  // Return the error message for additional handling if needed
  return errorMessage;
}

/**
 * Wrapper for async operations with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  operationName: string = "operation"
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    console.error(`Error in ${operationName}:`, error);
    const errorMessage = handleAuthError(error);
    return { data: null, error: errorMessage };
  }
}
