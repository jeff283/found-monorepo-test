# Foundly Main Website

Welcome to the main website for **Foundly**—your gateway to discovering, connecting, and collaborating with innovative startups and founders. This repository contains the source code and configuration for the public-facing site of Foundly.

## 🚀 Project Purpose

This project powers the main landing page and marketing site for Foundly. It showcases our mission, features, and provides a central hub for users to learn more about our platform.

## 🛠️ Tech Stack

- **Next.js**: React framework for server-side rendering and static site generation.
- **shadcn/ui**: Component library for building accessible and beautiful UIs.
- **Cloudflare**: Used for edge deployment, DNS, and environment configuration.
- **TypeScript**: Type safety across the codebase.
- **Vercel**: (Optional) For seamless deployment and hosting.

## ⚙️ Configuration Overview

- `shadcn/ui` (`components.json`):
  - Manages UI component imports and customizations. See [shadcn/ui docs](https://ui.shadcn.com/docs) for usage.
- `cloudflare-env.d.ts` & `wrangler.jsonc`:
  - Type definitions and configuration for Cloudflare Workers and environment variables. Used for edge deployment or serverless functions.
- `next.config.ts` & `open-next.config.ts`:
  - Next.js and OpenNext configuration for custom build and deployment settings.
- `src/app/globals.css`:
  - Global styles, including font and theme customizations.

## 🏗️ Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.

3. **Edit the main page:**
   - Modify `src/app/page.tsx` to update the homepage content.

## 🧑‍💻 Development Notes

- UI components are in `src/components/ui/` and managed via shadcn/ui.
- Utility functions live in `src/lib/`.
- Global styles and fonts are set in `src/app/globals.css`.
- Environment variables for Cloudflare should be defined in your Wrangler config.

## 🚢 Deployment

- **Vercel**: Push to `master` to auto-deploy (if connected).
- **Cloudflare**: Use Wrangler for deploying to Cloudflare Workers:
  ```bash
  npm run deploy
  ```
  Ensure your environment variables and `wrangler.jsonc` are configured.

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Vercel Documentation](https://vercel.com/docs)

---

For questions or contributions, please open an issue or contact the Foundly team.
