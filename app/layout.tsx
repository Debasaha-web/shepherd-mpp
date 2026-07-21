import type { Metadata, Viewport } from "next";
import { Oswald, Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";

// Display headings, nav labels, eyebrow tags, button text.
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

// Main hero / section headings (+ italic Scripture).
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-source",
  display: "swap",
});

// Body text, labels, form inputs.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shepherd Mental Edge Protocols",
  description: "Shepherd Coach Network · Shepherd Mental Edge Protocols (Overcoming Your Goliaths)",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f6f3ec",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oswald.variable} ${sourceSerif.variable} ${inter.variable}`}>
      <body>
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
