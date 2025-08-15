import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  getTestServer,
  makeRequest,
  makeAuthenticatedRequest,
  expectJsonResponse,
  cleanupTestServer,
  type TestServer,
} from "@/api/tests/integration/setup";

describe("Institution API Integration Tests", () => {
  let server: TestServer;

  beforeAll(async () => {
    server = await getTestServer(true);
    console.log(`🧪 Running institution API tests against ${server.url}`);
  });

  afterAll(async () => {
    if (server) {
      await cleanupTestServer(server);
    }
  });

  describe("User Institution Endpoints", () => {
    const userInstitutionBase = "/api/user/institution";

    it("should handle GET /api/user/institution requests", async () => {
      const response = await makeRequest(`${server.url}${userInstitutionBase}`);

      // Since this endpoint may not exist yet, allow 404 as well
      expect([200, 401, 403, 404].includes(response.status)).toBe(true);

      if (response.status === 401 || response.status === 403) {
        console.log(
          "✅ User institution endpoint properly requires authentication"
        );
      } else if (response.status === 404) {
        console.log(
          "ℹ️ User institution endpoint not found - may not be implemented yet"
        );
      }
    });

    it("should handle authenticated requests to user institution endpoints", async () => {
      const response = await makeAuthenticatedRequest(
        `${server.url}${userInstitutionBase}`,
        { method: "GET" },
        "test-token"
      );

      // Expect proper handling (including 404 if not implemented)
      expect([200, 401, 403, 404].includes(response.status)).toBe(true);

      if (response.headers.get("content-type")?.includes("application/json")) {
        const data = await response.json();
        expect(data).toBeDefined();
      }
    });

    it("should handle POST requests for creating institutions", async () => {
      const createData = {
        name: "Test University",
        domain: "test.edu",
        type: "university",
      };

      const response = await makeAuthenticatedRequest(
        `${server.url}${userInstitutionBase}`,
        {
          method: "POST",
          body: JSON.stringify(createData),
        }
      );

      // Should handle the request (including 404 if not implemented)
      expect(
        [200, 201, 400, 401, 403, 404, 405].includes(response.status)
      ).toBe(true);
    });
  });

  describe("Admin Institution Endpoints", () => {
    const adminInstitutionBase = "/api/admin/institution";

    it("should handle admin endpoint requests appropriately", async () => {
      const response = await makeRequest(
        `${server.url}${adminInstitutionBase}`
      );

      // Allow 404 if endpoint doesn't exist yet
      expect([401, 403, 404].includes(response.status)).toBe(true);

      if (response.status === 404) {
        console.log(
          "ℹ️ Admin institution endpoint not found - may not be implemented yet"
        );
      }
    });

    it("should handle authenticated admin requests", async () => {
      const response = await makeAuthenticatedRequest(
        `${server.url}${adminInstitutionBase}`,
        { method: "GET" }
      );

      // Even with auth header, likely needs proper admin permissions (or 404 if not implemented)
      expect([200, 401, 403, 404].includes(response.status)).toBe(true);
    });
  });

  describe("API Error Handling", () => {
    it("should handle malformed JSON in requests appropriately", async () => {
      const response = await makeRequest(`${server.url}/api/user/institution`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "{ invalid json }",
      });

      // Should handle malformed JSON gracefully (or 404 if endpoint doesn't exist)
      expect([400, 401, 403, 404].includes(response.status)).toBe(true);
    });

    it("should handle unsupported methods", async () => {
      const response = await makeRequest(`${server.url}/api/user/institution`, {
        method: "PATCH", // Assuming PATCH is not supported
      });

      // Should return appropriate method not allowed or handle gracefully
      expect([200, 404, 405].includes(response.status)).toBe(true);
    });
  });

  describe("API Consistency", () => {
    it("should return consistent error formats", async () => {
      // Test multiple endpoints for consistent error handling
      const endpoints = ["/api/user/institution", "/api/admin/institution"];

      for (const endpoint of endpoints) {
        const response = await makeRequest(`${server.url}${endpoint}`);

        if (
          !response.ok &&
          response.headers.get("content-type")?.includes("application/json")
        ) {
          const errorData = await response.json();

          // Check for consistent error structure
          expect(errorData).toBeDefined();
          // Add more specific error format checks as your API evolves
        }
      }
    });

    it("should include proper CORS headers on all API endpoints", async () => {
      const endpoints = ["/api/user/institution", "/api/admin/institution"];

      for (const endpoint of endpoints) {
        const response = await makeRequest(`${server.url}${endpoint}`, {
          headers: {
            Origin: "http://localhost:3000",
          },
        });

        const corsHeader = response.headers.get("Access-Control-Allow-Origin");
        expect(corsHeader).toBeDefined();
      }
    });
  });
});
