"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CertChainShield } from "@/components/CertChainLogo";
import { QrCodeModal, buildLinkedInCertUrl } from "@/components/QrCodeModal";
import {
  SmartContractModal,
  MerklePathVisualizer,
} from "@/components/SmartContractModal";
import { downloadAndSyncCertificatePdf } from "@/lib/pdfGenerator";
import {
  ArrowLeft,
  Award,
  Download,
  QrCode,
  Copy,
  Check,
  Search,
  ShieldCheck,
  ExternalLink,
  Code2,
  Layers,
  Sparkles,
} from "lucide-react";

interface WalletCertificate {
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

export default function StudentWalletPage() {
  const [certificates, setCertificates] = useState<WalletCertificate[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCert, setSelectedCert] = useState<WalletCertificate | null>(null);
  const [qrCert, setQrCert] = useState<WalletCertificate | null>(null);
  const [expandedMerkleId, setExpandedMerkleId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isContractOpen, setIsContractOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch("/api/certificates")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.certificates)) {
          setCertificates(data.certificates);
          if (data.certificates.length > 0) {
            setSelectedCert(data.certificates[0]);
          }
        }
      })
      .catch(() => {});
  }, []);

  const filteredCerts = certificates.filter((c) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      c.email.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.course.toLowerCase().includes(q)
    );
  });

  const handleDownloadPdf = async (cert: WalletCertificate) => {
    const { fileName, sha256Hash } = await downloadAndSyncCertificatePdf({
      id: cert.id,
      name: cert.name,
      course: cert.course,
      grade: cert.grade,
      issueDate: cert.issueDate,
      institution: "Stanford Credentials Office",
      blockNumber: cert.blockNumber,
    });
    setCertificates((prev) =>
      prev.map((item) => (item.id === cert.id ? { ...item, hash: sha256Hash } : item))
    );
    if (selectedCert?.id === cert.id) {
      setSelectedCert({ ...cert, hash: sha256Hash });
    }
    setToast(`Downloaded ${fileName} (SHA-256 synced with registry)`);
    setTimeout(() => setToast(""), 4000);
  };

  const handleCopyShareLink = (id: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/verify?id=${encodeURIComponent(id)}`;
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans selection:bg-white selection:text-black">
      {toast && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-xl bg-black/90 border border-[#10B981] text-white text-xs font-mono shadow-2xl flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Bar */}
      <header className="border-b border-white/[0.08] bg-[#0E0E10]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <ArrowLeft className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
              <div className="w-[18px] h-[28px]">
                <CertChainShield className="w-full h-full" />
              </div>
              <span className="font-semibold text-ink tracking-tight text-base">
                CertChain
              </span>
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 font-mono text-[10px] uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              GRADUATE CREDENTIAL WALLET
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <button
              onClick={() => setIsContractOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/15 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Smart Contract</span>
            </button>
            <Link
              href="/verify"
              className="px-4 py-1.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Employer Verifier
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-1.5 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors"
            >
              Issuer Console
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full border border-white/10 bg-white/[0.04] text-[#10B981] text-xs font-mono uppercase tracking-widest">
              <Award className="w-3.5 h-3.5" />
              <span>Self-Sovereign Academic Passport</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-tight">
              Graduate Digital Credential Wallet
            </h1>
            <p className="text-sm text-white/50 mt-1 max-w-2xl">
              Look up your institutional email or Credential ID to inspect your Polygon-anchored diplomas, download official verifiable PDFs, view your Merkle proof path, or add credentials directly to LinkedIn.
            </p>
          </div>

          {/* Search & Quick Student Switcher */}
          <div className="w-full md:w-80">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Filter by student email, name, or ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#0E0E10] border border-white/15 rounded-full pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-white/40 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Quick Graduate Selector Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-white/40 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-[#10B981]" />
            <span>Quick Switch Graduate:</span>
          </span>
          <button
            onClick={() => setQuery("")}
            className={`px-3 py-1 rounded-full border transition-colors ${
              query === ""
                ? "bg-white text-black border-white font-semibold"
                : "border-white/10 text-white/60 hover:text-white"
            }`}
          >
            All Graduates ({certificates.length})
          </button>
          {certificates.slice(0, 4).map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setQuery(c.email);
                setSelectedCert(c);
              }}
              className={`px-3 py-1 rounded-full border transition-colors ${
                query === c.email
                  ? "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/50 font-semibold"
                  : "border-white/10 text-white/60 hover:text-white"
              }`}
            >
              {c.name} ({c.email})
            </button>
          ))}
        </div>

        {/* Main 2-Column Layout: Left Credential Cards, Right Interactive Diploma Canvas */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Credential List */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {filteredCerts.map((cert) => {
              const isSelected = selectedCert?.id === cert.id;
              return (
                <div
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#0E0E10] border-[#10B981]/60 shadow-[0_0_30px_rgba(16,185,129,0.08)]"
                      : "bg-[#0E0E10]/60 border-white/[0.08] hover:border-white/25"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-white/60">{cert.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        cert.status === "ACTIVE"
                          ? "text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30"
                          : "text-red-400 bg-red-500/10 border border-red-500/30"
                      }`}
                    >
                      {cert.status}
                    </span>
                  </div>
                  <div className="text-base font-medium text-white">{cert.course}</div>
                  <div className="text-xs text-white/60 mt-0.5">
                    Issued to <strong className="text-white/90">{cert.name}</strong> ·{" "}
                    <span className="font-mono text-emerald-400">{cert.grade}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-white/40">
                    <span>Issued: {cert.issueDate}</span>
                    <span>Polygon Block #{cert.blockNumber}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Embossed Diploma Preview + Actions + Merkle Tree */}
          <div className="lg:col-span-7">
            {selectedCert ? (
              <div className="flex flex-col gap-6">
                {/* Embossed Certificate Canvas Card */}
                <div className="relative rounded-2xl bg-gradient-to-b from-[#13151A] to-[#0A0B0E] border-2 border-[#10B981]/40 p-8 sm:p-10 shadow-2xl overflow-hidden">
                  {/* Subtle Corner Framing */}
                  <div className="absolute inset-3 border border-white/[0.07] rounded-xl pointer-events-none" />

                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-8">
                        <CertChainShield className="w-full h-full" />
                      </div>
                      <div>
                        <div className="text-xs font-mono uppercase tracking-widest text-[#10B981]">
                          STANFORD CREDENTIALS OFFICE
                        </div>
                        <div className="text-[11px] font-mono text-white/40">
                          POLYGON POS LAYER-2 ANCHORED DIPLOMA
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-xs text-white font-semibold">{selectedCert.id}</div>
                      <div className="text-[10px] text-emerald-400">
                        BLOCK #{selectedCert.blockNumber}
                      </div>
                    </div>
                  </div>

                  <div className="py-8 text-center">
                    <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/40">
                      This Cryptographic Credential Certifies That
                    </div>
                    <div className="mt-3 text-3xl sm:text-4xl font-serif text-white tracking-tight">
                      {selectedCert.name}
                    </div>
                    <div className="mt-2 text-xs font-mono text-white/40">
                      {selectedCert.email}
                    </div>

                    <div className="mt-6 text-xs font-mono uppercase tracking-[0.2em] text-white/40">
                      Has Successfully Completed The Academic Requirements For
                    </div>
                    <div className="mt-2 text-xl sm:text-2xl font-medium text-[#10B981]">
                      {selectedCert.course}
                    </div>
                    <div className="mt-1.5 text-xs font-mono text-white/80">
                      Honors / Distinction: {selectedCert.grade}
                    </div>
                  </div>

                  <div className="pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] font-mono">
                    <div>
                      <span className="text-white/40 block uppercase">SHA-256 Document Digest</span>
                      <span className="text-white/80 truncate block mt-0.5" title={selectedCert.hash}>
                        0x{selectedCert.hash.slice(0, 22)}...{selectedCert.hash.slice(-8)}
                      </span>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-white/40 block uppercase">Conferral Date &amp; Batch</span>
                      <span className="text-white/80 block mt-0.5">
                        {selectedCert.issueDate} · Batch {selectedCert.batchId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="p-5 rounded-2xl bg-[#0E0E10] border border-white/10 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleDownloadPdf(selectedCert)}
                    className="px-4 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Download Verifiable PDF</span>
                  </button>

                  <button
                    onClick={() => setQrCert(selectedCert)}
                    className="px-4 py-2.5 rounded-full border border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981] text-xs font-mono hover:bg-[#10B981]/20 transition-colors flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR Code Badge</span>
                  </button>

                  <a
                    href={buildLinkedInCertUrl({
                      credentialId: selectedCert.id,
                      courseTitle: selectedCert.course,
                      issueDate: selectedCert.issueDate,
                      institution: "Stanford Credentials Office",
                      verifyUrl:
                        typeof window !== "undefined"
                          ? `${window.location.origin}/verify?id=${encodeURIComponent(selectedCert.id)}`
                          : `https://certchain.edu/verify?id=${encodeURIComponent(selectedCert.id)}`,
                    })}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <span>Add to LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleCopyShareLink(selectedCert.id)}
                    className="px-4 py-2.5 rounded-full border border-white/15 text-xs font-mono text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
                  >
                    {copiedId === selectedCert.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>Copied Link!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Share Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      setExpandedMerkleId(
                        expandedMerkleId === selectedCert.id ? null : selectedCert.id
                      )
                    }
                    className="px-4 py-2.5 rounded-full border border-white/15 text-xs font-mono text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>
                      {expandedMerkleId === selectedCert.id ? "Hide Merkle Proof" : "Inspect Merkle Tree"}
                    </span>
                  </button>
                </div>

                {/* Expandable Visual Merkle Tree Proof */}
                {expandedMerkleId === selectedCert.id && (
                  <MerklePathVisualizer
                    credentialId={selectedCert.id}
                    leafHash={selectedCert.hash}
                    merkleRoot="0x89f4b2c9e1038a7c512490d81736251489f4b2c9e1038a7c512490d81738c1"
                    batchId={selectedCert.batchId}
                    blockNumber={selectedCert.blockNumber}
                  />
                )}
              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-[#0E0E10] border border-white/10 text-center text-white/40 font-mono text-xs">
                Select a graduate credential on the left to inspect its diploma and Merkle proof.
              </div>
            )}
          </div>
        </div>
      </main>

      {qrCert && (
        <QrCodeModal
          isOpen={!!qrCert}
          onClose={() => setQrCert(null)}
          credentialId={qrCert.id}
          studentName={qrCert.name}
          courseTitle={qrCert.course}
          issueDate={qrCert.issueDate}
        />
      )}

      <SmartContractModal
        isOpen={isContractOpen}
        onClose={() => setIsContractOpen(false)}
      />
    </div>
  );
}
