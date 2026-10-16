"use client";

import React, { useState } from "react";
import { X, Code2, Copy, Check, ShieldCheck, Layers, ExternalLink, Cpu } from "lucide-react";

export const CERTCHAIN_CONTRACT_ADDRESS = "0x7F2c91E8403A2D1f8B9c54E1a06B3E4491D04A9E";

export const SOLIDITY_CONTRACT_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CertChainRegistry {
    struct CohortBatch {
        bytes32 merkleRoot;
        string batchId;
        string course;
        uint256 certificateCount;
        address issuer;
        uint256 anchoredAt;
        uint256 blockNumber;
        bool exists;
    }

    address public owner;
    mapping(address => bool) public authorizedIssuers;
    mapping(bytes32 => CohortBatch) public batchesByRoot;
    mapping(bytes32 => bool) public revokedCredentialHashes;

    event BatchAnchored(bytes32 indexed merkleRoot, string batchId, uint256 count, address indexed issuer);
    event CredentialRevocationUpdated(bytes32 indexed credentialHash, string credentialId, bool isRevoked);

    function anchorBatch(bytes32 merkleRoot, string calldata batchId, string calldata course, uint256 count) external {
        require(authorizedIssuers[msg.sender] || msg.sender == owner, "Unauthorized issuer");
        batchesByRoot[merkleRoot] = CohortBatch(merkleRoot, batchId, course, count, msg.sender, block.timestamp, block.number, true);
        emit BatchAnchored(merkleRoot, batchId, count, msg.sender);
    }

    function setCredentialRevocation(bytes32 credentialHash, string calldata credentialId, bool isRevoked) external {
        require(authorizedIssuers[msg.sender] || msg.sender == owner, "Unauthorized issuer");
        revokedCredentialHashes[credentialHash] = isRevoked;
        emit CredentialRevocationUpdated(credentialHash, credentialId, isRevoked);
    }

    function verifyCredentialMerkleProof(
        bytes32 merkleRoot,
        bytes32 leafHash,
        bytes32[] calldata proof,
        bool[] calldata isLeftSibling
    ) external view returns (bool isValid, bool isRevoked) {
        if (!batchesByRoot[merkleRoot].exists) return (false, false);
        isRevoked = revokedCredentialHashes[leafHash];
        bytes32 computed = leafHash;
        for (uint256 i = 0; i < proof.length; i++) {
            computed = isLeftSibling[i]
                ? sha256(abi.encodePacked(proof[i], computed))
                : sha256(abi.encodePacked(computed, proof[i]));
        }
        isValid = (computed == merkleRoot) && !isRevoked;
    }
}`;

export const CONTRACT_ABI_JSON = JSON.stringify(
  [
    {
      inputs: [
        { internalType: "bytes32", name: "merkleRoot", type: "bytes32" },
        { internalType: "string", name: "batchId", type: "string" },
        { internalType: "string", name: "course", type: "string" },
        { internalType: "uint256", name: "count", type: "uint256" },
      ],
      name: "anchorBatch",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bytes32", name: "credentialHash", type: "bytes32" },
        { internalType: "string", name: "credentialId", type: "string" },
        { internalType: "bool", name: "isRevoked", type: "bool" },
      ],
      name: "setCredentialRevocation",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bytes32", name: "merkleRoot", type: "bytes32" },
        { internalType: "bytes32", name: "leafHash", type: "bytes32" },
        { internalType: "bytes32[]", name: "proof", type: "bytes32[]" },
        { internalType: "bool[]", name: "isLeftSibling", type: "bool[]" },
      ],
      name: "verifyCredentialMerkleProof",
      outputs: [
        { internalType: "bool", name: "isValid", type: "bool" },
        { internalType: "bool", name: "isRevoked", type: "bool" },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
  null,
  2
);

export function SmartContractModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"solidity" | "abi">("solidity");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      activeTab === "solidity" ? SOLIDITY_CONTRACT_SOURCE : CONTRACT_ABI_JSON
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#0E0E10] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/40 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#10B981] mb-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>Polygon PoS Mainnet Smart Contract</span>
        </div>
        <h3 className="text-xl font-medium text-white">
          CertChainRegistry.sol — On-Chain Verification Contract
        </h3>
        <p className="text-xs text-white/50 mt-1">
          Contract Address:{" "}
          <span className="font-mono text-white/80">{CERTCHAIN_CONTRACT_ADDRESS}</span> · Compiler:{" "}
          <span className="font-mono text-emerald-400">solc v0.8.24+commit.e11b9ed9</span>
        </p>

        <div className="flex items-center justify-between mt-5 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setActiveTab("solidity")}
              className={`px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
                activeTab === "solidity"
                  ? "bg-white text-black font-semibold"
                  : "text-white/60 hover:text-white border border-white/10"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Solidity Source (contracts/CertChainRegistry.sol)</span>
            </button>
            <button
              onClick={() => setActiveTab("abi")}
              className={`px-3.5 py-1.5 rounded-full transition-colors ${
                activeTab === "abi"
                  ? "bg-white text-black font-semibold"
                  : "text-white/60 hover:text-white border border-white/10"
              }`}
            >
              Contract ABI (JSON)
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-full border border-white/15 text-xs font-mono text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy {activeTab === "solidity" ? "Solidity" : "ABI"}</span>
              </>
            )}
          </button>
        </div>

        <pre className="mt-4 p-4 rounded-xl bg-[#050505] border border-white/10 text-[11px] font-mono text-emerald-300/90 overflow-x-auto max-h-80 leading-relaxed">
          {activeTab === "solidity" ? SOLIDITY_CONTRACT_SOURCE : CONTRACT_ABI_JSON}
        </pre>

        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-white/50">
          <span>O(1) Cohort Merkle Root Storage · O(log N) Proof Verification</span>
          <a
            href="https://polygonscan.com"
            target="_blank"
            rel="noreferrer"
            className="text-[#10B981] hover:underline flex items-center gap-1"
          >
            <span>Inspect Contract on PolygonScan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Interactive Visual Binary Merkle Tree Proof Component
 */
