import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const fileType = searchParams.get("fileType");
    const q = searchParams.get("q")?.toLowerCase();

    const where: any = {};

    if (courseId && courseId !== "all") {
      where.courseId = courseId;
    }

    if (fileType && fileType !== "all") {
      where.fileType = fileType.toUpperCase();
    }

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
      ];
    }

    const resources = await prisma.resource.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ resources });
  } catch (error) {
    console.error("Resources API error:", error);
    return NextResponse.json({ error: "Lỗi tải danh mục tài liệu." }, { status: 500 });
  }
}
