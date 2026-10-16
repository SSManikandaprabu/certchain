import { computeSha256 } from "./pdfExtractor";

export interface CertificatePdfPayload {
  id: string;
  name: string;
  course: string;
  grade: string;
  issueDate: string;
  institution?: string;
  blockNumber?: string;
}

function escapePdfText(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

/**
 * Generates a deterministic, valid PDF 1.4 binary document (Landscape 792x612 pt)
 * with vector borders, obsidian background, and uncompressed text streams so PDF.js
 * renders a crisp visual preview and extracts 100% accurate metadata.
 */
export function generateDeterministicCertificatePdfBytes(
  cert: CertificatePdfPayload
): Uint8Array {
  const institution = cert.institution || "Stanford Credentials Office";
  const blockNum = cert.blockNumber
    ? cert.blockNumber.replace(/^#/, "")
    : "61,420,918";
  const verifyUrl = `http://localhost:3000/verify?id=${cert.id}`;

  // Construct PDF page content stream (Landscape 792 x 612)
  const contentLines: string[] = [
    // Deep Obsidian background (#0A0A0D)
    "0.04 0.04 0.05 rg",
    "0 0 792 612 re f",
    // Outer border (subtle white/gray)
    "1 w",
    "0.22 0.22 0.25 RG",
    "28 28 736 556 re S",
    // Inner accent border (Emerald #10B981)
    "1.5 w",
    "0.063 0.725 0.506 RG",
    "38 38 716 536 re S",
    // Top header accent bar
    "0.063 0.725 0.506 rg",
    "38 566 716 8 re f",

    // Institution Header
    "BT",
    "/F2 13 Tf",
    "0.063 0.725 0.506 rg",
    `72 520 Td (${escapePdfText(institution.toUpperCase())}) Tj`,
    "ET",

    // Subtitle
    "BT",
    "/F1 11 Tf",
    "0.65 0.65 0.68 rg",
    "72 496 Td (POLYGON LAYER-2 CRYPTOGRAPHIC CREDENTIAL REGISTRY) Tj",
    "ET",

    // Main Certificate Heading
    "BT",
    "/F2 26 Tf",
    "0.98 0.98 0.98 rg",
    "72 440 Td (Certificate of Achievement & Competency) Tj",
    "ET",

    // Presented to label
    "BT",
    "/F1 12 Tf",
    "0.65 0.65 0.68 rg",
    "72 395 Td (This is to certify that) Tj",
    "ET",

    // Recipient Name (Largest font size so PDF.js heuristic & human eyes see it immediately)
    "BT",
    "/F2 34 Tf",
    "1 1 1 rg",
    `72 348 Td (${escapePdfText(cert.name)}) Tj`,
    "ET",

    // Completion text
    "BT",
    "/F1 12 Tf",
    "0.65 0.65 0.68 rg",
    "72 308 Td (has successfully completed the academic requirements for) Tj",
    "ET",

    // Course / Program Title
    "BT",
    "/F2 20 Tf",
    "0.063 0.725 0.506 rg",
    `72 272 Td (${escapePdfText(cert.course)}) Tj`,
    "ET",

    // Grade / Honors
    "BT",
    "/F1 13 Tf",
    "0.88 0.88 0.90 rg",
    `72 240 Td (Honors / Classification: ${escapePdfText(cert.grade)}) Tj`,
    "ET",

    // Divider line
    "0.5 w",
    "0.20 0.20 0.24 RG",
    "72 195 m 720 195 l S",

    // Metadata Footer Left
    "BT",
    "/F3 11 Tf",
    "0.85 0.85 0.88 rg",
    `72 160 Td (Credential ID: ${escapePdfText(cert.id)}) Tj`,
    "ET",

    "BT",
    "/F3 11 Tf",
    "0.85 0.85 0.88 rg",
    `72 140 Td (Issued: ${escapePdfText(cert.issueDate)}) Tj`,
    "ET",

    "BT",
    "/F3 10 Tf",
    "0.063 0.725 0.506 rg",
    `72 118 Td (Polygon PoS Mainnet Anchor Block: #${escapePdfText(blockNum)}) Tj`,
    "ET",

    "BT",
    "/F3 9 Tf",
    "0.55 0.55 0.60 rg",
    `72 82 Td (Verify Online: ${escapePdfText(verifyUrl)}) Tj`,
    "ET",
  ];

  const streamContent = contentLines.join("\n");
  const streamBytesLength = new TextEncoder().encode(streamContent).length;

  const objects: string[] = [
    // 1: Catalog
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    // 2: Pages
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    // 3: Page
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 792 612] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> >> >>\nendobj\n",
    // 4: Page Contents Stream
    `4 0 obj\n<< /Length ${streamBytesLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
    // 5: Font F1 (Helvetica)
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    // 6: Font F2 (Helvetica-Bold)
    "6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n",
    // 7: Font F3 (Courier)
    "7 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\nendobj\n",
  ];

  let pdfText = "%PDF-1.4\n";
  const offsets: number[] = [];

  for (const obj of objects) {
    offsets.push(pdfText.length);
    pdfText += obj;
  }

  const xrefStart = pdfText.length;
  pdfText += `xref\n0 ${objects.length + 1}\n`;
  pdfText += "0000000000 65535 f \n";
  for (const offset of offsets) {
    pdfText += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }

  pdfText += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new TextEncoder().encode(pdfText);
}

/**
 * Generates the official PDF certificate, computes its exact SHA-256 byte hash,
 * syncs the hash to the persistent registry (`PATCH /api/certificates`),
 * and triggers a browser file download.
 */
export async function downloadAndSyncCertificatePdf(
  cert: CertificatePdfPayload
): Promise<{ sha256Hash: string; fileName: string }> {
  const pdfBytes = generateDeterministicCertificatePdfBytes(cert);
  const sha256Hash = await computeSha256(pdfBytes.buffer as ArrayBuffer);

  // Sync the exact PDF byte hash with the persistent database so dropping this PDF into /verify matches 100%
  try {
    await fetch("/api/certificates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: cert.id,
        hash: sha256Hash,
      }),
    });
  } catch (err) {
    console.warn("Could not sync PDF hash to server:", err);
  }

  const cleanName = cert.name.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "");
  const fileName = `${cleanName}_${cert.id}.pdf`;

  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);

  return { sha256Hash, fileName };
}
