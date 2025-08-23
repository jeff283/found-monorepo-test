import {
  pgTable,
  timestamp,
  varchar,
  uuid,
  pgEnum,
  index,
  unique,
  foreignKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenant } from "../tenant";
import { relations } from "drizzle-orm";
import { agent } from "./agent";

// --- Enums ---
const statusEnumValues = ["active", "inactive"] as const;
export const locationStatusEnum = pgEnum("location_status", statusEnumValues);
// --- Main Table ---
export const location = pgTable(
  "location",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    tenantClerkId: varchar("tenant_clerk_id")
      .notNull()
      .references(() => tenant.clerkId),

    name: varchar("name", { length: 100 }).notNull(),
    floor: varchar("floor", { length: 100 }),
    room: varchar("room", { length: 100 }),

    typeId: uuid("type_id")
      .notNull()
      .references(() => locationType.id),
    status: locationStatusEnum("status").notNull().default("active"),
    buildingId: uuid("building_id")
      .notNull()
      // Locations will be deleted when buildings are deleted
      .references(() => building.id, { onDelete: "cascade" }),

    // --- Address Fields ---
    street: varchar("street", { length: 255 }),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    country: varchar("country", { length: 100 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Indexes
    index("location_name_idx").on(table.name),
    index("location_tenant_clerk_id_idx").on(table.tenantClerkId),
    index("location_type_id_idx").on(table.typeId),
    index("location_building_id_idx").on(table.buildingId),
    index("location_status_id_idx").on(table.status),

    //  composite foreign key to ensure type + tenant match
    foreignKey({
      columns: [table.typeId, table.tenantClerkId],
      foreignColumns: [locationType.id, locationType.tenantClerkId],
      name: "fk_location_type_tenant",
    }),

    //  composite foreign key to ensure building + tenant match
    foreignKey({
      columns: [table.buildingId, table.tenantClerkId],
      foreignColumns: [building.id, building.tenantClerkId],
      name: "fk_location_building_tenant",
    }),
  ]
);
// --- Lookup Tables ---
export const locationType = pgTable(
  "location_type",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    tenantClerkId: varchar("tenant_clerk_id")
      .notNull()
      .references(() => tenant.clerkId),
    code: varchar("code", { length: 50 }).notNull(), // e.g. 'desk'
    label: varchar("label", { length: 100 }).notNull(), // e.g. 'Desk'

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("location_type_tenant_code_idx").on(table.tenantClerkId, table.code),
    unique("location_type_tenant_code").on(table.tenantClerkId, table.code),
    unique("location_type_id_tenant_unique").on(table.id, table.tenantClerkId),
  ]
);

export const building = pgTable(
  "building",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    tenantClerkId: varchar("tenant_clerk_id")
      .notNull()
      .references(() => tenant.clerkId),
    name: varchar("name", { length: 100 }).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("building_tenant_name_idx").on(table.tenantClerkId, table.name),
    unique("building_tenant_name").on(table.tenantClerkId, table.name),
    unique("building_id_tenant_unique").on(table.id, table.tenantClerkId),
  ]
);

// tables
export const tables = {
  location,
  locationType,
  building,
};

// --- Types ---
// Location
export type Location = typeof location.$inferSelect;
export type NewLocation = typeof location.$inferInsert;

// Building
export type Building = typeof building.$inferSelect;
export type NewBuilding = typeof building.$inferInsert;

// Location Type
export type LocationType = typeof locationType.$inferSelect;
export type NewLocationType = typeof locationType.$inferInsert;

// Status
export type LocationStatus = (typeof statusEnumValues)[number];

// --- Relations ---
export const locationRelations = relations(location, ({ one, many }) => ({
  tenant: one(tenant, {
    fields: [location.tenantClerkId],
    references: [tenant.clerkId],
  }),
  type: one(locationType, {
    fields: [location.typeId],
    references: [locationType.id],
  }),
  building: one(building, {
    fields: [location.buildingId],
    references: [building.id],
  }),
  agents: many(agent),
}));

export const locationTypeRelations = relations(
  locationType,
  ({ one, many }) => ({
    tenant: one(tenant, {
      fields: [locationType.tenantClerkId],
      references: [tenant.clerkId],
    }),
    locations: many(location),
  })
);

export const buildingRelations = relations(building, ({ one, many }) => ({
  tenant: one(tenant, {
    fields: [building.tenantClerkId],
    references: [tenant.clerkId],
  }),
  locations: many(location),
}));

// External Relations
// One location can have many agents
