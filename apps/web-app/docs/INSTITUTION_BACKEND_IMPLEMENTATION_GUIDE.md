# Step-by-Step Implementation Guide

This document provides detailed prompts for implementing the Institution Backend using Hono + Durable Objects. Each step should be completed in order and can be given to Cursor AI or GitHub Copilot.3. `POST /admin/approve/:userId` - Approve institution application
   - Get draft data from Durable Object
   - Update status to 'approved' 
   - Send approval notification to user
   - User then creates organization in Clerk from frontend

4. `POST /admin/reject/:userId` - Reject institution application
   - Update Durable Object with rejection reason
   - Update D1 status
   - Send rejection notification (simulate for now)

5. `POST /confirm-org/:userId` - Verify Clerk organization creation
   - Validate that user has created organization in Clerk
   - Verify organization details match the approved application  
   - Update Durable Object with Clerk organization ID and slug
   - Schedule alarm to trigger Supabase sync
   - Return success confirmation

6. Durable Object Alarm Handler - Supabase sync
   - Triggered after organization confirmation
   - Create institution record in Supabase
   - Link Clerk organization to Supabase data
   - Mark sync as completed in Durable Object

Requirements:

Before starting, ensure you have:
- Cloudflare Workers account
- Basic understanding of TypeScript and Hono
- Access to the institution backend architecture document

---

## Step 1: Create the Durable Object

**Prompt for AI:**

```
Create a Durable Object class called `InstitutionDraft` that manages institution onboarding sessions.

Requirements:
- File path: `src/durable-objects/InstitutionDraft.ts`
- Use Clerk user ID as the Durable Object identifier
- Store institution draft data with the following TypeScript interface:

```typescript
interface InstitutionDraftData {
  userId: string;              // Clerk user ID (primary identifier)
  userEmail: string;           // User's email address
  emailDomain: string;         // Extracted domain (e.g., "stanford.edu")
  
  // Step 1: Basic Organization Info
  organizationName: string;
  organizationType: 'university' | 'college' | 'research' | 'nonprofit' | 'government' | 'corporate' | 'other';
  organizationSize: '1-10' | '11-100' | '101-1000' | '1001-10000' | '10000+';
  
  // Step 2: Verification Details (optional until submitted)
  website?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactPhone?: string;
  registrationNumber?: string;
  
  // Workflow State
  status: 'draft' | 'pending_verification' | 'approved' | 'rejected';
  currentStep: 'basic' | 'verification' | 'complete';
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
  
  // Admin Review
  reviewedBy?: string;
  rejectionReason?: string;
  
  // Clerk Organization Details (set after user creates org)
  clerkOrgId?: string;         // Clerk organization ID from frontend creation
  clerkOrgSlug?: string;       // Clerk organization slug from frontend creation
  orgCreatedAt?: string;       // When the Clerk org was created
  
  // Supabase Sync Status
  supabaseSynced?: boolean;    // Whether data has been synced to Supabase
  supabaseSyncedAt?: string;   // When the sync completed
}
```

HTTP Methods to implement:
- GET: Return current data or `{ exists: false }` if no data
- POST: Create new session (return 409 if already exists)
- PUT: Update existing session with new data
- DELETE: Delete the session completely

Additional functionality:
- **Alarm Handler**: Triggered to sync data to Supabase after Clerk organization confirmation
- **scheduleAlarm()**: Schedule alarm for delayed Supabase sync
- **syncToSupabase()**: Create institution record in Supabase and mark as synced

Key requirements:
- Use `this.state.storage.put("data", data)` for persistence
- Always update `updatedAt` timestamp on PUT operations
- Extract `emailDomain` from `userEmail` automatically
- Return proper JSON responses with HTTP status codes
- Handle async operations with proper error handling

Response formats:
- Success: `{ success: true, userId: string, data?: InstitutionDraftData }`
- Get with data: `{ exists: true, status: string, userId: string, data: InstitutionDraftData }`
- Get without data: `{ exists: false }`
- Error: `{ error: string }`

Use TypeScript, import from "cloudflare:workers", and include comprehensive error handling.
```

---

## Step 2: Create Type Definitions and Validation

**Prompt for AI:**

