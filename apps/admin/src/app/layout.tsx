// Ensure global styles are imported
import "./globals.css";
// Import necessary types and components
import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import { Toaster } from "@/admin/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/admin/components/providers/query-provider";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${hostGrotesk.variable} antialiased`}>
          <QueryProvider>
            <Toaster richColors position="top-center" />
            {children}
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

export const metadata: Metadata = {
  title: "Foundly Admin Dashboard",
  description:
    "Administrative dashboard for managing Foundly Internal Operations",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
  other: {
    google: "notranslate",
    ChatGPT: "noindex",
    CCBot: "nofollow",
    "Claude-Web": "noindex",
    Perplexity: "noindex",
  },
  creator: "Foundly Team",
  openGraph: {
    title: "Foundly Admin Dashboard",
    description:
      "Administrative dashboard for managing Foundly Internal Operations",
    url: "https://admin.protect.foundlyhq.com",
    siteName: "Foundly Admin",
    images: [
      {
        url: "https://admin.protect.foundlyhq.com/og-image.png",
        width: 500,
        height: 540,
        alt: "Foundly Admin Dashboard",
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
      url: "https://github.com/VictorNzai",
    },
  ],
};
