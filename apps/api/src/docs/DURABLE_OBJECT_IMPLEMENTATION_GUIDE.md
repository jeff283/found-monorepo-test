<!-- markdownlint-disable -->

# Durable Object Implementation Guide

## Understanding Durable Objects

### What Are Durable Objects?

Durable Objects (DOs) are **stateful compute primitives** in Cloudflare Workers that combine:
- **Persistent storage** - Data survives between requests
- **Strong consistency** - All operations are serialized per object
- **Global uniqueness** - Each ID maps to exactly one instance worldwide
- **HTTP interface** - Handle requests like mini web servers

### Key Concepts

1. **Stateful vs Stateless**
   - Regular Workers: Stateless, no data persists between requests
   - Durable Objects: Stateful, maintain data across requests

2. **Unique Identification**
   - Each DO instance has a unique ID (in our case: Clerk user ID)
   - Same ID always routes to the same DO instance
   - Different IDs get different DO instances

3. **Transactional Storage**
   - `this.state.storage` provides ACID transactions
   - Operations are atomic - either all succeed or all fail
   - No need to worry about data corruption

4. **Request Serialization**
   - Multiple requests to same DO are processed one at a time
   - No race conditions within a single DO instance
   - Simplifies concurrent access patterns

## Implementation Architecture

### Class Structure

```typescript
export class InstitutionDraft extends DurableObject {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    // ctx: Access to storage, alarms, waitUntil
    // env: Your bindings (KV, D1, environment variables)
  }

  // Main HTTP handler
  async fetch(request: Request): Promise<Response> {
    // Route based on HTTP method and URL
  }

  // Alarm handler for scheduled tasks
  async alarm(): Promise<void> {
    // Triggered when scheduled alarm fires
  }
}
```

### Storage Patterns

#### Basic Operations
```typescript
// Store data
await this.state.storage.put("data", institutionData);

// Retrieve data
const data = await this.state.storage.get("data");

// Delete data
await this.state.storage.delete("data");

// Check if exists
const exists = (await this.state.storage.get("data")) !== undefined;
```

#### Data Structure
```typescript
// Use a simple key for our main data
const DATA_KEY = "data";

// Store the entire InstitutionDraftData object
const institutionData: InstitutionDraftData = {
  userId: "user_123",
  userEmail: "john@stanford.edu",
  emailDomain: "stanford.edu",
  // ... rest of the data
};

await this.state.storage.put(DATA_KEY, institutionData);
```

## HTTP Method Implementation

### GET - Retrieve Current Data

**Purpose**: Check if draft exists and return current state

**Logic Flow**:
1. Try to get data from storage
2. If data exists, return it with metadata
3. If no data, return "does not exist" response

**Response Patterns**:
```typescript
// Data exists
{ exists: true, status: "draft", userId: "user_123", data: {...} }

// No data
{ exists: false }
```

### POST - Create New Draft

**Purpose**: Initialize a new institution draft session

**Logic Flow**:
1. Check if data already exists (return 409 if it does)
2. Extract email domain from email address
3. Create new data object with timestamps
4. Store in DO storage
5. Return success response

**Key Considerations**:
- Only allow one draft per user
- Validate email domain before creating
- Set initial status to 'draft'
- Set currentStep to 'basic'

### PUT - Update Existing Draft

**Purpose**: Update draft with new information (form steps, admin actions)

**Logic Flow**:
1. Get existing data from storage
2. Merge new data with existing data
3. Update 'updatedAt' timestamp
4. Update status/step if needed
5. Store updated data
6. Return success response

**Key Considerations**:
- Always preserve existing data, only update provided fields
- Update timestamps appropriately
- Handle status transitions (draft → pending_verification)

### DELETE - Remove Draft

**Purpose**: Cancel the application completely

**Logic Flow**:
1. Delete data from storage
2. Return success confirmation

**Key Considerations**:
- Complete cleanup - no trace left
- Consider if you need to cleanup related data in KV/D1

## Alarm Implementation

### Scheduling Alarms

**When to Schedule**:
- After user confirms Clerk organization creation
- Delay allows for any propagation issues

**How to Schedule**:
```typescript
// Schedule alarm for 5 minutes from now
const alarmTime = new Date(Date.now() + 5 * 60 * 1000);
await this.state.storage.setAlarm(alarmTime);
```

### Alarm Handler

**Purpose**: Sync approved institution data to Supabase

**Logic Flow**:
1. Get current data from storage
2. Verify data is ready for sync (has Clerk org details)
3. Create institution record in Supabase
4. Mark sync as completed
5. Update storage with sync status

## Error Handling Patterns

### Storage Errors
```typescript
try {
  const data = await this.state.storage.get("data");
  // Process data
} catch (error) {
  console.error("Storage error:", error);
  return new Response(JSON.stringify({ error: "Storage unavailable" }), {
    status: 503,
    headers: { "Content-Type": "application/json" }
  });
}
```

### Validation Errors
```typescript
// Check required fields
if (!requestData.userId || !requestData.userEmail) {
  return new Response(JSON.stringify({ error: "Missing required fields" }), {
    status: 400,
    headers: { "Content-Type": "application/json" }
  });
}
```

