"use server";
import { db } from "@/db/drizzle";
import z from "zod";
import { ApiResponse } from "@/api/lib/types";
import { eq, desc, and, count } from "drizzle-orm";
import {
  requireInstitutionAuth,
  handleAuthError,
} from "@/utils/institution-auth-handler";
import {
  building,
  NewBuilding,
  Building,
  locationType,
  NewLocationType,
  LocationType,
  location,
  Location,
  NewLocation,
  LocationStatus,
} from "@/db/drizzle/schema/institution/locations";
import { parseZodError } from "@/utils/zod-error-parse";
import { seedLocationTypesForTenant } from "@/db/seed/location-types";

// BUILDINGS
// Validation schema for new building
const createBuildingSchema = z.object({
  name: z
    .string()
    .min(1, "Building name is required")
    .max(100, "Building name must be less than 100 characters"),
});

export type createBuildingInput = z.infer<typeof createBuildingSchema>;
export type createBuildingResponse = ApiResponse<Building>;
export async function createBuilding(
  buildingData: createBuildingInput
): Promise<createBuildingResponse> {
  try {
    // Get current user and organization
    const { orgId } = await requireInstitutionAuth();

    // Validate input data
    const validatedData = createBuildingSchema.parse(buildingData);

    // Attempt to insert building (DB enforces uniqueness)
    const newBuilding: NewBuilding = {
      tenantClerkId: orgId,
      name: validatedData.name,
    };

    const [insertedBuilding] = await db
      .insert(building)
      .values(newBuilding)
      //instead of checking the db for uniqueness , I simplified the round trips and let the db check for uniqueness
      .onConflictDoNothing({ target: [building.tenantClerkId, building.name] })
      .returning();

    if (!insertedBuilding) {
      return {
        success: false,
        error: "A building with this name already exists",
      };
    }

    return {
      success: true,
      data: insertedBuilding,
    };
  } catch (error) {
    console.error("Error creating building:", error);

    const zodError = parseZodError(error);
    if (zodError) {
      return zodError;
    }

    const authError = handleAuthError(error);
    if (authError) {
      return authError;
    }

    return {
      success: false,
      error: "Failed to create building. Please try again.",
    };
  }
}

// Get buildings of a specific tenant

// Get a single building of a specific tenant
const getBuildingSchema = z.object({
  buildingId: z.uuid("Building ID must be a valid UUID"),
});

export async function getBuilding(
  buildingId: string
): Promise<ApiResponse<Building>> {
  try {
    // Get current user and organization
    const { orgId } = await requireInstitutionAuth();

    // Validate input data
    const validatedData = getBuildingSchema.parse({ buildingId });

    // Query the building
    const [foundBuilding] = await db
      .select()
      .from(building)
      .where(
        and(
          eq(building.id, validatedData.buildingId),
          eq(building.tenantClerkId, orgId)
        )
      )
      .limit(1);

    if (!foundBuilding) {
      return {
        success: false,
        error: "Building not found",
      };
    }

    return {
      success: true,
      data: foundBuilding,
    };
  } catch (error) {
    console.error("Error getting building:", error);

    const zodError = parseZodError(error);
    if (zodError) {
      return zodError;
    }
    const authError = handleAuthError(error);
    if (authError) {
      return authError;
    }

    return {
      success: false,
      error: "Failed to get building. Please try again.",
    };
  }
}

// Get buildings of a specific tenant with optional pagination
const getBuildingsSchema = z
  .object({
    limit: z.number().min(1).max(100).optional().default(10),
    offset: z.number().min(0).optional().default(0),
    getAll: z.boolean().optional().default(false),
  })
  .default({
    limit: 10,
    offset: 0,
    getAll: false,
  });
export type GetBuildingsResponse = ApiResponse<{
  buildings: Building[];
  total: number;
}>;

