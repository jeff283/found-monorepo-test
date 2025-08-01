import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Common timestamp columns for reuse
export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

// Enums
export const joinRequestStatusEnum = pgEnum("join_request_status", [
  "pending",
  "approved",
  "rejected",
]);
export const memberRoleEnum = pgEnum("member_role", ["admin", "member"]);

// User Profiles Table
// This table stores additional user information not managed by Clerk
// clerk_user_id should match the ID from Clerk authentication
export const userProfiles = pgTable(
  "user_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").unique().notNull(), // This should match Clerk's user ID
    email: text("email").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    jobTitle: text("job_title"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("idx_user_profiles_clerk_user_id").on(table.clerkUserId),
  ]
);

// Organizations Table
// This table stores organization information
export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    domain: text("domain").unique().notNull(), // Email domain like "university.edu"
    description: text("description"),
    logoUrl: text("logo_url"),
    createdBy: text("created_by").references(() => userProfiles.clerkUserId),
    ...timestamps,
  },
  (table) => [uniqueIndex("idx_organizations_domain").on(table.domain)]
);

// Join Requests Table
// This table stores requests from users to join organizations
export const joinRequests = pgTable(
  "join_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    clerkUserId: text("clerk_user_id").notNull(),
    userEmail: text("user_email").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    status: joinRequestStatusEnum("status").default("pending"),
    requestedAt: timestamp("requested_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewedBy: text("reviewed_by").references(() => userProfiles.clerkUserId),
  },
  (table) => [
    index("idx_join_requests_organization_id").on(table.organizationId),
    index("idx_join_requests_clerk_user_id").on(table.clerkUserId),
    index("idx_join_requests_status").on(table.status),
  ]
);

// Organization Members Table
// This table tracks which users belong to which organizations
export const organizationMembers = pgTable(
  "organization_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    clerkUserId: text("clerk_user_id").references(
      () => userProfiles.clerkUserId,
      { onDelete: "cascade" }
    ),
    role: memberRoleEnum("role").default("member"),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_organization_members_organization_id").on(table.organizationId),
    index("idx_organization_members_clerk_user_id").on(table.clerkUserId),
    uniqueIndex("unique_organization_member").on(
      table.organizationId,
      table.clerkUserId
    ),
  ]
);

// Relations
export const userProfilesRelations = relations(userProfiles, ({ many }) => ({
  createdOrganizations: many(organizations),
  organizationMemberships: many(organizationMembers),
  reviewedJoinRequests: many(joinRequests, { relationName: "reviewer" }),
}));

export const organizationsRelations = relations(
  organizations,
  ({ one, many }) => ({
    creator: one(userProfiles, {
      fields: [organizations.createdBy],
      references: [userProfiles.clerkUserId],
    }),
    joinRequests: many(joinRequests),
    members: many(organizationMembers),
  })
);

export const joinRequestsRelations = relations(joinRequests, ({ one }) => ({
  organization: one(organizations, {
    fields: [joinRequests.organizationId],
    references: [organizations.id],
  }),
  reviewer: one(userProfiles, {
    fields: [joinRequests.reviewedBy],
    references: [userProfiles.clerkUserId],
    relationName: "reviewer",
  }),
}));

export const organizationMembersRelations = relations(
  organizationMembers,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [organizationMembers.organizationId],
      references: [organizations.id],
    }),
    user: one(userProfiles, {
      fields: [organizationMembers.clerkUserId],
      references: [userProfiles.clerkUserId],
    }),
  })
);

// Type exports for use in your application
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

export type JoinRequest = typeof joinRequests.$inferSelect;
export type InsertJoinRequest = typeof joinRequests.$inferInsert;

export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type InsertOrganizationMember = typeof organizationMembers.$inferInsert;
