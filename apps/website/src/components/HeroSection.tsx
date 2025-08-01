import React from "react";
import FoundlyButton from "@/components/FoundlyButton";
import { HeroSectionMarquee } from "@/components/HeroSectionMarquee";

const HeroSection = () => {
  return (
    <section className="mx-2 px-2 md:mx-4 md:px-4 lg:mx-6 lg:px-[62px]  bg-secondary text-white min-h-[calc(100vh-theme(spacing.24))] rounded-4xl flex items-center">
      <div className="flex-1 h-full  ">
        <LeftSide />
      </div>
      <div className="hidden lg:flex lg:flex-1 h-full ">
        <HeroSectionMarquee />
      </div>
    </section>
  );
};

export default HeroSection;

const LeftSide = () => {
  return (
    <div className="flex flex-col items-center lg:items-start text-center lg:text-start gap-6">
      {/* Heading */}
      <div className="title-2 text-balance">
        AI-Powered Lost & Found, Finally Built for Schools and Offices
      </div>
      {/* Description */}
      <div className="body-1 text-pretty">
        Foundly is an AI-powered platform that enables businesses to securely
        manage lost items, automate matching, and streamline item recovery
        across locations.
      </div>
      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <FoundlyButton text="Join Our Waitlist" href="#waitlist" />
        <FoundlyButton text="Learn More" href="#how-it-works" />
      </div>
    </div>
  );
};
