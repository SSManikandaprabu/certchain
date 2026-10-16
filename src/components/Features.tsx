"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Layers,
  Palette,
  QrCode,
  ShieldAlert,
  MailCheck,
  Users2,
  History,
  Globe2,
  Code2,
} from "lucide-react";

const FEATURES = [
  {
    id: "merkle-batch",
    title: "Batch Issuing with One Merkle Root",
    description:
      "Compress 10,000+ student certificates into a single 32-byte cryptographic hash anchored on Polygon. Pay pennies in gas fees for an entire graduating class.",
    icon: Layers,
    colSpan: "lg:col-span-8",
    visual: (
      <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-[11px] flex flex-col gap-2">
        <div className="flex items-center justify-between text-white/50 pb-2 border-b border-white/[0.06]">
          <span>Cohort Batch #2026-A (5,240 Certificates)</span>
          <span className="text-[#10B981]">1 On-Chain Tx</span>
        </div>
        <div className="flex items-center gap-2 text-white/80">
          <span className="text-white/40">ROOT:</span>
          <span className="text-white truncate">
            0x89f4b62d3a1e94c8b2098e77a102bc45ff72d0b31e9c8a...
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-white/40 pt-1">
          <span>Gas Cost: ~₹0.18</span>
          <span>Settlement Time: ~2.1s</span>
        </div>
      </div>
    ),
  },
  {
    id: "branded-templates",
    title: "Custom Branded Templates",
    description:
      "Design pixel-perfect vector diplomas with custom university seals, typography, foil borders, and dynamic variables.",
    icon: Palette,
    colSpan: "lg:col-span-4",
    visual: (
      <div className="mt-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between font-mono text-[11px]">
        <span className="text-white/70">Theme: Institutional Gold</span>
        <span className="w-3 h-3 rounded-full bg-[#10B981]" />
      </div>
    ),
  },
  {
    id: "embedded-qr",
    title: "Tamper-Proof QR on Every PDF",
    description:
      "Every issued document includes an embedded cryptographic QR code readable by any smartphone camera with zero apps needed.",
    icon: QrCode,
    colSpan: "lg:col-span-4",
    visual: (
      <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-center">
        <div className="px-3 py-1.5 rounded-lg border border-[#10B981]/40 bg-[#10B981]/[0.08] text-[#10B981] font-mono text-[11px] flex items-center gap-2">
          <QrCode className="w-4 h-4" />
          <span>SCAN TO VERIFY</span>
        </div>
      </div>
    ),
  },
  {
    id: "instant-revocation",
    title: "Instant On-Chain Revocation",
    description:
      "Revoke compromised, fraudulent, or misprinted certificates with a single click. Status changes propagate globally in seconds.",
    icon: ShieldAlert,
    colSpan: "lg:col-span-4",
    visual: (
      <div className="mt-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between font-mono text-[11px]">
        <span className="text-[#EF4444] font-semibold">STATUS: REVOKED</span>
        <span className="text-white/40 text-[10px]">RECORD PRESERVED</span>
      </div>
    ),
  },
  {
    id: "bulk-delivery",
    title: "Automated Email Dispatch",
    description:
      "Automatically deliver personalized, cryptographically signed credentials directly to thousands of graduates via high-deliverability SMTP.",
    icon: MailCheck,
    colSpan: "lg:col-span-4",
    visual: (
      <div className="mt-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between font-mono text-[11px]">
        <span className="text-white/70">5,240 Emails Sent</span>
        <span className="text-[#10B981]">99.8% Delivered</span>
      </div>
    ),
  },
  {
    id: "team-roles",
    title: "Registrar Roles & Permissions",
    description:
      "Multi-user administrative controls with separate permissions for template designers, issue reviewers, and department heads.",
    icon: Users2,
    colSpan: "lg:col-span-4",
    visual: (
      <div className="mt-4 flex gap-1.5 flex-wrap font-mono text-[10px]">
        <span className="px-2 py-1 bg-white/10 text-white rounded">DEAN (ADMIN)</span>
        <span className="px-2 py-1 bg-white/5 text-white/60 rounded">REGISTRAR</span>
        <span className="px-2 py-1 bg-white/5 text-white/60 rounded">AUDITOR</span>
      </div>
    ),
  },
  {
    id: "audit-log",
    title: "Immutable History & Audit Trail",
    description:
      "Complete cryptographic audit trails recording every issuance, dispatch, scan, and verification for institutional compliance.",
    icon: History,
    colSpan: "lg:col-span-4",
    visual: (
      <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-[10px] text-white/50 flex flex-col gap-1">
        <div>10:14:02 UTC · Batch #2026-A Anchored</div>
        <div>10:14:18 UTC · 5,240 Receipts Dispatched</div>
      </div>
    ),
  },
  {
    id: "white-label",
    title: "Custom Institute Verify Portal",
    description:
      "Host verification on your own domain (e.g. verify.stanford.edu) with custom school branding, logos, and registrar disclosures.",
    icon: Globe2,
    colSpan: "lg:col-span-4",
    visual: (
      <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] font-mono text-[11px] text-white/70 flex items-center gap-2">
        <span className="text-[#10B981]">https://</span>
        <span>verify.university.edu</span>
      </div>
    ),
  },
  {
    id: "developer-api",
    title: "REST & GraphQL API Integration",
    description:
      "Connect CertChain directly to Moodle, Canvas, Blackboard, or custom ERP systems with complete SDKs in TypeScript, Python, and Go.",
    icon: Code2,
    colSpan: "lg:col-span-12",
    visual: (
      <div className="mt-4 p-4 rounded-xl bg-black/60 border border-white/[0.06] font-mono text-xs overflow-x-auto text-white/80">
        <span className="text-[#10B981]">POST</span> /api/v1/certificates/issue
        <div className="text-white/40 mt-1">
          {`{ "institute_id": "inst_stanford", "batch_size": 240, "chain": "polygon-mainnet" }`}
        </div>
      </div>
    ),
  },
];

export function Features() {
  const easeCurve = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      id="features"
      className="relative w-full py-28 sm:py-36 px-6 bg-[#050505] text-[#FAFAFA] border-t border-white/[0.06] overflow-hidden"
    >
      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full border border-white/10 bg-white/[0.04] text-[#A7A6A6] text-xs font-mono uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Enterprise Infrastructure
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#FAFAFA] tracking-tight leading-[1.08]">
            Built for institutions. <br />
            Loved by registrars.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#A7A6A6] font-sans leading-relaxed">
            Everything your credential office needs to replace outdated paper registries with automated, tamper-proof cryptographic proofs.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.05,
                  ease: easeCurve,
                }}
                className={`rounded-2xl bg-[#0E0E10] border border-white/[0.08] hover:border-white/20 transition-all duration-300 p-7 flex flex-col justify-between ${item.colSpan}`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/80 mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A7A6A6] font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {item.visual}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
