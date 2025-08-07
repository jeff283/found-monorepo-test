import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

// Zod schema for email validation
const foundlyEmailSchema = z
  .string()
  .email("Invalid email format")
  .refine((email) => email.endsWith("@foundlyhq.com"), {
    message: "Only @foundlyhq.com email addresses are allowed",
  });

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the authentication state
  const { userId } = await auth();

  // If not signed in, redirect to login
  if (!userId) {
    redirect("/login");
  }

  // Get the full user object to access email addresses
  const user = await currentUser();

  if (!user) {
    console.warn(
      `Admin access denied: Could not fetch user data for userId ${userId}`
    );
    redirect("/unauthorized");
  }

  // Get the primary email address
  const primaryEmail = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId
  );

  if (!primaryEmail) {
    console.warn(
      `Admin access denied: No primary email found for user ${userId}`
    );
    redirect("/unauthorized");
  }

  // Validate user email domain using Zod
  try {
    foundlyEmailSchema.parse(primaryEmail.emailAddress);
  } catch (error) {
    // Log unauthorized access attempt with detailed error
    if (error instanceof z.ZodError) {
      const errorMessage =
        error.issues[0]?.message || "Email validation failed";
      console.warn(
        `Admin access denied for ${primaryEmail.emailAddress}: ${errorMessage}`
      );
    } else {
      console.warn(
        `Admin access denied for ${primaryEmail.emailAddress}: Unknown validation error`
      );
    }

    redirect("/unauthorized");
  }

  // User is authenticated and has valid @foundlyhq.com email domain
  return <>{children}</>;
}
