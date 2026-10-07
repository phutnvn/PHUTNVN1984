import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReceiptCode } from "@/lib/utils";
import fs from "fs";
import path from "path";

const DEFAULT_MAX_MB = 50;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const studentName = (formData.get("studentName") as string)?.trim();
    const studentId = (formData.get("studentId") as string)?.trim();
    const studentClass = (formData.get("studentClass") as string)?.trim();
    const studentEmail = (formData.get("studentEmail") as string)?.trim();
    const assignmentId = (formData.get("assignmentId") as string)?.trim();
    const notes = (formData.get("notes") as string)?.trim() || "";
    const file = formData.get("file") as File | null;

    // 1. Validate required fields
    if (!studentName || !studentId || !studentClass || !studentEmail || !assignmentId || !file) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ các thông tin bắt buộc và đính kèm tệp bài làm." },
        { status: 400 }
      );
    }

    // 2. Validate student email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentEmail)) {
      return NextResponse.json(
        { error: "Địa chỉ email sinh viên không hợp lệ." },
        { status: 400 }
      );
    }

    // 3. Find assignment
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { course: true },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Không tìm thấy bài tập được chỉ định hoặc bài tập đã bị xóa." },
        { status: 404 }
      );
    }

    if (assignment.status === "CLOSED") {
      return NextResponse.json(
        { error: "Bài tập này đã đóng và không còn nhận bài nộp." },
        { status: 400 }
      );
    }

    // 4. Validate file size
    const maxMb = assignment.maxFileSizeMb || DEFAULT_MAX_MB;
    const maxBytes = maxMb * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        {
          error: `Dung lượng tệp vượt quá giới hạn cho phép (${maxMb} MB). Tệp của bạn là ${(
            file.size /
            (1024 * 1024)
          ).toFixed(2)} MB.`,
        },
        { status: 400 }
      );
    }

    // 5. Validate file extension
    const originalName = file.name;
    const fileExt = originalName.split(".").pop()?.toUpperCase() || "";
    const acceptedExtensions = assignment.acceptedFormats
      .split(",")
      .map((ext) => ext.trim().toUpperCase().replace(/^\./, ""));

    if (acceptedExtensions.length > 0 && !acceptedExtensions.includes(fileExt)) {
      return NextResponse.json(
        {
          error: `Định dạng tệp .${fileExt.toLowerCase()} không được chấp nhận. Các định dạng hợp lệ: ${assignment.acceptedFormats}`,
        },
        { status: 400 }
      );
    }

    // 6. Check deadline & lateness based on server time
    const serverNow = new Date();
    const isLate = serverNow > new Date(assignment.deadline);

    // 7. Save file securely into private storage directory
    const storageDir = path.resolve(
      process.cwd(),
      process.env.STORAGE_DIR || "private_storage/submissions"
    );

    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    // Generate safe unique filename
    const receiptCode = generateReceiptCode();
    const sanitizedExt = fileExt ? `.${fileExt.toLowerCase()}` : "";
    const sanitizedBase = studentId.replace(/[^a-zA-Z0-9]/g, "");
    const uniqueFileName = `${receiptCode}_${sanitizedBase}_${Date.now()}${sanitizedExt}`;
    const destinationPath = path.join(storageDir, uniqueFileName);

    // Write file buffer to private disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destinationPath, buffer);

    // 8. Record in database
    const submission = await prisma.submission.create({
      data: {
        receiptCode,
        studentName,
        studentId,
        studentClass,
        studentEmail,
        assignmentId,
        fileName: uniqueFileName,
        fileOriginalName: originalName,
        filePath: destinationPath,
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
        notes,
        submittedAt: serverNow,
        isLate,
        gradingStatus: "PENDING",
      },
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: isLate
        ? "Đã nộp bài thành công (Ghi nhận nộp muộn sau hạn chót)."
        : "Đã nộp bài thành công đúng hạn!",
      receipt: {
        receiptCode: submission.receiptCode,
        studentName: submission.studentName,
        studentId: submission.studentId,
        studentClass: submission.studentClass,
        studentEmail: submission.studentEmail,
        assignmentTitle: submission.assignment.title,
        courseName: `${submission.assignment.course.code} - ${submission.assignment.course.name}`,
        fileName: submission.fileOriginalName,
        fileSize: submission.fileSize,
        submittedAt: submission.submittedAt,
        deadline: submission.assignment.deadline,
        isLate: submission.isLate,
      },
    });
  } catch (error: any) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi trong quá trình tải lên hoặc xử lý bài nộp. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
