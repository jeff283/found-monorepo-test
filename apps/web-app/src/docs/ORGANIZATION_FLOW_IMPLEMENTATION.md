# Organization Join/Create Flow Implementation

## Overview
Successfully implemented a comprehensive flow for users after email verification to either join an existing organization or create a new one based on their email domain.

## New Pages Created

### 1. Organization Selection Page
**Path**: `/signup/institution/organization-selection`
**File**: `src/app/(auth)/signup/institution/organization-selection/page.tsx`

**Features**:
- Extracts email domain from user's email address
- Checks if organization exists with that domain in Supabase
- Shows different UI based on organization existence:
  - **If organization exists**: Option to request to join + fallback to create new
  - **If no organization**: Encourages creating organization + guidance for non-admins

**Database Queries**:
- Checks `organizations` table for matching domain
- Checks `join_requests` table for existing pending requests
- Prevents duplicate join requests

### 2. Join Request Pending Page
**Path**: `/signup/institution/join-request-pending`
**File**: `src/app/(auth)/signup/institution/join-request-pending/page.tsx`

**Features**:
- Confirmation page after successful join request submission
- Shows organization name and status
- Explains approval process
- Provides fallback option to create new organization

## Updated Pages

### Email Verification Page
**File**: `src/app/(auth)/signup/institution/(personal)/verify-otp/page.tsx`
**Change**: Updated redirect after successful verification to go to organization-selection instead of create-organization

## Database Schema Updates

### New Tables Added to `src/database/user_profiles.sql`:

#### Organizations Table
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL, -- Email domain like "university.edu"
  description TEXT,
  logo_url TEXT,
  created_by TEXT REFERENCES user_profiles(clerk_user_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Join Requests Table
```sql
CREATE TABLE join_requests (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  clerk_user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT REFERENCES user_profiles(clerk_user_id)
);
```

#### Organization Members Table
```sql
CREATE TABLE organization_members (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  clerk_user_id TEXT REFERENCES user_profiles(clerk_user_id),
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, clerk_user_id)
);
```

### Row Level Security (RLS) Policies
- Organizations: Public read for domain checking, creator can update
- Join Requests: Users see own requests, org admins see all requests for their org
- Organization Members: Members see their orgs, admins see all members

## User Flow

### Complete Authentication & Organization Flow:

1. **Personal Account Creation** (`/signup/institution`)
   - User fills form with email, name, job title, password
   - Clerk creates account with basic info
   - Supabase stores additional info (job title) linked by Clerk user ID

2. **Email Verification** (`/signup/institution/verify-otp`)
   - User receives 6-digit verification code
   - Clerk validates code and activates session
   - Redirects to organization selection

3. **Organization Selection** (`/signup/institution/organization-selection`)
   - Extracts domain from user's email (e.g., `@university.edu`)
   - Checks if organization with that domain exists

   **If Organization Exists**:
   - Shows organization details
   - Checks for existing pending requests
   - If no pending request: "Request to Join" button
   - If pending request: Shows "already requested" message
   - Always provides "Create New Organization" fallback

   **If No Organization**:
   - Shows "No organization found" message
   - Primary "Create Organization" button
   - Guidance for non-administrators

4. **Join Request Submitted** (`/signup/institution/join-request-pending`)
   - Confirmation page showing request status
   - Explains approval process
   - Email notification promise
   - Fallback to create new organization

5. **Organization Creation** (`/signup/institution/create-organization`)
   - For users who choose to create new organization
   - (Existing page - no changes needed)

## Technical Implementation

### Domain-Based Organization Matching
```typescript
// Extract domain from email
const domain = email.split('@')[1]; // e.g., "university.edu"

// Check for existing organization
const { data: organization } = await supabase
  .from('organizations')
  .select('*')
  .eq('domain', domain)
  .single();
```

### Join Request Creation
```typescript
// Create join request
const { error } = await supabase
  .from('join_requests')
  .insert({
    organization_id: existingOrganization.id,
    user_email: email,
    clerk_user_id: user.id,
    first_name: firstName,
    last_name: lastName,
    status: 'pending'
  });
```

### Duplicate Request Prevention
- Checks for existing pending requests before showing join button
- Prevents users from spamming join requests
- Shows appropriate message if request already exists

## Security Considerations

### Row Level Security
- Users can only see their own join requests
- Organization admins can see requests for their organizations
- Public read access for organization domain checking (required for flow)

### Authentication
- All operations require authenticated Clerk session
- Clerk user ID used as foreign key for data relationships
- No sensitive data exposed in client-side queries

## Next Steps for Complete Implementation

### 1. Organization Admin Dashboard
- Page for org admins to review join requests
- Approve/reject functionality
- Member management interface

### 2. Email Notifications
- Notify org admins of new join requests
- Notify users when requests are approved/rejected
- Welcome emails for new members

### 3. Member Onboarding
- Automatic organization_members record creation upon approval
- Role assignment (admin vs member)
- Dashboard access based on organization membership

### 4. Organization Creation Integration
- Update create-organization page to save to organizations table
- Automatically make creator an admin in organization_members
- Set up initial admin privileges

## Database Migration Required

Run the updated SQL from `src/database/user_profiles.sql` in your Supabase dashboard to create the new tables and policies.

## Testing the Flow

1. Navigate to http://localhost:3000/signup/institution
2. Create account with email like `test@example.com`
3. Verify email with 6-digit code
4. See organization selection page
5. Test both "organization exists" and "no organization" scenarios
6. Create join requests and see confirmation page

The flow provides a seamless experience for both individual users creating organizations and staff members joining existing ones, with proper fallbacks and clear user guidance throughout.
