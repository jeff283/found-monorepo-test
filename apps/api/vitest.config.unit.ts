import { defineProject } from "vitest/config";
import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineProject(
  defineWorkersConfig({
    plugins: [tsconfigPaths()],
    test: {
      name: "unit",
      globals: true,
      restoreMocks: true,
      unstubEnvs: true,
      include: ["src/tests/unit/**/*.test.ts"],
      setupFiles: ["./src/tests/unit/setup.ts"], // Correct path to unit setup
      poolOptions: {
        workers: {
          wrangler: { configPath: "./wrangler.jsonc" },
        },
      },
    },
  })
);
