import { useCallback } from "react"; // Import useCallback
import { useAuth } from "@clerk/nextjs";

// Custom hook for authenticated API calls
export function useApiCall() {
  // Get API url from env or default to localhost
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

  const { getToken } = useAuth();

  const callAPI = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const token = await getToken();

      return fetch(`${apiUrl}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    },
    [apiUrl, getToken]
  ); // Dependencies for useCallback

  // GET request
  const get = useCallback(
    async (endpoint: string) => {
      return callAPI(endpoint, { method: "GET" });
    },
    [callAPI]
  ); // Depends on callAPI

  // POST request
  const post = useCallback(
    async (endpoint: string, data?: unknown) => {
      return callAPI(endpoint, {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [callAPI]
  ); // Depends on callAPI

  // PUT request
  const put = useCallback(
    async (endpoint: string, data?: unknown) => {
      return callAPI(endpoint, {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [callAPI]
  ); // Depends on callAPI

  // DELETE request
  const del = useCallback(
    async (endpoint: string) => {
      return callAPI(endpoint, { method: "DELETE" });
    },
    [callAPI]
  ); // Depends on callAPI

  return { callAPI, get, post, put, delete: del };
}
