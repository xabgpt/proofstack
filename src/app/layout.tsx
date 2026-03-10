import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProofStack — Your Work, Verified. Your Reputation, Portable.",
  description:
    "Stop relying on platforms to prove what you've done. ProofStack lets clients verify your work in one click — giving you a credibility record you own forever.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