export async function getBuildings(
  options?: z.infer<typeof getBuildingsSchema>
): Promise<GetBuildingsResponse> {
  try {
    const { orgId } = await requireInstitutionAuth();

    const validatedOptions = getBuildingsSchema.parse(options);

    // Base count query (needed in both cases)
    const [{ count: buildingsCount }] = await db
      .select({ count: count() })
      .from(building)
      .where(eq(building.tenantClerkId, orgId));

    if (Number(buildingsCount) === 0) {
      return {
        success: true,
        data: { buildings: [], total: 0 },
      };
    }

    // Define queries separately
    const paginatedQuery = db
      .select()
      .from(building)
      .where(eq(building.tenantClerkId, orgId))
      .orderBy(desc(building.createdAt))
      .limit(validatedOptions.limit)
      .offset(validatedOptions.offset);

    const allQuery = db
      .select()
      .from(building)
      .where(eq(building.tenantClerkId, orgId))
      .orderBy(desc(building.createdAt));

    // Execute the right one
    const buildings = validatedOptions.getAll
      ? await allQuery
      : await paginatedQuery;

    return {
      success: true,
      data: { buildings, total: Number(buildingsCount) },
    };
  } catch (error) {
    console.error("Error getting buildings:", error);

    const zodError = parseZodError(error);
    if (zodError) {
      return zodError;
    }

    const authError = handleAuthError(error);
    if (authError) {
      return authError;
    }

    return {
      success: false,
      error: "Failed to get buildings. Please try again.",
    };
  }
}

// LOCATION TYPES
// Validation schema for new location type
const createLocationTypeSchema = z.object({
  code: z
    .string()
    .min(1, "Location type code is required")
    .max(50, "Location type code must be less than 50 characters"),
  label: z
    .string()
    .min(1, "Location type label is required")
    .max(100, "Location type label must be less than 100 characters"),
});

export async function createLocationType(
  locationTypeData: z.infer<typeof createLocationTypeSchema>
): Promise<ApiResponse<LocationType>> {
  try {
    // Get current user and organization
    const { orgId } = await requireInstitutionAuth();

    // Validate input data
    const validatedData = createLocationTypeSchema.parse(locationTypeData);

    // Attempt to insert location type (DB enforces uniqueness)
    const newLocationType: NewLocationType = {
      tenantClerkId: orgId,
      code: validatedData.code,
      label: validatedData.label,
    };

    const [insertedLocationType] = await db
      .insert(locationType)
      .values(newLocationType)
      .onConflictDoNothing({
        target: [locationType.tenantClerkId, locationType.code],
      })
      .returning();

    if (!insertedLocationType) {
      return {
        success: false,
        error: "A location type with this code already exists",
      };
    }

    return {
      success: true,
      data: insertedLocationType,
    };
  } catch (error) {
    console.error("Error creating location type:", error);

    const zodError = parseZodError(error);
    if (zodError) {
      return zodError;
    }

    const authError = handleAuthError(error);
    if (authError) {
      return authError;
    }

    return {
      success: false,
      error: "Failed to create location type. Please try again.",
    };
  }
}

// Get a single location type of a specific tenant
const getLocationTypeSchema = z.object({
  locationTypeId: z.uuid("Location type ID must be a valid UUID"),
});

export async function getLocationType(
  locationTypeId: string
): Promise<ApiResponse<LocationType>> {
  try {
    // Get current user and organization
    const { orgId } = await requireInstitutionAuth();

    // Validate input data
    const validatedData = getLocationTypeSchema.parse({ locationTypeId });

    // Query the location type
    const [foundLocationType] = await db
      .select()
      .from(locationType)
      .where(
        and(
          eq(locationType.id, validatedData.locationTypeId),
          eq(locationType.tenantClerkId, orgId)
        )
      )
      .limit(1);

    if (!foundLocationType) {
      return {
        success: false,
        error: "Location type not found",
      };
    }

    return {
      success: true,
      data: foundLocationType,
    };
  } catch (error) {
    console.error("Error getting location type:", error);

    const zodError = parseZodError(error);
    if (zodError) {
      return zodError;
    }
    const authError = handleAuthError(error);
    if (authError) {
      return authError;
    }

    return {
      success: false,
      error: "Failed to get location type. Please try again.",
    };
  }
}

