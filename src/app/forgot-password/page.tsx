"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/AuthLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid institute email address.");
      return;
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <AuthLayout mode="login">
      <div className="flex flex-col gap-6">
        <div>
          <span className="inline-block px-3 py-1 font-mono text-[11px] tracking-[0.2em] uppercase text-white/80 bg-white/[0.09] border border-white/10 rounded-none">
            [ PASSWORD RECOVERY ]
          </span>
        </div>

        <h1
          className="font-sora font-[200] text-white leading-[0.92] tracking-[0.03em] select-none"
          style={{ fontSize: "clamp(54px, 6.2vw, 118px)" }}
        >
          CERTCHAIN
        </h1>

        <p className="font-mono font-[300] text-xs sm:text-sm tracking-wider uppercase text-white/70">
          Reset administrative credentials for your institute node.
        </p>

        {submitted ? (
          <div className="p-4 bg-white/[0.05] border border-white/20 text-white text-xs font-mono tracking-wide rounded-none flex flex-col gap-3">
            <span className="text-white font-bold">[ RECOVERY LINK DISPATCHED ]</span>
            <p className="text-white/70 leading-relaxed">
              If an authorized institute record exists for <span className="text-white underline">{email}</span>, a cryptographic reset token has been sent to your inbox.
            </p>
            <Link
              href="/login"
              className="mt-2 text-white/90 hover:text-white underline underline-offset-4"
            >
              ← Return to Institute Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
            {error && (
              <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono tracking-wide rounded-none flex items-start gap-2">
                <span className="text-red-400 font-bold">[!]</span>
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="font-mono text-[11px] tracking-widest uppercase text-white/50"
              >
                Institute Admin Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@university.edu"
                className="w-full bg-transparent border-0 border-b border-white/20 focus:border-white py-2.5 px-0 text-white placeholder-white/25 font-mono text-sm outline-none transition-colors rounded-none focus:ring-0"
              />
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 font-mono text-xs tracking-[0.2em] uppercase font-medium bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 transition-all duration-200 rounded-none disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {loading ? "[ TRANSMITTING TOKEN... ]" : "Send Recovery Link"}
              </button>

              <Link
                href="/login"
                className="text-center font-mono text-xs tracking-wider text-white/50 hover:text-white transition-colors py-2"
              >
                ← Back to Institute Sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
