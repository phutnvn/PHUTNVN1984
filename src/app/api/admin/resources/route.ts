import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Chưa xác thực." }, { status: 401 });

    const body = await req.json();
    const { title, description, courseId, fileType, fileUrl, isRestricted } = body;

    if (!title || !fileType || !fileUrl) {
      return NextResponse.json({ error: "Vui lòng nhập tên tài liệu, loại tệp và đường dẫn." }, { status: 400 });
    }

    const resource = await prisma.resource.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        courseId: courseId && courseId !== "none" ? courseId : null,
        fileType: fileType.toUpperCase(),
        fileUrl: fileUrl.trim(),
        isRestricted: !!isRestricted,
      },
    });

    return NextResponse.json({ success: true, resource });
  } catch (error) {
    console.error("Create resource error:", error);
    return NextResponse.json({ error: "Lỗi thêm tài liệu." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Chưa xác thực." }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Thiếu ID tài liệu." }, { status: 400 });

    await prisma.resource.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Đã xóa tài liệu." });
  } catch (error) {
    console.error("Delete resource error:", error);
    return NextResponse.json({ error: "Lỗi xóa tài liệu." }, { status: 500 });
  }
}
