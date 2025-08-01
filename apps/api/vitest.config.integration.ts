import { defineProject } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineProject({
  plugins: [tsconfigPaths()],
  test: {
    name: "integration",
    environment: "node",
    globals: true,
    restoreMocks: true,
    unstubEnvs: true,
    include: ["src/tests/integration/**/*.test.ts"],
    testTimeout: 30000, // 30 seconds for integration tests
    hookTimeout: 60000, // 60 seconds for setup/teardown
    setupFiles: ["./src/tests/integration/setup.ts"], // Integration test setup
  },
});
