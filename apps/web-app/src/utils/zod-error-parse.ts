import z from "zod";

export function parseZodError(error: unknown) {
  if (error instanceof z.ZodError) {
    return {
      success: false,
      message: "Validation error",
      error: z.treeifyError(error).errors,
    };
  }
}
