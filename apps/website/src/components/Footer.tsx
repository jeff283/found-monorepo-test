"use client";
import { ArrowUpRight } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter, FaLinkedinIn } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import FoundlyButton from "@/components/FoundlyButton";
import images from "@/constants/images";

export default function FoundlyFooter() {
  return (
    <footer
      className="w-[95%] mx-auto bg-secondary rounded-3xl py-16 px-4 mb-4"
      id="footer"
    >
      <div className=" mx-auto">
        {/* Main Footer Content */}
        <div className="relative overflow-hidden rounded-4xl bg-secondary text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-primary to-transparent rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 p-8 md:p-12">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-12">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Image
                    src={images.logo}
                    alt="Foundly Logo"
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-2xl shadow-lg"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h3 className="headline-1 text-white">Foundly</h3>
                  <p className="body-small text-white/70">
                    Smart Lost & Found Technology
                  </p>
                </div>
              </div>

              <FoundlyButton
                href="/#waitlist"
                text="Join Our Waitlist"
                // className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <h4 className="headline-2 text-white mb-4">About Foundly</h4>
                <p className="body-1 text-white/80 mb-6">
                  Building trust through smart, secure, and scalable lost &
                  found technology. We&apos;re revolutionizing how businesses
                  and individuals handle lost items with cutting-edge solutions.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full caption-small font-medium">
                    AI-Powered
                  </span>
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full caption-small font-medium">
                    Built for Organizations
                  </span>
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full caption-small font-medium">
                    Seamless Integration
                  </span>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="headline-2 text-white mb-4">Navigation</h4>
                <ul className="space-y-3">
                  {[
                    { href: "/", label: "Home" },
                    { href: "/#how-it-works", label: "How it Works" },
                    { href: "/#for-businesses", label: "Industries" },
                    { href: "/pricing", label: "Pricing" },
                    { href: "/#waitlist", label: "Waitlist" },
                    { href: "/policies", label: "Policies" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="body-small text-white/70 hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                      >
                        {link.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="headline-2 text-white mb-4">Get in Touch</h4>
                <div className="space-y-3">
                  <a
                    href="tel:+15856237660"
                    className="body-small text-white/70 hover:text-primary transition-colors duration-200 block"
                  >
                    +1 (585) 623-7660
                  </a>
                  <a
                    href="mailto:hello@foundlyhq.com"
                    className="body-small text-white/70 hover:text-primary transition-colors duration-200 block"
                  >
                    hello@foundlyhq.com
                  </a>
                  <p className="body-small text-white/70">
                    Rochester, NY
                    <span className="block caption text-white/50">USA</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Copyright */}
                <p className="caption text-white/60">
                  © 2025 Foundly Technologies. All rights reserved.
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-4">
                  <span className="body-small text-white/70 mr-2">
                    Follow us:
                  </span>
                  {[
                    { icon: FaXTwitter, href: "#", label: "Twitter" },
                    { icon: FaInstagram, href: "#", label: "Instagram" },
                    { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 bg-white/10 hover:bg-primary rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                      aria-label={social.label}
                    >
                      <social.icon className="w-4 h-4 text-white group-hover:text-white" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
