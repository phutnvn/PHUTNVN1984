import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let profile = await prisma.lecturerProfile.findUnique({
      where: { id: "default" },
    });

    if (!profile) {
      profile = await prisma.lecturerProfile.create({
        data: { id: "default" },
      });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json({ error: "Lỗi tải thông tin giảng viên." }, { status: 500 });
  }
}
