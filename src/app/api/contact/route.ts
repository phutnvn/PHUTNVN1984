import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, subject, content } = body;

    if (!fullName || !email || !subject || !content) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ họ tên, email, chủ đề và nội dung tin nhắn." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Địa chỉ email không hợp lệ." },
        { status: 400 }
      );
    }

    const contactMsg = await prisma.contactMessage.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim(),
        subject: subject.trim(),
        content: content.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tin nhắn của bạn đã được gửi thành công đến giảng viên. Cảm ơn bạn!",
      id: contactMsg.id,
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Không thể gửi tin nhắn lúc này. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
