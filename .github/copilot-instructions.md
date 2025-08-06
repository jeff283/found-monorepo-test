# Foundly Monorepo - AI Assistant Rules & Project Guide

## Project Overview

**Foundly** is a modern, AI-powered lost & found platform that connects people with their lost belongings efficiently and securely. The platform serves both individuals looking for lost items and institutions (schools, hotels, offices) that need to manage found items at their locations.

### Business Mission

- **For Individuals**: Report lost/found items, receive AI-powered match suggestions, and communicate securely
- **For Institutions**: Provide staff tools to manage, match, and resolve item reports with admin dashboards and recordkeeping
- **Core Value**: Leveraging AI matching, real-time alerts, and intuitive dashboards to modernize the lost & found process

### Key Features

- **AI-Powered Matching**: Machine learning analyzes item descriptions, photos, and location data to identify potential matches
- **Real-Time Alerts**: Notifications for potential matches and updates
- **Mobile-First Design**: Optimized for accessibility and ease of use
- **Privacy & Security**: Encrypted data with strict access controls
- **Intuitive Dashboards**: For both individuals and institutions to track and resolve cases

## Technical Architecture

### Monorepo Structure

This is a **Turborepo** monorepo using **pnpm** workspaces with the following apps and packages:

```
foundly-monorepo/
├── apps/
│   ├── website/          # Marketing website (Next.js 15)
│   ├── web-app/          # Main application (Next.js 15)
│   ├── admin/            # Admin dashboard (Next.js 15)
│   └── api/              # Backend API (Hono + Cloudflare Workers)
├── packages/
│   ├── ui/               # Shared React component library
│   ├── eslint-config/    # Shared ESLint configuration
│   ├── typescript-config/# Shared TypeScript configuration
│   └── tailwind-config/  # Shared Tailwind CSS configuration
```

### Technology Stack

#### Frontend Applications

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS v4 with custom shared configuration
- **UI Components**: Radix UI primitives with custom design system
- **Authentication**: Clerk (SSO, organization management)
- **Database**: Supabase (PostgreSQL) with Drizzle ORM
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Cloudflare Pages via OpenNext

#### Backend API

- **Framework**: Hono (lightweight web framework)
- **Runtime**: Cloudflare Workers
- **Authentication**: Clerk backend integration
- **Database**: Cloudflare D1 (SQLite) for API-specific data
- **Storage**: Cloudflare KV for caching
- **State Management**: Cloudflare Durable Objects for complex workflows
- **Testing**: Vitest with Cloudflare Workers testing environment

#### Shared Infrastructure

- **Package Manager**: pnpm with workspaces
- **Build System**: Turborepo for monorepo orchestration
- **Linting**: ESLint 9 with shared configurations
- **Formatting**: Prettier with Tailwind plugin
- **Type Safety**: TypeScript throughout all packages
- **CI/CD**: Multiple deployment environments (preview, staging, production)

## Development Guidelines

### Code Style & Standards

- **TypeScript First**: All new code must be written in TypeScript
- **Component Architecture**: Prefer composition over inheritance
- **File Naming**: Use kebab-case for files, PascalCase for components
- **Imports**: Use absolute imports with path mapping where possible
- **Error Handling**: Implement proper error boundaries and API error handling

### Component Development

- **Design System**: Use components from `@repo/ui` package when available
- **Radix UI**: Leverage Radix primitives for accessible base components
- **Tailwind**: Use utility-first approach with shared design tokens
- **Responsive**: Always implement mobile-first responsive design
- **Accessibility**: Ensure WCAG 2.1 AA compliance

### API Development

- **Hono Patterns**: Follow Hono best practices for route organization
- **Validation**: Use Zod schemas for all request/response validation
- **Authentication**: Always verify Clerk authentication in protected routes
- **Error Responses**: Return consistent error formats across all endpoints
- **Testing**: Write unit and integration tests for all API endpoints

### Database & State Management

- **Drizzle ORM**: Use Drizzle for all database operations in Next.js apps
- **Durable Objects**: Use for complex stateful workflows (institution onboarding)
- **KV Storage**: Use for caching and fast lookups
- **Migrations**: Always create migration files for schema changes

### Institution Management Architecture

The platform has a sophisticated institution onboarding system:

- **Clean Clerk Instance**: Only approved institutions exist in Clerk
- **Temporary State**: Durable Objects handle draft/pending states
- **Email Domain Validation**: One institution per email domain
- **Multi-step Process**: Draft → Verification → Admin Review → Approval/Rejection
- **Deferred Creation**: Institution slug and Clerk org only created upon approval

## Coding Rules & Preferences

### General Rules

1. **Always use TypeScript** - No JavaScript files except configuration
2. **Validate all inputs** - Use Zod schemas for runtime validation
3. **Handle errors gracefully** - Implement proper error boundaries and fallbacks
4. **Write testable code** - Prefer pure functions and dependency injection
5. **Document complex logic** - Add JSDoc comments for complex functions
6. **Follow existing patterns** - Look at existing code for consistency

### React/Next.js Specific

1. **Use Server Components** by default, Client Components only when needed
2. **Implement loading states** for all async operations
3. **Use Suspense boundaries** for data fetching
4. **Prefer composition** over large component files
5. **Extract custom hooks** for reusable logic
6. **Use React.memo()** sparingly and only when performance issues are measured

### API Development Rules

1. **Validate all requests** with Zod schemas
2. **Use middleware** for cross-cutting concerns (auth, CORS, logging)
3. **Return consistent responses** - always include status, data, and error fields
4. **Log all errors** with sufficient context for debugging
5. **Implement rate limiting** for public endpoints
6. **Use Durable Objects** for stateful workflows, not simple CRUD

