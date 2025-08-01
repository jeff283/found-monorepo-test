# Turborepo Tailwind CSS starter

This Turborepo starter is maintained by the Turborepo core team.

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
- **Run a dev server for a specific app (e.g., `web`):**
  ```sh
  pnpm --filter web dev
  ```
- **Build a specific app (e.g., `docs`):**
  ```sh
  pnpm --filter docs build
  ```
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

### Turborepo Remote Caching (Optional)

To speed up builds and CI, you can enable [Turborepo Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching). See the [Turbo docs](https://turbo.build/repo/docs/core-concepts/remote-caching) for setup instructions. This is optional but recommended for teams.

## Using this example

Run the following command:

```sh
npx create-turbo@latest -e with-tailwind
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app with [Tailwind CSS](https://tailwindcss.com/)
- `web`: another [Next.js](https://nextjs.org/) app with [Tailwind CSS](https://tailwindcss.com/)
- `ui`: a stub React component library with [Tailwind CSS](https://tailwindcss.com/) shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

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
