import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  // Get the userId from auth() -- if null, the user is not signed in
  const { userId } = await auth();

  // If not signed in, redirect to login
  if (!userId) {
    redirect("/login");
  }

  // If signed in, redirect to the protected dashboard
  // The protected layout will handle email domain validation
  redirect("/dashboard");
}
