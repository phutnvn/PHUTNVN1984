import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Chưa xác thực quyền giảng viên." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const assignmentId = searchParams.get("assignmentId");
    const courseId = searchParams.get("courseId");

    const where: any = {};
    if (assignmentId && assignmentId !== "all") where.assignmentId = assignmentId;
    if (courseId && courseId !== "all") where.assignment = { courseId };

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        assignment: {
          include: { course: true },
        },
      },
      orderBy: { submittedAt: "asc" },
    });

    // Generate CSV with UTF-8 BOM
    let csvContent = "\ufeff"; // BOM for Excel
    csvContent += "STT,Mã Biên Nhận,Mã Sinh Viên,Họ và Tên,Lớp,Email,Học Phần,Bài Tập,Tên Tệp Tin,Dung Lượng (KB),Thời Gian Nộp,Hạn Nộp,Trạng Thái Nộp,Trạng Thái Chấm,Điểm Số,Nhận Xét Giảng Viên,Ghi Chú Sinh Viên\r\n";

    submissions.forEach((s, idx) => {
      const escape = (str: string | null | undefined) => {
        if (!str) return '""';
        return `"${str.replace(/"/g, '""')}"`;
      };

      const submittedTime = new Date(s.submittedAt).toLocaleString("vi-VN");
      const deadlineTime = new Date(s.assignment.deadline).toLocaleString("vi-VN");
      const sizeKb = (s.fileSize / 1024).toFixed(1);
      const timingStatus = s.isLate ? "Nộp muộn" : "Đúng hạn";
      const grading =
        s.gradingStatus === "GRADED"
          ? "Đã chấm"
          : s.gradingStatus === "NEEDS_REVISION"
          ? "Cần chỉnh sửa"
          : "Chờ chấm";

      csvContent += [
        idx + 1,
        s.receiptCode,
        s.studentId,
        escape(s.studentName),
        escape(s.studentClass),
        escape(s.studentEmail),
        escape(`${s.assignment.course.code} - ${s.assignment.course.name}`),
        escape(s.assignment.title),
        escape(s.fileOriginalName),
        sizeKb,
        escape(submittedTime),
        escape(deadlineTime),
        timingStatus,
        grading,
        s.score !== null ? s.score : "",
        escape(s.feedback),
        escape(s.notes),
      ].join(",") + "\r\n";
    });

    const fileName = `Danh_Sach_Bai_Nop_${Date.now()}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": "text/csv; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Lỗi xuất danh sách bài nộp." }, { status: 500 });
  }
}
