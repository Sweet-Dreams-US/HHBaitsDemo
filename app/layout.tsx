import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Alfa_Slab_One, Sometype_Mono, Permanent_Marker } from "next/font/google";
import "./globals.css";

// next/font downloads these at build time and serves them from this deployment.
// Nothing is fetched from a font CDN at runtime.
const display = Alfa_Slab_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const body = Sometype_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

const hand = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "H&H Baits. Soft fishing baits, poured by hand.",
  description: "H&H Baits sells soft fishing baits. Green pumpkin plastic with gold, silver and red flake, poured by hand and shipped from here.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f1f2ec",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${hand.variable}`}>
      <body>
        {children}
        {/* Vendored locally in public/vendor so the film keeps working without a CDN. */}
        <Script src="/vendor/gsap.min.js" strategy="beforeInteractive" />
        <Script src="/vendor/ScrollTrigger.min.js" strategy="beforeInteractive" />
        <Script src="/vendor/lenis.min.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
