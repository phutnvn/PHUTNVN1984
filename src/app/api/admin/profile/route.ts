import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const profile = await prisma.lecturerProfile.findUnique({
      where: { id: "default" },
    });
    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tải thông tin." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Chưa xác thực." }, { status: 401 });

    const body = await req.json();
    const {
      fullName,
      title,
      tagline,
      email,
      phone,
      workplace,
      officeLocation,
      bio,
      educationJson,
      researchJson,
      teachingExpJson,
      activitiesJson,
      socialLinksJson,
      avatarUrl,
    } = body;

    const updated = await prisma.lecturerProfile.upsert({
      where: { id: "default" },
      update: {
        fullName,
        title,
        tagline,
        email,
        phone,
        workplace,
        officeLocation,
        bio,
        educationJson: typeof educationJson === "string" ? educationJson : JSON.stringify(educationJson),
        researchJson: typeof researchJson === "string" ? researchJson : JSON.stringify(researchJson),
        teachingExpJson: typeof teachingExpJson === "string" ? teachingExpJson : JSON.stringify(teachingExpJson),
        activitiesJson: typeof activitiesJson === "string" ? activitiesJson : JSON.stringify(activitiesJson),
        socialLinksJson: typeof socialLinksJson === "string" ? socialLinksJson : JSON.stringify(socialLinksJson),
        avatarUrl,
      },
      create: {
        id: "default",
        fullName,
        title,
        tagline,
        email,
        phone,
        workplace,
        officeLocation,
        bio,
        educationJson: typeof educationJson === "string" ? educationJson : JSON.stringify(educationJson),
        researchJson: typeof researchJson === "string" ? researchJson : JSON.stringify(researchJson),
        teachingExpJson: typeof teachingExpJson === "string" ? teachingExpJson : JSON.stringify(teachingExpJson),
        activitiesJson: typeof activitiesJson === "string" ? activitiesJson : JSON.stringify(activitiesJson),
        socialLinksJson: typeof socialLinksJson === "string" ? socialLinksJson : JSON.stringify(socialLinksJson),
        avatarUrl,
      },
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Lỗi lưu thông tin giảng viên." }, { status: 500 });
  }
}
