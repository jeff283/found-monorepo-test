// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
// import { schema } from "./schema";

// const dbUrl = process.env.DATABASE_URL;
// if (!dbUrl) {
//   throw new Error("DATABASE_URL is not defined");
// }

// const client = postgres(dbUrl, { prepare: false });
// export const db = drizzle(client, {
//   schema,
//   logger: true,
// });
// lib/db.ts
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "./schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Factory: creates a fresh client per request
export function getDb() {
  let dbUrl: string | undefined;

  // Get from node
  dbUrl = process.env.DATABASE_URL;

  // Get from Cloudflare
  if (typeof process == "undefined") {
    const { env } = getCloudflareContext();
    dbUrl = env.DATABASE_URL; // from wrangler.toml
  }

  if (!dbUrl) {
    throw new Error("DATABASE_URL is not defined");
  }

  // ⚠️ Must disable prepare for serverless
  const client = postgres(dbUrl, { prepare: false });

  return drizzle(client, {
    schema,
    logger: true,
  });
}

// Drop-in export: lazy proxy so old `import { db }` keeps working
export const db: PostgresJsDatabase<typeof schema> = new Proxy(
  {} as PostgresJsDatabase<typeof schema>,
  {
    get(_, prop, receiver) {
      const instance = getDb();
      return Reflect.get(instance, prop, receiver);
    },
  }
);
