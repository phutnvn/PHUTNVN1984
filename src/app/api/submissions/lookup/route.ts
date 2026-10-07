import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const studentId = body.studentId?.trim();
    const queryKey = body.queryKey?.trim(); // receiptCode OR studentEmail

    if (!studentId || !queryKey) {
      return NextResponse.json(
        { error: "Vui lòng nhập Mã sinh viên (MSSV) và Mã biên nhận (hoặc Email đã dùng khi nộp bài)." },
        { status: 400 }
      );
    }

    // Lookup submissions where studentId matches and (receiptCode matches OR studentEmail matches)
    const submissions = await prisma.submission.findMany({
      where: {
        studentId: studentId,
        OR: [
          { receiptCode: { equals: queryKey } },
          { studentEmail: { equals: queryKey } },
        ],
      },
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

    if (!submissions || submissions.length === 0) {
      return NextResponse.json(
        {
          error: "Không tìm thấy bài nộp nào phù hợp với thông tin đã cung cấp. Vui lòng kiểm tra lại MSSV và Mã biên nhận.",
        },
        { status: 404 }
      );
    }

    // Return sanitized data (protect sensitive server paths)
    const results = submissions.map((sub) => ({
      id: sub.id,
      receiptCode: sub.receiptCode,
      studentName: sub.studentName,
      studentId: sub.studentId,
      studentClass: sub.studentClass,
      assignmentTitle: sub.assignment.title,
      courseName: `${sub.assignment.course.code} - ${sub.assignment.course.name}`,
      fileOriginalName: sub.fileOriginalName,
      fileSize: sub.fileSize,
      submittedAt: sub.submittedAt,
      deadline: sub.assignment.deadline,
      isLate: sub.isLate,
      gradingStatus: sub.gradingStatus,
      score: sub.score,
      feedback: sub.feedback,
      notes: sub.notes,
    }));

    return NextResponse.json({
      success: true,
      submissions: results,
    });
  } catch (error) {
    console.error("Lookup error:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi tra cứu dữ liệu. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
