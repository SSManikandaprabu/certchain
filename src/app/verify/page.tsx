"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CertChainShield } from "@/components/CertChainLogo";
import { VerifyDemo } from "@/components/VerifyDemo";
import { QrCodeModal } from "@/components/QrCodeModal";
import {
  SmartContractModal,
  MerklePathVisualizer,
} from "@/components/SmartContractModal";
import { downloadAndSyncCertificatePdf } from "@/lib/pdfGenerator";
import {
  ArrowLeft,
  ShieldCheck,
  Search,
  ExternalLink,
  Lock,
  Download,
  Copy,
  Check,
  QrCode,
  Code2,
} from "lucide-react";

interface FoundCertificate {
  id: string;
  name: string;
  email: string;
  course: string;
  grade: string;
  issueDate: string;
  status: "ACTIVE" | "REVOKED";
  hash: string;
  batchId: string;
  blockNumber: string;
}

export default function PublicVerifyPage() {
  const [lookupId, setLookupId] = useState("");
  const [lookupResult, setLookupResult] = useState<"FOUND_VALID" | "FOUND_REVOKED" | "NOT_FOUND" | null>(null);
  const [foundCert, setFoundCert] = useState<FoundCertificate | null>(null);
  const [foundMerkleRoot, setFoundMerkleRoot] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);

  const executeLookup = async (query: string) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    setIsSearching(true);
    setLookupResult(null);
    setFoundCert(null);

    try {
      const res = await fetch(`/api/certificates?id=${encodeURIComponent(cleanQuery)}`);
      const data = await res.json();
      if (data.success && data.certificate) {
        setFoundCert(data.certificate);
        setFoundMerkleRoot(data.merkleRoot || "");
        setLookupResult(data.certificate.status === "ACTIVE" ? "FOUND_VALID" : "FOUND_REVOKED");
      } else {
        setLookupResult("NOT_FOUND");
      }
    } catch {
      setLookupResult("NOT_FOUND");
    } finally {
      setIsSearching(false);
    }
  };

  // Auto-verify when visiting /verify?id=CC-2026-94812
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get("id");
      if (idParam) {
        setLookupId(idParam);
        executeLookup(idParam);
      }
    }
  }, []);

  const handleIdSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeLookup(lookupId);
  };

  const handleCopyShareLink = (id: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/verify?id=${encodeURIComponent(id)}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleDownloadCertPdf = async (cert: FoundCertificate) => {
    const { sha256Hash } = await downloadAndSyncCertificatePdf({
      id: cert.id,
      name: cert.name,
      course: cert.course,
      grade: cert.grade,
      issueDate: cert.issueDate,
      institution: "Stanford Credentials Office",
      blockNumber: cert.blockNumber,
    });
    setFoundCert({ ...cert, hash: sha256Hash });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans selection:bg-white selection:text-black">
      {/* Top Header */}
      <header className="border-b border-white/[0.08] bg-[#0E0E10]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <ArrowLeft className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
            <div className="w-[18px] h-[28px]">
              <CertChainShield className="w-full h-full" />
            </div>
            <span className="font-semibold text-ink tracking-tight text-base">
              CertChain
            </span>
          </Link>

          <div className="flex items-center gap-3 text-xs font-mono">
            <button
              onClick={() => setShowContractModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/15 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Smart Contract</span>
            </button>
            <Link
              href="/wallet"
              className="px-4 py-1.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Student Wallet
            </Link>
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors"
            >
              Institute Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 pt-12 pb-24">
        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-white/10 bg-white/[0.04] text-[#A7A6A6] text-xs font-mono uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            Official Public Verification Gateway
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif text-[#FAFAFA] tracking-tight">
            Verify Any Academic Credential
          </h1>
          <p className="mt-3 text-sm text-[#A7A6A6] leading-relaxed">
            Verify a PDF directly via client-side SHA-256 Merkle proof or lookup an on-chain Credential ID. Free for employers worldwide. Zero accounts required.
          </p>

          {/* Quick Credential ID Search Bar */}
          <form onSubmit={handleIdSearch} className="mt-8 flex items-center gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Or enter Credential ID (e.g. CC-2026-94812)"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                className="w-full bg-[#0E0E10] border border-white/15 rounded-full pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-white/40 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all shrink-0 disabled:opacity-50"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>

          {/* Search Result Feedback */}
          {lookupResult === "FOUND_VALID" && foundCert && (
            <div className="mt-5 p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-left max-w-xl mx-auto animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 text-xs font-mono text-emerald-400">
                <span className="flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  AUTHENTIC CREDENTIAL ON POLYGON
                </span>
                <span>Block #{Number(foundCert.blockNumber || 61420918).toLocaleString()}</span>
              </div>
              <div className="mt-3 text-white font-medium text-lg">
                {foundCert.name}
              </div>
              <div className="text-xs text-white/80 mt-0.5">
                {foundCert.course} · <span className="font-mono text-emerald-400">{foundCert.grade}</span>
              </div>
              <div className="mt-3 pt-2 border-t border-emerald-500/20 flex flex-col gap-1 text-[11px] font-mono text-white/50">
                <div className="flex items-center justify-between">
                  <span>ID: {foundCert.id}</span>
                  <span>Issued: {foundCert.issueDate}</span>
                </div>
                <div className="truncate" title={foundCert.hash}>
                  SHA-256: <span className="text-white/70">{foundCert.hash}</span>
                </div>
              </div>

              {/* Interactive Merkle Path Proof Visualizer */}
              <MerklePathVisualizer
                credentialId={foundCert.id}
                leafHash={foundCert.hash}
                merkleRoot={foundMerkleRoot || "0x89f4b2c9e1038a7c512490d81736251489f4b2c9e1038a7c512490d81738c1"}
                batchId={foundCert.batchId}
                blockNumber={foundCert.blockNumber}
              />

              <div className="mt-4 pt-3 border-t border-emerald-500/20 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleDownloadCertPdf(foundCert)}
                  className="px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Download Official PDF</span>
                </button>
                <button
                  onClick={() => setShowQrModal(true)}
                  className="px-3.5 py-1.5 rounded-full border border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981] text-xs font-mono hover:bg-[#10B981]/20 transition-colors flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QR &amp; LinkedIn Badge</span>
                </button>
                <button
                  onClick={() => handleCopyShareLink(foundCert.id)}
                  className="px-3.5 py-1.5 rounded-full border border-white/20 text-white text-xs font-mono hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Share Link</span>
                    </>
                  )}
                </button>
              </div>
              <QrCodeModal
                isOpen={showQrModal}
                onClose={() => setShowQrModal(false)}
                credentialId={foundCert.id}
                studentName={foundCert.name}
                courseTitle={foundCert.course}
                issueDate={foundCert.issueDate}
              />
            </div>
          )}
          <SmartContractModal
            isOpen={showContractModal}
            onClose={() => setShowContractModal(false)}
          />

          {lookupResult === "FOUND_REVOKED" && foundCert && (
            <div className="mt-5 p-4 rounded-2xl bg-red-950/30 border border-red-500/40 text-left max-w-md mx-auto animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-red-500/20 text-xs font-mono text-red-400">
                <span className="flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  CREDENTIAL REVOKED BY ISSUER
                </span>
                <span>Flagged On-Chain</span>
              </div>
              <div className="mt-3 text-white font-medium text-base">
                {foundCert.name}
              </div>
              <div className="text-xs text-white/70 mt-0.5">
                {foundCert.course} (ID: {foundCert.id})
              </div>
              <p className="mt-2 text-xs text-red-300 font-sans">
                This credential was revoked by the issuing institution. Do not accept this certificate for employment or accreditation.
              </p>
            </div>
          )}

          {lookupResult === "NOT_FOUND" && (
            <div className="mt-4 p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-xs font-mono text-red-300 max-w-md mx-auto">
              ⚠️ Credential ID not found in current on-chain registry. Drop the PDF below for full cryptographic audit.
            </div>
          )}
        </div>

        {/* Live Verifier Component */}
        <div className="rounded-3xl border border-white/10 bg-[#0E0E10]/40 overflow-hidden shadow-2xl">
          <VerifyDemo />
        </div>

        {/* Verification Explainer */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
          <div className="p-6 rounded-2xl bg-[#0E0E10] border border-white/10">
            <div className="text-white font-semibold mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#10B981]" />
              <span>100% Private Hashing</span>
            </div>
            <p className="text-white/60 leading-relaxed font-sans">
              No files are ever uploaded to remote servers. SHA-256 fingerprinting happens directly in your browser RAM.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0E0E10] border border-white/10">
            <div className="text-white font-semibold mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Polygon PoS Mainnet</span>
            </div>
            <p className="text-white/60 leading-relaxed font-sans">
              Anchored immutably on Polygon Layer-2 with sub-second finality and cryptographic Merkle path proofs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0E0E10] border border-white/10">
            <div className="text-white font-semibold mb-2 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#10B981]" />
              <span>Publicly Auditable</span>
            </div>
            <p className="text-white/60 leading-relaxed font-sans">
              Every issued batch contains an on-chain block receipt verifiable directly on PolygonScan block explorer.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
