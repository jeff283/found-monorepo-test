import { Context } from "hono";
import { Resend } from "resend";
import { InstitutionDraftData } from "@/lib/schemas";
import { Approvedhtml } from "@/emails/templates/ApplicationApproved";
import { Env } from "@/lib/bindings";

export async function sendApplicationApproveStatus(
  c: Context<{ Bindings: Env }>,
  results: InstitutionDraftData
) {
  try {
    const resendKEY = c.env.RESEND_API_KEY;
    if (!resendKEY) {
      console.error("RESEND_API_KEY not configured");
      return;
    }
    if (!results.institutionName) {
      console.error("Institution name is missing");
      return;
    }

    // Get the recipinets first name
    const clerk = c.get("clerk");
    const user = await clerk.users.getUser(results.userId);
    if (!user) {
      console.error("User not found for ID:", results.userId);
      return;
    }

    // Get first name or use institution name
    const name = user.firstName || results.institutionName;

    const resend = new Resend(c.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: "no-reply@notifications.foundlyhq.com",
      to: results.userEmail,
      subject: "Your Institution Application Has Been Approved",
      html: Approvedhtml(name),
    });

    return { data, error };
  } catch (error) {
    console.error("Failed to send approval email:", error);
    return { message: "Failed to send approval email", error: error as Error };
  }
}
