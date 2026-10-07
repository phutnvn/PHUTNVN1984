import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      include: {
        course: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ announcements });
  } catch (error) {
    console.error("Announcements API error:", error);
    return NextResponse.json({ error: "Lỗi tải thông báo." }, { status: 500 });
  }
}