```
Create TypeScript type definitions and Zod validation schemas for the institution backend.

Files to create:

1. `src/lib/types.ts` - Export the InstitutionDraftData interface and all related types
2. `src/lib/validation.ts` - Create Zod schemas for API validation
3. `src/bindings.ts` - Define Cloudflare Workers environment bindings

Requirements for validation.ts:
- `basicOrganizationSchema` for step 1 (userId, userEmail, organizationName, organizationType, organizationSize)
- `verificationDetailsSchema` for step 2 (userId, website, address, contactPhone, registrationNumber)
- `adminReviewSchema` for admin actions (userId, action: 'approve'|'reject', rejectionReason?, reviewedBy)

Requirements for bindings.ts:
- INSTITUTION_DRAFT: DurableObjectNamespace
- INSTITUTION_CACHE: KVNamespace  
- DB: D1Database
- Environment variables: SUPABASE_URL, SUPABASE_ANON_KEY, CLERK_SECRET_KEY, RESEND_API_KEY

Validation rules:
- Block common email providers (gmail.com, yahoo.com, hotmail.com, outlook.com, aol.com, icloud.com)
- Organization name: 2-100 characters
- Website: valid URL format if provided
- All address fields required when address is provided
- Phone optional but validate format if provided

Export all schemas and types for use in API routes.
```

---

## Step 3: Create Utility Functions

**Prompt for AI:**

```
Create utility functions for the institution backend.

File: `src/lib/utils.ts`

Functions to implement:

1. `extractEmailDomain(email: string): string` - Extract domain from email address
2. `isValidInstitutionEmail(domain: string): boolean` - Check if domain is allowed (not in blocked list)
3. `generateUniqueSlug(organizationName: string): string` - Generate URL-safe slug with random suffix
4. `validateEmailDomain(email: string): { valid: boolean, domain: string, error?: string }` - Complete email validation

Constants to define:
- `BLOCKED_EMAIL_DOMAINS`: Array of public email providers to block
- `SLUG_MAX_LENGTH`: Maximum length for generated slugs (40 chars)
- `RANDOM_SUFFIX_LENGTH`: Length of random suffix for uniqueness (6 chars)

Requirements:
- Use nanoid for random string generation
- Slug generation should remove special characters, replace spaces with hyphens
- Include comprehensive JSDoc comments
- Handle edge cases (empty strings, invalid formats)
- Export all functions and constants

Example usage:
```typescript
const domain = extractEmailDomain("john@stanford.edu"); // "stanford.edu"
const isValid = isValidInstitutionEmail(domain); // true
const slug = generateUniqueSlug("Stanford University"); // "stanford-university-a1b2c3"
```
```

---

## Step 4: Create Institution API Routes

**Prompt for AI:**

```
Create the main institution API routes using Hono.

File: `src/api/routes/institution.ts`

Endpoints to implement:

1. `POST /create` - Create new institution draft
   - Validate email domain is not blocked
   - Check if domain already has an institution (via KV cache)
   - Create Durable Object session
   - Store reference in D1 database
   - Cache domain mapping in KV

2. `PUT /verify/:userId` - Submit verification details
   - Get existing draft from Durable Object
   - Update with verification data
   - Set status to 'pending_verification'
   - Update D1 record

3. `GET /status/:userId` - Get user's institution status
   - Query Durable Object by user ID
   - Return current status and data

4. `GET /status/domain/:domain` - Check domain availability
   - Check KV cache for existing user with domain
   - Return status information

5. `DELETE /:userId` - Cancel/delete draft
   - Remove from Durable Object
   - Clean up KV cache
   - Update D1 record

6. `POST /confirm-org/:userId` - Verify Clerk organization creation and sync to Supabase
   - Validate user has created organization in Clerk
   - Verify organization details match approved application
   - Update Durable Object with Clerk org ID and slug
   - Schedule alarm for Supabase sync
   - Return confirmation

Requirements:
- Use Zod schemas for validation
- Proper error handling with appropriate HTTP status codes
- Type-safe request/response handling
- Integration with all three storage layers (DO, KV, D1)
- Comprehensive logging for debugging

Error handling:
- 400: Validation errors with field details
- 404: Institution draft not found
- 409: Domain conflict (already exists)
- 500: Internal server errors

Import required types, validation schemas, and utility functions.
Use Hono's context type with proper Cloudflare bindings.
```

---

## Step 5: Create Admin API Routes

**Prompt for AI:**

