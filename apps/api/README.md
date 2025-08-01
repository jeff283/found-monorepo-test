# Foundly API

A Cloudflare Workers API built with Hono framework for the Foundly platform.

## Development

### Setup

```txt
npm install
npm run dev
```

### Testing

This project uses two types of tests:

#### Unit Tests
Run unit tests that test individual functions and components:
```txt
npm run test:unit
```

#### Integration Tests

Integration tests make real HTTP requests to test the complete API:

**Run with auto-start** (recommended):
```txt
npm run test:int
```

**Run in watch mode**:
```txt
npm run test:int:watch
```

The integration tests will automatically:
- Check if a dev server is running on `http://localhost:8787`
- If no server is found, automatically start one using `npm run dev`
- Run the tests against the server
- Clean up the server if it was auto-started

For manual control, you can start the server separately:
```txt
# Terminal 1
npm run dev

# Terminal 2  
npm run test:int
```

The integration tests are completely decoupled from the API implementation and test the actual HTTP endpoints. See `src/tests/integration/README.md` for more details.

### Deployment

```txt
npm run deploy
```

### Type Generation

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```
