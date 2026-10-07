import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Chưa xác thực." }, { status: 401 });

    const body = await req.json();
    const { code, name, description, targetStudents, objectives, syllabus, semester, academicYear, isActive } = body;

    if (!code || !name || !description) {
      return NextResponse.json({ error: "Vui lòng nhập mã môn, tên môn và mô tả." }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim(),
        targetStudents: targetStudents?.trim() || null,
        objectives: objectives?.trim() || null,
        syllabus: syllabus?.trim() || null,
        semester: semester?.trim() || "Học kỳ 1",
        academicYear: academicYear?.trim() || "2025 - 2026",
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    console.error("Create course error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Mã môn học này đã tồn tại." }, { status: 400 });
    }
    return NextResponse.json({ error: "Lỗi tạo học phần." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Chưa xác thực." }, { status: 401 });

    const body = await req.json();
    const { id, code, name, description, targetStudents, objectives, syllabus, semester, academicYear, isActive } = body;

    if (!id) return NextResponse.json({ error: "Thiếu ID môn học." }, { status: 400 });

    const course = await prisma.course.update({
      where: { id },
      data: {
        code: code?.trim().toUpperCase(),
        name: name?.trim(),
        description: description?.trim(),
        targetStudents: targetStudents?.trim() || null,
        objectives: objectives?.trim() || null,
        syllabus: syllabus?.trim() || null,
        semester: semester?.trim(),
        academicYear: academicYear?.trim(),
        isActive,
      },
    });

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Update course error:", error);
    return NextResponse.json({ error: "Lỗi cập nhật học phần." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Chưa xác thực." }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Thiếu ID môn học." }, { status: 400 });

    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Đã xóa học phần." });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json({ error: "Lỗi xóa học phần." }, { status: 500 });
  }
}
