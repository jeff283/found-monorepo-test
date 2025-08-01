import { vi, beforeEach } from "vitest";

// Test environment variables
const TestEnvVariables = {
  CLERK_SECRET_KEY: "TEST_API_KEY",
  CLERK_PUBLISHABLE_KEY: "TEST_API_KEY",
};

// Mock for authenticateRequest function
export const authenticateRequestMock = vi.fn();

// Current auth state for mocking
let currentAuthState: any = { userId: null };

// Mock the @clerk/backend module
vi.mock("@clerk/backend", async (importOriginal) => {
  const original = (await importOriginal()) as any;

  return {
    ...original,
    createClerkClient(options: any) {
      const client = original.createClerkClient(options);
      vi.spyOn(client, "authenticateRequest").mockImplementation(
        authenticateRequestMock
      );
      return client;
    },
  };
});

// Mock the @hono/clerk-auth module entirely
vi.mock("@hono/clerk-auth", () => ({
  clerkMiddleware: () => {
    return async (c: any, next: any) => {
      // Set up mock auth context
      c.set("clerkAuth", () => currentAuthState);
      c.set("clerk", {
        authenticateRequest: authenticateRequestMock,
      });
      await next();
    };
  },
  getAuth: (c: any) => {
    const authFn = c.get("clerkAuth");
    return authFn ? authFn() : currentAuthState;
  },
}));

// Setup environment variables before each test
beforeEach(() => {
  // Reset the mock before each test
  authenticateRequestMock.mockReset();

  // Reset auth state
  currentAuthState = { userId: null };

  // Set up default mock response
  authenticateRequestMock.mockResolvedValue({
    headers: new Headers(),
    toAuth: () => currentAuthState,
  });
});

// Helper function to mock successful authentication
export const mockSuccessfulAuth = (
  userId = "test-user-123",
  sessionClaims = {}
) => {
  currentAuthState = {
    userId,
    sessionId: "test-session-123",
    sessionClaims: {
      email: "test@example.com",
      ...sessionClaims,
    },
    has: () => true,
    ...sessionClaims,
  };

  authenticateRequestMock.mockResolvedValueOnce({
    headers: new Headers(),
    toAuth: () => currentAuthState,
  });
};

// Helper function to mock unauthenticated state
export const mockUnauthenticated = () => {
  currentAuthState = {
    userId: null,
    sessionId: null,
    sessionClaims: null,
  };

  authenticateRequestMock.mockResolvedValueOnce({
    headers: new Headers(),
    toAuth: () => currentAuthState,
  });
};

export { TestEnvVariables };
