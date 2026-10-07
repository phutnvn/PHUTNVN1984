import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Chưa xác thực." }, { status: 401 });
    }

    const [
      totalCourses,
      openAssignments,
      totalSubmissions,
      unreviewedSubmissions,
      lateSubmissions,
      recentSubmissions,
      coursesWithSubmissions,
      unreadMessagesCount,
    ] = await Promise.all([
      prisma.course.count({ where: { isActive: true } }),
      prisma.assignment.count({ where: { status: { in: ["OPEN", "CLOSING_SOON"] } } }),
      prisma.submission.count(),
      prisma.submission.count({ where: { gradingStatus: "PENDING" } }),
      prisma.submission.count({ where: { isLate: true } }),
      prisma.submission.findMany({
        take: 8,
        orderBy: { submittedAt: "desc" },
        include: {
          assignment: {
            include: { course: true },
          },
        },
      }),
      prisma.course.findMany({
        select: {
          id: true,
          code: true,
          name: true,
          assignments: {
            select: {
              _count: {
                select: { submissions: true },
              },
            },
          },
        },
      }),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

    // Aggregate submissions by course
    const courseStats = coursesWithSubmissions.map((c) => {
      const submissionsCount = c.assignments.reduce(
        (acc, curr) => acc + curr._count.submissions,
        0
      );
      return {
        id: c.id,
        code: c.code,
        name: c.name,
        submissionsCount,
      };
    });

    return NextResponse.json({
      totalCourses,
      openAssignments,
      totalSubmissions,
      unreviewedSubmissions,
      lateSubmissions,
      unreadMessagesCount,
      recentSubmissions,
      courseStats,
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json({ error: "Lỗi thống kê dữ liệu." }, { status: 500 });
  }
}