### Conflict Errors
```typescript
// Check for existing data on POST
const existingData = await this.state.storage.get("data");
if (existingData) {
  return new Response(JSON.stringify({ error: "Draft already exists" }), {
    status: 409,
    headers: { "Content-Type": "application/json" }
  });
}
```

## Data Flow Understanding

### Step-by-Step Process

1. **User Creation Flow**:
   ```
   Frontend → API Route → DO.fetch(POST) → DO.storage.put() → Response
   ```

2. **Update Flow**:
   ```
   Frontend → API Route → DO.fetch(PUT) → DO.storage.get() → merge data → DO.storage.put() → Response
   ```

3. **Admin Review Flow**:
   ```
   Admin UI → API Route → DO.fetch(PUT) → update status → DO.storage.put() → Response
   ```

4. **Organization Confirmation Flow**:
   ```
   Frontend → API Route → DO.fetch(PUT) → update with Clerk details → schedule alarm → Response
   ```

5. **Supabase Sync Flow**:
   ```
   Alarm fires → DO.alarm() → sync to Supabase → mark completed → DO.storage.put()
   ```

## Integration Points

### With KV Storage
- DO handles the authoritative data
- KV provides fast domain lookups
- DO operations should update KV when needed

### With D1 Database
- DO handles session state
- D1 provides admin queries and analytics
- Keep D1 records lightweight (just references)

### With External Services
- Clerk: Verify organization creation
- Supabase: Final data storage
- Resend: Email notifications

## Testing Strategy

### Unit Testing Approach
1. **Mock the storage layer**:
   ```typescript
   const mockStorage = {
     get: jest.fn(),
     put: jest.fn(),
     delete: jest.fn()
   };
   ```

2. **Test each HTTP method individually**
3. **Test error conditions**
4. **Test data transformations**

### Integration Testing
1. **Use Wrangler dev environment**
2. **Test with real DO instances**
3. **Verify storage persistence**
4. **Test alarm functionality**

## Common Pitfalls and Solutions

### Pitfall 1: Forgetting Async/Await
```typescript
// Wrong
const data = this.state.storage.get("data");

// Correct
const data = await this.state.storage.get("data");
```

### Pitfall 2: Not Handling Missing Data
```typescript
// Wrong
const data = await this.state.storage.get("data");
return data.someProperty;

// Correct
const data = await this.state.storage.get("data");
if (!data) {
  return new Response(JSON.stringify({ exists: false }), { status: 200 });
}
return data.someProperty;
```

### Pitfall 3: Inconsistent JSON Responses
```typescript
// Establish consistent response format
function createResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
```

### Pitfall 4: Not Updating Timestamps
```typescript
// Always update timestamps on changes
const updatedData = {
  ...existingData,
  ...newData,
  updatedAt: new Date().toISOString()
};
```

## Implementation Checklist

### Basic Structure
- [ ] Class extends DurableObject
- [ ] Constructor calls super() and stores context/env
- [ ] fetch() method handles HTTP requests
- [ ] alarm() method handles scheduled tasks

### HTTP Methods
- [ ] GET: Returns data or { exists: false }
- [ ] POST: Creates new draft (409 if exists)
- [ ] PUT: Updates existing draft
- [ ] DELETE: Removes draft completely

### Error Handling
- [ ] Try/catch around storage operations
- [ ] Proper HTTP status codes
- [ ] Consistent error response format
- [ ] Validation of required fields

### Data Management
- [ ] Timestamp updates on all changes
- [ ] Email domain extraction
- [ ] Status transition handling
- [ ] Data merging for updates

### Advanced Features
- [ ] Alarm scheduling after org confirmation
- [ ] Supabase sync in alarm handler
- [ ] Proper async error handling

## Performance Considerations

### Storage Efficiency
- Store only necessary data in DO
- Use single key for main data object
- Consider data size limits

### Request Optimization
- Minimize storage operations per request
- Batch related operations when possible
- Handle errors gracefully to avoid retries

### Memory Management
- DOs can be garbage collected when idle
- Don't store large objects in memory
- Use storage for persistence, not instance variables

## Real Implementation Examples

### Fetch Method Structure
```typescript
async fetch(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method;

  try {
    switch (method) {
      case "GET":
        return await this.handleGet();
      case "POST":
        return await this.handlePost(request);
      case "PUT":
        return await this.handlePut(request);
      case "DELETE":
        return await this.handleDelete();
      default:
        return this.createResponse({ error: "Method not allowed" }, 405);
    }
  } catch (error) {
    console.error("DO Error:", error);
    return this.createResponse({ error: "Internal server error" }, 500);
  }
}
```

### Data Key Constants
```typescript
const DATA_KEY = "data";
const METADATA_KEY = "metadata";

// Use consistent keys throughout your implementation
```

### Response Helper
```typescript
private createResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
```

This guide provides the foundation for understanding and implementing your Institution Draft Durable Object. Refer back to specific sections as you implement each part of the system.
