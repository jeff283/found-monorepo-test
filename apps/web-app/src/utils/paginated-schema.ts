import z from "zod";

// Define a global reusable pagination schema (input only)
export const paginationInput = z.object({
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
  getAll: z.boolean().optional(),
});

// Utility to apply defaults to any schema (works with pagination or extended ones)
export function withDefaults<T extends z.ZodTypeAny>(
  schema: T,
  defaults: Partial<z.infer<T>>
) {
  // Ensure the schema is an object schema before applying defaults
  if (!(schema instanceof z.ZodObject)) {
    throw new Error("withDefaults can only be used with Zod object schemas");
  }
  return (schema as z.ZodObject<z.ZodRawShape>).transform((data) => ({
    ...defaults,
    ...data,
  }));
}

// Pre-built normalized pagination schema with defaults
export const paginationSchema = withDefaults(paginationInput, {
  limit: 10,
  offset: 0,
  getAll: false,
});

// --------------------------
// Example usage: extend schema for Locations

// const getLocationsInput = paginationInput.extend({
//   buildingId: z.uuid().optional(),
//   typeId: z.uuid().optional(),
//   status: z.enum(["active", "inactive"]).optional(),
// });

// const getLocationsSchema = withDefaults(getLocationsInput, {
//   limit: 10,
//   offset: 0,
//   getAll: false,
// });

// export async function getLocations(
//   options?: z.input<typeof getLocationsInput>
// ) {
//   const validated = getLocationsSchema.parse(options ?? {});
//   // validated has defaults + your extended fields
// }

// // --------------------------
// // Example usage: extend schema for Buildings

// const getBuildingsInput = paginationInput; // can reuse directly
// const getBuildingsSchema = paginationSchema; // defaults already applied

// export async function getBuildings(
//   options?: z.input<typeof getBuildingsInput>
// ) {
//   const validated = getBuildingsSchema.parse(options ?? {});
// }

// // --------------------------
// // Example usage: extend schema for Location Types

// const getLocationTypesInput = paginationInput;
// const getLocationTypesSchema = paginationSchema;

// export async function getLocationTypes(
//   options?: z.input<typeof getLocationTypesInput>
// ) {
//   const validated = getLocationTypesSchema.parse(options ?? {});
// }
