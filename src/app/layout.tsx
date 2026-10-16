import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "CertChain | Tamper-proof certificates, verified in 5 seconds.",
  description:
    "CertChain lets institutes issue tamper-proof certificates in bulk (anchored on Polygon) and lets anyone verify a PDF in 5 seconds. No blockchain knowledge needed.",
  keywords: [
    "blockchain certificates",
    "tamper-proof certificates",
    "Polygon verification",
    "academic credentials",
    "bulk certificate issuance",
    "Merkle tree verification",
  ],
  authors: [{ name: "CertChain Technologies" }],
  openGraph: {
    title: "CertChain | Tamper-proof certificates, verified in 5 seconds.",
    description:
      "Bulk cryptographic certificate issuance on Polygon with instant 5-second PDF verification.",
    url: "https://certchain.io",
    siteName: "CertChain",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CertChain | Tamper-proof certificates, verified in 5 seconds.",
    description:
      "Bulk cryptographic certificate issuance on Polygon with instant 5-second PDF verification.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-bg text-ink min-h-screen antialiased selection:bg-white/20">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
