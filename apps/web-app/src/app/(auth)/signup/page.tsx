"use client";

import { useState } from "react";
import { User, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

import AuthLayout from "@/components/authentication/AuthLayout";
import AuthHeader from "@/components/authentication/AuthHeader";
import AuthBackButton from "@/components/authentication/AuthBackButton";
import FoundlyButton from "@/components/authentication/FoundlyButton";
import AuthFooter from "@/components/authentication/AuthFooter";
import ContactSupport from "@/components/authentication/ContactSupport";

export default function RegisterChoicePage() {
  const [selected, setSelected] = useState<"individual" | "institution" | null>(
    null
  );
  const router = useRouter();

  const topBar = (
    <div className="flex justify-between items-center w-full">
      <AuthBackButton />
      <ContactSupport variant="minimal" />
    </div>
  );

  const handleContinue = () => {
    if (selected === "individual") router.push("/signup/individual");
    if (selected === "institution") router.push("/signup/institution");
  };

  // The form content only (no layout)
  const FormContent = (
    <div className="flex flex-col justify-between h-full max-w-[432px] w-full mx-auto">
      <div className="flex flex-col gap-6">
        <AuthHeader
          title="Choose your account type"
          subtitle="Select how you'll be using Foundly"
        />
        {/* Individuals Button */}
        <button
          onClick={() => setSelected("individual")}
          className={`w-full h-[104px] text-left px-6 py-4 flex items-center gap-6 transition-all rounded-lg ${
            selected === "individual"
              ? "bg-[#F0FBFC] ring-2 ring-primary"
              : "bg-white"
          }`}
        >
          <div className="w-12 h-12 flex items-center justify-center bg-[#F0FBFC] rounded-md">
            <User size={20} className="text-[#00B5C3]" />
          </div>
          <div>
            <p className="font-medium">Individuals</p>
            <p className="text-sm text-muted-foreground">
              I lost something at an institution
            </p>
          </div>
        </button>
        {/* Institutions Button */}
        <button
          onClick={() => setSelected("institution")}
          className={`w-full h-[104px] text-left px-6 py-4 flex items-center gap-6 transition-all rounded-lg ${
            selected === "institution"
              ? "bg-[#F0FBFC] ring-2 ring-primary"
              : "bg-white"
          }`}
        >
          <div className="w-12 h-12 flex items-center justify-center bg-[#F0FBFC] rounded-md">
            <Building2 size={20} className="text-[#00B5C3]" />
          </div>
          <div>
            <p className="font-medium">Institutions</p>
            <p className="text-sm text-muted-foreground">
              We manage lost & found items
            </p>
          </div>
        </button>
      </div>
      {/* Continue Button */}
      <div className="mt-8">
        <FoundlyButton
          text={
            selected === "individual"
              ? "Continue as Individual"
              : selected === "institution"
                ? "Continue as Institution"
                : "Select one to Continue"
          }
          className="w-full"
          onClick={handleContinue}
          as="button"
          disabled={!selected}
        />
      </div>
      <div className="mt-8">
        <AuthFooter />
      </div>
    </div>
  );

  // Always use AuthLayout with topBar for both mobile and desktop for consistent UX
  return (
    <AuthLayout topBar={topBar}>
      <div className="px-4 pt-8 pb-8 min-h-[calc(100vh-9rem)] md:flex md:items-center md:justify-center md:pt-0 md:pb-0">
        {FormContent}
      </div>
    </AuthLayout>
  );
}
