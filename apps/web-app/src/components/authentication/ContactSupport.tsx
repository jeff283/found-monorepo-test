import React from "react";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactSupportProps {
  className?: string;
  variant?: "minimal" | "detailed";
  showIcon?: boolean;
}

const ContactSupport: React.FC<ContactSupportProps> = ({
  className,
  variant = "minimal",
  showIcon = true,
}) => {
  const subject = encodeURIComponent("Support Request - Foundly");
  const body = encodeURIComponent(
    "Hi Foundly Support Team,\n\nI need assistance with:\n\n[Please describe your issue here]\n\nThank you for your help!"
  );

  const mailtoLink = `mailto:support@foundlyhq.com?subject=${subject}&body=${body}`;

  if (variant === "minimal") {
    return (
      <Link
        href={mailtoLink}
        className={cn(
          "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:underline",
          className
        )}
      >
        {showIcon && <Mail className="h-4 w-4" />}
        Contact Support
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 text-center",
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <MessageCircle className="h-5 w-5 text-primary" />
        </div>

        <div className="space-y-1">
          <h3 className="font-medium text-foreground">Need Help?</h3>
          <p className="text-sm text-muted-foreground">
            Our support team is here to assist you
          </p>
        </div>

        <Link
          href={mailtoLink}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <Mail className="h-4 w-4" />
          Contact Support
        </Link>

        <p className="text-xs text-muted-foreground">support@foundlyhq.com</p>
      </div>
    </div>
  );
};

export default ContactSupport;