// Get location types of a specific tenant with optional pagination
const getLocationTypesSchema = z
  .object({
    limit: z.number().min(1).max(100).optional().default(10),
    offset: z.number().min(0).optional().default(0),
    getAll: z.boolean().optional().default(false),
  })
  .default({
    limit: 10,
    offset: 0,
    getAll: false,
  });

export type getLocationTypesResponse = ApiResponse<{
  locationTypes: LocationType[];
  total: number;
}>;

export async function getLocationTypes(
  options?: z.infer<typeof getLocationTypesSchema>
): Promise<getLocationTypesResponse> {
  try {
    const { orgId } = await requireInstitutionAuth();
    const { limit, offset, getAll } = getLocationTypesSchema.parse(options);

    // Check if tenant has any location types
    let [{ count: locationTypesCount }] = await db
      .select({ count: count() })
      .from(locationType)
      .where(eq(locationType.tenantClerkId, orgId));

    let locationTypes: LocationType[] = [];

    if (Number(locationTypesCount) === 0) {
      // Seed defaults if empty
      const seedResult = await seedLocationTypesForTenant(orgId);
      locationTypes = seedResult.locationTypes;
      locationTypesCount = locationTypes.length;
    } else {
      // Fetch paginated or all rows from DB
      // Query to get all rows
      const allQuery = db
        .select()
        .from(locationType)
        .where(eq(locationType.tenantClerkId, orgId))
        .orderBy(desc(locationType.createdAt));

      // Query to get paginated rows
      const paginatedQuery = db
        .select()
        .from(locationType)
        .where(eq(locationType.tenantClerkId, orgId))
        .orderBy(desc(locationType.createdAt))
        .limit(limit)
        .offset(offset);

      // Execute the right query
      locationTypes = getAll ? await allQuery : await paginatedQuery;
    }

    return {
      success: true,
      data: { locationTypes, total: Number(locationTypesCount) },
    };
  } catch (error) {
    console.error("Error getting location types:", error);

    const zodError = parseZodError(error);
    if (zodError) return zodError;

    const authError = handleAuthError(error);
    if (authError) return authError;

    return {
      success: false,
      error: "Failed to get location types. Please try again.",
    };
  }
}

export async function seedDefaultLocationTypes() {
  const { orgId } = await requireInstitutionAuth();

  await seedLocationTypesForTenant(orgId);
}

// --- LOCATIONS ---
// Validation schema for new location
const createLocationSchema = z.object({
  name: z
    .string()
    .min(1, "Location name is required")
    .max(100, "Location name must be less than 100 characters"),
  floor: z
    .string()
    .max(100, "Floor must be less than 100 characters")
    .optional(),
  room: z.string().max(100, "Room must be less than 100 characters").optional(),
  typeId: z.uuid("Location type ID must be a valid UUID"),
  buildingId: z.uuid("Building ID must be a valid UUID"),
  status: z.enum(["active", "inactive"]).optional().default("active"),
});

export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type CreateLocationResponse = ApiResponse<Location>;

export async function createLocation(
  locationData: CreateLocationInput
): Promise<CreateLocationResponse> {
  try {
    const { orgId } = await requireInstitutionAuth();

    // Validate input
    const validatedData = createLocationSchema.parse(locationData);

    // Directly insert — rely on FK constraints
    const [insertedLocation] = await db
      .insert(location)
      .values({
        tenantClerkId: orgId,
        name: validatedData.name,
        floor: validatedData.floor,
        room: validatedData.room,
        typeId: validatedData.typeId,
        buildingId: validatedData.buildingId,
        status: validatedData.status,
      })
      .returning();

    return { success: true, data: insertedLocation };
  } catch (error) {
    console.error("Error creating location:", error);

    // Validation errors
    const zodError = parseZodError(error);
    if (zodError) {
      return zodError;
    }

    // DB constraint violations
    if (error instanceof Error && "code" in error) {
      if (error.code === "23503") {
        // foreign key violation
        return {
          success: false,
          error: "Invalid building or location type for this tenant.",
        };
      }

      if (error.code === "23505") {
        // unique violation
        return {
          success: false,
          error: "This location already exists for your tenant.",
        };
      }
    }

    const authError = handleAuthError(error);
    if (authError) return authError;

    return {
      success: false,
      error: "Failed to create location. Please try again.",
    };
  }
}

