import {
  pgTable,
  timestamp,
  varchar,
  uuid,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { tenant } from "../tenant";
import { location } from "./locations";

// --- Tables ---
export const agent = pgTable(
  "agent",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userClerkId: varchar("user_clerk_id").notNull().unique(),
    tenantClerkId: varchar("tenant_clerk_id")
      .notNull()
      .references(() => tenant.clerkId),
    locationId: uuid("location_id")
      .notNull()
      .references(() => location.id),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Indexes
    index("agent_user_clerk_id_idx").on(table.userClerkId),
    index("agent_tenant_clerk_id_idx").on(table.tenantClerkId),
    index("agent_location_id_idx").on(table.locationId),

    // Unique constraint to ensure a user can only have one agent per tenant
    // This is because the user can only signup to tenant with their tenant email domain(userx@tenant1.com), so if the user moves to a new tenant, they will use a different email (userx@tenant2.com)
    unique("agent_user_tenant_unique").on(
      table.userClerkId,
      table.tenantClerkId
    ),
    //
    unique("agent_user_location_unique").on(
      table.userClerkId,
      table.locationId
    ),
  ]
);

// --- Types ---
export type Agent = typeof agent.$inferSelect;
export type NewAgent = typeof agent.$inferInsert;

// --- Relations ---

export const agentRelations = relations(agent, ({ one }) => ({
  location: one(location, {
    fields: [agent.locationId],
    references: [location.id],
  }),
  tenant: one(tenant, {
    fields: [agent.tenantClerkId],
    references: [tenant.clerkId],
  }),
}));
