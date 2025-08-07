import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

// Custom hook for authenticated API calls to the actual API (not admin app routes)
export function useApiCall() {
  // Get API url from env or default to localhost
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

  const { getToken } = useAuth();

  const callAPI = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const token = await getToken();

      const response = await fetch(`${apiUrl}${endpoint}`, {
        ...options,
        credentials: "include", // Include cookies for session management
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = new Error(
          `HTTP error! status: ${response.status}`
        ) as Error & { status?: number };
        error.status = response.status;
        throw error;
      }

      return response;
    },
    [apiUrl, getToken]
  );

  // GET request
  const get = useCallback(
    async (endpoint: string) => {
      return callAPI(endpoint, { method: "GET" });
    },
    [callAPI]
  );

  // POST request
  const post = useCallback(
    async (endpoint: string, data?: unknown) => {
      return callAPI(endpoint, {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [callAPI]
  );

  // PUT request
  const put = useCallback(
    async (endpoint: string, data?: unknown) => {
      return callAPI(endpoint, {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [callAPI]
  );

  // DELETE request
  const del = useCallback(
    async (endpoint: string) => {
      return callAPI(endpoint, { method: "DELETE" });
    },
    [callAPI]
  );

  return { callAPI, get, post, put, delete: del };
}