// Get a single location of a specific tenant
const getLocationSchema = z.object({
  locationId: z.uuid("Location ID must be a valid UUID"),
});

export type LocationWithRelations = {
  id: string;
  name: string;
  floor: string | null;
  room: string | null;
  status: LocationStatus;
  type: {
    id: string;
    code: string;
    label: string;
  } | null;
  building: {
    id: string;
    name: string;
  } | null;
};
export type GetLocationResponse = ApiResponse<LocationWithRelations>;

export async function getLocation(
  locationId: string
): Promise<GetLocationResponse> {
  try {
    // Get current user and organization
    const { orgId } = await requireInstitutionAuth();

    // Validate input data
    const validatedData = getLocationSchema.parse({ locationId });

    // Query the location
    const [foundLocation] = await db
      .select({
        id: location.id,
        name: location.name,
        floor: location.floor,
        room: location.room,
        status: location.status,
        type: {
          id: locationType.id,
          code: locationType.code,
          label: locationType.label,
        },
        building: {
          id: building.id,
          name: building.name,
        },
      })
      .from(location)
      .leftJoin(
        locationType,
        and(
          eq(location.typeId, locationType.id),
          eq(location.tenantClerkId, locationType.tenantClerkId)
        )
      )
      .leftJoin(
        building,
        and(
          eq(location.buildingId, building.id),
          eq(location.tenantClerkId, building.tenantClerkId)
        )
      )
      .where(
        and(
          eq(location.id, validatedData.locationId),
          eq(location.tenantClerkId, orgId)
        )
      )
      .limit(1);

    if (!foundLocation) {
      return {
        success: false,
        error: "Location not found",
      };
    }

    return {
      success: true,
      data: foundLocation,
    };
  } catch (error) {
    console.error("Error getting location:", error);

    const zodError = parseZodError(error);
    if (zodError) {
      return zodError;
    }

    const authError = handleAuthError(error);
    if (authError) {
      return authError;
    }

    return {
      success: false,
      error: "Failed to get location. Please try again.",
    };
  }
}

