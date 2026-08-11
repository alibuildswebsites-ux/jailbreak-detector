import type { Metadata } from "next";
import { Outfit, Rubik } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jailbreak-detector.vercel.app/"),
  title: "Jailbreak Detector — Guard your LLM",
  description:
    "Paste any prompt and instantly know if it is a jailbreak attack or benign. Powered by a TF-IDF + Logistic Regression model (97.7% accuracy, recall-first for safety).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${rubik.variable}`}>
      <body>{children}</body>
    </html>
  );
}