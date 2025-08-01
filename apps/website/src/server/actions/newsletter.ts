//   // Todo
//   //   Turnstile
//   /*
//     1. Get turnstile token from the request
//     2. Verify the turnstile token with the Turnstile API
//     3. If verification fails, return an error response
//     4. If verification succeeds, proceed with the subscription logic
//    */
//   // Data Validation
//   /*    1. Validate the data using a schema (e.g., Zod)
//     2. If validation fails, return an error response with validation errors
//       */
//   // Check if the email already exists in the database
//   // If the email does not exist, create a new subscription record
//   // If the email exists, update the existing subscription record
//   // Subscription Logic
//   /*

//     1. Save email to mailerlite first
//     2. If the save is successful, proceed to save the email to the database
//     3. If the save to mailerlite fails, return an error response

//     */

"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// Zod validation schema for the waitlist form
const WaitlistSchema = z.object({
  "Full Name": z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  "Email Address": z
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  "Institution Name": z
    .string()
    .min(1, "Institution name is required")
    .min(2, "Institution name must be at least 2 characters"),
  "Job Title": z.string().optional(),
  Message: z.string().optional(),
  "cf-turnstile-response": z
    .string()
    .min(1, "CAPTCHA verification is required."),
});

interface TurnstileResult {
  success: boolean;
  error_codes?: string[];
  challenge_ts: string;
  hostname: string;
}
/**
 * Server action to handle waitlist and newsletter subscription
 */
export async function handleNewsletterSubscription(formData: FormData) {
  try {
    // 1. Data Validation
    const formObject = Object.fromEntries(formData.entries());
    const validationResult = WaitlistSchema.safeParse(formObject);

    if (!validationResult.success) {
      const flattened = z.flattenError(validationResult.error);
      return {
        success: false,
        message: "Invalid form data.",
        errors: flattened.fieldErrors,
      };
    }

    const {
      "Full Name": fullName,
      "Email Address": email,
      "Institution Name": institutionName,
      "Job Title": jobTitle,
      Message: message,
      "cf-turnstile-response": turnstileToken,
    } = validationResult.data;

    // 2. Turnstile Verification
    const turnstileVerify = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY || "",
          response: turnstileToken,
          remoteip: (await headers()).get("CF-Connecting-IP") || "",
        }),
      }
    );

    const turnstileResult: TurnstileResult = await turnstileVerify.json();

    if (!turnstileResult.success) {
      return {
        success: false,
        message: "CAPTCHA verification failed. Please try again.",
      };
    }

    // 3. Check if email already exists in the database
    const supabase = createServerSupabaseClient();
    const { data: existingUser, error: checkError } = await supabase
      .from("Waitlist")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      console.error("Supabase check error:", checkError);
      return { success: false, message: "Database error. Please try again." };
    }

    // If email exists, inform the user and stop execution.
    if (existingUser) {
      return {
        success: true, // It's a "success" from the user's perspective
        message: "You are already on our waitlist. Thank you!",
      };
    }

    // 4. Subscription Logic (only if user is new)
    // 4.1 Save email to MailerLite first
    const mailerliteApiKey = process.env.MAILERLITE_API_KEY;
    if (!mailerliteApiKey) {
      console.error("MAILERLITE_API_KEY environment variable is not set");
      return {
        success: false,
        message: "Configuration error. Please contact support.",
      };
    }

    const mailerliteResponse = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${mailerliteApiKey}`,
        },
        body: JSON.stringify({
          email: email,
          fields: {
            name: fullName,
            institution: institutionName,
            job_title: jobTitle,
          },
          groups: ["159689234693752676", "159690569525757418"], // Your group IDs
        }),
      }
    );

    if (!mailerliteResponse.ok) {
      const mailerliteData = await mailerliteResponse.json();
      // Log the error but don't block saving to our own DB if MailerLite fails
      console.error("MailerLite API error:", mailerliteData);
    }

    // 4.2 Save the new user to Supabase
    const headersList = await headers();
    const clientIP = headersList.get("CF-Connecting-IP") || null;
    const country = headersList.get("CF-IPCountry") || null;

    const { error: insertError } = await supabase.from("Waitlist").insert({
      full_name: fullName,
      email: email,
      institution_name: institutionName,
      job_title: jobTitle,
      message: message,
      client_ip: clientIP,
      country: country,
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return { success: false, message: "Failed to add you to the waitlist." };
    }

    // 5. Join Clerk waitlist
    if (!process.env.CLERK_SECRET_KEY) {
      console.error("CLERK_SECRET_KEY environment variable is not set");
      return {
        success: false,
        message: "Configuration error. Please contact support.",
      };
    }

    const clerkJoinWaitlist = await fetch(
      "https://api.clerk.com/v1/waitlist_entries",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
        body: JSON.stringify({
          email_address: email,
          notify: false, // Set to true if you want to notify the user immediately
        }),
      }
    );

    if (!clerkJoinWaitlist.ok) {
      const clerkError = await clerkJoinWaitlist.json();
      console.error("Clerk waitlist API error:", clerkError);
      // Don't block the success response if Clerk fails, but log the error
    }

    return {
      success: true,
      message: "You have successfully joined our waitlist!",
    };
  } catch (error) {
    console.error("Waitlist submission error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
