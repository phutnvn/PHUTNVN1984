import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Chưa xác thực." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim().toLowerCase();
    const assignmentId = searchParams.get("assignmentId");
    const courseId = searchParams.get("courseId");
    const status = searchParams.get("status"); // PENDING, GRADED, NEEDS_REVISION
    const timing = searchParams.get("timing"); // on_time, late

    const where: any = {};

    if (assignmentId && assignmentId !== "all") {
      where.assignmentId = assignmentId;
    }

    if (courseId && courseId !== "all") {
      where.assignment = {
        ...(where.assignment || {}),
        courseId: courseId,
      };
    }

    if (status && status !== "all") {
      where.gradingStatus = status;
    }

    if (timing === "late") {
      where.isLate = true;
    } else if (timing === "on_time") {
      where.isLate = false;
    }

    if (search) {
      where.OR = [
        { studentName: { contains: search } },
        { studentId: { contains: search } },
        { studentClass: { contains: search } },
        { receiptCode: { contains: search } },
        { studentEmail: { contains: search } },
      ];
    }

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Admin submissions error:", error);
    return NextResponse.json({ error: "Lỗi tải danh sách bài nộp." }, { status: 500 });
  }
}
