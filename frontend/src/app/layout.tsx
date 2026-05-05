import "./globals.css";
import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const siteUrl = "https://codeenhancer.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OptiCode - AI Code Optimizer and Analyzer",
    template: "%s | OptiCode",
  },
  description:
    "OptiCode is an AI code optimizer and analyzer that improves performance, complexity, and DSA patterns across Python, C++, Java, C, and C#.",
  keywords: [
    "code optimizer",
    "code analyzer",
    "AI code tool",
    "DSA optimization tool",
    "Python code analyzer",
    "AI code optimization tool",
    "opticode",
  ],
  alternates: {
    canonical: siteUrl,
  },
  authors: [
    {
      name: "Soman Abbasi",
      url: "https://www.somanabbasi.tech/",
    },
  ],
  creator: "Soman Abbasi",
  openGraph: {
    title: "OptiCode - AI Code Optimizer and Analyzer",
    description:
      "Optimize code with AI-driven complexity analysis, DSA suggestions, and performance improvements.",
    url: siteUrl,
    siteName: "OptiCode",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "OptiCode - AI Code Optimizer and Analyzer",
    description:
      "Optimize code with AI-driven complexity analysis, DSA suggestions, and performance improvements.",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "profile:first_name": "Soman",
    "profile:last_name": "Abbasi",
    "profile:username": "SomanAbbasi",
    "profile:gender": "male",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${jetbrainsMono.variable} bg-slate-50 text-slate-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}