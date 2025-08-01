import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Define projects for different test types
    projects: [
      // Unit tests using Cloudflare Workers pool
      "./vitest.config.unit.ts",

      // Integration tests using Node environment
      "./vitest.config.integration.ts",
    ],
    // Global options that apply to all projects
    // reporters, coverage, etc. go here
  },
});
