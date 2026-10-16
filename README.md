# 🛡️ CertChain — Polygon Layer-2 Academic Credentialing & Cryptographic Verification Platform

🌐 **Live Production Deployment**: **[https://certchain-six.vercel.app/](https://certchain-six.vercel.app/)**
- **Public Verification Gateway**: [https://certchain-six.vercel.app/verify](https://certchain-six.vercel.app/verify)
- **Graduate Credential Wallet**: [https://certchain-six.vercel.app/wallet](https://certchain-six.vercel.app/wallet)
- **Enterprise REST API Playground**: [https://certchain-six.vercel.app/docs](https://certchain-six.vercel.app/docs)
- **Master Admin Console**: [https://certchain-six.vercel.app/dashboard](https://certchain-six.vercel.app/dashboard) *(Login at [/login](https://certchain-six.vercel.app/login) with 1-Click Demo Credentials)*

**CertChain** is an enterprise B2B SaaS academic credentialing platform and public verification gateway anchored on **Polygon PoS Layer-2**. It empowers universities to issue tamper-proof digital diplomas in bulk via **SHA-256 Binary Merkle Trees** and enables employers worldwide to verify any PDF certificate in under 2 seconds with zero accounts, zero server uploads, and 100% immunity to AI forgery.

---

## ✨ Key Features

### 1. Unified Master Admin Control Center (`/dashboard`)
- **All-in-One Single Dashboard**: Manage credentials, preview embossed diplomas, inspect Merkle proofs, run bulk PDF verification audits, inspect the Solidity smart contract, and review governance logs from one screen.
- **Bulk CSV & PDF Cohort Anchoring**: Upload a graduate CSV spreadsheet or individual PDF, compute individual SHA-256 digests, pair leaves into a binary Merkle tree (`src/lib/merkle.ts`), and commit a single 32-byte Merkle Root (`0x...`) to Polygon.
- **10-Second Inline Quick Issuance**: Mint and anchor an individual student credential on the spot without preparing a CSV.
- **1-Click On-Chain Revocation**: Instantly revoke or restore any credential (`POST /api/certificates/[id]/revoke`) with immediate global enforcement on `/verify`.
- **MetaMask / EIP-1193 Web3 Signing**: Sign batch Merkle roots cryptographically via `personal_sign` or the built-in Institutional Relayer Node.
- **Cryptographic Governance Audit Log & CSV Export**: Chronological ledger of every batch anchor, revocation, and PDF hash sync, plus 1-click full registry CSV export.

### 2. Zero-Trust Public Verification Gateway (`/verify`)
- **100% Client-Side SHA-256 Hashing**: Candidate PDFs are hashed directly in browser RAM via the Web Crypto API (`crypto.subtle.digest("SHA-256", ...)`). Files never leave the verifier's device.
- **Strict Anti-Forgery & AI-Fake Rejection**: Any unanchored PDF, byte-modified PDF, or AI-generated certificate produces a completely different SHA-256 digest and is strictly flagged as `UNREGISTERED / FORGED DOCUMENT`.
- **Direct Credential ID Lookup & Shareable URLs**: Instant verification via Credential ID (`CC-2026-94812`) or auto-verifying links (`/verify?id=CC-2026-94812`).
- **Bulk Multi-PDF Verification Scorecard**: Upload multiple candidate PDFs simultaneously or run a 1-click full-registry cryptographic audit.

### 3. Graduate Digital Credential Wallet (`/wallet`)
- **Self-Service Academic Passport**: Graduates filter by their email or Credential ID to view their embossed digital diploma, download their official verifiable PDF (`src/lib/pdfGenerator.ts`), generate a scannable **QR Code Badge**, or click **Add to LinkedIn Profile** (`src/components/QrCodeModal.tsx`).

### 4. Production Solidity Smart Contract (`contracts/CertChainRegistry.sol`)
- Includes the complete Solidity `^0.8.24` smart contract (`anchorBatch`, `setCredentialRevocation`, `verifyCredentialMerkleProof`) with an interactive **Smart Contract & ABI Inspector Modal** built directly into the UI.

---

## 🏗️ Architecture & Tech Stack

- **Frontend & API**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion
- **Authentication**: NextAuth.js (`JWT` session strategy + Next.js Edge Middleware protecting `/dashboard` and write APIs)
- **Cryptography**: Web Crypto API (`SHA-256`), Binary Merkle Tree Engine (`src/lib/merkle.ts`), EIP-191 / EIP-1193 Web3 Signatures
- **PDF Engine**: Deterministic PDF 1.4 Generator (`src/lib/pdfGenerator.ts`) + `pdfjs-dist` & `tesseract.js` OCR Extractor (`src/lib/pdfExtractor.ts`)
- **Blockchain**: Solidity `^0.8.24` (`contracts/CertChainRegistry.sol`) + Live Polygon PoS Mainnet RPC (`https://polygon-rpc.com`)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Or build and start production server
npm run build
npm run start
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser:
- **Landing Page**: `http://localhost:3000`
- **Public Verification Gateway**: `http://localhost:3000/verify`
- **Graduate Credential Wallet**: `http://localhost:3000/wallet`
- **University Admin Console**: `http://localhost:3000/dashboard` *(Login at `/login` using the 1-Click Demo Credentials button)*