```
Create admin management API routes using Hono.

File: `src/api/routes/admin.ts`

Endpoints to implement:

1. `GET /pending` - List all pending institution applications
   - Query D1 for all pending_verification status
   - Return paginated results with user details
   - Include sorting by submission date

2. `POST /approve/:userId` - Approve institution application
   - Get draft data from Durable Object
   - Generate unique slug using utility function
   - Create organization in Clerk (simulate for now)
   - Create record in Supabase (simulate for now)
   - Update Durable Object with approval data
   - Send approval notification (simulate for now)

3. `POST /reject/:userId` - Reject institution application
   - Update Durable Object with rejection reason
   - Update D1 status
   - Send rejection notification (simulate for now)

4. `GET /stats` - Get approval statistics
   - Query D1 for status counts
   - Calculate approval rates
   - Return summary metrics

Requirements:
- Admin authentication middleware (simulate with header check for now)
- Proper transaction handling for multi-step operations
- Comprehensive audit logging
- Error rollback on failed operations
- Rate limiting for admin actions

For Clerk and Supabase operations, create mock functions that log what would happen:
```typescript
async function createClerkOrganization(data: any) {
  console.log('Would create Clerk org:', data);
  return { id: 'org_mock_123', slug: data.slug };
}

async function createSupabaseRecord(data: any) {
  console.log('Would create Supabase record:', data);
  return { id: 'uuid-mock-456' };
}
```

Include proper TypeScript types and error handling.
```

---

## Step 6: Create Middleware

**Prompt for AI:**

```
Create middleware functions for the Hono API.

Files to create:

1. `src/api/middleware/cors.ts` - CORS configuration
   - Allow origins: localhost:3000, foundlyhq.com
   - Allow methods: GET, POST, PUT, DELETE, OPTIONS
   - Allow headers: Content-Type, Authorization
   - Handle preflight requests

2. `src/api/middleware/auth.ts` - Authentication middleware
   - Verify Clerk JWT tokens (simulate for now)
   - Extract user information from token
   - Add user context to Hono context
   - Handle unauthorized requests

3. `src/api/middleware/validation.ts` - Request validation
   - JSON body validation
   - Query parameter validation
   - File upload validation (for future use)

4. `src/api/middleware/rate-limit.ts` - Rate limiting
   - Per-user rate limiting using KV storage
   - Different limits for different endpoints
   - Exponential backoff for repeated violations

Requirements:
- Use Hono middleware patterns
- Type-safe middleware with proper Cloudflare bindings
- Comprehensive error handling
- Configurable limits and settings
- Proper HTTP status codes and error messages

For auth middleware, create a mock implementation:
```typescript
export async function authMiddleware(c: Context, next: Next) {
  // Mock implementation - replace with real Clerk verification
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  // Mock user extraction
  c.set('user', { id: 'user_mock_123', email: 'user@example.com' });
  await next();
}
```

Export all middleware functions with proper TypeScript types.
```

---

## Step 7: Create Main Hono Application

**Prompt for AI:**

```
Create the main Hono application entry point.

File: `src/index.ts`

Requirements:
- Import and configure all middleware (CORS, auth, rate limiting, logging)
- Register all route handlers (institution, admin, health)
- Export the InstitutionDraft Durable Object
- Configure error handling and 404 responses
- Add request logging middleware
- Set up proper TypeScript types for Cloudflare Workers

Structure:
```typescript
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import type { Env } from './bindings';

// Import routes
import institutionRoutes from './api/routes/institution';
import adminRoutes from './api/routes/admin';

// Import middleware
import { corsMiddleware } from './api/middleware/cors';
import { authMiddleware } from './api/middleware/auth';
import { rateLimitMiddleware } from './api/middleware/rate-limit';

// Export Durable Object
export { InstitutionDraft } from './durable-objects/InstitutionDraft';

const app = new Hono<{ Bindings: Env }>();

// Global middleware
app.use('*', logger());
app.use('*', corsMiddleware);

// Apply rate limiting to API routes
app.use('/api/*', rateLimitMiddleware);

// Apply auth to protected routes
app.use('/api/institution/*', authMiddleware);
app.use('/api/admin/*', authMiddleware);

