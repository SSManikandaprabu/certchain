"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CertChainShield } from "./CertChainLogo";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  mode: "login" | "signup";
}

export function AuthLayout({ children, mode }: AuthLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-white flex flex-col justify-between overflow-x-hidden font-mono selection:bg-white selection:text-black">
      {/* ============================================================ */}
      {/* BACKGROUND: FULL-BLEED VIDEO & SCRIM GRADIENTS */}
      {/* ============================================================ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Looping video (hidden if prefers-reduced-motion) */}
        {!prefersReducedMotion ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/auth-poster.svg"
            className="w-full h-full object-cover object-[35%_center] lg:object-[45%_center] opacity-85"
          >
            <source src="/auth.mp4" type="video/mp4" />
          </video>
        ) : (
          /* Poster Fallback when prefers-reduced-motion is active */
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('/auth-poster.svg')" }}
          />
        )}

        {/* Black Scrim Gradients */}
        {/* Left subtle vignette */}
        <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#050505]/70 to-transparent" />
        
        {/* Top bar vignette */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent" />

        {/* Heavy Right scrim gradient leading into the form panel */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-3/5 bg-gradient-to-r from-transparent via-[#050505]/85 to-[#050505]" />

        {/* Mobile full dark overlay */}
        <div className="lg:hidden absolute inset-0 bg-[#050505]/85" />

        {/* Bottom subtle shadow */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#050505] to-transparent" />
      </div>

      {/* ============================================================ */}
      {/* TOP NAVIGATION */}
      {/* ============================================================ */}
      <header className="relative z-30 w-full px-6 lg:px-12 py-7 flex items-center justify-between border-b border-white/[0.06]">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-[18px] h-[28px] transition-transform duration-200 group-hover:scale-105">
              <CertChainShield className="w-full h-full" />
            </div>
            <span className="font-sans font-light tracking-[0.18em] text-white text-base">
              CERTCHAIN
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-white/10 text-[10px] text-white/40 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-white/40 block rounded-none" />
            Polygon Mainnet Verified
          </div>
        </div>

        {/* Desktop Header Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs tracking-wider uppercase text-white/50">
          <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
            <ArrowLeft className="w-3 h-3" />
            Back to Home
          </Link>
          <Link href="/#verify-demo" className="hover:text-white transition-colors">
            Public Verify
          </Link>
          <Link
            href={mode === "login" ? "/signup" : "/login"}
            className="border border-white/20 px-3.5 py-1 text-white hover:bg-white hover:text-black transition-colors"
          >
            {mode === "login" ? "[ REGISTER INSTITUTE ]" : "[ SIGN IN ]"}
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
          className="md:hidden relative z-50 w-10 h-10 border border-white/20 bg-black/60 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
        >
          <span
            className={`w-5 h-[1.5px] bg-white transition-all duration-300 ${
              mobileMenuOpen ? "rotate-45 translate-y-[7.5px]" : ""
            }`}
          />
          <span
            className={`w-5 h-[1.5px] bg-white transition-all duration-200 ${
              mobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-5 h-[1.5px] bg-white transition-all duration-300 ${
              mobileMenuOpen ? "-rotate-45 -translate-y-[7.5px]" : ""
            }`}
          />
        </button>

        {/* Mobile Circular Clip-Path Overlay Menu */}
        <div
          style={{
            clipPath: mobileMenuOpen
              ? "circle(150% at calc(100% - 32px) 32px)"
              : "circle(0% at calc(100% - 32px) 32px)",
            transition: "clip-path 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          className="fixed inset-0 z-40 bg-[#050505] text-white flex flex-col justify-between p-8 pt-28 md:hidden"
        >
          <div className="flex flex-col gap-6 text-sm tracking-widest uppercase">
            <div className="text-[10px] text-white/30 tracking-[0.25em] pb-3 border-b border-white/10">
              NAVIGATION
            </div>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/70 hover:text-white py-2 flex items-center justify-between"
            >
              <span>Home</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Link>
            <Link
              href="/#verify-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/70 hover:text-white py-2 flex items-center justify-between"
            >
              <span>Verify PDF Demo</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Link>
            <Link
              href={mode === "login" ? "/signup" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="text-white py-2 flex items-center justify-between font-bold"
            >
              <span>{mode === "login" ? "Create Account" : "Sign In"}</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>

          <div className="text-[11px] text-white/30 leading-relaxed border-t border-white/10 pt-4 uppercase">
            <div>CertChain Institute Gateway</div>
            <div>Polygon Layer-2 Cryptographic Anchor</div>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MAIN VIEWPORT: RIGHT-ALIGNED FORM PANEL */}
      {/* ============================================================ */}
      <main className="relative z-20 flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-end py-10 lg:py-14">
        {/* Right-aligned Panel Container */}
        <div className="w-full lg:w-[490px] xl:w-[540px] flex flex-col justify-center">
          {children}
        </div>
      </main>

      {/* ============================================================ */}
      {/* BOTTOM LEGAL FOOTER */}
      {/* ============================================================ */}
      <footer className="relative z-20 w-full px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/35 border-t border-white/[0.06] uppercase tracking-wider">
        <div className="flex items-center gap-3">
          <span>&copy; {new Date().getFullYear()} CERTCHAIN TECHNOLOGIES</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline text-white/20">SHA-256 ANCHORED</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-white transition-colors">
            Privacy Notice
          </Link>
          <span>·</span>
          <Link href="#" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <span>·</span>
          <Link href="#" className="hover:text-white transition-colors">
            Security Disclosures
          </Link>
        </div>
      </footer>
    </div>
  );
}
