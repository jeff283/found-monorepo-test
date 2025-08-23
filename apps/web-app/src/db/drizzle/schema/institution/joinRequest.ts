import {
  pgTable,
  timestamp,
  varchar,
  uuid,
  index,
  unique,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { tenant } from "../tenant";

// --- Enums ---
export const joinRequestStatusEnum = pgEnum("join_request_status", [
  "pending",
  "approved",
  "rejected",
]);

// --- Tables ---
export const joinRequest = pgTable(
  "join_request",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    // Clerk user who is requesting to join
    userClerkId: varchar("user_clerk_id").notNull(),

    // Org/Tenant they want to join (maps to your tenant table)
    tenantClerkId: varchar("tenant_clerk_id")
      .notNull()
      .references(() => tenant.clerkId),

    // Email used in the request
    email: varchar("email").notNull(),

    // Request status as enum
    status: joinRequestStatusEnum("status").notNull().default("pending"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Indexes for fast lookups
    index("join_request_user_idx").on(table.userClerkId),
    index("join_request_tenant_idx").on(table.tenantClerkId),

    // Unique: prevent multiple requests per user/org
    unique("join_request_user_tenant_unique").on(
      table.userClerkId,
      table.tenantClerkId
    ),
  ]
);

// --- Types ---
export type JoinRequest = typeof joinRequest.$inferSelect;
export type NewJoinRequest = typeof joinRequest.$inferInsert;

// --- Relations ---
export const joinRequestRelations = relations(joinRequest, ({ one }) => ({
  tenant: one(tenant, {
    fields: [joinRequest.tenantClerkId],
    references: [tenant.clerkId],
  }),
}));
