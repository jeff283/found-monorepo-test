"use client";

import { useState } from "react";
import clsx from "clsx";
import { Navbar } from "@/components/Navbar";
import FoundlyFooter from "@/components/Footer";

const pricingData = {
  monthly: [
    {
      title: "Essentials",
      bestFor: "Small campuses or pilot offices",
      price: "$499",
      note: "/month",
      features: [
        "1 Lost & Found Office",
        "AI Search + Match",
        "Branded public intake form",
        "Dashboard for staff",
        "2,500 item records/year",
        "Email support",
      ],
    },
    {
      title: "Advanced",
      bestFor: "Mid-size institutions with multiple offices",
      price: "$749",
      note: "/month",
      features: [
        "Up to 5 Offices",
        "AI Match & Analytics",
        "Internal messaging",
        "10,000 records/year",
        "Priority support 24/7",
      ],
      popular: true,
    },
    {
      title: "Enterprise",
      bestFor: "Large universities or multi-campus systems",
      price: "$1,250",
      note: "/month",
      features: [
        "Unlimited Offices",
        "Full platform access",
        "SSO integration (NetID)",
        "Advanced reporting",
        "Dedicated success manager",
      ],
    },
  ],
  annually: [
    {
      title: "Essentials",
      bestFor: "Small campuses or pilot offices",
      price: "$5,999",
      note: "/year",
      features: [
        "1 Lost & Found Office",
        "AI Search + Match",
        "Branded public intake form",
        "Dashboard for staff",
        "2,500 item records/year",
        "Email support",
      ],
    },
    {
      title: "Advanced",
      bestFor: "Mid-size institutions with multiple offices",
      price: "$8,999",
      note: "/year",
      features: [
        "Up to 5 Offices",
        "AI Match & Analytics",
        "Internal messaging",
        "10,000 records/year",
        "Priority support 24/7",
      ],
      popular: true,
    },
    {
      title: "Enterprise",
      bestFor: "Large universities or multi-campus systems",
      price: "Custom Pricing",
      note: "(starts at $15,000/year)",
      features: [
        "Unlimited Offices",
        "Full platform access",
        "SSO integration (NetID)",
        "Advanced reporting",
        "Dedicated success manager",
      ],
    },
  ],
};

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annually">("annually");
  const plans = pricingData[billing];

  return (
    <main className="bg-[#fbfbfb] text-[--foreground] min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="w-full bg-[#fbfbfb] px-4 sm:px-6 lg:px-24 pt-16 pb-12 text-center">
        <h1 className="title-3 mb-4" style={{ color: "var(--steel-blue)" }}>
          Foundly for Campuses
        </h1>
        <p className="body-2 max-w-2xl mx-auto text-[--muted-foreground]">
          Modern lost & found, built for the way your campus works. Easy to set up. Built to scale. Backed by AI.
        </p>

        <h2 className="title-4 mt-6 text-[--foreground]">
          Choose a Plan That Fits Your Campus
        </h2>

        {/* Billing Toggle */}
        <div className="mt-6 inline-flex rounded-full bg-[#f7f7f7] p-1">
          {(["monthly", "annually"] as const).map((key) => {
            const isActive = billing === key;
            return (
              <button
                key={key}
                onClick={() => setBilling(key)}
                className={clsx(
                  "px-6 py-2 rounded-full transition-all button-text",
                  isActive
                    ? "bg-white text-[--foreground] shadow-sm"
                    : "text-[--muted-foreground]"
                )}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            );
          })}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="flex-grow px-4 sm:px-6 lg:px-24 pb-20">
        <div className="flex flex-col md:flex-row gap-y-6 md:gap-y-0 gap-x-4 justify-center max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const isMiddle = index === 1;

            return (
              <div
                key={index}
                className={clsx(
                  "rounded-[24px] p-6 flex flex-col justify-between max-w-[320px] min-h-[498px] w-full mx-auto",
                  isMiddle ? "bg-white border shadow-sm" : "bg-[#f7f7f7]"
                )}
              >
                <div>
                  {/* Title + Popular */}
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="headline-2 text-[--foreground]">{plan.title}</h3>
                    {plan.popular && (
                      <span className="inline-flex items-center justify-center w-[78px] h-[27px] bg-secondary text-white text-sm font-medium rounded-[6px]">
                        Popular
                      </span>
                    )}
                  </div>

                  <p className="caption text-[--muted-foreground] mb-2">
                    {plan.bestFor}
                  </p>

                  <p className="text-3xl font-bold text-[--foreground] mb-1">
                    {plan.price}
                  </p>
                  <p className="caption text-[--muted-foreground] mb-4">
                    {plan.note}
                  </p>

                  <ul className="body-small text-[--muted-foreground] space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 flex justify-center">
                  <a
                    href="https://foundlyhq.com/#waitlist" // Corrected link to scroll to the #waitlist section
                    className="w-full max-w-[255px] h-[50px] bg-primary text-white rounded-[12px] button-text transition hover:opacity-90 flex items-center justify-center"
                  >
                    Get started
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <FoundlyFooter />
    </main>
  );
}
