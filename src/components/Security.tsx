"use client";

import React from "react";
import { ExternalLink, Binary, Database, Cpu, FileText } from "lucide-react";

export function Security() {

  return (
    <section
      id="security"
      className="relative w-full py-28 sm:py-36 px-6 bg-[#050505] text-[#FAFAFA] border-t border-white/[0.06] overflow-hidden"
    >
      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full border border-white/10 bg-white/[0.04] text-[#A7A6A6] text-xs font-mono uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Privacy & Trust Architecture
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#FAFAFA] tracking-tight leading-[1.08]">
            Zero personal data on-chain. <br />
            Only cryptographic math.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#A7A6A6] font-sans leading-relaxed">
            Full compliance with GDPR, FERPA, and global educational data privacy laws. Names, grades, and student records are never exposed to the public blockchain.
          </p>
        </div>

        {/* Cryptographic Pipeline Explainer Diagram (PDF -> Hash -> Merkle Tree -> Polygon) */}
        <div className="rounded-2xl bg-[#0E0E10] border border-white/10 p-8 sm:p-12 mb-12 shadow-2xl">
          <div className="text-xs font-mono text-[#8B8A8A] uppercase tracking-wider mb-8">
            DATA PRIVACY ARCHITECTURE & PROOF LIFECYCLE
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Stage 1: Local PDF */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/80 mb-3">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-xs font-mono text-white/40 uppercase">Stage 01</div>
                <h4 className="text-base font-medium text-white mt-1">Local PDF</h4>
                <p className="text-xs text-[#A7A6A6] mt-2 leading-relaxed">
                  Generated in private institute memory. Contains student name, course, and grade.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] text-[10px] font-mono text-white/40">
                🔒 NEVER SENT ON-CHAIN
              </div>
            </div>

            {/* Stage 2: SHA-256 Hash */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/80 mb-3">
                  <Binary className="w-4 h-4" />
                </div>
                <div className="text-xs font-mono text-white/40 uppercase">Stage 02</div>
                <h4 className="text-base font-medium text-white mt-1">SHA-256 Hash</h4>
                <p className="text-xs text-[#A7A6A6] mt-2 leading-relaxed">
                  One-way mathematical digest. Impossible to reverse-engineer student identity.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] text-[10px] font-mono text-[#10B981]">
                ✓ ONE-WAY ANONYMOUS
              </div>
            </div>

            {/* Stage 3: Merkle Tree Batch */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/80 mb-3">
                  <Database className="w-4 h-4" />
                </div>
                <div className="text-xs font-mono text-white/40 uppercase">Stage 03</div>
                <h4 className="text-base font-medium text-white mt-1">Merkle Tree</h4>
                <p className="text-xs text-[#A7A6A6] mt-2 leading-relaxed">
                  10,000+ hashes compressed into a single 32-byte cryptographic Merkle root.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] text-[10px] font-mono text-white/40">
                ⚡ SCALES FRACTIONAL GAS
              </div>
            </div>

            {/* Stage 4: Polygon Anchor */}
            <div className="p-5 rounded-xl bg-[#10B981]/[0.04] border border-[#10B981]/30 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#10B981]/10 flex items-center justify-center text-[#10B981] mb-3">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="text-xs font-mono text-[#10B981] uppercase">Stage 04</div>
                <h4 className="text-base font-medium text-white mt-1">Polygon Anchor</h4>
                <p className="text-xs text-[#A7A6A6] mt-2 leading-relaxed">
                  Only the 32-byte root is written to Polygon. Immutable and verifiable globally forever.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#10B981]/20 text-[10px] font-mono text-[#10B981]">
                ✓ IMMUTABLE PROOF
              </div>
            </div>
          </div>
        </div>

        {/* Live PolygonScan Block Explorer Card */}
        <div className="p-6 rounded-2xl bg-[#0E0E10] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 font-mono text-xs">
          <div>
            <div className="flex items-center gap-2 text-white font-medium">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>ANCHORED ON POLYGON MAINNET</span>
            </div>
            <div className="text-white/40 text-[11px] mt-1">
              Contract: 0x71C948F2A6bC0382E... | Verified Smart Contract on PolygonScan
            </div>
          </div>

          <a
            href="https://polygonscan.com"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all flex items-center gap-2 shrink-0"
          >
            <span>View Contract on PolygonScan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
