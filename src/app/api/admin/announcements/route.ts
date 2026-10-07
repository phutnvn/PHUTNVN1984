import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Chưa xác thực." }, { status: 401 });

    const body = await req.json();
    const { title, content, courseId, isPinned } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Vui lòng nhập tiêu đề và nội dung thông báo." }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        courseId: courseId && courseId !== "none" ? courseId : null,
        isPinned: !!isPinned,
      },
    });

    return NextResponse.json({ success: true, announcement });
  } catch (error) {
    console.error("Create announcement error:", error);
    return NextResponse.json({ error: "Lỗi tạo thông báo." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Chưa xác thực." }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Thiếu ID thông báo." }, { status: 400 });

    await prisma.announcement.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Đã xóa thông báo." });
  } catch (error) {
    console.error("Delete announcement error:", error);
    return NextResponse.json({ error: "Lỗi xóa thông báo." }, { status: 500 });
  }
}
