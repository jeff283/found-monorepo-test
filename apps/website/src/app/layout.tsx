import "./globals.css";
import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Foundly",
  description: "Smarter Lost and Found for Modern Institutions",
  keywords: [
    "Lost and Found",
    "Institutions",
    "Foundly",
    "Smart Tracking",
    "Item Recovery",
    "Campus Lost and Found",
    "University Lost and Found",
    "School Lost and Found",
    "Corporate Lost and Found",
    "Hospital Lost and Found",
    "Airport Lost and Found",
    "Hotel Lost and Found",
    "Digital Lost and Found",
    "Lost Item Management",
    "Found Item Database",
    "Item Tracking System",
    "Lost Property Management",
    "Foundly Platform",
    "Smart Lost and Found Software",
    "Institutional Item Recovery",
    "Lost Item Search",
    "Found Item Reporting",
    "Lost and Found Technology",
    "Item Return System",
    "Lost Property Tracking"
  ],
  creator: "Foundly Team",
  openGraph: {
    title: "Foundly",
    description: "Smarter Lost and Found for Modern Institutions",
    url: "https://foundlyhq.com",
    siteName: "Foundly",
    images: [
      {
        url: "https://foundlyhq.com/og-image.png",
        width: 500,
        height: 540,
        alt: "Foundly - Smarter Lost and Found",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  authors: [
    {
      name: "Foundly Team",
      url: "https://foundlyhq.com",
    },
    {
      name: "Jeff Njoroge",
      url: "https://www.linkedin.com/in/jefnjoroge/",
    },
    {
      name: "Victor Musembi",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${hostGrotesk.variable}  antialiased`}>{children}</body>
    </html>
  );
}