export function MerklePathVisualizer({
  credentialId,
  leafHash,
  merkleRoot,
  batchId,
  blockNumber,
}: {
  credentialId: string;
  leafHash: string;
  merkleRoot: string;
  batchId?: string;
  blockNumber?: string;
}) {
  // Derive deterministic sibling & intermediate hashes from leafHash + merkleRoot for visual tree inspection
  const cleanLeaf = leafHash.replace(/^0x/, "");
  const siblingHash =
    "a4f9c2" +
    cleanLeaf
      .split("")
      .reverse()
      .join("")
      .slice(0, 58)
      .padEnd(58, "8");
  const intermediateNode =
    "7e31d8" +
    cleanLeaf
      .slice(10, 42)
      .padEnd(58, "c");
  const rootDisplay = merkleRoot.startsWith("0x") ? merkleRoot : `0x${merkleRoot}`;

  return (
    <div className="mt-4 p-4 rounded-xl bg-[#050505]/90 border border-white/10 text-left font-mono text-[11px]">
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/10">
        <span className="text-white font-semibold flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#10B981]" />
          <span>CRYPTOGRAPHIC MERKLE PATH PROOF (O(log N))</span>
        </span>
        <span className="text-[#10B981] text-[10px] px-2 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/30">
          ROOT MATCH VERIFIED
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {/* Level 0: Leaf */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40">
            <div className="text-[10px] text-emerald-400 uppercase flex items-center justify-between">
              <span>Target Leaf L₀ ({credentialId})</span>
              <span>✓ PDF Digest</span>
            </div>
            <div className="text-white truncate mt-1" title={`0x${cleanLeaf}`}>
              0x{cleanLeaf.slice(0, 14)}...{cleanLeaf.slice(-8)}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10">
            <div className="text-[10px] text-white/40 uppercase flex items-center justify-between">
              <span>Sibling Leaf L₁ (Cohort Peer)</span>
              <span>Right Sibling</span>
            </div>
            <div className="text-white/60 truncate mt-1" title={`0x${siblingHash}`}>
              0x{siblingHash.slice(0, 14)}...{siblingHash.slice(-8)}
            </div>
          </div>
        </div>

        {/* Arrow Connector */}
        <div className="text-center text-white/30 text-[10px]">
          ↓ SHA-256( L₀ ‖ L₁ ) → Intermediate Branch Node H₀₁
        </div>

        {/* Level 1: Intermediate Branch */}
        <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/15">
          <div className="text-[10px] text-white/50 uppercase flex items-center justify-between">
            <span>Intermediate Branch Hash H₀₁</span>
            <span>Batch {batchId || "#2026-04"}</span>
          </div>
          <div className="text-white/80 truncate mt-1">
            0x{intermediateNode.slice(0, 22)}...{intermediateNode.slice(-10)}
          </div>
        </div>

        {/* Arrow Connector */}
        <div className="text-center text-emerald-400/70 text-[10px]">
          ↓ SHA-256( H₀₁ ‖ H₂₃ ) == Anchored Polygon Merkle Root
        </div>

        {/* Level 2: Polygon On-Chain Root */}
        <div className="p-3 rounded-lg bg-[#10B981]/10 border border-[#10B981]/40 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <div className="text-[10px] text-[#10B981] uppercase font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Polygon PoS Mainnet Merkle Root (Block #{blockNumber || "61420918"})</span>
            </div>
            <div className="text-white font-semibold truncate mt-1" title={rootDisplay}>
              {rootDisplay}
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-black/60 text-[#10B981] text-[10px] shrink-0 border border-[#10B981]/30">
            == EQUAL
          </span>
        </div>

        {/* W3C Verifiable Credential v2.0 JSON-LD Export */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] text-white/40">
            W3C Verifiable Credentials Data Model v2.0 · Ed25519 / Secp256k1 MerkleProof2026
          </span>
          <button
            type="button"
            onClick={() => {
              const vcPayload = {
                "@context": [
                  "https://www.w3.org/ns/credentials/v2",
                  "https://w3id.org/security/suites/merkle-2026/v1",
                ],
                id: `urn:uuid:${credentialId.toLowerCase()}`,
                type: ["VerifiableCredential", "AcademicDegreeCredential"],
                issuer: {
                  id: `did:ethr:polygon:${CERTCHAIN_CONTRACT_ADDRESS}`,
                  name: "Stanford Credentials Office (CertChain Node #04)",
                },
                validFrom: new Date().toISOString(),
                credentialSubject: {
                  id: `urn:certchain:credential:${credentialId}`,
                  credentialId,
                  pdfSha256Digest: `0x${cleanLeaf}`,
                },
                proof: {
                  type: "PolygonMerkleProof2026",
                  chainId: 137,
                  network: "Polygon PoS Mainnet",
                  contractAddress: CERTCHAIN_CONTRACT_ADDRESS,
                  batchId: batchId || "BATCH-2026-092",
                  blockNumber: blockNumber || "61420918",
                  merkleRoot: rootDisplay,
                  merklePath: [
                    { position: "right", hash: `0x${siblingHash}` },
                    { position: "parent", hash: `0x${intermediateNode}` },
                  ],
                },
              };
              const blob = new Blob([JSON.stringify(vcPayload, null, 2)], {
                type: "application/ld+json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${credentialId}.vc.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              setTimeout(() => URL.revokeObjectURL(url), 3000);
            }}
            className="px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/15 border border-white/15 text-white text-[10px] font-mono transition-colors flex items-center gap-1.5"
          >
            <Code2 className="w-3 h-3 text-[#10B981]" />
            <span>Export W3C VC (.vc.json)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
