# Institution Backend Architecture

## Overview

This document outlines the complete backend architecture for handling institution onboarding using Hono + Cloudflare Durable Objects. The system manages a multi-step institution verification process while keeping Clerk and Supabase clean from pending/rejected applications.

## Architecture Principles

### Core Philosophy
- **Clean Clerk Instance**: Only approved institutions exist in Clerk
- **Temporary State Management**: Durable Objects handle draft/pending states
- **User ID Based**: All operations use Clerk user ID as primary identifier
- **Email Domain Validation**: One institution per email domain (@stanford.edu, @harvard.edu, etc.)
- **Deferred Creation**: Institution slug and Clerk org only created upon approval

### Data Flow

```
1. User starts organization creation → Durable Object (draft)
2. User completes verification details → Durable Object (pending_verification)
3. Admin reviews application → Approve/Reject
4. If approved → User creates organization in Clerk (frontend)
5. User calls verification API → Backend verifies Clerk org creation
6. Backend updates DO with org details → Triggers alarm for Supabase sync
7. If rejected → Update DO with reason, notify user
```

## System Components

### 1. Durable Objects

- **Purpose**: Stateful session management for institution drafts and organization verification
- **Identifier**: Clerk user ID
- **Lifespan**: From creation until Supabase sync completion
- **Data**: Complete institution information, workflow state, and Clerk organization details
- **Alarms**: Triggers Supabase sync after successful Clerk organization verification

### 2. KV Storage
- **Purpose**: Fast domain lookups and caching
- **Mapping**: Email domain → User ID
- **Use Case**: Prevent duplicate institutions for same domain

### 3. D1 Database
- **Purpose**: Persistent references and admin queries
- **Data**: User ID, email domain, status, timestamps
- **Use Case**: Admin dashboard, analytics, cleanup jobs

### 4. Hono API
- **Purpose**: HTTP endpoints for frontend integration
- **Features**: Validation, CORS, error handling, authentication
- **Deployment**: Cloudflare Workers

## User Roles & Permissions

### Institution Admin
- **Purpose**: Creates and manages the organization
- **Process**: Creates draft → Fills verification → Awaits approval
- **Outcome**: Becomes organization owner in Clerk upon approval

### Institution Staff (Future)
- **Purpose**: Work on platform with varied permissions
- **Process**: Joins existing approved organization
- **Requirements**: Email domain must match approved institution

### Institution Members (Future)
- **Purpose**: Use platform to find lost items
- **Process**: Self-service signup with domain verification
- **Access**: Limited platform features

### Public Members (Future)
- **Purpose**: Non-affiliated users looking for items
- **Security**: Heavy restrictions, special verification needed

## Data Schema

### InstitutionDraftData (Durable Object)
```typescript
interface InstitutionDraftData {
  userId: string;              // Clerk user ID (primary identifier)
  userEmail: string;           // User's email address
  emailDomain: string;         // Extracted domain (e.g., "stanford.edu")
  
  // Step 1: Basic Organization Info
  organizationName: string;    // "Stanford University"
  organizationType: OrganizationType;
  organizationSize: OrganizationSize;
  
  // Step 2: Verification Details (optional until submitted)
  website?: string;            // "https://stanford.edu"
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactPhone?: string;       // "+1-650-123-4567"
  registrationNumber?: string; // Government/accreditation number
  
  // Workflow State
  status: 'draft' | 'pending_verification' | 'approved' | 'rejected';
  currentStep: 'basic' | 'verification' | 'complete';
  
  // Timestamps
  createdAt: string;           // ISO timestamp
  updatedAt: string;           // ISO timestamp
  submittedAt?: string;        // When verification submitted
  reviewedAt?: string;         // When admin reviewed
  
  // Admin Review
  reviewedBy?: string;         // Admin user ID
  rejectionReason?: string;    // Why rejected
  
  // Clerk Organization Details (set after user creates org)
  clerkOrgId?: string;         // Clerk organization ID from frontend creation
  clerkOrgSlug?: string;       // Clerk organization slug from frontend creation
  orgCreatedAt?: string;       // When the Clerk org was created
  
  // Supabase Sync Status
  supabaseSynced?: boolean;    // Whether data has been synced to Supabase
  supabaseSyncedAt?: string;   // When the sync completed
}
```

### KV Cache Structure
```typescript
// Email domain to user ID mapping
`domain:stanford.edu` → `user_2abc123def`

// User status cache (optional)
`user:user_2abc123def:status` → `pending_verification`
```

