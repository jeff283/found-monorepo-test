import { pgTable, timestamp, varchar, uuid, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const tenant = pgTable(
  "tenant",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    clerkId: varchar("clerk_id").notNull().unique(),
    name: varchar("name", { length: 100 }).notNull(),
    emailDomain: varchar("email_domain", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("tenant_clerk_id_index").on(table.clerkId)]
);

export type Tenant = typeof tenant.$inferSelect;
export type NewTenant = typeof tenant.$inferInsert;
