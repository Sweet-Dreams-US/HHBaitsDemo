import type { Metadata } from "next";
import { Climate_Crisis, Inclusive_Sans } from "next/font/google";
import "./globals.css";

const display = Climate_Crisis({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const body = Inclusive_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "H&H Baits | Soft fishing baits and merchandise",
  description: "Explore H&H Baits and ask about the first online collection.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
