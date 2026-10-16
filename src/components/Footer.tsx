"use client";

import React from "react";
import Link from "next/link";
import { CertChainShield } from "./CertChainLogo";
import { ArrowRight } from "lucide-react";

// Polygon Logo SVG
function PolygonIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 38 33" fill="currentColor" className={className}>
      <path d="M29 10.2c-1.3-.8-3-.8-4.3 0l-4.5 2.6-3.1 1.8-4.5 2.6c-1.3.8-3 .8-4.3 0l-3.9-2.3c-1.3-.8-2.1-2.2-2.1-3.7V6.7c0-1.5.8-2.9 2.1-3.7l3.9-2.3c1.3-.8 3-.8 4.3 0l3.9 2.3c1.3.8 2.1 2.2 2.1 3.7v2.3l3.1-1.8V5c0-1.5-.8-2.9-2.1-3.7L18 .2C16.7-.6 15-.6 13.7.2L5.8 4.8C4.5 5.6 3.7 7 3.7 8.5v9.1c0 1.5.8 2.9 2.1 3.7l7.9 4.6c1.3.8 3 .8 4.3 0l4.5-2.6 3.1-1.8 4.5-2.6c1.3-.8 3-.8 4.3 0l3.9 2.3c1.3.8 2.1 2.2 2.1 3.7v4.6c0 1.5-.8 2.9-2.1 3.7l-3.9 2.3c-1.3.8-3 .8-4.3 0l-3.9-2.3c-1.3-.8-2.1-2.2-2.1-3.7v-2.3l-3.1 1.8v2.3c0 1.5.8 2.9 2.1 3.7l7.9 4.6c1.3.8 3 .8 4.3 0l7.9-4.6c1.3-.8 2.1-2.2 2.1-3.7v-9.1c0-1.5-.8-2.9-2.1-3.7L29 10.2z" />
    </svg>
  );
}

// GitHub Logo SVG
function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// LinkedIn Logo SVG
function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative w-full bg-[#050505] text-[#FAFAFA] border-t border-white/[0.08] overflow-hidden">
      {/* ============================================================ */}
      {/* FINAL CALL TO ACTION WITH SUBTLE HERO VIDEO */}
      {/* ============================================================ */}
      <div className="relative py-28 sm:py-36 px-6 overflow-hidden border-b border-white/[0.08]">
        {/* Subtle background video overlay */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-20"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-[#050505] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="w-12 h-16 mb-8">
            <CertChainShield className="w-full h-full" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#FAFAFA] tracking-tight leading-[1.08]">
            Start issuing certificates <br />
            nobody can fake.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#A7A6A6] font-sans max-w-xl mx-auto leading-relaxed">
            Join forward-thinking universities, bootcamps, and certification bodies on Polygon. Set up your institute node in under 5 minutes.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/signup"
              className="h-12 px-8 rounded-full bg-[#FAFAFA] text-[#050505] font-medium text-sm hover:bg-white hover:shadow-[0_0_24px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2"
            >
              <span>Start Free (50 Certs/Mo)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#verify-demo"
              className="h-12 px-6 flex items-center justify-center text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Test Live Verifier →
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-4 text-xs font-mono text-[#8B8A8A]">
            <span>✓ No credit card required</span>
            <span>·</span>
            <span>✓ Polygon Layer-2 gas included</span>
            <span>·</span>
            <span>✓ Instant deployment</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SITE DIRECTORY LINKS & COPYRIGHT */}
      {/* ============================================================ */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-[18px] h-[28px]">
                <CertChainShield className="w-full h-full" />
              </div>
              <span className="font-semibold text-ink tracking-tight text-lg">
                CertChain
              </span>
            </Link>
            <p className="mt-4 text-xs text-[#A7A6A6] max-w-xs leading-relaxed font-sans">
              Decentralized academic credential infrastructure. Anchored cryptographically on Polygon for instant, tamper-proof verification globally.
            </p>

            <div className="mt-6 flex items-center gap-3 text-white/50">
              <a
                href="https://polygon.technology"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center hover:text-white hover:border-white/30 transition-colors"
                title="Polygon Network"
              >
                <PolygonIcon className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center hover:text-white hover:border-white/30 transition-colors"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center hover:text-white hover:border-white/30 transition-colors"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-3 text-xs">
            <span className="font-mono text-white/40 uppercase tracking-widest text-[11px] mb-1">
              Product
            </span>
            <Link href="/#verify-demo" className="text-[#A7A6A6] hover:text-white transition-colors">
              Verify PDF
            </Link>
            <Link href="/#how-it-works" className="text-[#A7A6A6] hover:text-white transition-colors">
              How it works
            </Link>
            <Link href="/#features" className="text-[#A7A6A6] hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="text-[#A7A6A6] hover:text-white transition-colors">
              Pricing
            </Link>
          </div>

          {/* Solutions Links */}
          <div className="flex flex-col gap-3 text-xs">
            <span className="font-mono text-white/40 uppercase tracking-widest text-[11px] mb-1">
              Solutions
            </span>
            <Link href="/#use-cases" className="text-[#A7A6A6] hover:text-white transition-colors">
              Colleges & Universities
            </Link>
            <Link href="/#use-cases" className="text-[#A7A6A6] hover:text-white transition-colors">
              Bootcamps & Academies
            </Link>
            <Link href="/#use-cases" className="text-[#A7A6A6] hover:text-white transition-colors">
              Hackathons & Events
            </Link>
            <Link href="/#security" className="text-[#A7A6A6] hover:text-white transition-colors">
              Security & Privacy
            </Link>
          </div>

          {/* Legal & Company */}
          <div className="flex flex-col gap-3 text-xs">
            <span className="font-mono text-white/40 uppercase tracking-widest text-[11px] mb-1">
              Legal & Node
            </span>
            <Link href="/login" className="text-[#A7A6A6] hover:text-white transition-colors">
              Institute Sign In
            </Link>
            <Link href="/signup" className="text-[#A7A6A6] hover:text-white transition-colors">
              Register Institute
            </Link>
            <Link href="#" className="text-[#A7A6A6] hover:text-white transition-colors">
              Privacy Notice
            </Link>
            <Link href="#" className="text-[#A7A6A6] hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40">
          <div>
            &copy; {new Date().getFullYear()} CERTCHAIN TECHNOLOGIES. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>POLYGON MAINNET OPERATIONAL · 100% UPTIME</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
