"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FaqSection from "@/components/FaqSection";
// import ContactUs from "@/components/ContactUs";
// import TestimonialsSection from "@/components/TestimonialsSection";
import IndustriesSection from "@/components/IndustriesSection";
import HowFoundlyWorks from "@/components/HowFoundlyWorks";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import SeeFoundly from "@/components/SeeFoundly";
import WaitlistForm from "@/components/WaitlistForm";
import FoundlyFooter from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 min-h-0 h-full" id="hero">
          <HeroSection />
        </div>
      </div>

      {/* How Foundly Works Section */}
      <section id="how-it-works">
        <HowFoundlyWorks />
      </section>

      {/* Video Demo Section */}
      <section id="video-demo" className="py-16 px-4 md:px-8 bg-background">
        <div className="mx-auto text-center max-w-[1192px]">
          <h2 className="title-2 text-secondary mb-6">
            Watch How Foundly Works
          </h2>
          <HeroVideoDialog
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/NZp5j5hvn9I"
            thumbnailSrc="https://img.youtube.com/vi/NZp5j5hvn9I/maxresdefault.jpg"
            thumbnailAlt="Foundly Demo Video"
            className="mx-auto w-full aspect-[2.1]"
          />
        </div>
      </section>

      {/* Industries Section */}
      <section id="for-businesses">
        <IndustriesSection />
      </section>

      {/* See Foundly in Action Section */}
      <SeeFoundly />

      {/* Testimonials Section */}
      {/* <TestimonialsSection /> */}

      {/* FAQ Section */}
      <main>
        <FaqSection />
      </main>

      {/* Waitlist Form Section */}
      <section>
        <WaitlistForm />
      </section>

      {/* Contact Form */}
      {/* <section id="contact">
        <ContactUs />
      </section> */}

      {/* Footer Section */}
      <FoundlyFooter />
    </>
  );
}
