import { NextResponse } from "next/server";
import {
  getStoredCertificates,
  findCertificateByHash,
  findCertificateById,
  updateCertificateHash,
  getCertificateMerkleProof,
} from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get("hash");
  const id = searchParams.get("id");

  if (hash) {
    const cert = findCertificateByHash(hash);
    if (!cert) {
      return NextResponse.json(
        { success: false, error: "Certificate hash not found in on-chain registry" },
        { status: 404 }
      );
    }
    const proofInfo = getCertificateMerkleProof(cert.id);
    return NextResponse.json({
      success: true,
      certificate: cert,
      merkleRoot: proofInfo.merkleRoot,
      merkleProof: proofInfo.proof,
    });
  }

  if (id) {
    const cert = findCertificateById(id);
    if (!cert) {
      return NextResponse.json(
        { success: false, error: "Credential ID not found" },
        { status: 404 }
      );
    }
    const proofInfo = getCertificateMerkleProof(cert.id);
    return NextResponse.json({
      success: true,
      certificate: cert,
      merkleRoot: proofInfo.merkleRoot,
      merkleProof: proofInfo.proof,
    });
  }

  const certificates = getStoredCertificates();
  return NextResponse.json({ success: true, certificates });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, hash } = body;

    if (!id || !hash) {
      return NextResponse.json(
        { success: false, error: "Certificate id and hash are required" },
        { status: 400 }
      );
    }

    const result = updateCertificateHash(id, hash);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      certificate: result.certificate,
      batchRoot: result.batchRoot,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update certificate hash";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

