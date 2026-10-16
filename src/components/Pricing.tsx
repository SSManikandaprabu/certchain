"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  const PLANS = [
    {
      name: "Free",
      price: isYearly ? "₹0" : "₹0",
      cadence: "forever free",
      description: "For small workshops, hackathons, and independent mentors.",
      highlighted: false,
      badge: null,
      cta: "Start Free",
      ctaHref: "/signup",
      features: [
        "Up to 50 certificates / month",
        "Polygon Layer-2 on-chain anchor",
        "Public instant verification link",
        "Standard CertChain template",
        "Email support",
      ],
    },
    {
      name: "Starter",
      price: isYearly ? "₹399" : "₹499",
      cadence: "per month, billed annually",
      description: "Ideal for growing vocational academies and training institutes.",
      highlighted: true,
      badge: "MOST POPULAR",
      cta: "Start 14-Day Trial",
      ctaHref: "/signup",
      features: [
        "Up to 500 certificates / month",
        "Everything in Free, plus:",
        "Custom logo & institution branding",
        "Automated batch CSV upload",
        "Embedded QR codes on all PDFs",
        "1-click on-chain revocation",
        "Priority registrar support",
      ],
    },
    {
      name: "Pro",
      price: isYearly ? "₹1,599" : "₹1,999",
      cadence: "per month, billed annually",
      description: "For colleges, large academies, and high-volume event organizers.",
      highlighted: false,
      badge: null,
      cta: "Get Pro Access",
      ctaHref: "/signup",
      features: [
        "Up to 2,500 certificates / month",
        "Everything in Starter, plus:",
        "Automated bulk email delivery",
        "Multi-admin team roles & permissions",
        "Custom domain (verify.yourdomain.edu)",
        "Permanent audit logs & exports",
        "Dedicated onboarding manager",
      ],
    },
    {
      name: "Custom",
      price: "Custom",
      cadence: "tailored volume",
      description: "For university systems, government boards, and state councils.",
      highlighted: false,
      badge: "ENTERPRISE",
      cta: "Contact Enterprise",
      ctaHref: "/signup",
      features: [
        "Unlimited monthly certificates",
        "Everything in Pro, plus:",
        "Full REST & GraphQL API access",
        "LMS integration (Moodle, Canvas, Banner)",
        "Custom smart contract deployment",
        "99.99% SLA uptime guarantee",
        "Dedicated cryptographic engineer",
      ],
    },
  ];

  return (
    <section
      id="pricing"
      className="relative w-full py-28 sm:py-36 px-6 bg-[#050505] text-[#FAFAFA] border-t border-white/[0.06] overflow-hidden"
    >
      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full border border-white/10 bg-white/[0.04] text-[#A7A6A6] text-xs font-mono uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Transparent Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#FAFAFA] tracking-tight leading-[1.08]">
            Simple plans for every scale.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#A7A6A6] font-sans leading-relaxed">
            Anchored cryptographically on Polygon. No hidden gas fees, no wallet setup required.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1 rounded-full bg-[#0E0E10] border border-white/10 text-xs font-medium">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 rounded-full transition-all ${
                !isYearly ? "bg-white text-black" : "text-white/60 hover:text-white"
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                isYearly ? "bg-white text-black" : "text-white/60 hover:text-white"
              }`}
            >
              <span>Yearly billing</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#10B981]/20 text-[#10B981] font-mono">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 relative ${
                plan.highlighted
                  ? "bg-[#0E0E10] border-2 border-white/30 shadow-2xl scale-[1.02]"
                  : "bg-[#0E0E10]/70 border border-white/[0.08] hover:border-white/20"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-white text-black font-mono text-[10px] font-semibold uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="text-sm font-semibold text-white tracking-wide">
                  {plan.name}
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-light text-white tracking-tight">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-xs text-white/50 font-mono">/mo</span>
                  )}
                </div>
                <div className="text-[11px] text-[#A7A6A6] mt-1 font-mono">
                  {plan.cadence}
                </div>
                <p className="text-xs text-[#A7A6A6] mt-4 leading-relaxed pb-6 border-b border-white/[0.08]">
                  {plan.description}
                </p>

                {/* Features List */}
                <div className="mt-6 flex flex-col gap-3">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-white/80">
                      <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan CTA */}
              <div className="mt-8 pt-4">
                <Link
                  href={plan.ctaHref}
                  className={`w-full py-3 rounded-full text-xs font-medium tracking-wide flex items-center justify-center transition-all ${
                    plan.highlighted
                      ? "bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                      : "border border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
