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
  title: "Foundly Admin App",
  description: "Smarter Lost and Found for Modern Institutions",
  keywords: ["Lost and Found", "Institutions", "Foundly", "Smart Tracking"],
  creator: "Foundly Team",
  openGraph: {
    title: "Foundly",
    description: "Smarter Lost and Found for Modern Institutions",
    url: "https://app.foundlyhq.com",
    siteName: "Foundly",
    images: [
      {
        url: "https://app.foundlyhq.com/og-image.png",
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
      url: "https://github.com/VictorNzai",
    },
  ],
};