### Styling Guidelines

1. **Mobile-first** responsive design always
2. **Use design tokens** from shared Tailwind config
3. **Prefer utility classes** over custom CSS
4. **Create component variants** using class-variance-authority
5. **Maintain design consistency** across all apps
6. **Test dark mode** if theme switching is enabled

## Environment & Deployment

### Development Environment

- **Node.js**: >= 22 (specified in package.json engines)
- **Package Manager**: pnpm (required, version 10.14.0)
- **Development Commands**:
  - `pnpm dev` - Start all development servers
  - `pnpm --filter web-app dev` - Start specific app
  - `pnpm build` - Build all apps
  - `pnpm test` - Run all tests

### Deployment Strategy

- **Production**: Cloudflare Pages/Workers with environment-specific configs
- **Staging**: Preview deployments for testing
- **Preview**: Branch-based deployments for feature review
- **Environment Variables**: Managed through Cloudflare dashboard and Wrangler

### Key Environment Variables

```
# Authentication
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# Database
DATABASE_URL
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY

# API
NEXT_PUBLIC_API_URL

# External Services
MAILERLITE_API_KEY
TURNSTILE_SECRET_KEY
```

## Common Patterns & Examples

### Creating a New Component

```typescript
// packages/ui/src/components/example-component.tsx
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const exampleVariants = cva(
  "base-classes-here",
  {
    variants: {
      variant: {
        default: "default-classes",
        destructive: "destructive-classes",
      },
      size: {
        default: "default-size-classes",
        sm: "small-size-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ExampleComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof exampleVariants> {
  children: React.ReactNode
}

export const ExampleComponent = ({
  className,
  variant,
  size,
  children,
  ...props
}: ExampleComponentProps) => {
  return (
    <div
      className={cn(exampleVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </div>
  )
}
```

### API Route Pattern (Hono)

```typescript
// apps/api/src/api/routes/example.ts
import { Hono } from "hono";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth";

const app = new Hono();

const createItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

app.post("/items", authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { name, description } = createItemSchema.parse(body);

    // Process the request
    const result = await createItem({ name, description });

    return c.json({
      success: true,
      data: result,
      error: null,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        data: null,
        error: error.message,
      },
      400
    );
  }
});

export default app;
```

### Database Query Pattern (Drizzle)

```typescript
// apps/web-app/src/lib/db/queries.ts
import { db } from "./connection";
import { items, users } from "./schema";
import { eq, and, desc } from "drizzle-orm";

export async function getUserItems(userId: string) {
  return await db
    .select()
    .from(items)
    .where(eq(items.userId, userId))
    .orderBy(desc(items.createdAt));
}

export async function getItemById(itemId: string, userId: string) {
  const [item] = await db
    .select()
    .from(items)
    .where(and(eq(items.id, itemId), eq(items.userId, userId)))
    .limit(1);

  return item;
}
```

## Security Considerations

### Authentication & Authorization

- **Always verify** Clerk authentication in protected routes
- **Use organization context** for institution-specific data
- **Implement role-based access** control where needed
- **Validate permissions** at both frontend and backend

### Data Privacy

- **Encrypt sensitive data** at rest and in transit
- **Implement data retention** policies (180 days for reports)
- **Provide data deletion** capabilities for GDPR compliance
- **Log access patterns** for security auditing

### Content Security

- **Validate all uploads** for file type and size
- **Sanitize user inputs** to prevent XSS attacks
- **Implement rate limiting** to prevent abuse
- **Use HTTPS everywhere** and secure headers

## Testing Strategy

### Unit Testing

- **API Routes**: Test all endpoints with various inputs
- **Components**: Test rendering and user interactions
- **Utilities**: Test pure functions with edge cases
- **Database Queries**: Test with mock data

### Integration Testing

- **API Workflows**: Test complete user journeys
- **Authentication**: Test Clerk integration flows
- **Database**: Test with actual database connections
- **External Services**: Test third-party integrations

### Testing Tools

- **Vitest**: For unit and integration tests
- **Cloudflare Workers Testing**: For API testing
- **React Testing Library**: For component testing
- **MSW**: For API mocking in tests

## Troubleshooting Guide

### Common Issues

1. **Build Failures**: Check TypeScript errors and dependency versions
2. **Authentication Issues**: Verify Clerk configuration and environment variables
3. **Database Connections**: Check Supabase/D1 connection strings
4. **Deployment Failures**: Review Wrangler configuration and secrets
5. **Package Resolution**: Clear node_modules and pnpm lock file

### Debug Commands

```bash
# Check workspace dependencies
pnpm list --depth=0

# Lint specific package
pnpm --filter web-app lint

# Type check without building
pnpm --filter api check-types

# Test specific pattern
pnpm --filter api test auth

# Deploy to preview environment
pnpm --filter web-app deploy:preview
```

## Resources & Documentation

### Project Links

- **Website**: https://foundlyhq.com
- **App**: https://app.foundlyhq.com
- **Business Context**: https://foundlyhq.com/llms.txt
- **Admin Dashboard**: (Internal)

### External Documentation

- **Next.js**: https://nextjs.org/docs
- **Hono**: https://hono.dev/
- **Cloudflare Workers**: https://developers.cloudflare.com/workers/
- **Clerk**: https://clerk.com/docs
- **Supabase**: https://supabase.com/docs
- **Drizzle ORM**: https://orm.drizzle.team/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

When working on this codebase, always refer to existing patterns, maintain consistency with the established architecture, and prioritize user experience and data security. The platform's success depends on reliable AI matching, seamless user flows, and robust institution management capabilities.
