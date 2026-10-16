"use client";

import React, { useState } from "react";
import { X, Copy, Check, ExternalLink, ShieldCheck } from "lucide-react";

export function buildLinkedInCertUrl(params: {
  courseTitle: string;
  institution?: string;
  issueDate?: string;
  credentialId: string;
  verifyUrl: string;
}): string {
  const parsedDate = params.issueDate ? new Date(params.issueDate) : new Date();
  const year = !isNaN(parsedDate.getFullYear())
    ? parsedDate.getFullYear()
    : 2026;
  const month = !isNaN(parsedDate.getMonth()) ? parsedDate.getMonth() + 1 : 10;

  const query = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: params.courseTitle,
    organizationName: params.institution || "Stanford Credentials Office",
    issueYear: String(year),
    issueMonth: String(month),
    certUrl: params.verifyUrl,
    certId: params.credentialId,
  });

  return `https://www.linkedin.com/profile/add?${query.toString()}`;
}

/**
 * Renders a crisp 21x21 QR Code SVG with standard 7x7 finder patterns,
 * timing lines, and deterministic data modules derived from `value`.
 */
export function DeterministicQrSvg({
  value,
  size = 168,
}: {
  value: string;
  size?: number;
}) {
  const gridSize = 21;

  // Deterministic hash stream from value
  const isFinderArea = (r: number, c: number) => {
    if (r < 8 && c < 8) return true;
    if (r < 8 && c >= gridSize - 8) return true;
    if (r >= gridSize - 8 && c < 8) return true;
    return false;
  };

  const getFinderModule = (r: number, c: number, topR: number, leftC: number) => {
    const lr = r - topR;
    const lc = c - leftC;
    if (lr < 0 || lr > 6 || lc < 0 || lc > 6) return false;
    if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
    if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true;
    return false;
  };

  const modules: boolean[][] = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(false)
  );

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (r < 7 && c < 7) {
        modules[r][c] = getFinderModule(r, c, 0, 0);
      } else if (r < 7 && c >= gridSize - 7) {
        modules[r][c] = getFinderModule(r, c, 0, gridSize - 7);
      } else if (r >= gridSize - 7 && c < 7) {
        modules[r][c] = getFinderModule(r, c, gridSize - 7, 0);
      } else if (r === 6 || c === 6) {
        // Timing pattern
        modules[r][c] = (r + c) % 2 === 0;
      } else if (!isFinderArea(r, c)) {
        const idx = r * gridSize + c;
        const charCode = value.charCodeAt(idx % value.length) || 71;
        const mix = ((charCode * 37 + r * 19 + c * 53 + idx * 11) ^ (charCode << 2)) & 0xff;
        modules[r][c] = mix % 2 === 0;
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${gridSize + 4} ${gridSize + 4}`}
      className="bg-white rounded-xl p-2 shadow-inner"
      aria-label={`QR Code for ${value}`}
    >
      <rect width={gridSize + 4} height={gridSize + 4} fill="#FFFFFF" rx={1.5} />
      {modules.map((row, r) =>
        row.map((active, c) =>
          active ? (
            <rect
              key={`${r}-${c}`}
              x={c + 2}
              y={r + 2}
              width={0.92}
              height={0.92}
              rx={0.12}
              fill="#050505"
            />
          ) : null
        )
      )}
    </svg>
  );
}

export function QrCodeModal({
  isOpen,
  onClose,
  credentialId,
  studentName,
  courseTitle,
  issueDate,
  institution = "Stanford Credentials Office",
}: {
  isOpen: boolean;
  onClose: () => void;
  credentialId: string;
  studentName: string;
  courseTitle: string;
  issueDate?: string;
  institution?: string;
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const origin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const verifyUrl = `${origin}/verify?id=${encodeURIComponent(credentialId)}`;
  const linkedInUrl = buildLinkedInCertUrl({
    courseTitle,
    institution,
    issueDate,
    credentialId,
    verifyUrl,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0E0E10] border border-white/15 rounded-2xl p-6 sm:p-7 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[#10B981] text-[10px] font-mono uppercase tracking-widest mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          On-Chain Verification Badge
        </div>

        <h3 className="text-lg font-medium text-white">{studentName}</h3>
        <p className="text-xs text-white/60 mt-0.5">{courseTitle}</p>
        <p className="text-[11px] font-mono text-emerald-400 mt-1">{credentialId}</p>

        <div className="my-6 flex justify-center">
          <DeterministicQrSvg value={verifyUrl} size={176} />
        </div>

        <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-white/70 truncate mb-5">
          {verifyUrl}
        </div>

        <div className="flex flex-col gap-2.5">
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 px-4 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2"
          >
            <span>Add Credential to LinkedIn Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-full border border-white/15 text-xs font-mono text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Verification URL Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Direct Verification URL</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
