"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSpreadsheet, Cpu, QrCode, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Upload CSV or Connect API",
    badge: "BATCH INGESTION",
    description:
      "Drop a spreadsheet with student names, roll numbers, and course details. CertChain validates the fields and generates vector-sharp, branded PDF credentials in seconds.",
    icon: FileSpreadsheet,
    mockup: {
      type: "csv",
      title: "alumni_batch_2026.csv",
      rows: [
        { name: "Sarah Jenkins", id: "ST-8901", course: "Distributed Cryptography", gpa: "3.94" },
        { name: "Michael Chang", id: "ST-8902", course: "AI & Machine Learning", gpa: "4.00" },
        { name: "Priya Sharma", id: "ST-8903", course: "Applied Quantum Computing", gpa: "3.88" },
      ],
      footerNote: "240 records parsed · 0 schema errors detected",
    },
  },
  {
    step: "02",
    title: "Anchor on Polygon",
    badge: "MERKLE ROOT ANCHOR",
    description:
      "All certificates are hashed with SHA-256 and structured into a cryptographic Merkle tree. Only the single root hash is written to Polygon Layer-2—keeping gas fees under ₹1 per 500 certificates.",
    icon: Cpu,
    mockup: {
      type: "tree",
      title: "Polygon Smart Contract Commitment",
      root: "0x89f4b62d3a1e94c8b2098e77a102bc45ff72d0b31e9c8a140d38c1192834b7f0",
      txHash: "0x3f98c21a4e7...8891d0",
      block: "#61,420,918",
      cost: "0.0024 MATIC (~₹0.28)",
      footerNote: "Confirmed on-chain · 128 block confirmations",
    },
  },
  {
    step: "03",
    title: "Verify Anywhere in 5 Seconds",
    badge: "INSTANT PROOF",
    description:
      "Every PDF certificate includes a dynamic verification link and tamper-proof QR code. Employers and background check companies verify authenticity instantly without needing crypto wallets.",
    icon: QrCode,
    mockup: {
      type: "verify",
      title: "Public Verifier Terminal",
      status: "AUTHENTIC & TAMPER-FREE",
      issuer: "Stanford Credentials Office",
      student: "Sarah Jenkins",
      algorithm: "SHA-256 Merkle Membership Proof",
      footerNote: "Verified via Polygon RPC in 3.8s",
    },
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const easeCurve = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      id="how-it-works"
      className="relative w-full py-28 sm:py-36 px-6 bg-[#050505] text-[#FAFAFA] border-t border-white/[0.06] overflow-hidden"
    >
      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full border border-white/10 bg-white/[0.04] text-[#A7A6A6] text-xs font-mono uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
            Simple 3-Step Architecture
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#FAFAFA] tracking-tight leading-[1.08]">
            From spreadsheet to Polygon <br />
            in three clicks.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#A7A6A6] font-sans leading-relaxed">
            No smart contract coding, no crypto wallets, no complex gas management. CertChain handles all cryptographic bundling behind an intuitive registrar UI.
          </p>
        </div>

        {/* Interactive 3-Step Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Step Navigation List */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.step}
                  onClick={() => setActiveStep(idx)}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[#0E0E10] border-white/20 shadow-xl"
                      : "bg-transparent border-white/[0.06] hover:border-white/10 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                        isActive
                          ? "bg-white text-black"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      STEP {step.step}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#8B8A8A]">
                      {step.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-medium text-white mb-2 flex items-center justify-between">
                    <span>{step.title}</span>
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? "text-[#10B981]" : "text-white/40"
                      }`}
                    />
                  </h3>

                  <p className="text-xs sm:text-sm text-[#A7A6A6] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Dashboard Mockup */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl bg-[#0E0E10] border border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden min-h-[420px] flex flex-col justify-between">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="ml-3 font-mono text-xs text-white/50">
                    certchain-console // {STEPS[activeStep].mockup.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#10B981] uppercase bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                  READY
                </span>
              </div>

              {/* Dynamic Mockup Body */}
              <div className="py-6 flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {/* Step 1 Mockup: CSV */}
                  {activeStep === 0 && (
                    <motion.div
                      key="step-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, ease: easeCurve }}
                      className="flex flex-col gap-3 font-mono text-xs"
                    >
                      <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-between text-white/60">
                        <span>CSV File Loaded:</span>
                        <span className="text-white font-semibold">
                          2026_Engineering_Graduates.csv (42 KB)
                        </span>
                      </div>
                      <div className="overflow-x-auto border border-white/[0.06] rounded-xl bg-black/40">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-white/[0.04] text-white/50 border-b border-white/[0.06]">
                            <tr>
                              <th className="p-2.5">Candidate Name</th>
                              <th className="p-2.5">Student ID</th>
                              <th className="p-2.5">Major / Degree</th>
                              <th className="p-2.5">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.04] text-white/80">
                            {STEPS[0].mockup.rows?.map((r, i) => (
                              <tr key={i}>
                                <td className="p-2.5 font-medium text-white">{r.name}</td>
                                <td className="p-2.5 text-white/60">{r.id}</td>
                                <td className="p-2.5">{r.course}</td>
                                <td className="p-2.5 text-[#10B981]">✓ Valid</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2 Mockup: Merkle Tree & Polygon */}
                  {activeStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, ease: easeCurve }}
                      className="flex flex-col gap-3 font-mono text-xs"
                    >
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col gap-2">
                        <span className="text-[10px] text-white/40 uppercase">
                          Anchor Merkle Root Hash:
                        </span>
                        <code className="text-xs text-[#10B981] break-all">
                          {STEPS[1].mockup.root}
                        </code>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-[11px]">
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <span className="text-white/40 block text-[10px] uppercase">
                            Polygon Block:
                          </span>
                          <span className="text-white font-semibold">
                            {STEPS[1].mockup.block}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <span className="text-white/40 block text-[10px] uppercase">
                            Total Gas Cost:
                          </span>
                          <span className="text-[#10B981] font-semibold">
                            {STEPS[1].mockup.cost}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3 Mockup: Public Verifier */}
                  {activeStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, ease: easeCurve }}
                      className="flex flex-col gap-3 font-mono text-xs"
                    >
                      <div className="p-4 rounded-xl bg-[#10B981]/[0.08] border border-[#10B981]/30 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#10B981]">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-semibold text-sm">
                            {STEPS[2].mockup.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#10B981] border border-[#10B981]/30 px-2 py-0.5 rounded">
                          5 SECONDS
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-1.5 text-[11px]">
                        <div className="flex justify-between text-white/50">
                          <span>Verified Issuer:</span>
                          <span className="text-white">{STEPS[2].mockup.issuer}</span>
                        </div>
                        <div className="flex justify-between text-white/50">
                          <span>Certificate Recipient:</span>
                          <span className="text-white">{STEPS[2].mockup.student}</span>
                        </div>
                        <div className="flex justify-between text-white/50">
                          <span>Verification Method:</span>
                          <span className="text-[#10B981]">
                            {STEPS[2].mockup.algorithm}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Window Footer */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-white/40">
                <span>{STEPS[activeStep].mockup.footerNote}</span>
                <span className="text-white/60">Step {activeStep + 1} of 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
