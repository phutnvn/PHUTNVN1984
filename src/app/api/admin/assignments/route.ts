import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Chưa xác thực." }, { status: 401 });

    const body = await req.json();
    const { title, courseId, description, requirements, deadline, acceptedFormats, maxFileSizeMb, status } = body;

    if (!title || !courseId || !description || !deadline) {
      return NextResponse.json({ error: "Vui lòng điền đủ các thông tin bắt buộc." }, { status: 400 });
    }

    const assignment = await prisma.assignment.create({
      data: {
        title: title.trim(),
        courseId,
        description: description.trim(),
        requirements: requirements?.trim() || null,
        deadline: new Date(deadline),
        acceptedFormats: acceptedFormats?.trim() || "PDF,DOCX,ZIP",
        maxFileSizeMb: maxFileSizeMb ? parseInt(maxFileSizeMb, 10) : 50,
        status: status || "OPEN",
      },
    });

    return NextResponse.json({ success: true, assignment });
  } catch (error) {
    console.error("Create assignment error:", error);
    return NextResponse.json({ error: "Lỗi tạo bài tập." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Chưa xác thực." }, { status: 401 });

    const body = await req.json();
    const { id, title, courseId, description, requirements, deadline, acceptedFormats, maxFileSizeMb, status } = body;

    if (!id) return NextResponse.json({ error: "Thiếu ID bài tập." }, { status: 400 });

    const assignment = await prisma.assignment.update({
      where: { id },
      data: {
        title: title?.trim(),
        courseId,
        description: description?.trim(),
        requirements: requirements?.trim() || null,
        deadline: deadline ? new Date(deadline) : undefined,
        acceptedFormats: acceptedFormats?.trim(),
        maxFileSizeMb: maxFileSizeMb ? parseInt(maxFileSizeMb, 10) : undefined,
        status,
      },
    });

    return NextResponse.json({ success: true, assignment });
  } catch (error) {
    console.error("Update assignment error:", error);
    return NextResponse.json({ error: "Lỗi cập nhật bài tập." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Chưa xác thực." }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Thiếu ID bài tập." }, { status: 400 });

    await prisma.assignment.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Đã xóa bài tập." });
  } catch (error) {
    console.error("Delete assignment error:", error);
    return NextResponse.json({ error: "Lỗi xóa bài tập." }, { status: 500 });
  }
}