// Register routes
app.route('/api/institution', institutionRoutes);
app.route('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// 404 handler
app.notFound((c) => c.json({ error: 'Not Found' }, 404));

// Error handler
app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

export default app;
```

Add comprehensive error handling and logging throughout.
Ensure all imports are correct and types are properly defined.
```

---

## Step 8: Create Configuration Files

**Prompt for AI:**

```
Create the necessary configuration files for the Cloudflare Workers project.

Files to create:

1. `wrangler.toml` - Cloudflare Workers configuration
```toml
name = "foundly-institution-api"
main = "src/index.ts"
compatibility_date = "2024-07-29"

[env.production]
vars = { ENVIRONMENT = "production" }

[env.development]  
vars = { ENVIRONMENT = "development" }

[[durable_objects.bindings]]
name = "INSTITUTION_DRAFT"
class_name = "InstitutionDraft"

[[kv_namespaces]]
binding = "INSTITUTION_CACHE"
id = "preview_id"

[[d1_databases]]
binding = "DB"
database_name = "foundly-institution-db"
database_id = "preview_id"
```

2. `package.json` - Node.js dependencies
```json
{
  "name": "foundly-institution-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "tail": "wrangler tail"
  },
  "dependencies": {
    "hono": "^4.0.0",
    "zod": "^3.22.0",
    "nanoid": "^5.0.0"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20240208.0",
    "typescript": "^5.3.0",
    "wrangler": "^3.28.0"
  }
}
```

3. `tsconfig.json` - TypeScript configuration
```json
{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["es2022"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "allowJs": true,
    "checkJs": false,
    "strict": true,
    "noEmit": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["@cloudflare/workers-types"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

4. `migrations/001_initial_schema.sql` - D1 database schema
```sql
CREATE TABLE institution_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT UNIQUE NOT NULL,
  user_email TEXT NOT NULL,
  email_domain TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_verification', 'approved', 'rejected')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_id ON institution_sessions(user_id);
CREATE INDEX idx_email_domain ON institution_sessions(email_domain);
CREATE INDEX idx_status ON institution_sessions(status);
CREATE INDEX idx_created_at ON institution_sessions(created_at);

-- Trigger to automatically update updated_at
CREATE TRIGGER update_institution_sessions_updated_at
  AFTER UPDATE ON institution_sessions
  FOR EACH ROW
  BEGIN
    UPDATE institution_sessions 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
  END;
```

5. `README.md` - Project documentation with setup instructions, API endpoints, and deployment guide

Create all files with proper formatting and ensure they're compatible with the latest versions of their respective tools.
```

---

## Step 9: Update Next.js Frontend Integration

**Prompt for AI:**

```
Update the existing Next.js organization creation page to integrate with the new Hono backend API.

File to modify: `src/app/(auth)/signup/institution/(organization)/create-organization/page.tsx`

Changes needed:

1. Remove the mock implementation and slug generation
2. Remove the organizationSlug from the form schema and UI
3. Add API integration with proper error handling
4. Use Clerk user ID for all requests
5. Add loading states and error messages

Updated schema (remove organizationSlug):
```typescript
const basicOrganizationSchema = z.object({
  organizationName: z
    .string()
    .min(1, "Organization name is required")
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name must be less than 100 characters"),
  organizationType: z.enum([
    "university", "college", "research", "nonprofit", "government", "corporate", "other",
  ]),
  organizationSize: z.enum(["1-10", "11-100", "101-1000", "1001-10000", "10000+"]),
});
```

New onSubmit implementation:
```typescript
const onSubmit = async (data: BasicOrganizationForm) => {
  if (!user?.id) {
    setError('root', { message: 'User authentication required' });
    return;
  }

  setLoading(true);

  try {
    const requestData = {
      userId: user.id,
      userEmail: user.emailAddresses[0]?.emailAddress || '',
      organizationName: data.organizationName,
      organizationType: data.organizationType,
      organizationSize: data.organizationSize,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/institution/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getToken()}`, // Get Clerk token
      },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        setError('root', { message: 'An institution request already exists for your email domain.' });
      } else if (response.status === 400 && result.error.includes('email domain')) {
        setError('root', { message: 'Please use your institutional email address, not a personal email.' });
      } else {
        setError('root', { message: result.error || 'Failed to create institution request' });
      }
      return;
    }

    // Success - navigate to verification
    router.push('/signup/institution/verification-details');

  } catch (error) {
    console.error('Institution creation error:', error);
    setError('root', { message: 'Network error. Please try again.' });
  } finally {
    setLoading(false);
  }
};
```

Requirements:
- Add proper TypeScript types for API responses
- Remove slug-related UI components and logic
- Add environment variable for API URL
- Include proper error handling for all error scenarios
- Add loading states for better UX
- Use Clerk's getToken() function for authentication
- Remove the slug watching and generation useEffect

Also update the form UI to remove the organizationSlug input field and related validation display.

Ensure all imports are updated and the component still uses the BusinessSetupLayout properly.
```

This completes the step-by-step implementation guide. Each step can be given individually to an AI assistant to build the complete institution backend system.
