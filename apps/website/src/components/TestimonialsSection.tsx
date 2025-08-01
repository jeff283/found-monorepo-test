"use client";

import Image, { StaticImageData } from "next/image";
import { Quote } from "lucide-react";
import { Marquee } from "@/components/magicui/marquee";

import images from "@/constants/images";

type Testimonial = {
  quote: string;
  name: string;
  avatar: StaticImageData;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Foundly streamlined our entire lost-and-found process in days. What used to take a team of three is now automated and resolved within hours.",
    name: "Alice K., University Admin",
    avatar: images.avatar1,
  },
  {
    quote:
      "We cleared over 3 months of lost item backlog in a single weekend using Foundly. The accuracy of their smart matching truly impressed our staff.",
    name: "James B., Hotel Front Desk Manager",
    avatar: images.avatar2,
  },
  {
    quote:
      "Setup was effortless — students and staff love the instant match notifications. Foundly has brought a level of clarity and trust we never had before.",
    name: "Linda N., Campus Services",
    avatar: images.avatar3,
  },
  {
    quote:
      "Before Foundly, our team wasted hours every week tracking item reports. Now it's all automated, and we've reduced claim errors by over 70%.",
    name: "Derek M., Mall Security Lead",
    avatar: images.avatar4,
  },
];

import React from "react";
const TestimonialCard = React.memo(({ quote, name, avatar }: Testimonial) => (
  <div
    className="w-[430px] h-[285px] bg-[#f9f9f9] rounded-2xl p-6 shrink-0 shadow-sm flex flex-col justify-between"
    style={{ willChange: "transform" }}
  >
    <div>
      <Quote className="w-6 h-6 text-muted-foreground mb-4" />
      <p className="text-base text-foreground leading-relaxed">“{quote}”</p>
    </div>
    <div className="flex items-center gap-4 mt-6">
      <Image
        src={avatar}
        alt={name}
        width={52}
        height={52}
        className="w-[52px] h-[52px] rounded-full object-cover"
        loading="lazy"
        priority={false}
      />
      <div>
        <p className="font-medium text-sm text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{name}</p>
      </div>
    </div>
  </div>
));
TestimonialCard.displayName = "TestimonialCard";

const TestimonialsSection = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto mb-10">
        <div className="text-left">
          {/* <p className="text-primary font-medium caption mb-2">● Testimonials</p> */}
          <h2 className="title-2 text-secondary">
            Why Organizations & People
            <br />
            Trust Foundly
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Top Marquee */}
        <div className="relative" style={{ willChange: "transform" }}>
          <Marquee  className="[--duration:40s] gap-6">
            {testimonials.map((item, i) => (
              <TestimonialCard key={`top-${i}`} {...item} />
            ))}
          </Marquee>
          {/* Edge Fades */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-background to-transparent z-10" />
        </div>

        {/* Bottom Marquee */}
        <div className="relative" style={{ willChange: "transform" }}>
          <Marquee reverse  className="[--duration:40s] gap-6">
            {testimonials.map((item, i) => (
              <TestimonialCard key={`bottom-${i}`} {...item} />
            ))}
          </Marquee>
          {/* Edge Fades */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-background to-transparent z-10" />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
