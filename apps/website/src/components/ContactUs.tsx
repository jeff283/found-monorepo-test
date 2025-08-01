"use client";

import FoundlyButton from "@/components/FoundlyButton";

const fieldConfig = [
  { label: "Full Name", type: "text", placeholder: "Enter your name" },
  {
    label: "Phone Number",
    type: "text",
    placeholder: "Enter your phone number",
  },
  { label: "Email Address", type: "email", placeholder: "Enter your email" },
  {
    label: "Organization Name",
    type: "text",
    placeholder: "Enter your organization",
  },
  { label: "Job Title", type: "text", placeholder: "Enter your job title" },
  {
    label: "What can we help with?",
    type: "text",
    placeholder: "Let us know how we can help",
  },
];

const ContactUs = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-background py-16 px-8">
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
      <h4 className="text-primary font-medium mb-4 caption">Contact us</h4>
      <h2 className="title-2 text-secondary">
        Ready to streamline your management process? Contact us today!
      </h2>
    </div>
  );
};

const RightSide = () => {
  return (
    <div className="flex flex-col">
      <h4 className="caption text-primary font-medium mb-2">
        Send us a message
      </h4>
      <h2 className="headline-1 text-secondary mb-8">
        We’d love to hear from you
      </h2>
      <form className="space-y-6">
        <FormFields />
        <MessageField />
        <SubmitButton />
      </form>
    </div>
  );
};

const FormFields = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {fieldConfig.map((field, index) => (
      <div className="flex flex-col" key={`${field.label}-${index}`}>
        <label className="text-sm font-medium text-foreground mb-1">
          {field.label}
        </label>
        <input
          type={field.type}
          placeholder={field.placeholder}
          className="border border-border rounded-full py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    ))}
  </div>
);

const MessageField = () => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-foreground mb-1">
      Your Message
    </label>
    <textarea
      rows={4}
      placeholder="Write your message"
      className="w-full border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    />
  </div>
);

const SubmitButton = () => (
  <FoundlyButton
    text="Contact us"
    as="button"
    type="submit"
    className="w-full"
  />
);
