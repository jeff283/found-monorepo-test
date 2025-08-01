import { expect } from "vitest";
import { spawn, ChildProcess } from "child_process";

export interface TestServer {
  url: string;
  port: number;
  process?: ChildProcess;
  isOwnProcess: boolean;
}

// Default test server configuration
const DEFAULT_TEST_PORT = 8787;
const HEALTH_CHECK_INTERVAL = 1000; // 1 second
const HEALTH_CHECK_MAX_ATTEMPTS = 30; // Max attempts for health check

/**
 * Sleep utility function
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if a server is already running on the specified port
 */
async function isServerRunning(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${url}/health`, {
      method: "GET",
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Wait for server to be ready by polling the health endpoint
 */
async function waitForServer(url: string, maxAttempts: number = HEALTH_CHECK_MAX_ATTEMPTS): Promise<boolean> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (await isServerRunning(url)) {
      console.log(`✅ Server is ready at ${url}`);
      return true;
    }
    
    if (attempt < maxAttempts) {
      console.log(`⏳ Waiting for server... (attempt ${attempt}/${maxAttempts})`);
      await sleep(HEALTH_CHECK_INTERVAL);
    }
  }
  
  return false;
}

/**
 * Start the development server using npm run dev
 */
async function startDevServer(port: number = DEFAULT_TEST_PORT): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    console.log(`🚀 Starting dev server on port ${port}...`);
    
    // Start npm run dev
    const serverProcess = spawn("npm", ["run", "dev"], {
      stdio: ["pipe", "pipe", "pipe"],
      shell: true,
      cwd: process.cwd(),
      env: { ...process.env, PORT: port.toString() }
    });

    let serverStarted = false;
    let startupOutput = "";

    // Capture stdout and stderr
    serverProcess.stdout?.on("data", (data: Buffer) => {
      const output = data.toString();
      startupOutput += output;
      
      // Look for indicators that the server has started
      if (output.includes("Ready on") || output.includes(`localhost:${port}`) || output.includes("Local:")) {
        if (!serverStarted) {
          serverStarted = true;
          console.log(`✅ Dev server started on port ${port}`);
          resolve(serverProcess);
        }
      }
    });

    serverProcess.stderr?.on("data", (data: Buffer) => {
      const output = data.toString();
      startupOutput += output;
      console.error("Server stderr:", output);
    });

    serverProcess.on("error", (error: Error) => {
      if (!serverStarted) {
        reject(new Error(`Failed to start server: ${error.message}`));
      }
    });

    serverProcess.on("exit", (code: number | null) => {
      if (!serverStarted && code !== 0) {
        reject(new Error(`Server exited with code ${code}. Output: ${startupOutput}`));
      }
    });

    // Timeout if server doesn't start within 30 seconds
    setTimeout(() => {
      if (!serverStarted) {
        serverProcess.kill();
        reject(new Error(`Server failed to start within 30 seconds. Output: ${startupOutput}`));
      }
    }, 30000);
  });
}

/**
 * Setup test server - either use existing one or start a new one
 */
export async function setupTestServer(
  port: number = DEFAULT_TEST_PORT,
  autoStart: boolean = true
): Promise<TestServer> {
  const url = `http://localhost:${port}`;
  
  console.log(`🔍 Checking if server is running on ${url}...`);
  
  // First, check if server is already running
  if (await isServerRunning(url)) {
    console.log(`✅ Using existing server at ${url}`);
    return {
      url,
      port,
      isOwnProcess: false,
    };
  }

  if (!autoStart) {
    throw new Error(
      `❌ No server found at ${url}.\n` +
      `Please start the development server first:\n` +
      `  npm run dev\n` +
      `\nThen run the integration tests again.`
    );
  }

  // Server not running, start our own
  console.log(`📡 No server found, starting new dev server...`);
  
  try {
    const serverProcess = await startDevServer(port);
    
    // Wait for server to be ready
    const isReady = await waitForServer(url);
    
    if (!isReady) {
      serverProcess.kill();
      throw new Error(`Server started but failed health check at ${url}`);
    }

    return {
      url,
      port,
      process: serverProcess,
      isOwnProcess: true,
    };
  } catch (error) {
    throw new Error(`Failed to setup test server: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Cleanup test server if we started it
 */
export async function cleanupTestServer(server: TestServer): Promise<void> {
  if (server.isOwnProcess && server.process) {
    console.log(`🧹 Cleaning up test server (PID: ${server.process.pid})...`);
    
    return new Promise((resolve) => {
      const process = server.process!;
      
      // Set up exit handler
      process.on("exit", () => {
        console.log("✅ Test server cleaned up");
        resolve();
      });
      
      // Try graceful shutdown first
      process.kill("SIGTERM");
      
      // Force kill after timeout
      setTimeout(() => {
        if (!process.killed) {
          console.log("🔪 Force killing test server...");
          process.kill("SIGKILL");
        }
      }, 5000);
    });
  } else {
    console.log("ℹ️ Using external server, no cleanup needed");
  }
}

/**
 * Helper to make authenticated requests with proper headers
 */
export async function makeAuthenticatedRequest(
  url: string,
  options: RequestInit = {},
  token: string = "test-token"
): Promise<Response> {
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");
  
  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Helper to make unauthenticated requests
 */
export async function makeRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  
  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Helper to validate JSON response structure
 */
export async function expectJsonResponse<T = any>(
  response: Response,
  expectedStatus: number = 200
): Promise<T> {
  expect(response.status).toBe(expectedStatus);
  expect(response.headers.get("content-type")).toContain("application/json");
  return await response.json() as T;
}

/**
 * Helper to validate text response
 */
export async function expectTextResponse(
  response: Response,
  expectedStatus: number = 200
): Promise<string> {
  expect(response.status).toBe(expectedStatus);
  expect(response.headers.get("content-type")).toContain("text/plain");
  return await response.text();
}

/**
 * Global test server instance
 */
let globalTestServer: TestServer | null = null;

/**
 * Get or setup global test server for reuse across tests
 */
export async function getTestServer(autoStart: boolean = false): Promise<TestServer> {
  if (!globalTestServer) {
    globalTestServer = await setupTestServer(DEFAULT_TEST_PORT, autoStart);
  }
  return globalTestServer;
}
