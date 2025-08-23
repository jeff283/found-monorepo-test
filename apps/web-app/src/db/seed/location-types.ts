import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import {
  LocationType,
  locationType,
} from "@/db/drizzle/schema/institution/locations";

export const defaultLocationTypes = [
  { code: "desk", label: "Desk" },
  { code: "office", label: "Office" },
  { code: "kiosk", label: "Kiosk" },
  { code: "zone", label: "Zone" },
];

/**
 * Seed default location types for a tenant.
 * Returns the number of types inserted.
 */

type SeedLocationTypesResult = {
  count: number;
  locationTypes: LocationType[];
};

export async function seedLocationTypesForTenant(
  tenantId: string
): Promise<SeedLocationTypesResult> {
  const valuesToInsert = defaultLocationTypes.map((type) => ({
    tenantClerkId: tenantId,
    code: type.code,
    label: type.label,
  }));
  await db
    .insert(locationType)
    .values(valuesToInsert)
    .onConflictDoNothing({
      target: [locationType.tenantClerkId, locationType.code],
    });
  // Returns all location types for the tenant, including pre-existing ones

  const existing = await db
    .select()
    .from(locationType)
    .where(eq(locationType.tenantClerkId, tenantId));

  return {
    count: existing.length,
    locationTypes: existing,
  };
}
