import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";
import JSZip from "jszip";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Chưa xác thực quyền giảng viên." }, { status: 401 });
    }

    const body = await req.json();
    const { submissionIds, assignmentId } = body;

    const where: any = {};
    if (Array.isArray(submissionIds) && submissionIds.length > 0) {
      where.id = { in: submissionIds };
    } else if (assignmentId) {
      where.assignmentId = assignmentId;
    } else {
      return NextResponse.json(
        { error: "Vui lòng chọn ít nhất một bài nộp hoặc chọn bài tập để tải về." },
        { status: 400 }
      );
    }

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        assignment: {
          include: { course: true },
        },
      },
    });

    if (submissions.length === 0) {
      return NextResponse.json({ error: "Không tìm thấy bài nộp nào." }, { status: 404 });
    }

    const zip = new JSZip();

    for (const sub of submissions) {
      const fullPath = path.resolve(sub.filePath);
      if (fs.existsSync(fullPath)) {
        const fileData = fs.readFileSync(fullPath);
        // Clean filename for the zip entry: MSSV_HoTen_Receipt_FileName
        const safeStudentName = sub.studentName
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9]/g, "_");
        const safeOriginalName = sub.fileOriginalName.replace(/[^\w\d_.-]/g, "_");
        const zipEntryName = `${sub.studentId}_${safeStudentName}_${sub.receiptCode}_${safeOriginalName}`;

        zip.file(zipEntryName, fileData);
      }
    }

    // Also include a summary CSV / text manifest inside the ZIP!
    let manifestText = `DANH SÁCH BÀI NỘP - XUẤT LÚC: ${new Date().toLocaleString("vi-VN")}\r\n`;
    manifestText += `STT,Mã Biên Nhận,MSSV,Họ và Tên,Lớp,Học Phần,Bài Tập,Thời Gian Nộp,Trạng Thái,Điểm Số\r\n`;

    submissions.forEach((s, idx) => {
      manifestText += `${idx + 1},${s.receiptCode},${s.studentId},"${s.studentName}",${s.studentClass},"${s.assignment.course.code} - ${s.assignment.course.name}","${s.assignment.title}",${new Date(s.submittedAt).toLocaleString("vi-VN")},${s.isLate ? "Nộp muộn" : "Đúng hạn"},${s.score ?? "Chưa chấm"}\r\n`;
    });

    zip.file("00_Danh_Sach_Bai_Nop.csv", "\ufeff" + manifestText);

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    const zipFileName = `BaiNop_SinhVien_${Date.now()}.zip`;

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${zipFileName}"`,
        "Content-Type": "application/zip",
        "Content-Length": zipBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Batch download error:", error);
    return NextResponse.json({ error: "Lỗi tạo tệp ZIP hàng loạt." }, { status: 500 });
  }
}
