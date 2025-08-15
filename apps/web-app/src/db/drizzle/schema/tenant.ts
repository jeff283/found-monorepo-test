import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const tenantSchema = pgTable("tenant", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  clerkId: varchar("clerk_id").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  emailDomain: varchar("email_domain", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Tenant = typeof tenantSchema.$inferSelect;
export type NewTenant = typeof tenantSchema.$inferInsert;
