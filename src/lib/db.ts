import fs from "fs";
import path from "path";

export interface PersistentCertificate {
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

export interface PersistentBatch {
  id: string;
  course: string;
  count: number;
  root: string;
  block: string;
  status: "ANCHORED" | "PENDING";
  date: string;
  txHash: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: "BATCH_ANCHORED" | "CREDENTIAL_REVOKED" | "CREDENTIAL_RESTORED" | "PDF_HASH_SYNCED";
  actor: string;
  targetId: string;
  details: string;
}

interface DatabaseSchema {
  batches: PersistentBatch[];
  certificates: PersistentCertificate[];
  auditLogs?: AuditLogEntry[];
}

const DB_FILE = path.join(process.cwd(), "data", "certchain.json");

const INITIAL_DB: DatabaseSchema = {
  batches: [
    {
      id: "BATCH-2026-092",
      course: "B.Tech Computer Science & AI (2026)",
      count: 240,
      root: "0x89f4b62d3a1e94c8b2098e77a102bc45ff72d0b31e9c8a140d38c1192834b7f0",
      block: "61420918",
      status: "ANCHORED",
      date: "Oct 12, 2026",
      txHash: "0x5c72e94b812ef9481920384b1209348bc48209418294018294819204882ea814",
    },
    {
      id: "BATCH-2026-091",
      course: "Executive Data Science Masters",
      count: 85,
      root: "0x32e1a89c92bfa04412ef8941098cbef320914c81048b99182049814bf994812a",
      block: "61380410",
      status: "ANCHORED",
      date: "Oct 05, 2026",
      txHash: "0x4a82b01938fc10948b209418294018294819204882ea814018294819204882ea",
    },
    {
      id: "BATCH-2026-090",
      course: "Full-Stack Web3 Fellowship",
      count: 150,
      root: "0x17c0948b812ef9481920384b1209348bc48209418294018294819204882ea814",
      block: "61290114",
      status: "ANCHORED",
      date: "Sep 28, 2026",
      txHash: "0x7d94e81a38fc10948b209418294018294819204882ea814018294819204882ea",
    },
  ],
  certificates: [
    {
      id: "CC-2026-94812",
      name: "Sarah M. Jenkins",
      email: "sarah.jenkins@alumni.stanford.edu",
      course: "Advanced Distributed Systems & Applied Cryptography",
      grade: "Summa Cum Laude (GPA 4.0)",
      issueDate: "Oct 08, 2026",
      status: "ACTIVE",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      batchId: "BATCH-2026-092",
      blockNumber: "61420918",
    },
    {
      id: "CC-2026-94813",
      name: "Alexander Vance",
      email: "avance@alumni.stanford.edu",
      course: "B.Tech Computer Science & AI (2026)",
      grade: "First Class with Distinction",
      issueDate: "Oct 12, 2026",
      status: "ACTIVE",
      hash: "7d94e81a38fc10948b209418294018294819204882ea814018294819204882ea",
      batchId: "BATCH-2026-092",
      blockNumber: "61420918",
    },
    {
      id: "CC-2026-94814",
      name: "Maya Lin Chen",
      email: "m.chen@alumni.stanford.edu",
      course: "B.Tech Computer Science & AI (2026)",
      grade: "Magna Cum Laude",
      issueDate: "Oct 12, 2026",
      status: "ACTIVE",
      hash: "4a82b01938fc10948b209418294018294819204882ea814018294819204882ea",
      batchId: "BATCH-2026-092",
      blockNumber: "61420918",
    },
    {
      id: "CC-2026-94815",
      name: "Devon M. Reynolds",
      email: "devon.reynolds@alumni.stanford.edu",
      course: "B.Tech Computer Science & AI (2026)",
      grade: "Honors Distinction",
      issueDate: "Oct 12, 2026",
      status: "REVOKED",
      hash: "89fcb1048b209418294018294819204882ea814018294819204882ea38fc1094",
      batchId: "BATCH-2026-092",
      blockNumber: "61420918",
    },
  ],
};

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const dataDir = path.dirname(DB_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), "utf-8");
      return INITIAL_DB;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file:", err);
    return INITIAL_DB;
  }
}

