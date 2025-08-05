# Foundly Monorepo

Welcome to the Foundly monorepo! This repository contains all the core code for Foundly, including the marketing website, main application, and backend API.

Learn more at [foundlyhq.com](https://foundlyhq.com/)

For LLM and AI-related info, see [foundlyhq.com/llms.txt](https://foundlyhq.com/llms.txt)

## Repository Structure

The main projects in this monorepo are:

- `website`: The marketing website for Foundly ([Next.js](https://nextjs.org/))
- `web-app`: The main Foundly application ([Next.js](https://nextjs.org/))
- `admin`: The admin dashboard for Foundly ([Next.js](https://nextjs.org/))
- `api`: The backend API for Foundly ([Hono](https://hono.dev/))

Other packages include shared UI components, TypeScript configs, and ESLint configs.

## Getting Started with pnpm

This monorepo uses [pnpm](https://pnpm.io/) as the package manager. You need to install it globally before working with the repo.

### Installing pnpm

You can install pnpm globally using npm:

```sh
npm install -g pnpm
```

Or follow the official instructions at [https://pnpm.io/installation](https://pnpm.io/installation).

### Common pnpm Commands

- **Install dependencies for the whole monorepo:**

  ```sh
  pnpm install
  ```

- **Run a dev server for a specific app:**
  - Marketing website: `pnpm --filter website dev`
  - Main app: `pnpm --filter web-app dev`
  - Admin dashboard: `pnpm --filter admin dev`
  - API: `pnpm --filter api dev`
- **Build a specific app:**
  - Marketing website: `pnpm --filter website build`
  - Main app: `pnpm --filter web-app build`
  - Admin dashboard: `pnpm --filter admin build`
  - API: `pnpm --filter api build`
- **Add a new package to an app (e.g., add `axios` to `web-app`):**
  ```sh
  pnpm --filter web-app add axios
  ```
- **Remove a package from an app:**
  ```sh
  pnpm --filter web-app remove axios
  ```

### Working on Specific Parts of the Monorepo

- To run, build, or test a specific app or package, use the `--filter` flag with the name of the app/package.
  - Example: `pnpm --filter api test`
- You can also run scripts defined in each app's `package.json` using the same filter approach.
- The main apps you will work on are `website`, `web-app`, `admin`, and `api`.

### Turborepo Remote Caching (Optional)

To speed up builds and CI, you can enable [Turborepo Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching). See the [Turbo docs](https://turbo.build/repo/docs/core-concepts/remote-caching) for setup instructions. This is optional but recommended for teams.

## What's inside?

This monorepo includes:

- `website`: Foundly marketing website (Next.js)
- `web-app`: Main Foundly application (Next.js)
- `admin`: Foundly admin dashboard (Next.js)
- `api`: Foundly backend API (Hono)
- `ui`: Shared React component library (used by main apps)
- `@repo/eslint-config`: Shared ESLint config
- `@repo/typescript-config`: Shared TypeScript config

All apps and packages use [TypeScript](https://www.typescriptlang.org/).

### Building packages/ui

This example is set up to produce compiled styles for `ui` components into the `dist` directory. The component `.tsx` files are consumed by the Next.js apps directly using `transpilePackages` in `next.config.ts`. This was chosen for several reasons:

- Make sharing one `tailwind.config.ts` to apps and packages as easy as possible.
- Make package compilation simple by only depending on the Next.js Compiler and `tailwindcss`.
- Ensure Tailwind classes do not overwrite each other. The `ui` package uses a `ui-` prefix for it's classes.
- Maintain clear package export boundaries.

Another option is to consume `packages/ui` directly from source without building. If using this option, you will need to update the `tailwind.config.ts` in your apps to be aware of your package locations, so it can find all usages of the `tailwindcss` class names for CSS compilation.

For example, in [tailwind.config.ts](packages/tailwind-config/tailwind.config.ts):

```js
  content: [
    // app content
    `src/**/*.{js,ts,jsx,tsx}`,
    // include packages if not transpiling
    "../../packages/ui/*.{js,ts,jsx,tsx}",
  ],
```

If you choose this strategy, you can remove the `tailwindcss` and `autoprefixer` dependencies from the `ui` package.

### Utilities

This Turborepo has some additional tools already setup for you:

- [Tailwind CSS](https://tailwindcss.com/) for styles
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
