import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();

// Copy them to your package.json scripts section to use OpenNext CLI commands
// "build:opennext": "opennextjs-cloudflare build",
// "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
// "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy -- --keep-vars",
// "deploy:preview": "opennextjs-cloudflare build && opennextjs-cloudflare deploy -- --env=preview --keep-vars",
// "deploy:stage": "opennextjs-cloudflare build && opennextjs-cloudflare deploy -- --env=staging --keep-vars",
// "deploy:prod": "opennextjs-cloudflare build && opennextjs-cloudflare deploy -- --env=production --keep-vars",
// "cf-typegen": "wrangler types --env-interface CloudflareEnv ./cloudflare-env.d.ts"
