import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submissionId = params.id;
    const { searchParams } = new URL(req.url);
    const receiptCodeParam = searchParams.get("receiptCode");

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { assignment: true },
    });

    if (!submission) {
      return NextResponse.json({ error: "Không tìm thấy bài nộp." }, { status: 404 });
    }

    // Check authorization:
    // 1. Either user is an authenticated lecturer / admin
    const session = await getSessionUserFromRequest(req);
    const isLecturer = !!session && (session.role === "LECTURER" || session.role === "ADMIN");

    // 2. Or the requester provides the matching receipt code
    const isOwner = receiptCodeParam && receiptCodeParam === submission.receiptCode;

    if (!isLecturer && !isOwner) {
      return NextResponse.json(
        { error: "Truy cập bị từ chối. Bạn không có quyền tải tệp này." },
        { status: 403 }
      );
    }

    // Resolve file path
    const filePath = path.resolve(submission.filePath);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Tệp tin không tồn tại trên hệ thống lưu trữ hoặc đã bị di chuyển." },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);
    const encodedFileName = encodeURIComponent(submission.fileOriginalName);

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename*=UTF-8''${encodedFileName}`,
        "Content-Type": submission.mimeType || "application/octet-stream",
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Lỗi tải tệp tin." }, { status: 500 });
  }
}
