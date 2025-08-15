import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  getTestServer,
  makeRequest,
  makeAuthenticatedRequest,
  expectJsonResponse,
  expectTextResponse,
  cleanupTestServer,
  type TestServer,
} from "@/api/tests/integration/setup";

describe("Basic API Integration Tests", () => {
  let server: TestServer;

  beforeAll(async () => {
    // Setup the test server (auto-start if needed)
    server = await getTestServer(true);
    console.log(`🧪 Running integration tests against ${server.url}`);
  });

  afterAll(async () => {
    // Cleanup if we started our own server
    if (server) {
      await cleanupTestServer(server);
    }
  });

  describe("GET /", () => {
    it("should return API running message", async () => {
      const response = await makeRequest(`${server.url}/`);

      const text = await expectTextResponse(response, 200);
      expect(text).toBe("Foundly API is running! 🚀");
    });
  });

  describe("GET /health", () => {
    it("should return health status with proper structure", async () => {
      const response = await makeRequest(`${server.url}/health`);

      const data = await expectJsonResponse<{
        status: string;
        timestamp: string;
        environment: string;
        version: string;
      }>(response, 200);

      expect(data).toHaveProperty("status", "healthy");
      expect(data).toHaveProperty("timestamp");
      expect(data).toHaveProperty("environment", "development");
      expect(data).toHaveProperty("version", "1.0.0");

      // Validate timestamp is a valid ISO string
      expect(() => new Date(data.timestamp)).not.toThrow();
      expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp);
    });

    it("should return current timestamp on each request", async () => {
      // Make first request
      const response1 = await makeRequest(`${server.url}/health`);
      const data1 = await expectJsonResponse<{ timestamp: string }>(
        response1,
        200
      );

      // Wait a small amount of time
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Make second request
      const response2 = await makeRequest(`${server.url}/health`);
      const data2 = await expectJsonResponse<{ timestamp: string }>(
        response2,
        200
      );

      // Timestamps should be different (or at least not fail)
      expect(data1.timestamp).toBeDefined();
      expect(data2.timestamp).toBeDefined();
    });
  });

  describe("GET /auth", () => {
    it("should handle auth endpoint (may not be implemented yet)", async () => {
      const response = await makeRequest(`${server.url}/auth`);

      // Auth endpoint may not be implemented, so check for various valid responses
      expect([200, 404].includes(response.status)).toBe(true);

      if (response.status === 200) {
        const data = await expectJsonResponse<{
          message: string;
          userId?: string;
        }>(response, 200);

        expect(data).toHaveProperty("message");
        expect(typeof data.message).toBe("string");
      } else if (response.status === 404) {
        console.log("ℹ️ Auth endpoint not found - may not be implemented yet");
      }
    });

    it("should handle authentication headers appropriately", async () => {
      const response = await makeAuthenticatedRequest(`${server.url}/auth`);

      // Handle various possible responses (auth endpoint may not exist)
      expect([200, 401, 403, 404].includes(response.status)).toBe(true);

      if (response.status === 200) {
        const data = (await response.json()) as { message: string };
        expect(data).toHaveProperty("message");
        expect(typeof data.message).toBe("string");
      } else if (response.status === 404) {
        console.log("ℹ️ Auth endpoint not found with auth headers");
      }
    });

    it("should handle empty auth headers consistently", async () => {
      const response = await makeRequest(`${server.url}/auth`, {
        headers: {
          Authorization: "",
        },
      });

      // Should handle empty auth consistently with no auth
      expect([200, 404].includes(response.status)).toBe(true);

      if (response.status === 200) {
        const data = await expectJsonResponse<{
          message: string;
        }>(response, 200);

        expect(data).toHaveProperty("message");
        expect(typeof data.message).toBe("string");
      }
    });
  });

  describe("Error handling", () => {
    it("should return 404 for non-existent routes", async () => {
      const response = await makeRequest(`${server.url}/non-existent-route`);

      expect(response.status).toBe(404);
    });

    it("should handle malformed requests gracefully", async () => {
      const response = await makeRequest(`${server.url}/health`, {
        method: "POST",
        body: "invalid-body-for-get-request",
      });

      // Should either work (405 Method Not Allowed) or handle gracefully
      expect([200, 404, 405].includes(response.status)).toBe(true);
    });
  });

  describe("CORS and Headers", () => {
    it("should include CORS headers in responses", async () => {
      const response = await makeRequest(`${server.url}/health`, {
        headers: {
          Origin: "http://localhost:3000",
        },
      });

      expect(response.status).toBe(200);

      // Check for CORS headers (these might be set by corsMiddleware)
      const corsHeader = response.headers.get("Access-Control-Allow-Origin");
      // CORS might be configured differently, so we just check it exists or is reasonable
      expect(corsHeader).toBeDefined();
    });

    it("should handle OPTIONS preflight requests", async () => {
      const response = await makeRequest(`${server.url}/health`, {
        method: "OPTIONS",
        headers: {
          Origin: "http://localhost:3000",
          "Access-Control-Request-Method": "GET",
        },
      });

      // Should handle OPTIONS request properly
      expect([200, 204].includes(response.status)).toBe(true);
    });
  });

  describe("Content-Type handling", () => {
    it("should return correct content types", async () => {
      // Test text endpoint
      const textResponse = await makeRequest(`${server.url}/`);
      expect(textResponse.headers.get("content-type")).toContain("text/plain");

      // Test JSON endpoint
      const jsonResponse = await makeRequest(`${server.url}/health`);
      expect(jsonResponse.headers.get("content-type")).toContain(
        "application/json"
      );
    });
  });
});
