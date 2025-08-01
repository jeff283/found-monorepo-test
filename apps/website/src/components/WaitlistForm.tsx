"use client";

import { useState } from "react";
import { z } from "zod";
import FoundlyButton from "@/components/FoundlyButton";
import Script from "next/script";
import { handleNewsletterSubscription } from "@/server/actions/newsletter";
import { BeatLoader } from "react-spinners";

// Zod validation schema
const contactSchema = z.object({
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
});

type ContactFormData = z.infer<typeof contactSchema>;

const fieldConfig = [
  {
    label: "Full Name",
    type: "text",
    placeholder: "Enter your name",
    required: true,
    autocomplete: "name",
    ariaLabel: "Enter your full name",
  },
  {
    label: "Email Address",
    type: "email",
    placeholder: "Enter your email",
    required: true,
    autocomplete: "email",
    ariaLabel: "Enter your email address",
  },
  {
    label: "Institution Name",
    type: "text",
    placeholder: "Enter your organization",
    required: true,
    autocomplete: "organization",
    ariaLabel: "Enter your institution or organization name",
  },
  {
    label: "Job Title",
    type: "text",
    placeholder: "Enter your job title",
    required: false,
    autocomplete: "organization-title",
    ariaLabel: "Enter your job title or position",
  },
];

const ContactUs = () => {
  return (
    <section
      id="waitlist"
      className="min-h-screen flex items-center justify-center bg-background py-16 px-8"
    >
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-16">
        <LeftSide />
        <RightSide />
      </div>
    </section>
  );
};

export default ContactUs;

const LeftSide = () => {
  return (
    <div className="flex flex-col justify-center">
      <h4 className="text-primary font-medium mb-4 caption">
        Join Our Waitlist
      </h4>
      <h2 className="title-2 text-secondary">
        Be the first to know when Foundly launches at your institution!
      </h2>
    </div>
  );
};

const RightSide = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ContactFormData>({
    "Full Name": "",
    "Email Address": "",
    "Institution Name": "",
    "Job Title": "",
    Message: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});
  const [serverMessage, setServerMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors({ ...errors, [name]: undefined });
    }
    if (serverMessage) {
      setServerMessage("");
    }
  };

  const validateForm = (): boolean => {
    try {
      contactSchema.parse(form);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as keyof ContactFormData] = issue.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerMessage("");

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);

    const result = await handleNewsletterSubscription(formData);

    if (result.success) {
      setSubmitted(true);
    } else {
      setServerMessage(result.message || "An error occurred.");
      if (result.errors) {
        // Transform arrays to single strings
        const transformedErrors: Partial<
          Record<keyof ContactFormData, string>
        > = {};
        Object.entries(result.errors).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            transformedErrors[key as keyof ContactFormData] = value[0];
          }
        });
        setErrors(transformedErrors);
      }
    }

    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 bg-white">
        <h3 className="title-1 font-bold text-secondary mb-6">Thank you!</h3>
        <p className="text-secondary mb-2">
          You have successfully joined our waitlist. We will keep you updated on
          our launch progress!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h4 className="caption text-primary font-medium mb-2">
        Sign up for early access
      </h4>
      <h2 className="headline-1 text-secondary mb-8">
        We will keep you in the loop
      </h2>
      <form
        className="space-y-6"
        onSubmit={handleSubmit}
        aria-label="Waitlist registration form"
        noValidate
      >
        <FormFields form={form} handleChange={handleChange} errors={errors} />
        <MessageField form={form} handleChange={handleChange} errors={errors} />
        <div
          className="cf-turnstile mt-2 flex justify-center items-center "
          data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          data-theme="light"
        ></div>
        {serverMessage && (
          <div className="text-red-500 text-sm text-center mt-2" role="alert">
            {serverMessage}
          </div>
        )}
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
      {/* Turnstile script */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      />
    </div>
  );
};

const FormFields = ({
  form,
  handleChange,
  errors,
}: {
  form: ContactFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Partial<Record<keyof ContactFormData, string>>;
}) => {
  const isOddFields = fieldConfig.length % 2 === 1;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fieldConfig.map((field, index) => {
        // If odd number of fields and this is the last one, span both columns
        const colSpan =
          isOddFields && index === fieldConfig.length - 1
            ? "md:col-span-2"
            : "";
        const fieldId = `field-${index}`;
        const fieldName = field.label as keyof ContactFormData;
        const hasError = errors[fieldName];

        return (
          <div
            className={`flex flex-col ${colSpan}`}
            key={`${field.label}-${index}`}
          >
            <label
              htmlFor={fieldId}
              className="text-sm font-medium text-foreground mb-1"
            >
              {field.label}
              {field.required && (
                <span className="text-red-500 ml-1" aria-label="required">
                  *
                </span>
              )}
            </label>
            <input
              id={fieldId}
              type={field.type}
              name={field.label}
              placeholder={field.placeholder}
              value={form[fieldName] || ""}
              onChange={handleChange}
              required={field.required}
              autoComplete={field.autocomplete}
              aria-label={field.ariaLabel}
              aria-required={field.required}
              aria-invalid={hasError ? "true" : "false"}
              aria-describedby={hasError ? `${fieldId}-error` : undefined}
              className={`border rounded-full py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                hasError ? "border-red-500 focus:ring-red-500" : "border-border"
              }`}
            />
            {hasError && (
              <span
                id={`${fieldId}-error`}
                className="text-red-500 text-xs mt-1"
                role="alert"
                aria-live="polite"
              >
                {hasError}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

const MessageField = ({
  form,
  handleChange,
  errors,
}: {
  form: ContactFormData;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  errors: Partial<Record<keyof ContactFormData, string>>;
}) => {
  const hasError = errors.Message;

  return (
    <div className="flex flex-col">
      <label
        htmlFor="message-field"
        className="text-sm font-medium text-foreground mb-1"
      >
        Your Message
      </label>
      <textarea
        id="message-field"
        rows={4}
        name="Message"
        placeholder="Tell us about your lost & found challenges or any additional information (optional)"
        value={form.Message || ""}
        onChange={handleChange}
        autoComplete="off"
        aria-label="Additional message or information about your lost and found challenges"
        aria-required="false"
        aria-invalid={hasError ? "true" : "false"}
        aria-describedby={hasError ? "message-field-error" : undefined}
        className={`w-full border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
          hasError ? "border-red-500 focus:ring-red-500" : "border-border"
        }`}
      />
      {hasError && (
        <span
          id="message-field-error"
          className="text-red-500 text-xs mt-1"
          role="alert"
          aria-live="polite"
        >
          {hasError}
        </span>
      )}
    </div>
  );
};

const SubmitButton = ({ isSubmitting }: { isSubmitting: boolean }) => (
  <FoundlyButton
    as="button"
    type="submit"
    disabled={isSubmitting}
    className="w-full"
  >
    <div className="flex items-center justify-center gap-2">
      <span>{isSubmitting ? "Joining" : "Join Our Waitlist"}</span>
      <BeatLoader
        size={8}
        color="#ffffff"
        className="flex items-center justify-center"
        loading={isSubmitting}
        aria-label="Submitting your information"
      />
    </div>
  </FoundlyButton>
);
