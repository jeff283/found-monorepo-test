import { db } from "./db";
import { createClient } from "@/database/supabase/client";
import {
  userProfiles,
  organizations,
  joinRequests,
  organizationMembers,
  type InsertUserProfile,
  type InsertOrganization,
  type InsertJoinRequest,
  type InsertOrganizationMember,
} from "./schema";
import { eq, and } from "drizzle-orm";

/**
 * Database operations using Drizzle ORM
 * These functions provide a hybrid approach - using Drizzle for complex queries
 * while maintaining Supabase client for RLS and real-time features when needed
 */

// User Profile Operations
export async function createUserProfile(data: InsertUserProfile) {
  const result = await db.insert(userProfiles).values(data).returning();
  return result[0];
}

export async function getUserProfileByClerkId(clerkUserId: string) {
  const result = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.clerkUserId, clerkUserId))
    .limit(1);
  return result[0] || null;
}

export async function updateUserProfile(
  clerkUserId: string,
  data: Partial<InsertUserProfile>
) {
  const result = await db
    .update(userProfiles)
    .set(data)
    .where(eq(userProfiles.clerkUserId, clerkUserId))
    .returning();
  return result[0];
}

// Organization Operations
export async function createOrganization(data: InsertOrganization) {
  const result = await db.insert(organizations).values(data).returning();
  return result[0];
}

export async function getOrganizationByDomain(domain: string) {
  const result = await db
    .select()
    .from(organizations)
    .where(eq(organizations.domain, domain))
    .limit(1);
  return result[0] || null;
}

export async function getOrganizationById(id: string) {
  const result = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, id))
    .limit(1);
  return result[0] || null;
}

// Join Request Operations
export async function createJoinRequest(data: InsertJoinRequest) {
  const result = await db.insert(joinRequests).values(data).returning();
  return result[0];
}

export async function getJoinRequestByUserAndOrganization(
  clerkUserId: string,
  organizationId: string
) {
  const result = await db
    .select()
    .from(joinRequests)
    .where(
      and(
        eq(joinRequests.clerkUserId, clerkUserId),
        eq(joinRequests.organizationId, organizationId)
      )
    )
    .limit(1);
  return result[0] || null;
}

export async function getPendingJoinRequestsForOrganization(
  organizationId: string
) {
  const result = await db
    .select()
    .from(joinRequests)
    .where(
      and(
        eq(joinRequests.organizationId, organizationId),
        eq(joinRequests.status, "pending")
      )
    );
  return result;
}

export async function approveJoinRequest(
  requestId: string,
  reviewedBy: string
) {
  // Start a transaction to approve request and add member
  const result = await db.transaction(async (tx) => {
    // Update the join request
    const [updatedRequest] = await tx
      .update(joinRequests)
      .set({
        status: "approved",
        reviewedAt: new Date(),
        reviewedBy,
      })
      .where(eq(joinRequests.id, requestId))
      .returning();

    // Add the user as an organization member
    if (updatedRequest) {
      await tx.insert(organizationMembers).values({
        organizationId: updatedRequest.organizationId!,
        clerkUserId: updatedRequest.clerkUserId,
        role: "member",
      });
    }

    return updatedRequest;
  });

  return result;
}

export async function rejectJoinRequest(requestId: string, reviewedBy: string) {
  const result = await db
    .update(joinRequests)
    .set({
      status: "rejected",
      reviewedAt: new Date(),
      reviewedBy,
    })
    .where(eq(joinRequests.id, requestId))
    .returning();
  return result[0];
}

// Organization Member Operations
export async function addOrganizationMember(data: InsertOrganizationMember) {
  const result = await db.insert(organizationMembers).values(data).returning();
  return result[0];
}

export async function getUserOrganizations(clerkUserId: string) {
  const result = await db
    .select({
      organization: organizations,
      membership: organizationMembers,
    })
    .from(organizationMembers)
    .innerJoin(
      organizations,
      eq(organizationMembers.organizationId, organizations.id)
    )
    .where(eq(organizationMembers.clerkUserId, clerkUserId));

  return result;
}

export async function getOrganizationMembers(organizationId: string) {
  const result = await db
    .select({
      member: organizationMembers,
      profile: userProfiles,
    })
    .from(organizationMembers)
    .innerJoin(
      userProfiles,
      eq(organizationMembers.clerkUserId, userProfiles.clerkUserId)
    )
    .where(eq(organizationMembers.organizationId, organizationId));

  return result;
}

export async function isUserOrganizationAdmin(
  clerkUserId: string,
  organizationId: string
) {
  const result = await db
    .select()
    .from(organizationMembers)
    .where(
      and(
        eq(organizationMembers.clerkUserId, clerkUserId),
        eq(organizationMembers.organizationId, organizationId),
        eq(organizationMembers.role, "admin")
      )
    )
    .limit(1);

  return result.length > 0;
}

/**
 * Hybrid function that uses Supabase client for RLS-enabled queries
 * Use this when you need RLS policies to be enforced
 */
export async function getOrganizationsWithRLS() {
  const supabase = createClient();
  const { data, error } = await supabase.from("organizations").select("*");

  if (error) throw error;
  return data;
}

/**
 * Real-time subscription helper using Supabase
 * Use this for real-time features like live join request updates
 */
export function subscribeToJoinRequests(
  organizationId: string,
  callback: (payload: {
    eventType: "INSERT" | "UPDATE" | "DELETE";
    new: Record<string, unknown>;
    old: Record<string, unknown>;
  }) => void
) {
  const supabase = createClient();

  return supabase
    .channel(`join_requests_${organizationId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "join_requests",
        filter: `organization_id=eq.${organizationId}`,
      },
      callback
    )
    .subscribe();
}
