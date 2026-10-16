import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toggleCertificateRevocation, findCertificateById, getStoredAuditLogs } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Institutional login required to revoke credentials" },
      { status: 401 }
    );
  }

  const { id } = params;
  const result = toggleCertificateRevocation(id, session.user.email || "admin@stanford.edu");

  if (!result.success) {
    return NextResponse.json({ success: false, error: "Certificate not found" }, { status: 404 });
  }

  const updatedCert = findCertificateById(id);
  const auditLogs = getStoredAuditLogs();
  return NextResponse.json({
    success: true,
    status: result.newStatus,
    certificate: updatedCert,
    auditLogs,
  });
}