function writeDb(data: DatabaseSchema): boolean {
  try {
    const dataDir = path.dirname(DB_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing database file:", err);
    return false;
  }
}

// Queries
export function getStoredBatches(): PersistentBatch[] {
  const db = readDb();
  return db.batches;
}

export function getStoredAuditLogs(): AuditLogEntry[] {
  const db = readDb();
  return (
    db.auditLogs || [
      {
        id: "AUDIT-2026-003",
        timestamp: "Oct 12, 2026 · 14:22 UTC",
        action: "CREDENTIAL_REVOKED",
        actor: "admin@stanford.edu",
        targetId: "CC-2026-94815",
        details: "Revoked credential for Devon M. Reynolds on Polygon Registry",
      },
      {
        id: "AUDIT-2026-002",
        timestamp: "Oct 12, 2026 · 09:15 UTC",
        action: "BATCH_ANCHORED",
        actor: "admin@stanford.edu",
        targetId: "BATCH-2026-092",
        details: "Anchored 240 credentials (B.Tech CS & AI) in Block #61,420,918",
      },
      {
        id: "AUDIT-2026-001",
        timestamp: "Oct 05, 2026 · 11:04 UTC",
        action: "BATCH_ANCHORED",
        actor: "admin@stanford.edu",
        targetId: "BATCH-2026-091",
        details: "Anchored 85 credentials (Executive Data Science) in Block #61,380,410",
      },
    ]
  );
}

function appendAuditEntry(
  db: DatabaseSchema,
  action: AuditLogEntry["action"],
  actor: string,
  targetId: string,
  details: string
) {
  if (!db.auditLogs) {
    db.auditLogs = getStoredAuditLogs();
  }
  const nowStr = new Date().toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  db.auditLogs.unshift({
    id: "AUDIT-" + Math.floor(10000 + Math.random() * 90000),
    timestamp: nowStr,
    action,
    actor,
    targetId,
    details,
  });
}

export function saveNewBatch(
  batch: PersistentBatch,
  certs: PersistentCertificate[],
  actor = "admin@stanford.edu"
): boolean {
  const db = readDb();
  db.batches.unshift(batch);
  db.certificates.unshift(...certs);
  appendAuditEntry(
    db,
    "BATCH_ANCHORED",
    actor,
    batch.id,
    `Anchored ${batch.count} credential(s) (${batch.course}) in Block #${Number(batch.block).toLocaleString()}`
  );
  return writeDb(db);
}

export function getStoredCertificates(): PersistentCertificate[] {
  const db = readDb();
  return db.certificates;
}

export function findCertificateByHash(hash: string): PersistentCertificate | null {
  const db = readDb();
  const cleanHash = hash.replace(/^0x/i, "").toLowerCase();
  return (
    db.certificates.find((c) => c.hash.replace(/^0x/i, "").toLowerCase() === cleanHash) || null
  );
}

export function findCertificateById(id: string): PersistentCertificate | null {
  const db = readDb();
  return db.certificates.find((c) => c.id.toLowerCase() === id.toLowerCase()) || null;
}

import { buildMerkleTree, getMerkleProof, MerkleProofItem } from "./merkle";

export function toggleCertificateRevocation(
  id: string,
  actor = "admin@stanford.edu"
): { success: boolean; newStatus?: string } {
  const db = readDb();
  const cert = db.certificates.find((c) => c.id.toLowerCase() === id.toLowerCase());
  if (!cert) return { success: false };

  cert.status = cert.status === "ACTIVE" ? "REVOKED" : "ACTIVE";
  appendAuditEntry(
    db,
    cert.status === "REVOKED" ? "CREDENTIAL_REVOKED" : "CREDENTIAL_RESTORED",
    actor,
    cert.id,
    `${cert.status === "REVOKED" ? "Revoked" : "Restored"} credential for ${cert.name} (${cert.course})`
  );
  writeDb(db);
  return { success: true, newStatus: cert.status };
}

export function updateCertificateHash(
  id: string,
  newHash: string,
  actor = "admin@stanford.edu"
): { success: boolean; certificate?: PersistentCertificate; batchRoot?: string } {
  const db = readDb();
  const cert = db.certificates.find((c) => c.id.toLowerCase() === id.toLowerCase());
  if (!cert) return { success: false };

  const clean = newHash.replace(/^0x/i, "").toLowerCase();
  const changed = cert.hash !== clean;
  cert.hash = clean;

  // Recompute batch Merkle root from all certificates belonging to this batch
  const batchCerts = db.certificates.filter((c) => c.batchId === cert.batchId);
  let updatedRoot: string | undefined;
  if (batchCerts.length > 0) {
    const { root } = buildMerkleTree(batchCerts.map((c) => c.hash));
    updatedRoot = root;
    const batch = db.batches.find((b) => b.id === cert.batchId);
    if (batch) {
      batch.root = root;
    }
  }

  if (changed) {
    appendAuditEntry(
      db,
      "PDF_HASH_SYNCED",
      actor,
      cert.id,
      `Synced official PDF SHA-256 digest (0x${clean.slice(0, 10)}...) for ${cert.name}`
    );
  }

  writeDb(db);
  return { success: true, certificate: cert, batchRoot: updatedRoot };
}

export function getCertificateMerkleProof(certId: string): {
  merkleRoot: string;
  proof: MerkleProofItem[];
} {
  const db = readDb();
  const cert = db.certificates.find((c) => c.id.toLowerCase() === certId.toLowerCase());
  if (!cert) {
    return { merkleRoot: "0x0", proof: [] };
  }

  const batchCerts = db.certificates.filter((c) => c.batchId === cert.batchId);
  const leaves = batchCerts.map((c) => c.hash);
  const index = batchCerts.findIndex((c) => c.id.toLowerCase() === certId.toLowerCase());
  const { root } = buildMerkleTree(leaves);
  const proof = index >= 0 ? getMerkleProof(leaves, index) : [];

  return {
    merkleRoot: root,
    proof,
  };
}