### D1 Database Schema
```sql
CREATE TABLE institution_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT UNIQUE NOT NULL,        -- Clerk user ID
  user_email TEXT NOT NULL,            -- User email
  email_domain TEXT NOT NULL,          -- Domain for duplicate prevention
  status TEXT DEFAULT 'draft',         -- Current status
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_id ON institution_sessions(user_id);
CREATE INDEX idx_email_domain ON institution_sessions(email_domain);
CREATE INDEX idx_status ON institution_sessions(status);
```

## API Endpoints

### Institution Management

- `POST /api/institution/create` - Create new institution draft
- `PUT /api/institution/verify/:userId` - Submit verification details  
- `GET /api/institution/status/:userId` - Get user's institution status
- `GET /api/institution/status/domain/:domain` - Check domain availability
- `POST /api/institution/confirm-org/:userId` - Verify Clerk organization creation and trigger Supabase sync
- `DELETE /api/institution/:userId` - Cancel/delete draft

### Admin Management
- `GET /api/admin/pending` - List all pending applications
- `POST /api/admin/approve/:userId` - Approve institution
- `POST /api/admin/reject/:userId` - Reject institution with reason
- `GET /api/admin/stats` - Get approval statistics

### Health & Utilities
- `GET /api/health` - Service health check
- `GET /api/domains/blocked` - List blocked email domains

## Security Considerations

### Email Domain Validation
```typescript
const blockedDomains = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'aol.com', 'icloud.com', 'protonmail.com', 'hey.com'
];

function isValidInstitutionEmail(domain: string): boolean {
  return !blockedDomains.includes(domain.toLowerCase());
}
```

### Rate Limiting
- Prevent spam applications from same IP/user
- Implement exponential backoff for failed attempts
- Monitor unusual patterns

### Data Privacy
- Store minimal data in Durable Objects
- Automatic cleanup of abandoned drafts (30 days)
- GDPR compliance for data deletion

## Error Handling

### Client Errors (4xx)
- `400`: Validation errors with detailed field messages
- `401`: Authentication required
- `403`: Insufficient permissions
- `404`: Institution draft not found
- `409`: Domain conflict (institution already exists)
- `429`: Rate limit exceeded

### Server Errors (5xx)
- `500`: Internal server error
- `503`: Service temporarily unavailable
- `507`: Storage quota exceeded

## Monitoring & Observability

### Metrics to Track
- Institution creation rate
- Approval/rejection ratios
- Average time to approval
- Abandoned draft percentage
- Domain distribution

### Logging
- All API requests with user context
- Admin actions for audit trail
- Error patterns and frequencies
- Performance metrics

## Future Enhancements

### Multi-Institution Support
- Users belonging to multiple institutions
- Role-based permissions per institution
- Institution switching in UI

### Advanced Verification
- Document upload for verification
- Integration with government databases
- Automated verification checks

### Workflow Automation
- Auto-approval for known domains
- Bulk approval tools
- Scheduled cleanup jobs

---

## File Structure

```
foundly-institution-api/
├── src/
│   ├── index.ts                        # Main Hono app entry point
│   ├── api/
│   │   ├── routes/
│   │   │   ├── institution.ts          # Institution CRUD operations
│   │   │   ├── admin.ts                # Admin management endpoints
│   │   │   └── health.ts               # Health check endpoints
│   │   └── middleware/
│   │       ├── auth.ts                 # Authentication middleware
│   │       ├── cors.ts                 # CORS configuration
│   │       ├── validation.ts           # Request validation
│   │       └── rate-limit.ts           # Rate limiting
│   ├── durable-objects/
│   │   └── InstitutionDraft.ts         # DO for draft management
│   ├── lib/
│   │   ├── types.ts                    # TypeScript interfaces
│   │   ├── validation.ts               # Zod schemas
│   │   ├── utils.ts                    # Utility functions
│   │   ├── email.ts                    # Email service integration
│   │   └── constants.ts                # App constants
│   └── bindings.ts                     # Cloudflare bindings types
├── migrations/
│   └── 001_initial_schema.sql          # D1 database schema
├── wrangler.toml                       # Cloudflare Workers config
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Clerk
CLERK_SECRET_KEY=sk_live_...

# Email Service
RESEND_API_KEY=re_...

# Environment
ENVIRONMENT=production|development
```

This architecture provides a robust, scalable foundation for institution onboarding while maintaining clean separation of concerns and excellent developer experience.
