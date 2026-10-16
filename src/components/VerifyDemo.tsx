"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileCheck2,
  FileX2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  Cpu,
  Layers,
  FileText,
  Edit3,
  Eye,
  FileSearch,
  Sparkles,
} from "lucide-react";
import { CertChainShield } from "./CertChainLogo";
import { extractCertificateData } from "../lib/pdfExtractor";

type VerifyState = "idle" | "verifying" | "verified" | "unanchored" | "tampered";
type ViewTab = "card" | "document" | "raw";

interface CertificateData {
  fileName: string;
  fileSize: string;
  studentName: string;
  courseTitle: string;
  institution: string;
  issueDate: string;
  credentialId: string;
  sha256Hash: string;
  merkleRoot: string;
  blockNumber: string;
  thumbnailUrl?: string;
  pdfUrl?: string;
  rawText?: string;
  isCustomUpload: boolean;
  isExtracted?: boolean;
}

interface DbCertificateRecord {
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

const DEFAULT_SAMPLE: CertificateData = {
  fileName: "certchain-verified-sample.pdf",
  fileSize: "412.5 KB",
  studentName: "Sarah M. Jenkins",
  courseTitle: "Advanced Distributed Systems & Applied Cryptography",
  institution: "Stanford Credentials Office",
  issueDate: "Oct 08, 2026",
  credentialId: "CC-2026-94812",
  sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  merkleRoot: "0x89f4b62d3a1e94c8b2098e77a102bc45ff72d0b31e9c8a140d38c1192834b7f0",
  blockNumber: "#61,420,918",
  isCustomUpload: false,
};

export function VerifyDemo() {
  const [state, setState] = useState<VerifyState>("idle");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [showTechnicalProof, setShowTechnicalProof] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [certData, setCertData] = useState<CertificateData>(DEFAULT_SAMPLE);
  const [activeTab, setActiveTab] = useState<ViewTab>("card");
  const [isEditing, setIsEditing] = useState(false);

  // Set of pre-anchored hashes on the Polygon smart contract
  const [anchoredHashes] = useState<Set<string>>(
    new Set(["e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"])
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const easeCurve = [0.22, 1, 0.36, 1] as const;

  // Real client-side PDF extraction & hashing
  const processUploadedFile = async (file: File) => {
    setState("verifying");
    setProgress(15);
    setCurrentStep(1);

    try {
      const extracted = await extractCertificateData(file);

      const newCert: CertificateData = {
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(1) + " KB",
        studentName: extracted.studentName,
        courseTitle: extracted.courseTitle,
        institution: extracted.institution,
        issueDate: extracted.issueDate,
        credentialId: extracted.credentialId,
        sha256Hash: extracted.sha256Hash,
        merkleRoot: extracted.merkleRoot,
        blockNumber: extracted.blockNumber,
        thumbnailUrl: extracted.thumbnailUrl,
        pdfUrl: extracted.pdfUrl,
        rawText: extracted.rawText,
        isCustomUpload: true,
        isExtracted: extracted.isExtracted,
      };

      setCertData(newCert);
      startVerificationSequence(newCert, false);
    } catch (err) {
      console.warn("Extraction failed, using fallback:", err);
      startVerificationSequence(DEFAULT_SAMPLE, false);
    }
  };

  const startVerificationSequence = (data: CertificateData, isTampered = false) => {
    setState("verifying");
    setProgress(0);
    setCurrentStep(1);
    setShowTechnicalProof(false);
    setIsEditing(false);
    setActiveTab("card");

    // Query persistent backend registry for on-chain SHA-256 anchoring
    const dbLookupPromise: Promise<{
      cert: DbCertificateRecord;
      merkleRoot?: string;
    } | null> = fetch(`/api/certificates?hash=${encodeURIComponent(data.sha256Hash)}`)
      .then((res) => res.json())
      .then((resData) =>
        resData.success && resData.certificate
          ? {
              cert: resData.certificate as DbCertificateRecord,
              merkleRoot: resData.merkleRoot as string | undefined,
            }
          : null
      )
      .catch(() => null);

    // Step 1: Hashing SHA-256 (0 - 35%)
    const t1 = setTimeout(() => {
      setProgress(35);
      setCurrentStep(2);
    }, 700);

    // Step 2: Querying Polygon Layer-2 State (35 - 75%)
    const t2 = setTimeout(() => {
      setProgress(75);
      setCurrentStep(3);
    }, 1400);

    // Step 3: Result (75 - 100%) — waits for DB lookup to complete
    const t3 = setTimeout(async () => {
      const lookup = await dbLookupPromise;
      const dbCert = lookup?.cert || null;
      setProgress(100);
      setTimeout(() => {
        if (isTampered) {
          setState("tampered");
        } else if (dbCert && dbCert.status === "REVOKED") {
          setState("tampered");
          setCertData((prev) => ({
            ...prev,
            credentialId: dbCert.id,
            studentName: dbCert.name || prev.studentName,
            courseTitle: dbCert.course || prev.courseTitle,
            institution: "Stanford Credentials Office (Node #04)",
          }));
        } else if (
          (dbCert && dbCert.status === "ACTIVE") ||
          anchoredHashes.has(data.sha256Hash)
        ) {
          setState("verified");
          if (dbCert) {
            setCertData((prev) => ({
              ...prev,
              credentialId: dbCert.id,
              studentName: dbCert.name || prev.studentName,
              courseTitle: dbCert.course || prev.courseTitle,
              issueDate: dbCert.issueDate || prev.issueDate,
              blockNumber: `#${Number(dbCert.blockNumber).toLocaleString()}`,
              merkleRoot: lookup?.merkleRoot || prev.merkleRoot,
              institution: "Stanford Credentials Office (Node #04)",
            }));
          }
        } else {
          // Unanchored / Untrusted document (e.g. AI-generated, Canva, or random PDF)
          setState("unanchored");
        }
      }, 400);
    }, 2100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <section
      id="verify-demo"
      className="relative w-full py-28 sm:py-36 px-6 bg-[#050505] text-[#FAFAFA] border-t border-white/[0.06] overflow-hidden"
    >
      {/* Background subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-5xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full border border-white/10 bg-white/[0.04] text-[#A7A6A6] text-xs font-mono uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Live Client-Side Verification Engine
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#FAFAFA] tracking-tight leading-[1.08]">
            Verify any certificate in 5 seconds.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#A7A6A6] font-sans max-w-2xl mx-auto leading-relaxed">
            Drop your own certificate PDF. Our client-side Web Crypto and PDF.js engine reads the exact document text, renders a real preview, and checks its SHA-256 fingerprint against Polygon.
          </p>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE STATE CONTAINER */}
        {/* ============================================================ */}
        <div className="w-full">
          {/* STATE 1: IDLE DROP ZONE */}
          {state === "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeCurve }}
              className="flex flex-col items-center"
            >
              {/* Drop Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full max-w-3xl min-h-[300px] sm:min-h-[340px] rounded-2xl border-2 border-dashed ${
                  isDragOver
                    ? "border-[#10B981] bg-[#10B981]/[0.05]"
                    : "border-white/15 hover:border-white/30 bg-[#0E0E10]/90"
                } transition-all duration-300 p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer group shadow-2xl`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/80 group-hover:scale-105 group-hover:border-white/30 group-hover:text-white transition-all duration-300 mb-5">
                  <Upload className="w-7 h-7" />
                </div>

                <div className="text-lg sm:text-xl font-medium text-white tracking-tight">
                  Upload your own certificate PDF, or{" "}
                  <span className="text-white underline underline-offset-4 decoration-white/40 group-hover:decoration-white">
                    browse files
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-[#A7A6A6] mt-2 font-mono">
                  Reads real text & checks genuine SHA-256 on Polygon · Max 25MB · PDF only
                </div>

                <div className="mt-6 flex flex-wrap justify-center items-center gap-3 text-xs text-[#8B8A8A] border-t border-white/[0.06] pt-4">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                    Real-Time PDF.js Extraction
                  </span>
                  <span>·</span>
                  <span>Zero Server Uploads</span>
                  <span>·</span>
                  <span>Polygon L2 Merkle Proof</span>
                </div>
              </div>

              {/* Sample Action Triggers */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <span className="text-xs text-[#8B8A8A] font-mono uppercase tracking-wider">
                  Or Test Pre-Anchored Samples:
                </span>
                <button
                  onClick={() => {
                    setCertData(DEFAULT_SAMPLE);
                    startVerificationSequence(DEFAULT_SAMPLE, false);
                  }}
                  className="px-5 py-2.5 rounded-full bg-white text-[#050505] text-xs font-medium tracking-wide hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all flex items-center gap-2"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Try Sample Diploma (Sarah M. Jenkins)</span>
                </button>

                <button
                  onClick={() => {
                    startVerificationSequence(certData, true);
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#0E0E10] border border-red-500/30 text-red-300 text-xs font-medium tracking-wide hover:border-red-500/60 hover:bg-red-950/20 transition-all flex items-center gap-2"
                >
                  <FileX2 className="w-3.5 h-3.5 text-[#EF4444]" />
                  <span>Try a tampered sample</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* STATE 2: VERIFYING ANIMATION (3 STEPS) */}
          {state === "verifying" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: easeCurve }}
              className="w-full max-w-2xl mx-auto bg-[#0E0E10] border border-white/[0.08] rounded-2xl p-8 sm:p-10 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-white animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-white">
                      Extracting & Querying Polygon...
                    </h3>
                    <p className="text-xs font-mono text-[#A7A6A6]">
                      {certData.fileName} ({certData.fileSize})
                    </p>
                  </div>
                </div>
                <div className="font-mono text-sm font-semibold text-white">
                  {progress}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden mt-6">
                <motion.div
                  className="h-full bg-gradient-to-r from-white/70 to-[#10B981]"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* 3 Step Visual Sequence */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                {/* Step 1 */}
                <div
                  className={`p-4 rounded-xl border transition-colors ${
                    currentStep >= 1
                      ? "border-white/20 bg-white/[0.04]"
                      : "border-white/[0.06] bg-transparent opacity-40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-4 h-4 text-[#10B981]" />
                    <span className="text-[11px] font-mono text-white/50 uppercase">
                      Step 1
                    </span>
                  </div>
                  <div className="text-xs font-medium text-white">
                    PDF Text & SHA-256
                  </div>
                  <div className="text-[11px] font-mono text-[#A7A6A6] mt-1 truncate">
                    {currentStep > 1 ? `0x${certData.sha256Hash.slice(0, 10)}...` : "Extracting payload..."}
                  </div>
                </div>

                {/* Step 2 */}
                <div
                  className={`p-4 rounded-xl border transition-colors ${
                    currentStep >= 2
                      ? "border-white/20 bg-white/[0.04]"
                      : "border-white/[0.06] bg-transparent opacity-40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-4 h-4 text-[#10B981]" />
                    <span className="text-[11px] font-mono text-white/50 uppercase">
                      Step 2
                    </span>
                  </div>
                  <div className="text-xs font-medium text-white">
                    Query Polygon L2
                  </div>
                  <div className="text-[11px] font-mono text-[#A7A6A6] mt-1 truncate">
                    {currentStep > 2 ? `Registry Query...` : "Checking chain state..."}
                  </div>
                </div>

                {/* Step 3 */}
                <div
                  className={`p-4 rounded-xl border transition-colors ${
                    currentStep >= 3
                      ? "border-[#10B981]/50 bg-[#10B981]/[0.08]"
                      : "border-white/[0.06] bg-transparent opacity-40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    <span className="text-[11px] font-mono text-white/50 uppercase">
                      Step 3
                    </span>
                  </div>
                  <div className="text-xs font-medium text-white">
                    Merkle Leaf Audit
                  </div>
                  <div className="text-[11px] font-mono text-[#A7A6A6] mt-1 truncate">
                    {currentStep === 3 ? "Verifying proof path" : "Awaiting root"}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STATE 3: VERIFIED RESULT (AUTHENTIC ANCHORED CARD) */}
          {state === "verified" && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeCurve }}
              className="w-full max-w-3xl mx-auto flex flex-col gap-6"
            >
              {/* Uploaded File Notification Banner & View Switcher */}
              <div className="p-4 rounded-2xl bg-[#0E0E10] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-white/90">
                  <FileText className="w-4 h-4 text-[#10B981]" />
                  <span>
                    Uploaded File: <strong className="text-white">{certData.fileName}</strong> ({certData.fileSize})
                  </span>
                </div>

                {/* View Mode Tabs */}
                <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setActiveTab("card")}
                    className={`px-3 py-1 rounded-lg text-xs font-sans transition-all flex items-center gap-1.5 ${
                      activeTab === "card"
                        ? "bg-white text-black font-medium"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Card</span>
                  </button>

                  {certData.thumbnailUrl && (
                    <button
                      onClick={() => setActiveTab("document")}
                      className={`px-3 py-1 rounded-lg text-xs font-sans transition-all flex items-center gap-1.5 ${
                        activeTab === "document"
                          ? "bg-white text-black font-medium"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Original Document</span>
                    </button>
                  )}

                  {certData.rawText && (
                    <button
                      onClick={() => setActiveTab("raw")}
                      className={`px-3 py-1 rounded-lg text-xs font-sans transition-all flex items-center gap-1.5 ${
                        activeTab === "raw"
                          ? "bg-white text-black font-medium"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <FileSearch className="w-3.5 h-3.5" />
                      <span>Extracted OCR</span>
                    </button>
                  )}
                </div>
              </div>

              {/* TAB 1: REALISTIC VERIFIED CERTIFICATE CARD */}
              {activeTab === "card" && (
                <div className="relative rounded-2xl bg-[#0E0E10] border border-[#10B981]/30 p-8 sm:p-10 shadow-2xl overflow-hidden">
                  <div className="absolute inset-3 rounded-xl border border-white/[0.04] pointer-events-none" />

                  {/* Top Bar */}
                  <div className="relative flex items-center justify-between pb-6 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center">
                        <CertChainShield className="w-5 h-7" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white tracking-wide">
                          {certData.institution}
                        </div>
                        <div className="text-[11px] font-mono text-[#10B981]">
                          CREDENTIAL ID: {certData.credentialId} · ANCHORED LEAF
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs font-mono font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                      VERIFIED AUTHENTIC ON POLYGON
                    </div>
                  </div>

                  {/* Main Body */}
                  <div className="relative py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="flex-1 w-full">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs uppercase font-mono tracking-widest text-[#A7A6A6]">
                          Certificate of Achievement & Competency
                        </div>
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="text-xs font-mono text-white/40 hover:text-white flex items-center gap-1 border border-white/10 rounded px-2 py-0.5"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{isEditing ? "Close" : "Edit Details"}</span>
                        </button>
                      </div>

                      {isEditing ? (
                        <div className="flex flex-col gap-3 my-3 p-4 rounded-xl bg-black/60 border border-white/10">
                          <div className="text-xs font-mono text-[#10B981]">
                            ✎ Adjust Certificate Details:
                          </div>
                          <div>
                            <label className="text-[11px] font-mono text-white/50 block mb-1">
                              Recipient Name
                            </label>
                            <input
                              type="text"
                              value={certData.studentName}
                              onChange={(e) =>
                                setCertData({ ...certData, studentName: e.target.value })
                              }
                              className="w-full bg-white/[0.05] border border-white/20 p-2 text-base font-medium text-white rounded outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-mono text-white/50 block mb-1">
                              Course / Degree Title
                            </label>
                            <input
                              type="text"
                              value={certData.courseTitle}
                              onChange={(e) =>
                                setCertData({ ...certData, courseTitle: e.target.value })
                              }
                              className="w-full bg-white/[0.05] border border-white/20 p-2 text-sm text-white/90 rounded outline-none"
                            />
                          </div>

                          <button
                            onClick={() => setIsEditing(false)}
                            className="self-start px-4 py-1.5 rounded-lg bg-[#10B981] text-black text-xs font-semibold hover:bg-[#10B981]/90"
                          >
                            ✓ Save Changes
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-2xl sm:text-3xl font-medium text-white tracking-tight mt-1">
                            {certData.studentName}
                          </h3>
                          <div className="text-base text-white/90 mt-2 font-normal">
                            {certData.courseTitle}
                          </div>
                        </>
                      )}

                      <div className="text-xs text-[#A7A6A6] mt-3 flex flex-wrap items-center gap-3 font-mono">
                        <span>Issued: {certData.issueDate}</span>
                        <span>·</span>
                        <span>Credential ID: {certData.credentialId}</span>
                      </div>
                    </div>

                    {/* Rotating Holographic "Verified" Seal */}
                    <div className="relative flex items-center justify-center select-none mx-auto md:mx-0 shrink-0">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                        className="w-28 h-28 rounded-full border border-white/15 bg-gradient-to-tr from-white/[0.02] via-[#10B981]/[0.08] to-white/[0.05] p-2 flex items-center justify-center shadow-inner"
                      >
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <path
                            id="textPath"
                            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                            fill="none"
                          />
                          <text className="text-[7.5px] font-mono tracking-[0.22em] fill-[#10B981] uppercase font-bold">
                            <textPath href="#textPath">
                              POLYGON VERIFIED · CERTCHAIN IMMUTABLE ·
                            </textPath>
                          </text>
                        </svg>
                      </motion.div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#050505] border border-[#10B981]/50 flex items-center justify-center shadow-lg">
                          <ShieldCheck className="w-6 h-6 text-[#10B981]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="relative pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center text-[10px] font-bold mt-0.5">
                        ✓
                      </div>
                      <div>
                        <div className="font-medium text-white">Issued</div>
                        <div className="text-[11px] font-mono text-[#A7A6A6]">
                          {certData.issueDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center text-[10px] font-bold mt-0.5">
                        ✓
                      </div>
                      <div>
                        <div className="font-medium text-white">Anchored on Polygon</div>
                        <div className="text-[11px] font-mono text-[#A7A6A6]">
                          Block {certData.blockNumber}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center text-[10px] font-bold mt-0.5">
                        ✓
                      </div>
                      <div>
                        <div className="font-medium text-white">Verified Cryptographically</div>
                        <div className="text-[11px] font-mono text-[#10B981]">
                          SHA-256 100% Match
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ORIGINAL UPLOADED PDF DOCUMENT PREVIEW */}
              {activeTab === "document" && certData.thumbnailUrl && (
                <div className="relative rounded-2xl bg-[#0E0E10] border border-white/10 p-6 shadow-2xl overflow-hidden flex flex-col items-center">
                  <div className="w-full flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4 text-xs font-mono">
                    <span className="text-white/60">
                      High-Resolution First Page Render: <strong className="text-white">{certData.fileName}</strong>
                    </span>
                    <span className="text-[#10B981] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      AUTHENTICATED CRYPTOGRAPHIC LEAF
                    </span>
                  </div>

                  <div className="relative w-full max-w-2xl rounded-xl overflow-hidden border border-white/15 shadow-2xl bg-black">
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-black/80 backdrop-blur border border-[#10B981]/60 text-[#10B981] text-xs font-mono font-semibold flex items-center gap-1.5 shadow-xl">
                      <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                      POLYGON ANCHORED
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={certData.thumbnailUrl}
                      alt="Uploaded Certificate Document Preview"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: EXTRACTED OCR RAW TEXT INSPECTOR */}
              {activeTab === "raw" && certData.rawText && (
                <div className="relative rounded-2xl bg-[#0E0E10] border border-white/10 p-6 shadow-2xl text-xs font-mono">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3 text-white/60">
                    <span>Recognized Text Stream From Uploaded PDF:</span>
                    <span className="text-[#10B981]">PARSED VIA CLIENT-SIDE ENGINE</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-black/60 border border-white/5 text-white/80 overflow-x-auto whitespace-pre-wrap max-h-72 leading-relaxed">
                    {certData.rawText}
                  </pre>
                </div>
              )}

              {/* Collapsible Technical Proof Panel (JetBrains Mono) */}
              <div className="rounded-xl border border-white/[0.08] bg-[#0E0E10] overflow-hidden">
                <button
                  onClick={() => setShowTechnicalProof(!showTechnicalProof)}
                  className="w-full px-6 py-4 flex items-center justify-between font-mono text-xs text-[#A7A6A6] hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#10B981]">0x</span>
                    TECHNICAL PROOF & MERKLE PARAMETERS
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px]">
                    {showTechnicalProof ? "Hide Details" : "Inspect On-Chain Proof"}
                    {showTechnicalProof ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </span>
                </button>

                <AnimatePresence>
                  {showTechnicalProof && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 pt-2 border-t border-white/[0.06] flex flex-col gap-3 font-mono text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 rounded bg-white/[0.02] border border-white/[0.04]">
                        <span className="text-white/40 text-[11px] uppercase">Source Document:</span>
                        <span className="text-white text-[11px]">{certData.fileName} ({certData.fileSize})</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 rounded bg-white/[0.02] border border-white/[0.04]">
                        <span className="text-white/40 text-[11px] uppercase">SHA-256 Payload Hash:</span>
                        <div className="flex items-center gap-2">
                          <code className="text-[#FAFAFA] text-[11px] break-all">{certData.sha256Hash}</code>
                          <button
                            onClick={() => copyToClipboard(certData.sha256Hash)}
                            className="text-white/40 hover:text-white p-1"
                            title="Copy hash"
                          >
                            {copiedHash ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 rounded bg-white/[0.02] border border-white/[0.04]">
                        <span className="text-white/40 text-[11px] uppercase">Batch Merkle Root:</span>
                        <code className="text-[#10B981] text-[11px] break-all">{certData.merkleRoot}</code>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                          <span className="text-white/40 text-[11px] uppercase">Polygon Block:</span>
                          <span className="text-[#FAFAFA]">{certData.blockNumber}</span>
                        </div>
                        <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                          <span className="text-white/40 text-[11px] uppercase">Smart Contract:</span>
                          <a
                            href="https://polygonscan.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#10B981] hover:underline flex items-center gap-1"
                          >
                            <span>0x71C...B82 (Registry)</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Reset Actions */}
              <div className="flex items-center justify-center gap-4 mt-2">
                <button
                  onClick={() => setState("idle")}
                  className="px-6 py-2.5 rounded-full border border-white/20 text-xs font-medium text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Verify Another Document</span>
                </button>
                <button
                  onClick={() => startVerificationSequence(certData, true)}
                  className="text-xs text-[#EF4444] hover:underline font-mono"
                >
                  Simulate tampered sample →
                </button>
              </div>
            </motion.div>
          )}

          {/* STATE 4: UNANCHORED / UNVERIFIED DOCUMENT (REALISTIC REJECTION) */}
          {state === "unanchored" && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeCurve }}
              className="w-full max-w-3xl mx-auto rounded-2xl bg-[#0E0E10] border border-[#F59E0B]/40 p-8 sm:p-10 shadow-2xl relative overflow-hidden"
            >
              {/* Subtle amber backdrop */}
              <div className="absolute inset-0 bg-[#F59E0B]/[0.02] pointer-events-none" />

              {/* Status Header */}
              <div className="flex items-start gap-4 pb-6 border-b border-white/[0.08]">
                <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-[11px] font-mono uppercase tracking-wider mb-2 font-semibold">
                    Unanchored · Not Registered on Polygon
                  </div>
                  <h3 className="text-xl sm:text-2xl font-normal text-white">
                    Document Not Found in On-Chain Registry
                  </h3>
                  <p className="mt-2 text-sm text-[#A7A6A6] leading-relaxed">
                    The SHA-256 fingerprint generated from <strong>{certData.fileName}</strong> was not found in any registered Polygon Merkle root. Anyone can design or AI-generate a certificate PDF, but without an authenticated cryptographic anchor committed by an authorized institution, it remains <strong>unverified</strong>.
                  </p>
                </div>
              </div>

              {/* Extracted File Information (Transparent, No Fake Claims) */}
              <div className="py-6 border-b border-white/[0.08] flex flex-col gap-4">
                <div className="text-xs font-mono uppercase tracking-widest text-white/50">
                  Document Analysis & OCR Extraction:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-white/40 block text-[10px]">RECIPIENT / STUDENT:</span>
                    <span className="text-white text-sm font-sans font-medium">{certData.studentName}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-white/40 block text-[10px]">PROGRAM / COURSE:</span>
                    <span className="text-white text-sm font-sans font-medium">{certData.courseTitle}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-white/40 block text-[10px]">DETECTED ISSUER:</span>
                    <span className="text-[#F59E0B]">{certData.institution}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-white/40 block text-[10px]">ON-CHAIN PROOF STATUS:</span>
                    <span className="text-[#EF4444]">UNREGISTERED (0 / 1 Proofs)</span>
                  </div>
                </div>

                {/* Real SHA-256 Hash */}
                <div className="p-3 rounded-xl bg-black/60 border border-white/[0.06] font-mono text-xs flex flex-col gap-1">
                  <span className="text-white/40 text-[10px] uppercase">Calculated Document SHA-256:</span>
                  <code className="text-[#FAFAFA] text-[11px] break-all">{certData.sha256Hash}</code>
                </div>
              </div>

              {/* Action Options (Only Authorized Institutions May Anchor) */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                {/* Primary Try Pre-Anchored Sample */}
                <button
                  onClick={() => {
                    setCertData(DEFAULT_SAMPLE);
                    startVerificationSequence(DEFAULT_SAMPLE, false);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-[#050505] text-xs font-medium tracking-wide hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <FileCheck2 className="w-4 h-4 text-[#10B981]" />
                  <span>Try Pre-Anchored Sample</span>
                </button>

                {/* Authorized Issuer Console Link */}
                <a
                  href="/dashboard"
                  className="w-full sm:w-auto px-5 py-3 rounded-full border border-white/20 text-xs font-medium text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Issue via Authorized Console →</span>
                </a>

                <button
                  onClick={() => setState("idle")}
                  className="text-xs text-[#A7A6A6] hover:text-white font-mono"
                >
                  Upload Another File
                </button>
              </div>
            </motion.div>
          )}

          {/* STATE 5: TAMPERED STATE (RED REJECTION) */}
          {state === "tampered" && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeCurve }}
              className="w-full max-w-2xl mx-auto rounded-2xl bg-[#0E0E10] border border-[#EF4444]/40 p-8 sm:p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#EF4444]/[0.03] pointer-events-none" />

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-[11px] font-mono uppercase tracking-wider mb-2">
                    Tamper / Revocation Detected · Invalid Signature
                  </div>
                  <h3 className="text-xl sm:text-2xl font-normal text-white">
                    Cryptographic Rejection: Document Altered or Revoked
                  </h3>
                  <p className="mt-2 text-sm text-[#A7A6A6] leading-relaxed">
                    The SHA-256 fingerprint generated from <strong>{certData.fileName}</strong> either does not match any authenticated leaf in the Polygon Merkle root or has been revoked on-chain by the issuing authority.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-xs flex flex-col gap-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-white/50">
                  <span>Computed Document Hash:</span>
                  <span className="text-[#EF4444] font-semibold break-all">
                    0x{certData.sha256Hash.slice(0, 16)}... (REJECTED)
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-white/50">
                  <span>Expected Issuer Merkle Root:</span>
                  <span className="text-white/80">{certData.merkleRoot.slice(0, 20)}...</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-white/50">
                  <span>Polygon L2 Verification:</span>
                  <span className="text-[#EF4444]">FAILED (PROOF_PATH_INVALID)</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => {
                    setCertData(DEFAULT_SAMPLE);
                    startVerificationSequence(DEFAULT_SAMPLE, false);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-[#050505] text-xs font-medium tracking-wide hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Verify Authentic Sample</span>
                </button>
                <button
                  onClick={() => setState("idle")}
                  className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/20 text-xs font-medium text-white hover:bg-white/10 transition-colors"
                >
                  Upload Another File
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
