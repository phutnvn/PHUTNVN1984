import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Chưa xác thực." }, { status: 401 });
    }

    const submissionId = params.id;
    const body = await req.json();
    const { score, feedback, gradingStatus } = body;

    const parsedScore = score === "" || score === null || score === undefined ? null : parseFloat(score);

    const updated = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        score: parsedScore,
        feedback: feedback ? String(feedback).trim() : null,
        gradingStatus: gradingStatus || (parsedScore !== null ? "GRADED" : "PENDING"),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Đã cập nhật điểm số và nhận xét thành công.",
      submission: updated,
    });
  } catch (error) {
    console.error("Grading error:", error);
    return NextResponse.json({ error: "Lỗi cập nhật điểm bài nộp." }, { status: 500 });
  }
}
