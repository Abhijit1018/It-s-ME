import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { EasterEggs } from "@/components/ui/EasterEggs";
import { TerminalModal } from "@/components/ui/TerminalModal";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s — Abhijit Singh",
    default: "Abhijit Singh — Developer & Builder",
  },
  description:
    "Personal portfolio of Abhijit Singh — developer building AI agents, full-stack apps, and enterprise tools.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://abhijit-singh.in"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Abhijit Singh",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Abhijit Singh — Developer & Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "6UG1kiTamRWkkvVxaTi_6IEFNCe549cGzaKL4KAXacA",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Abhijit Singh",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://abhijit-singh.in",
  jobTitle: "Developer & Builder",
  description:
    "Developer building AI agents, full-stack apps, and enterprise tools.",
  sameAs: [
    "https://github.com/Abhijit1018",
    "https://www.linkedin.com/in/abhijit-singh10",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable} h-full`}
    >
      <body>
        <Script
          id="person-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:px-4 focus:py-2 focus:rounded-md"
          style={{ background: "var(--accent-sage)", color: "#F7F4EF" }}
        >
          Skip to main content
        </a>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('portfolio-theme'),p=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t||p)}catch(e){}`,
          }}
        />
        <ThemeProvider>
          <SmoothScrollProvider>
            <CustomCursor />
            <EasterEggs />
            <TerminalModal />
            <Navbar />
            <CommandPalette />
            <main id="main-content" className="bg-gradient-radial-glow">{children}</main>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
