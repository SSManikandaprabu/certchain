"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Code, Trophy, Briefcase, CheckCircle2 } from "lucide-react";
import { CertChainShield } from "./CertChainLogo";

const USE_CASES = [
  {
    id: "training-institutes",
    label: "Training Institutes",
    icon: Code,
    headline: "Coding Bootcamps & Vocational Academies",
    summary:
      "Accelerate graduate hiring by providing verifiable proof of hands-on technical proficiency. Employers verify student competencies in 5 seconds without waiting on email threads.",
    benefits: [
      "Bulk dispatch certificates automatically upon course completion",
      "Embed GitHub and capstone project hashes directly into credentials",
      "White-labeled student directory for hiring partners",
    ],
    certPreview: {
      institution: "Fullstack Technical Institute",
      student: "Alex Rivera",
      program: "Full-Stack Web3 & Cloud Engineering",
      date: "September 2026",
      badgeColor: "#10B981",
      credentialId: "FTI-2026-881",
    },
  },
  {
    id: "colleges",
    label: "Colleges & Universities",
    icon: GraduationCap,
    headline: "Higher Education & Degree Granting Bodies",
    summary:
      "Eliminate transcript fraud, reduce registrar phone calls by 95%, and ensure alumni diplomas remain verifiable forever even if archival software changes.",
    benefits: [
      "SIS integration with Banner, PeopleSoft, and Canvas",
      "Multi-signatory approval workflows for Deans & Chancellors",
      "Tamper-proof transcripts with individual course grade anchoring",
    ],
    certPreview: {
      institution: "Metropolitan State University",
      student: "Marcus Vance",
      program: "Bachelor of Science in Computer Engineering",
      date: "May 2026",
      badgeColor: "#10B981",
      credentialId: "MSU-2026-00412",
    },
  },
  {
    id: "hackathons",
    label: "Hackathons & Events",
    icon: Trophy,
    headline: "Conferences, Hackathons & Web3 Summits",
    summary:
      "Distribute NFT or Polygon-anchored achievement badges to 5,000+ hackathon attendees and winners in a single gas-optimized batch transaction.",
    benefits: [
      "Generate certificates instantly from Devpost or CSV export",
      "Custom holographic winner medals & category badges",
      "Social sharing to LinkedIn with one-click verification badge",
    ],
    certPreview: {
      institution: "Global AI & Web3 Hackathon 2026",
      student: "Elena Rostova",
      program: "1st Place Winner · Autonomous AI Agents Track",
      date: "August 2026",
      badgeColor: "#10B981",
      credentialId: "HACK-2026-GOLD-01",
    },
  },
  {
    id: "internship-providers",
    label: "Internship Providers",
    icon: Briefcase,
    headline: "Corporate Internships & Research Fellowships",
    summary:
      "Issue cryptographic experience letters and internship completion letters that future employers can verify with mathematical certainty.",
    benefits: [
      "Issue verified letters of recommendation with tamper-proof signatures",
      "Department-level tracking and supervisor approvals",
      "Permanent proof of tenure, role responsibilities, and achievements",
    ],
    certPreview: {
      institution: "Apex Applied Robotics Labs",
      student: "Devon Reed",
      program: "Graduate Machine Learning Research Fellowship",
      date: "July 2026",
      badgeColor: "#10B981",
      credentialId: "APEX-INTERN-2026-44",
    },
  },
];

export function UseCases() {
  const [activeTab, setActiveTab] = useState(0);
  const easeCurve = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      id="use-cases"
      className="relative w-full py-28 sm:py-36 px-6 bg-[#050505] text-[#FAFAFA] border-t border-white/[0.06] overflow-hidden"
    >
      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full border border-white/10 bg-white/[0.04] text-[#A7A6A6] text-xs font-mono uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
            Tailored Industry Solutions
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#FAFAFA] tracking-tight leading-[1.08]">
            Engineered for every credential issuer.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#A7A6A6] font-sans leading-relaxed">
            From technical academies to university systems, CertChain powers cryptographic trust across the education lifecycle.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-white/[0.08] mb-12">
          {USE_CASES.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-white text-black shadow-lg"
                    : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={USE_CASES[activeTab].id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: easeCurve }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Column: Use Case Overview */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div>
                <span className="text-[11px] font-mono text-[#10B981] uppercase tracking-widest block mb-2">
                  CASE STUDY ARCHITECTURE
                </span>
                <h3 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
                  {USE_CASES[activeTab].headline}
                </h3>
                <p className="text-sm sm:text-base text-[#A7A6A6] leading-relaxed mt-4">
                  {USE_CASES[activeTab].summary}
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                {USE_CASES[activeTab].benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-white/90 font-sans">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Realistic Sample Certificate Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-[#0E0E10] border border-white/10 p-7 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[340px]">
                {/* Certificate Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center">
                      <CertChainShield className="w-4 h-5" />
                    </div>
                    <span className="font-semibold text-xs text-white">
                      {USE_CASES[activeTab].certPreview.institution}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                    VERIFIED
                  </span>
                </div>

                {/* Certificate Card Body */}
                <div className="py-6">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1">
                    CERTIFIED RECIPIENT
                  </div>
                  <div className="text-xl font-medium text-white">
                    {USE_CASES[activeTab].certPreview.student}
                  </div>
                  <div className="text-xs text-[#A7A6A6] mt-2">
                    {USE_CASES[activeTab].certPreview.program}
                  </div>
                </div>

                {/* Certificate Card Footer */}
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-white/40">
                  <span>ID: {USE_CASES[activeTab].certPreview.credentialId}</span>
                  <span>{USE_CASES[activeTab].certPreview.date}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
