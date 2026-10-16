"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CertChainShield } from "./CertChainLogo";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How it works", href: "#how-it-works" },
  { name: "Student Wallet", href: "/wallet" },
  { name: "Pricing", href: "#pricing" },
  { name: "Verify", href: "/verify" },
];

export function StickyNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky navbar after scrolling past ~80% of hero
      if (window.scrollY > window.innerHeight * 0.75) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Sticky Blurred Glass Navbar when scrolled past hero */}
      <AnimatePresence>
        {isScrolled && (
          <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#050505]/80 border-b border-white/[0.08] transition-colors"
          >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              {/* Brand Logo & Name */}
              <Link href="#" className="flex items-center gap-3 group">
                <div className="w-[22px] h-[32px] transition-transform duration-300 group-hover:scale-105">
                  <CertChainShield className="w-full h-full" />
                </div>
                <span className="font-semibold text-ink tracking-tight text-lg">
                  CertChain
                </span>
              </Link>

              {/* Centered Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm font-normal text-nav hover:text-ink transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Link
                  href="/wallet"
                  className="hidden sm:inline-flex text-xs font-medium text-muted hover:text-ink transition-colors px-3 py-1.5"
                >
                  Student Wallet
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center h-9 px-5 rounded-full bg-[#FAFAFA] text-[#050505] text-sm font-medium hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all duration-200"
                >
                  Issuer Console
                </Link>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>
    </>
  );
}
