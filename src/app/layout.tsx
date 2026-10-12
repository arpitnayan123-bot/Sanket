import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Sanket — AI Clinical Companion for Bharat",
  description:
    "Sanket turns a doctor's voice into a FHIR note and a patient's voice reminder. Built for India's ABDM. Black, yellow, white.",
  keywords: [
    "Sanket",
    "ABDM",
    "Ayushman Bharat",
    "FHIR",
    "ICD-10",
    "SNOMED",
    "clinical AI",
    "India healthcare",
    "code-switching NLP",
    "Llama 3.3",
  ],
  authors: [{ name: "Sanket Architecture" }],
  openGraph: {
    title: "Sanket — AI Clinical Companion for Bharat",
    description:
      "From doctor's voice to FHIR note to patient's native-language voice reminder. Built for India's ABDM.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
