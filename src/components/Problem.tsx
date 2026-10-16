"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldAlert, Clock, ArchiveX } from "lucide-react";

// ============================================================================
// EDITABLE PLACEHOLDER FIGURES
// Easily customize numbers, labels, units, and citation tags below
// ============================================================================
const PROBLEM_STATS = [
  {
    id: "fake-certificates",
    target: 43,
    suffix: "%",
    prefix: "",
    title: "Falsified Credentials",
    description:
      "Of technical and executive resumes contain fabricated degrees, altered GPA records, or unaccredited completion certificates.",
    subtext: "Photoshop and PDF editors have made credential fraud undetectable to manual inspection.",
    sourceTag: "EASY TO EDIT · STAT REF: HIGHER ED & HR RECRUITMENT SURVEY",
    icon: ShieldAlert,
  },
  {
    id: "verification-delays",
    target: 14,
    suffix: " Days",
    prefix: "Up to ",
    title: "Manual Verification Delays",
    description:
      "Average turnaround time for university registrar offices to manually confirm alumni graduation records via email or phone.",
    subtext: "Causes job offers to stall, increases HR drop-off rates, and burdens administrative teams.",
    sourceTag: "EASY TO EDIT · STAT REF: ENTERPRISE BACKGROUND VERIFICATION CYCLE",
    icon: Clock,
  },
  {
    id: "lost-records",
    target: 68,
    suffix: "%",
    prefix: "",
    title: "Vulnerable to Database Loss",
    description:
      "Of credential issuers rely on centralized database servers or physical paper archives vulnerable to vendor shutdowns, bit-rot, and server outages.",
    subtext: "When proprietary verification portals shut down, student certificates become unprovable.",
    sourceTag: "EASY TO EDIT · STAT REF: ACADEMIC ARCHIVE DURABILITY BENCHMARK",
    icon: ArchiveX,
  },
];

function StatCounter({
  target,
  prefix = "",
  suffix = "",
}: {
  target: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView) return;

    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(target);
      return;
    }

    const duration = 1600; // 1.6s
    const startTime = performance.now();

    const animateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * target);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums font-sans">
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

export function Problem() {
  const easeCurve = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      id="problem"
      className="relative w-full py-28 sm:py-36 px-6 bg-[#050505] text-[#FAFAFA] border-t border-white/[0.06] overflow-hidden"
    >
      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full border border-white/10 bg-white/[0.04] text-[#A7A6A6] text-xs font-mono uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            The Problem With Legacy Credentials
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#FAFAFA] tracking-tight leading-[1.08]">
            Paper fades. PDFs are edited. <br />
            Institutes pay the price.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#A7A6A6] font-sans leading-relaxed">
            Every year, millions of dollars and weeks of administrative hours are lost to unanchored diplomas that anyone can modify in 60 seconds with software.
          </p>
        </div>

        {/* 3 Animated Stat Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {PROBLEM_STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.12,
                  ease: easeCurve,
                }}
                className="group relative rounded-2xl bg-[#0E0E10] border border-white/[0.08] hover:border-white/20 transition-all duration-300 p-8 flex flex-col justify-between"
              >
                <div>
                  {/* Top Icon & Category */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/80 group-hover:scale-105 group-hover:text-white transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-[#8B8A8A] uppercase tracking-widest">
                      0{idx + 1} · CRITICAL
                    </span>
                  </div>

                  {/* Animated Counter */}
                  <div className="text-5xl sm:text-6xl font-light text-[#FAFAFA] tracking-tight leading-none">
                    <StatCounter
                      target={stat.target}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-medium text-white mt-6 mb-2 tracking-tight">
                    {stat.title}
                  </h3>
                  <p className="text-sm text-[#A7A6A6] font-sans leading-relaxed">
                    {stat.description}
                  </p>
                  <p className="text-xs text-white/50 font-sans mt-3 leading-normal border-t border-white/[0.06] pt-3">
                    {stat.subtext}
                  </p>
                </div>

                {/* Edit Marker & Source Tag */}
                <div className="mt-8 pt-4 border-t border-white/[0.04]">
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider block">
                    [{stat.sourceTag}]
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Insight Quote / Context */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-2 h-10 bg-white/20 rounded-full hidden sm:block" />
            <div>
              <div className="text-sm font-medium text-white">
                Verification should take 5 seconds, not 14 days.
              </div>
              <div className="text-xs text-[#A7A6A6] mt-0.5">
                CertChain replaces manual phone and email registrar inquiries with instant cryptographic math.
              </div>
            </div>
          </div>
          <a
            href="#how-it-works"
            className="shrink-0 text-xs font-mono uppercase tracking-wider text-white hover:text-white/80 transition-colors flex items-center gap-1.5"
          >
            <span>See How CertChain Solves This</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
