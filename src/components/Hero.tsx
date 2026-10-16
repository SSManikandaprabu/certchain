"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CertChainShield } from "./CertChainLogo";
import { ShieldCheck, Hash } from "lucide-react";

// Polygon Logo SVG component
function PolygonIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 38 33" fill="currentColor" className={className}>
      <path d="M29 10.2c-1.3-.8-3-.8-4.3 0l-4.5 2.6-3.1 1.8-4.5 2.6c-1.3.8-3 .8-4.3 0l-3.9-2.3c-1.3-.8-2.1-2.2-2.1-3.7V6.7c0-1.5.8-2.9 2.1-3.7l3.9-2.3c1.3-.8 3-.8 4.3 0l3.9 2.3c1.3.8 2.1 2.2 2.1 3.7v2.3l3.1-1.8V5c0-1.5-.8-2.9-2.1-3.7L18 .2C16.7-.6 15-.6 13.7.2L5.8 4.8C4.5 5.6 3.7 7 3.7 8.5v9.1c0 1.5.8 2.9 2.1 3.7l7.9 4.6c1.3.8 3 .8 4.3 0l4.5-2.6 3.1-1.8 4.5-2.6c1.3-.8 3-.8 4.3 0l3.9 2.3c1.3.8 2.1 2.2 2.1 3.7v4.6c0 1.5-.8 2.9-2.1 3.7l-3.9 2.3c-1.3.8-3 .8-4.3 0l-3.9-2.3c-1.3-.8-2.1-2.2-2.1-3.7v-2.3l-3.1 1.8v2.3c0 1.5.8 2.9 2.1 3.7l7.9 4.6c1.3.8 3 .8 4.3 0l7.9-4.6c1.3-.8 2.1-2.2 2.1-3.7v-9.1c0-1.5-.8-2.9-2.1-3.7L29 10.2z" />
    </svg>
  );
}

// Merkle Tree Icon SVG
function MerkleTreeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M12 7.5v3M12 10.5l-6 5M12 10.5l6 5" />
    </svg>
  );
}