// Get locations of a specific tenant with optional pagination
const getLocationsInput = z.object({
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
  getAll: z.boolean().optional(),
  buildingId: z.uuid().optional(),
  typeId: z.uuid().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

const getLocationsSchema = getLocationsInput.transform((data) => ({
  limit: data.limit ?? 10,
  offset: data.offset ?? 0,
  getAll: data.getAll ?? false,
  ...data,
}));

export type GetLocationsResponse = ApiResponse<{
  locations: LocationWithRelations[];
  total: number;
}>;

export async function getLocations(
  options?: z.input<typeof getLocationsInput>
): Promise<GetLocationsResponse> {
  try {
    const { orgId } = await requireInstitutionAuth();
    const validatedOptions = getLocationsSchema.parse(options ?? {});
    // Build where conditions
    const whereConditions = [eq(location.tenantClerkId, orgId)];

    if (validatedOptions.buildingId) {
      whereConditions.push(
        eq(location.buildingId, validatedOptions.buildingId)
      );
    }
    if (validatedOptions.typeId) {
      whereConditions.push(eq(location.typeId, validatedOptions.typeId));
    }
    if (validatedOptions.status) {
      whereConditions.push(eq(location.status, validatedOptions.status));
    }

    // Base count query
    const [{ count: locationsCount }] = await db
      .select({ count: count() })
      .from(location)
      .where(and(...whereConditions));

    if (Number(locationsCount) === 0) {
      return {
        success: true,
        data: { locations: [], total: 0 },
      };
    }

    // Define base query with joins
    const baseQuery = db
      .select({
        id: location.id,
        name: location.name,
        floor: location.floor,
        room: location.room,
        status: location.status,
        type: {
          id: locationType.id,
          code: locationType.code,
          label: locationType.label,
        },
        building: {
          id: building.id,
          name: building.name,
        },
      })
      .from(location)
      .leftJoin(
        locationType,
        and(
          eq(location.typeId, locationType.id),
          eq(location.tenantClerkId, locationType.tenantClerkId)
        )
      )
      .leftJoin(
        building,
        and(
          eq(location.buildingId, building.id),
          eq(location.tenantClerkId, building.tenantClerkId)
        )
      )
      .where(and(...whereConditions))
      .orderBy(desc(location.createdAt));

    // Execute the right query based on pagination
    const locations = validatedOptions.getAll
      ? await baseQuery
      : await baseQuery
          .limit(validatedOptions.limit)
          .offset(validatedOptions.offset);

    return {
      success: true,
      data: { locations, total: Number(locationsCount) },
    };
  } catch (error) {
    console.error("Error getting locations:", error);

    const zodError = parseZodError(error);
    if (zodError) {
      return zodError;
    }

    const authError = handleAuthError(error);
    if (authError) return authError;

    return {
      success: false,
      error: "Failed to get locations. Please try again.",
    };
  }
}

// Update location schema
// Update location schema (reuse instead of redefining everything)
const updateLocationSchema = createLocationSchema.partial().extend({
  locationId: z.uuid("Location ID must be a valid UUID"),
});

// Utility to remove undefined values
function removeUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

export async function updateLocation(
  locationData: z.infer<typeof updateLocationSchema>
): Promise<ApiResponse<Location>> {
  try {
    const { orgId } = await requireInstitutionAuth();

    const validatedData = updateLocationSchema.parse(locationData);

    // Prepare update payload (only defined fields)
    const updateData: Partial<NewLocation> = removeUndefined({
      name: validatedData.name,
      floor: validatedData.floor,
      room: validatedData.room,
      typeId: validatedData.typeId,
      buildingId: validatedData.buildingId,
      status: validatedData.status,
    });

    // Perform update directly — rely on FK + tenant constraints
    const [updatedLocation] = await db
      .update(location)
      .set({ ...updateData, updatedAt: new Date() })
      .where(
        and(
          eq(location.id, validatedData.locationId),
          eq(location.tenantClerkId, orgId)
        )
      )
      .returning();

    if (!updatedLocation) {
      return {
        success: false,
        error: "Location not found or does not belong to your organization",
      };
    }

    return { success: true, data: updatedLocation };
  } catch (error) {
    console.error("Error updating location:", error);

    const zodError = parseZodError(error);
    if (zodError) {
      return zodError;
    }

    const authError = handleAuthError(error);
    if (authError) {
      return authError;
    }

    return {
      success: false,
      error: "Failed to update location. Please try again.",
    };
  }
}

// Delete location schema
const deleteLocationSchema = z.object({
  locationId: z.uuid("Location ID must be a valid UUID"),
});

export async function deleteLocation(
  locationId: string
): Promise<ApiResponse<{ deleted: boolean }>> {
  try {
    // Get current user and organization
    const { orgId, orgRole } = await requireInstitutionAuth();

    // Validate input
    const { locationId: validatedLocationId } = deleteLocationSchema.parse({
      locationId,
    });

    // Role check
    if (orgRole !== "org:admin") {
      return {
        success: false,
        error: "Only admins can delete locations",
      };
    }

    // Delete directly (relies on tenant + id match)
    const [deletedLocation] = await db
      .delete(location)
      .where(
        and(
          eq(location.id, validatedLocationId),
          eq(location.tenantClerkId, orgId)
        )
      )
      .returning();

    if (!deletedLocation) {
      return {
        success: false,
        error: "Location not found or does not belong to your organization",
      };
    }

    return {
      success: true,
      data: { deleted: true },
    };
  } catch (error) {
    console.error("Error deleting location:", error);

    const zodError = parseZodError(error);
    if (zodError) {
      return zodError;
    }

    const authError = handleAuthError(error);
    if (authError) {
      return authError;
    }

    return {
      success: false,
      error: "Failed to delete location. Please try again.",
    };
  }
}
