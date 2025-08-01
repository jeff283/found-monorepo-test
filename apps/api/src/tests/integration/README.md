# Integration Testing Guide

This document explains the new decoupled integration testing approach for the Foundly API.

## Overview

The integration tests have been completely decoupled from the API implementation details. Instead of importing and directly calling the app, the tests now make real HTTP requests to a running development server.

## Key Benefits

1. **True End-to-End Testing**: Tests the complete request/response cycle including middleware, routing, and actual HTTP handling
2. **Environment Isolation**: Tests run against a real server environment, catching issues that unit tests might miss
3. **Production-Like Conditions**: Tests use actual HTTP requests, headers, and network communication
4. **Implementation Independence**: Tests don't break when internal implementation changes, only when the API contract changes

## How It Works

### Test Setup
- Tests use the `integration-setup.ts` utility to connect to a running dev server
- If no server is found, tests fail with clear instructions to start the server
- All HTTP requests are made using the native `fetch` API

### Running Integration Tests

1. **Start the development server** (in a separate terminal):
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. **Run the integration tests**:
   ```bash
   npm run test:int
   # or
   pnpm test:int
   ```

### Test Structure

Integration tests are located in `src/tests/integration/` and follow this pattern:

```typescript
import { describe, it, expect, beforeAll } from "vitest";
import { 
  getTestServer, 
  makeRequest, 
  makeAuthenticatedRequest,
  expectJsonResponse,
  expectTextResponse,
  type TestServer 
} from "../integration-setup";

describe("API Feature Tests", () => {
  let server: TestServer;

  beforeAll(async () => {
    server = await getTestServer();
  });

  it("should test an endpoint", async () => {
    const response = await makeRequest(`${server.url}/endpoint`);
    const data = await expectJsonResponse(response, 200);
    
    expect(data).toHaveProperty("expectedField");
  });
});
```

## Utilities

### `integration-setup.ts`

Provides utilities for integration testing:

- **`getTestServer()`**: Connects to or sets up a test server
- **`makeRequest(url, options)`**: Makes an unauthenticated HTTP request
- **`makeAuthenticatedRequest(url, options, token)`**: Makes an authenticated HTTP request
- **`expectJsonResponse(response, status)`**: Validates JSON responses and returns typed data
- **`expectTextResponse(response, status)`**: Validates text responses and returns content
- **`waitFor(condition, timeout)`**: Utility for waiting on conditions

### Configuration

Default configuration:
- **Port**: 8787 (matches wrangler dev default)
- **Base URL**: http://localhost:8787
- **Timeout**: 30 seconds for tests, 60 seconds for setup

## Best Practices

1. **Start Server First**: Always start the dev server before running integration tests
2. **Use Helpers**: Use the provided helper functions for consistent request handling
3. **Type Responses**: Use TypeScript types for response data validation
4. **Test Real Scenarios**: Focus on actual user workflows and API contracts
5. **Handle Auth Properly**: Use appropriate auth helpers for authenticated endpoints

## Migration from Old Tests

The old integration tests that directly imported the app have been replaced with true HTTP-based tests. Key changes:

- ❌ `import app from "@/index"` → ✅ `import { getTestServer } from "../integration-setup"`
- ❌ `app.request(request)` → ✅ `makeRequest(url)`
- ❌ Mock-based auth → ✅ Real auth headers (or test without auth)
- ❌ Direct function calls → ✅ HTTP requests

## Troubleshooting

### "No server found" Error
```
❌ No server found at http://localhost:8787.
Please start the development server first:
  npm run dev
```

**Solution**: Start the dev server with `npm run dev` or `pnpm dev`

### Port Conflicts
If port 8787 is in use, you can:
1. Stop the conflicting process
2. Or modify the test setup to use a different port

### Timeouts
If tests are timing out:
1. Ensure the server is running and healthy
2. Check server logs for errors
3. Increase timeout in vitest config if needed

## Example Test Files

- `basic-api-decoupled.test.ts`: Basic endpoint testing
- Add more integration test files following the same pattern for specific features

This approach ensures that integration tests truly validate the API as external consumers would use it, providing confidence that the API works correctly in real-world scenarios.
