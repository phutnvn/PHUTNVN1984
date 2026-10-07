import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { isActive: true },
      include: {
        assignments: {
          select: {
            id: true,
            title: true,
            deadline: true,
            status: true,
          },
        },
        _count: {
          select: {
            assignments: true,
            resources: true,
          },
        },
      },
      orderBy: { code: "asc" },
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Courses API error:", error);
    return NextResponse.json({ error: "Lỗi tải danh sách học phần." }, { status: 500 });
  }
}
