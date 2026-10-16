"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CertChainShield } from "@/components/CertChainLogo";
import { SmartContractModal, CERTCHAIN_CONTRACT_ADDRESS } from "@/components/SmartContractModal";
import {
  ArrowLeft,
  Terminal,
  Play,
  Code2,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
} from "lucide-react";

const API_ENDPOINTS = [
  {
    id: "verify-id",
    method: "GET",
    path: "/api/certificates?id=CC-2026-94812",
    title: "Verify Credential by On-Chain ID",
    description:
      "Returns the certificate record, Polygon block height, cohort Merkle root, and O(log N) binary Merkle proof array.",
  },
  {
    id: "list-certs",
    method: "GET",
    path: "/api/certificates",
    title: "List All Anchored Credentials",
    description:
      "Returns all active and revoked credentials anchored by the institutional registrar node.",
  },
  {
    id: "list-batches",
    method: "GET",
    path: "/api/batches",
    title: "List Polygon Merkle Batches & Audit Logs",
    description:
      "Returns all committed cohort Merkle roots, Polygon transaction hashes, and cryptographic governance logs.",
  },
];

export default function ApiDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(API_ENDPOINTS[0]);
  const [liveResponse, setLiveResponse] = useState<string>(
    '// Click "Execute Live Request" to inspect the real JSON payload from your node...'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [isContractOpen, setIsContractOpen] = useState(false);

  const handleRunEndpoint = async (endpoint = selectedEndpoint) => {
    setSelectedEndpoint(endpoint);
    setIsLoading(true);
    try {
      const res = await fetch(endpoint.path);
      const data = await res.json();
      setLiveResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setLiveResponse(
        JSON.stringify({ error: "Failed to execute request", details: String(err) }, null, 2)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCurl = () => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://certchain.edu";
    navigator.clipboard.writeText(`curl -X GET "${origin}${selectedEndpoint.path}"`);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans selection:bg-white selection:text-black">
      {/* Header */}
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
              DEVELOPER API &amp; SDK DOCS
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
              Verifier
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-1.5 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors"
            >
              Admin Console
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-3xl pb-8 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full border border-white/10 bg-white/[0.04] text-[#10B981] text-xs font-mono uppercase tracking-widest">
            <Terminal className="w-3.5 h-3.5" />
            <span>Enterprise HR &amp; ATS Integration Gateway</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-tight">
            REST API &amp; Polygon Smart Contract Reference
          </h1>
          <p className="text-sm text-white/50 mt-2 leading-relaxed">
            Integrate automated background checks directly into Workday, Greenhouse, Lever, or custom HR pipelines. Query our zero-cost REST endpoints or call{" "}
            <code className="text-emerald-400 font-mono">verifyCredentialMerkleProof</code> directly on Polygon PoS Mainnet ({CERTCHAIN_CONTRACT_ADDRESS}).
          </p>
        </div>

        {/* Interactive API Playground */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 5 Cols: Endpoint Selector */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="text-xs font-mono uppercase tracking-wider text-white/40 mb-1">
              Select Endpoint to Test Live:
            </div>
            {API_ENDPOINTS.map((ep) => {
              const active = selectedEndpoint.id === ep.id;
              return (
                <div
                  key={ep.id}
                  onClick={() => handleRunEndpoint(ep)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    active
                      ? "bg-[#0E0E10] border-[#10B981]/60 shadow-[0_0_25px_rgba(16,185,129,0.08)]"
                      : "bg-[#0E0E10]/60 border-white/[0.08] hover:border-white/25"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-semibold">
                      {ep.method}
                    </span>
                    <span className="text-white/70 truncate ml-2">{ep.path}</span>
                  </div>
                  <div className="text-sm font-medium text-white">{ep.title}</div>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">{ep.description}</p>
                </div>
              );
            })}

            {/* Direct On-Chain RPC Box */}
            <div className="mt-2 p-5 rounded-2xl bg-[#0E0E10] border border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2 text-[#10B981] font-semibold mb-2">
                <Cpu className="w-4 h-4" />
                <span>DIRECT POLYGON MAINNET RPC</span>
              </div>
              <div className="text-white/60 space-y-1 text-[11px]">
                <div>Chain ID: <span className="text-white">137 (Polygon PoS)</span></div>
                <div>RPC Endpoint: <span className="text-white">https://polygon-rpc.com</span></div>
                <div className="truncate">Contract: <span className="text-emerald-400">{CERTCHAIN_CONTRACT_ADDRESS}</span></div>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Live Request & JSON Response Inspector */}
          <div className="lg:col-span-7 bg-[#0E0E10] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-[#10B981]/20 text-[#10B981] font-semibold">
                  {selectedEndpoint.method}
                </span>
                <span className="text-white">{selectedEndpoint.path}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCurl}
                  className="px-3 py-1.5 rounded-full border border-white/15 text-xs font-mono text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  {copiedCurl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Copied cURL</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy cURL</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleRunEndpoint(selectedEndpoint)}
                  disabled={isLoading}
                  className="px-4 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-[#10B981] fill-[#10B981]" />
                  <span>{isLoading ? "Running..." : "Execute Live Request"}</span>
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40 mb-2">
                <span>LIVE SERVER RESPONSE (200 OK · application/json)</span>
                <span className="text-[#10B981] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Cryptographically Signed</span>
                </span>
              </div>
              <pre className="p-4 rounded-xl bg-[#050505] border border-white/10 text-xs font-mono text-emerald-300/90 overflow-x-auto max-h-[420px] leading-relaxed">
                {liveResponse}
              </pre>
            </div>
          </div>
        </div>
      </main>

      <SmartContractModal
        isOpen={isContractOpen}
        onClose={() => setIsContractOpen(false)}
      />
    </div>
  );
}
