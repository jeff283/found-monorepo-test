import { ZodError } from "zod";
import { ValidationErrorResponse } from "./types";

// Convert Zod validation errors to a user-friendly format
export function formatValidationErrors(
  error: ZodError
): ValidationErrorResponse {
  const validationErrors = error.issues.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));

  return {
    error: "Validation failed",
    validationErrors,
    details: error.issues,
  };
}

// Generic validation result handler
export function handleValidationResult<T>(
  result: { success: boolean; data?: T; error?: ZodError },
  context: string = "Data validation"
):
  | { success: true; data: T }
  | { success: false; error: ValidationErrorResponse } {
  if (result.success && result.data) {
    return { success: true, data: result.data };
  }

  const errorResponse = result.error
    ? formatValidationErrors(result.error)
    : {
        error: `${context} failed`,
        validationErrors: [
          { field: "unknown", message: "Unknown validation error" },
        ],
      };

  return { success: false, error: errorResponse };
}

// Sanitize data by removing undefined/null values
export function sanitizeData<T extends Record<string, any>>(
  data: T
): Partial<T> {
  const sanitized: Partial<T> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      sanitized[key as keyof T] = value;
    }
  });

  return sanitized;
}

// Deep merge utility for updating nested objects
export function mergeDeep<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  Object.entries(source).forEach(([key, value]) => {
    if (value !== undefined) {
      result[key as keyof T] = value as T[keyof T];
    }
  });

  return result;
}

// Safe JSON parsing with error handling
export function safeJsonParse<T = any>(
  jsonString: string
): { success: true; data: T } | { success: false; error: string } {
  try {
    const data = JSON.parse(jsonString);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Invalid JSON format",
    };
  }
}

// Environment variable validation (for Node.js environments)
export function validateRequiredEnvVars(
  vars: string[],
  env?: Record<string, string | undefined>
): void {
  const envSource = env || {};
  const missing = vars.filter((varName) => !envSource[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

// Rate limiting utilities (for future use)
export function createRateLimitKey(userId: string, action: string): string {
  return `rate_limit:${userId}:${action}`;
}

// Generate unique identifiers
export function generateId(prefix?: string): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2);
  return prefix
    ? `${prefix}_${timestamp}_${randomStr}`
    : `${timestamp}_${randomStr}`;
}

// Time utilities
export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export function isExpired(
  timestamp: string,
  expirationMinutes: number
): boolean {
  const created = new Date(timestamp);
  const expiry = addMinutes(created, expirationMinutes);
  return new Date() > expiry;
}