export function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const easeCurve = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="relative w-full min-h-[100dvh] overflow-hidden bg-[#050505] text-[#FAFAFA] select-none">
      {/* ============================================================ */}
      {/* DESKTOP CANVAS (Aspect >= 11/10 and width >= 900px) */}
      {/* Pixel-faithful 1487x1058 canvas using --u, --uw, --h */}
      {/* ============================================================ */}
      <div className="hero-desktop-canvas relative w-full h-[100dvh] overflow-hidden">
        {/* Background Looping MP4 */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.svg"
          className="absolute pointer-events-none object-cover"
          style={{
            top: "calc(1 * var(--u))",
            left: "50%",
            width: "calc(1492 * var(--u))",
            height: "calc(1054 * var(--u))",
            transform: "translateX(calc(-50% - 0.5 * var(--u)))",
          }}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Overlay 1: Bottom Fade */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, transparent 78.8%, rgba(5,5,5,0.23) 79.6%, rgba(5,5,5,0.45) 81.4%, rgba(5,5,5,0.75) 83.3%, rgba(5,5,5,0.84) 85.2%, rgba(5,5,5,0.888) 88%, rgba(5,5,5,0.905) 91%, rgba(5,5,5,0.96) 95%, #050505 100%)",
          }}
        />

        {/* Overlay 2: Side Letterbox */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, #050505 0%, #050505 calc(50% - 746 * var(--u)), transparent calc(50% - 676 * var(--u)), transparent calc(50% + 676 * var(--u)), #050505 calc(50% + 746 * var(--u)), #050505 100%)",
          }}
        />

        {/* Brand Mark (CertChain shield with checkmark, silver gradient, two notches) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeCurve }}
          className="absolute z-20 flex items-center group cursor-pointer"
          style={{
            left: "calc(75 * var(--u))",
            top: "calc(27 * var(--u))",
            width: "calc(31.5 * var(--u))",
            height: "calc(48.5 * var(--u))",
          }}
        >
          <CertChainShield className="w-full h-full" />
        </motion.div>

        {/* Centered Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeCurve }}
          className="absolute z-20 flex items-center justify-center font-sans"
          style={{
            left: "50%",
            top: "calc(51 * var(--u))",
            transform: "translate(-50%, -50%)",
            gap: "calc(24 * var(--u))",
            fontSize: "calc(19 * var(--u))",
            color: "#B6B5B5",
            fontWeight: 400,
          }}
        >
          <Link
            href="#features"
            className="hover:text-[#FAFAFA] transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-[#FAFAFA] transition-colors duration-200"
          >
            How it works
          </Link>
          <Link
            href="#pricing"
            className="hover:text-[#FAFAFA] transition-colors duration-200"
          >
            Pricing
          </Link>
          <Link
            href="#verify-demo"
            className="hover:text-[#FAFAFA] transition-colors duration-200"
          >
            Verify
          </Link>
        </motion.nav>

        {/* Header Pill "Start Free" */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeCurve }}
          className="absolute z-20"
          style={{
            right: "calc(75 * var(--u))",
            top: "calc(27 * var(--u))",
            width: "calc(175 * var(--u))",
            height: "calc(49 * var(--u))",
          }}
        >
          <Link
            href="#pricing"
            className="w-full h-full flex items-center justify-center rounded-full bg-[#FAFAFA] text-[#050505] font-sans transition-all duration-200 hover:bg-white hover:shadow-[0_0_24px_rgba(255,255,255,0.3)] active:scale-[0.98]"
            style={{
              fontSize: "calc(20.6 * var(--u))",
              fontWeight: 500,
            }}
          >
            Start Free
          </Link>
        </motion.div>

        {/* Headline (serif-free, Manrope 400) */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.06, ease: easeCurve }}
          className="absolute z-20 font-sans text-[#FAFAFA] font-normal leading-none"
          style={{
            left: "calc(75.5 * var(--u))",
            top: "calc(230.5 * var(--u))",
            fontSize: "calc(71.6 * var(--h))",
            lineHeight: "calc(80.5 * var(--h))",
            letterSpacing: "calc(0.3 * var(--h))",
          }}
        >
          <span className="block">Certificates nobody</span>
          <span className="block">can fake.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.14, ease: easeCurve }}
          className="absolute z-20 font-sans"
          style={{
            left: "calc(75.5 * var(--u))",
            top: "calc(230.5 * var(--u) + 189 * var(--h))",
            fontSize: "calc(20.7 * var(--h))",
            lineHeight: "calc(23.5 * var(--h))",
            color: "#A7A6A6",
          }}
        >
          <span className="block">
            Issue tamper-proof certificates in bulk and verify
          </span>
          <span className="block">
            any PDF in 5 seconds. No blockchain knowledge needed.
          </span>
        </motion.p>

        {/* Primary CTA "Start Free" */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.22, ease: easeCurve }}
          className="absolute z-20"
          style={{
            left: "calc(74.9 * var(--u))",
            top: "calc(230.5 * var(--u) + 264.5 * var(--h))",
            width: "calc(175.6 * var(--h))",
            height: "calc(50 * var(--h))",
          }}
        >
          <Link
            href="#pricing"
            className="w-full h-full flex items-center justify-center rounded-full bg-[#FAFAFA] text-[#050505] font-sans font-medium transition-all duration-200 hover:bg-white hover:shadow-[0_0_24px_rgba(255,255,255,0.3)] active:scale-[0.98]"
            style={{
              fontSize: "calc(20.6 * var(--h))",
              fontWeight: 500,
            }}
          >
            Start Free
          </Link>
        </motion.div>

        {/* Ghost Link "Verify a Certificate" */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.22, ease: easeCurve }}
          className="absolute z-20 flex items-center"
          style={{
            left: "calc(74.9 * var(--u) + 220.6 * var(--h))",
            top: "calc(230.5 * var(--u) + 279.5 * var(--h))",
          }}
        >
          <Link
            href="#verify-demo"
            className="font-sans font-medium text-white hover:text-white/80 transition-colors flex items-center gap-2 group"
            style={{
              fontSize: "calc(20.6 * var(--h))",
              fontWeight: 500,
            }}
          >
            <span>Verify a Certificate</span>
            <span className="text-white/60 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </motion.div>

        {/* Bottom Trust Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.34, ease: easeCurve }}
          className="absolute z-20 flex items-center justify-center font-sans pointer-events-auto"
          style={{
            left: "50%",
            top: "calc(995 * var(--u))",
            transform: "translateX(-50%)",
            gap: "calc(36 * var(--u))",
            color: "#8B8A8A",
            fontSize: "calc(15.5 * var(--u))",
          }}
        >
          <div className="flex items-center gap-2 hover:text-[#FAFAFA] transition-colors">
            <PolygonIcon className="w-[18px] h-[18px]" />
            <span>Polygon</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-2 hover:text-[#FAFAFA] transition-colors">
            <Hash className="w-4 h-4 text-[#8B8A8A]" />
            <span>SHA-256</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-2 hover:text-[#FAFAFA] transition-colors">
            <MerkleTreeIcon className="w-4 h-4 text-[#8B8A8A]" />
            <span>Merkle Proofs</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-2 hover:text-[#FAFAFA] transition-colors">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>PolygonScan Verified</span>
          </div>
        </motion.div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE / RESPONSIVE FLOW LAYOUT (Aspect < 11/10 or < 900px) */}
      {/* ============================================================ */}
      <div className="hero-mobile-canvas relative w-full min-h-[100dvh] flex-col justify-between px-6 py-6 overflow-hidden">
        {/* Background Looping MP4 for mobile with object-position 43% center */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.svg"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ objectPosition: "43% center" }}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Stronger Dark Overlays for Mobile Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/75 via-[#050505]/50 to-[#050505] pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050505]/40 to-[#050505]/95 pointer-events-none" />

        {/* Mobile Header Bar */}
        <div className="relative z-30 flex items-center justify-between w-full pt-2">
          {/* Brand Mark */}
          <Link href="#" className="flex items-center gap-2.5">
            <div className="w-7 h-11">
              <CertChainShield className="w-full h-full" />
            </div>
            <span className="font-semibold text-ink tracking-tight text-lg">
              CertChain
            </span>
          </Link>

          {/* Frosted Burger Button (bars morph to X) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="relative z-50 w-11 h-11 rounded-full border border-white/10 bg-[#0E0E10]/80 backdrop-blur-md flex flex-col items-center justify-center gap-1.5 focus:outline-none transition-colors"
          >
            <motion.span
              animate={mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25, ease: easeCurve }}
              className="w-5 h-[1.75px] bg-[#FAFAFA] block rounded-full origin-center"
            />
            <motion.span
              animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="w-5 h-[1.75px] bg-[#FAFAFA] block rounded-full"
            />
            <motion.span
              animate={
                mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.25, ease: easeCurve }}
              className="w-5 h-[1.75px] bg-[#FAFAFA] block rounded-full origin-center"
            />
          </button>
        </div>

        {/* Full-Screen Blurred Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-[#050505]/95 flex flex-col justify-between px-8 py-24"
            >
              <div className="flex flex-col gap-6 pt-4">
                {[
                  { name: "Features", href: "#features" },
                  { name: "How it works", href: "#how-it-works" },
                  { name: "Pricing", href: "#pricing" },
                  { name: "Verify PDF", href: "#verify-demo" },
                ].map((item, idx) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.08 * idx,
                      duration: 0.4,
                      ease: easeCurve,
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-2xl font-light text-nav hover:text-ink transition-colors block py-1"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="flex flex-col gap-4"
              >
                <Link
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-12 rounded-full bg-[#FAFAFA] text-[#050505] font-medium flex items-center justify-center text-base"
                >
                  Start Free
                </Link>
                <div className="text-center text-xs text-muted pt-2">
                  Polygon-anchored certificates · 5-sec verification
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Main Hero Content */}
        <div className="relative z-20 my-auto pt-16 pb-12 flex flex-col">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.06, ease: easeCurve }}
            className="text-4xl sm:text-5xl font-normal tracking-tight text-[#FAFAFA] leading-[1.12]"
          >
            Certificates nobody <br /> can fake.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.14, ease: easeCurve }}
            className="mt-5 text-base sm:text-lg text-[#A7A6A6] leading-relaxed max-w-md"
          >
            Issue tamper-proof certificates in bulk and verify any PDF in 5 seconds.
            No blockchain knowledge needed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22, ease: easeCurve }}
            className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <Link
              href="#pricing"
              className="h-12 px-7 rounded-full bg-[#FAFAFA] text-[#050505] font-medium flex items-center justify-center text-base hover:bg-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Start Free
            </Link>
            <Link
              href="#verify-demo"
              className="h-12 px-5 flex items-center justify-center text-white/90 hover:text-white font-medium text-base gap-2 group"
            >
              <span>Verify a Certificate</span>
              <span className="text-white/60 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Mobile Trust Strip as 2x2 Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.34, ease: easeCurve }}
          className="relative z-20 grid grid-cols-2 gap-3 text-xs text-[#8B8A8A] pt-4 border-t border-white/[0.06]"
        >
          <div className="flex items-center gap-2">
            <PolygonIcon className="w-4 h-4 text-white/70" />
            <span>Polygon</span>
          </div>
          <div className="flex items-center gap-2">
            <Hash className="w-3.5 h-3.5 text-white/70" />
            <span>SHA-256</span>
          </div>
          <div className="flex items-center gap-2">
            <MerkleTreeIcon className="w-3.5 h-3.5 text-white/70" />
            <span>Merkle Proofs</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>PolygonScan Verified</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
