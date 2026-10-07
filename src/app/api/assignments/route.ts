import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        course: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: {
        deadline: "asc",
      },
    });

    return NextResponse.json({ assignments });
  } catch (error) {
    console.error("Assignments API error:", error);
    return NextResponse.json({ error: "Lỗi tải danh sách bài tập." }, { status: 500 });
  }
}
