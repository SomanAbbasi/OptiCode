import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";

export const metadata: Metadata = {
  title: "OptiCode - AI Code Analyzer & Optimizer",
  description: "Find inefficient code patterns, analyze complexity, and get AI-powered optimization suggestions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={{ backgroundColor: '#0f172a', colorScheme: 'dark' }}
    >
      <body style={{ backgroundColor: '#0f172a', color: '#f1f5f9' }}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
