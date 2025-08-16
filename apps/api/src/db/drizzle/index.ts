import { env } from "cloudflare:workers";
import { schema } from "@/web-app/db/drizzle/schema";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const dbUrl = env.DATABASE_URL;

// if (!dbUrl) {
//   throw new Error("DATABASE_URL is not defined");
// }

const client = postgres(dbUrl, { prepare: false });
export const db = drizzle(client, {
  schema,
  logger: true,
});
