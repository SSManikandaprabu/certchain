"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AuthLayout } from "@/components/AuthLayout";

// Google Icon in monochrome minimal SVG
function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();

  const [instituteName, setInstituteName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    instituteName?: string;
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const errors: { instituteName?: string; email?: string; password?: string } = {};

    if (!instituteName.trim()) {
      errors.instituteName = "Institute legal name is required";
    }

    if (!email.trim()) {
      errors.email = "Official institute email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Enter a valid institute email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      // Sign up and create session with CredentialsProvider
      const res = await signIn("credentials", {
        instituteName: instituteName.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg(res.error || "Institute registration could not be completed.");
        setIsLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setErrorMsg("An unexpected error occurred during registration.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setErrorMsg(null);
    try {
      setTimeout(() => {
        router.push("/dashboard");
      }, 900);
    } catch {
      setErrorMsg("Google authentication unavailable.");
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout mode="signup">
      <div className="flex flex-col gap-6">
        {/* Chip "[ INSTITUTE ACCESS ]" (sharp rectangle, JetBrains Mono, uppercase, rgba(255,255,255,.09) fill) */}
        <div>
          <span className="inline-block px-3 py-1 font-mono text-[11px] tracking-[0.2em] uppercase text-white/80 bg-white/[0.09] border border-white/10 rounded-none">
            [ INSTITUTE ACCESS ]
          </span>
        </div>

        {/* H1 "CERTCHAIN" in Sora 200, clamp(54px, 6.2vw, 118px), letter-spacing .03em */}
        <h1
          className="font-sora font-[200] text-white leading-[0.92] tracking-[0.03em] select-none"
          style={{ fontSize: "clamp(54px, 6.2vw, 118px)" }}
        >
          CERTCHAIN
        </h1>

        {/* Tagline in JetBrains Mono 300, uppercase */}
        <p className="font-mono font-[300] text-xs sm:text-sm tracking-wider uppercase text-white/70">
          Tamper-proof certificates. Verified in seconds.
        </p>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono tracking-wide rounded-none flex items-start gap-2">
            <span className="text-red-400 font-bold">[!]</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* Institute Legal Name (bottom border only) */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="instituteName"
              className="font-mono text-[11px] tracking-widest uppercase text-white/50"
            >
              Institute / Organization Name
            </label>
            <input
              id="instituteName"
              type="text"
              value={instituteName}
              onChange={(e) => {
                setInstituteName(e.target.value);
                if (fieldErrors.instituteName) {
                  setFieldErrors({ ...fieldErrors, instituteName: undefined });
                }
              }}
              placeholder="e.g. Stanford University School of Engineering"
              className={`w-full bg-transparent border-0 border-b ${
                fieldErrors.instituteName
                  ? "border-red-500"
                  : "border-white/20 focus:border-white"
              } py-2.5 px-0 text-white placeholder-white/25 font-mono text-sm outline-none transition-colors rounded-none focus:ring-0`}
            />
            {fieldErrors.instituteName && (
              <span className="font-mono text-[11px] text-red-400 tracking-wide mt-0.5">
                {fieldErrors.instituteName}
              </span>
            )}
          </div>

          {/* Email input (bottom border only) */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="font-mono text-[11px] tracking-widest uppercase text-white/50"
            >
              Official Institute Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
              }}
              placeholder="registrar@stanford.edu"
              autoComplete="email"
              className={`w-full bg-transparent border-0 border-b ${
                fieldErrors.email ? "border-red-500" : "border-white/20 focus:border-white"
              } py-2.5 px-0 text-white placeholder-white/25 font-mono text-sm outline-none transition-colors rounded-none focus:ring-0`}
            />
            {fieldErrors.email && (
              <span className="font-mono text-[11px] text-red-400 tracking-wide mt-0.5">
                {fieldErrors.email}
              </span>
            )}
          </div>

          {/* Password input (bottom border only) */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="font-mono text-[11px] tracking-widest uppercase text-white/50"
            >
              Master Password (Min 6 Characters)
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors({ ...fieldErrors, password: undefined });
                }
              }}
              placeholder="••••••••••••"
              autoComplete="new-password"
              className={`w-full bg-transparent border-0 border-b ${
                fieldErrors.password ? "border-red-500" : "border-white/20 focus:border-white"
              } py-2.5 px-0 text-white placeholder-white/25 font-mono text-sm outline-none transition-colors rounded-none focus:ring-0`}
            />
            {fieldErrors.password && (
              <span className="font-mono text-[11px] text-red-400 tracking-wide mt-0.5">
                {fieldErrors.password}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            {/* Button "Sign in" / "Create institute account" (solid ghost fill) */}
            <button
              type="submit"
              disabled={isLoading || googleLoading}
              className="w-full py-3.5 px-6 font-mono text-xs tracking-[0.2em] uppercase font-medium bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 transition-all duration-200 rounded-none disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 group active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent animate-spin rounded-full" />
                  <span>[ INITIALIZING INSTITUTE ON-CHAIN... ]</span>
                </>
              ) : (
                <span>Register Institute</span>
              )}
            </button>

            {/* Button "Continue with Google" */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading || googleLoading}
              className="w-full py-3 px-6 font-mono text-xs tracking-wider uppercase text-white/80 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors duration-200 rounded-none disabled:opacity-40 flex items-center justify-center gap-3 active:scale-[0.99]"
            >
              {googleLoading ? (
                <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent animate-spin rounded-full" />
              ) : (
                <GoogleIcon className="w-4 h-4 text-white" />
              )}
              <span>Continue with Google</span>
            </button>
          </div>
        </form>

        {/* Link "Already have an institute account? Sign in" */}
        <div className="pt-2 text-center sm:text-left">
          <Link
            href="/login"
            className="font-mono text-xs tracking-wider text-white/60 hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            Already have an institute account? Sign in →
          </Link>
        </div>

        {/* Footer legal note */}
        <p className="font-mono text-[10px] sm:text-[11px] text-white/35 leading-relaxed tracking-wide pt-2 border-t border-white/[0.06]">
          By continuing you accept our{" "}
          <Link href="#" className="underline hover:text-white/60 transition-colors">
            Privacy Notice
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline hover:text-white/60 transition-colors">
            Terms of Service
          </Link>
          .
        </p>
      </div>
    </AuthLayout>
  );
}
