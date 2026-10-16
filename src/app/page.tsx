import React from "react";
import { StickyNavbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { VerifyDemo } from "@/components/VerifyDemo";
import { Problem } from "@/components/Problem";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { UseCases } from "@/components/UseCases";
import { Security } from "@/components/Security";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#050505] text-[#FAFAFA] overflow-x-hidden">
      {/* Sticky Blurred Glass Navbar when scrolled past hero */}
      <StickyNavbar />

      {/* SECTION 1: HERO */}
      <Hero />

      {/* SECTION 2: LIVE VERIFY DEMO */}
      <VerifyDemo />

      {/* SECTION 3: THE PROBLEM */}
      <Problem />

      {/* SECTION 4: HOW IT WORKS */}
      <HowItWorks />

      {/* SECTION 5: FEATURES (BENTO GRID) */}
      <Features />

      {/* SECTION 6: WHO IT'S FOR */}
      <UseCases />

      {/* SECTION 7: TRUST & SECURITY */}
      <Security />

      {/* SECTION 8: PRICING */}
      <Pricing />

      {/* SECTION 9: FAQ */}
      <Faq />

      {/* SECTION 10: FINAL CTA + FOOTER */}
      <Footer />
    </main>
  );
}
