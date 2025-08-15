import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "@/db/drizzle/schema";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error("DATABASE_URL is not defined");
}

const client = postgres(dbUrl, { prepare: false });
export const db = drizzle(client, {
  schema,
  logger: true,
});
