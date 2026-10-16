"use client";
import React from "react";

export function CertChainShield({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CertChain Shield Logo"
    >
      <defs>
        {/* Silver metallic gradient */}
        <linearGradient id="shieldSilver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9e9e9e" />
          <stop offset="48%" stopColor="#e2e2e2" />
          <stop offset="52%" stopColor="#cccccc" />
          <stop offset="100%" stopColor="#7a7a7a" />
        </linearGradient>
        {/* Inner glow gradient */}
        <linearGradient id="innerStroke" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#888888" stopOpacity="0.1" />
        </linearGradient>
        <filter id="notchGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Shield Shell */}
      <path
        d="M16 1.2 L30 6.8 C30 22.5 24.2 38.6 16 47.8 C7.8 38.6 2 22.5 2 6.8 L16 1.2 Z"
        fill="#0A0A0C"
        stroke="url(#shieldSilver)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Inner Metallic Rim / Facet */}
      <path
        d="M16 4.8 L27.2 9.2 C27.2 21.8 22.6 35.2 16 43.6 C9.4 35.2 4.8 21.8 4.8 9.2 L16 4.8 Z"
        fill="none"
        stroke="url(#innerStroke)"
        strokeWidth="1"
        strokeOpacity="0.4"
      />

      {/* Two bright #fdfdfd notches on the top chamfer */}
      {/* Left notch */}
      <rect
        x="6"
        y="5.8"
        width="3.2"
        height="1.5"
        rx="0.5"
        transform="rotate(22 6 5.8)"
        fill="#fdfdfd"
        filter="url(#notchGlow)"
      />
      {/* Right notch */}
      <rect
        x="23"
        y="7"
        width="3.2"
        height="1.5"
        rx="0.5"
        transform="rotate(-22 23 7)"
        fill="#fdfdfd"
        filter="url(#notchGlow)"
      />

      {/* Crisp metallic Checkmark */}
      <path
        d="M10 24.2 L14.2 28.5 L22.4 18.2"
        fill="none"
        stroke="url(#shieldSilver)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center highlight dot/accent */}
      <circle cx="16" cy="34" r="1.1" fill="#10B981" />
    </svg>
  );
}
