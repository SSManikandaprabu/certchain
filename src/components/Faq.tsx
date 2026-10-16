"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Do I or my students need cryptocurrency or a crypto wallet?",
    a: "No. Neither your institution nor your students need wallets, tokens, or crypto knowledge. CertChain abstracts all on-chain gas operations through fiat billing (UPI, credit cards, wire transfers). Students receive a standard PDF certificate with an embedded verification QR code.",
  },
  {
    q: "What if CertChain shuts down in the future?",
    a: "Your certificates remain 100% verifiable forever. Because the Merkle roots are committed immutably to Polygon's public blockchain, anyone with the original PDF can compute its SHA-256 hash and verify it against Polygon's smart contract using open-source tools without CertChain's servers.",
  },
  {
    q: "Can certificates be forged, edited, or faked?",
    a: "No. Even changing a single pixel, letter, or grade in the PDF alters its cryptographic SHA-256 mathematical digest completely (avalanche effect). When checked against the institute's on-chain Merkle root, the verification algorithm immediately identifies the tamper and rejects the document.",
  },
  {
    q: "What does verification cost for employers or background checkers?",
    a: "Verification is 100% free for everyone, forever. Employers, background verification companies, and embassies can verify any certificate in 5 seconds via web browser or by scanning the QR code without creating an account or paying fees.",
  },
  {
    q: "Can an institution revoke a certificate after it is issued?",
    a: "Yes. Institutes can revoke certificates at any time through the dashboard or API (e.g. in cases of academic dishonesty or administrative errors). Revocation status is instantly reflected on-chain while preserving the historical audit log.",
  },
  {
    q: "Is sensitive student data stored on the public blockchain?",
    a: "Never. Only one-way anonymous 32-byte cryptographic SHA-256 hashes are anchored on Polygon. Student names, email addresses, roll numbers, and grades never touch the blockchain, ensuring full compliance with GDPR, FERPA, and national data privacy regulations.",
  },
  {
    q: "Which blockchain does CertChain use, and why?",
    a: "CertChain uses Polygon PoS (Layer-2 Ethereum). Polygon provides enterprise-grade EVM security, sub-second finality, carbon-neutral proof-of-stake consensus, and ultra-low transaction costs, allowing us to anchor batches of thousands of certificates for pennies.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative w-full py-28 sm:py-36 px-6 bg-[#050505] text-[#FAFAFA] border-t border-white/[0.06] overflow-hidden"
    >
      <div className="relative max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full border border-white/10 bg-white/[0.04] text-[#A7A6A6] text-xs font-mono uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
            Frequently Asked Questions
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#FAFAFA] tracking-tight leading-[1.08]">
            Everything you need to know.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#A7A6A6] font-sans leading-relaxed">
            Clear answers about cryptography, security, pricing, and long-term durability.
          </p>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0E0E10] border border-white/[0.08] hover:border-white/15 transition-colors overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-medium text-sm sm:text-base text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/50 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-6 pb-6 text-xs sm:text-sm text-[#A7A6A6] leading-relaxed border-t border-white/[0.04] pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
