"use client";

import { useState } from "react";
import images from "@/constants/images";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import FoundlyButton from "./FoundlyButton";

const navLinks = [
  { label: "Home", href: "/#hero" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "For Businesses", href: "https://app.foundlyhq.com/login" },
  { label: "For Individuals", href: "https://app.foundlyhq.com/login" },
  { label: "Pricing", href: "/pricing" },
];

const supportedLanguages = [
  { label: "English", code: "en-US" },
  { label: "Español", code: "es-ES", disabled: true },
];

export function Navbar() {
  const [selectedLanguage, setSelectedLanguage] = useState<{
    label: string;
    code: string;
  }>(supportedLanguages[0]);

  const handleLanguageChange = (language: { label: string; code: string }) => {
    setSelectedLanguage(language);
    console.log("Selected language:", language.code); // For now, just logs
  };

  return (
    <header className="w-full bg-white flex items-center justify-between px-6 py-2 shadow-none">
      {/* Logo */}
      <Link href="/" className="flex flex-col items-center mr-8 cursor-pointer">
        <Image src={images.logo} alt="Foundly Logo" className="size-16" />
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex flex-1 items-center justify-start gap-8">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-black text-base font-medium hover:text-black/70 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        {/* Language Dropdown - Desktop */}
        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-black hover:text-black/70">
                <Globe className="w-5 h-5" />
                <span className="text-base font-medium">
                  {selectedLanguage.label}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {supportedLanguages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  className={`cursor-pointer ${
                    lang.disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleLanguageChange(lang)}
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop Login Button */}
        {/* <FoundlyButton
          href="https://app.foundlyhq.com/login"
          text="Login"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex px-10 text-base font-medium"
        /> */}

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-full bg-primary/10 hover:bg-primary/20">
                <Menu className="w-6 h-6 text-black" />
              </button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8 px-4">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-black text-lg font-medium hover:text-black/70 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}

                {/* Language Dropdown - Mobile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-black mb-4 hover:text-black/70">
                      <Globe className="w-5 h-5" />
                      <span className="text-base font-medium">
                        {selectedLanguage.label}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" side="top">
                    {supportedLanguages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        className="cursor-pointer"
                        onClick={() => handleLanguageChange(lang)}
                      >
                        {lang.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Login Button */}
                {/* <FoundlyButton
                  href="https://app.foundlyhq.com/login"
                  text="Login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 text-base font-medium"
                /> */}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
