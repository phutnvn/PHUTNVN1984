import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";

export const revalidate = 0;

export default async function AboutPage() {
  const profile = await prisma.lecturerProfile.findUnique({
    where: { id: "default" },
  });

  const education = profile?.educationJson ? JSON.parse(profile.educationJson) : [];
  const research = profile?.researchJson ? JSON.parse(profile.researchJson) : [];
  const teachingExp = profile?.teachingExpJson ? JSON.parse(profile.teachingExpJson) : [];
  const activities = profile?.activitiesJson ? JSON.parse(profile.activitiesJson) : [];
  const socialLinks = profile?.socialLinksJson ? JSON.parse(profile.socialLinksJson) : [];

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Title */}
        <div className="border-b border-gray-200 pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#123B65]/10 text-[#123B65] text-xs font-semibold mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-[#2F80ED]" />
            <span>Hồ sơ học thuật & Giảng dạy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123B65]">
            Giới thiệu Giảng viên
          </h1>
          <p className="text-base text-[#344054] mt-2 max-w-3xl">
            Thông tin chi tiết về học vấn, quá trình công tác, định hướng nghiên cứu và hoạt động đào tạo của ThS. Trịnh Minh Phú.
          </p>
        </div>

        {/* 1. Hero Bio Card */}
        <div className="bg-[#F4F7FB] border border-[#E4E7EC] rounded-3xl p-8 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-60 h-72 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
                <Image
                  src="/images/lecturer-portrait.jpg"
                  alt="ThS. Trịnh Minh Phú"
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div>
                <span className="text-xs font-bold text-[#2F80ED] uppercase tracking-wider">
                  {profile?.title || "Giảng viên | Công nghệ thông tin"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123B65] mt-1">
                  {profile?.fullName || "TRỊNH MINH PHÚ"}
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">
                  {profile?.workplace || "Khoa Công nghệ Thông tin — Trường Đại học"}
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#344054] leading-relaxed">
                {profile?.bio}
              </p>

              {/* Quick Details Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs sm:text-sm text-[#344054]">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#2F80ED] shrink-0" />
                  <span>{profile?.officeLocation || "Phòng 402, Nhà A1"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-[#2F80ED] shrink-0" />
                  <a href={`mailto:${profile?.email}`} className="hover:text-[#2F80ED] font-mono">
                    {profile?.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-[#2F80ED] shrink-0" />
                  <span>{profile?.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#2F80ED] shrink-0" />
                  <span>Tiếp SV: Chiều T3 & T5 (14:00 - 16:30)</span>
                </div>
              </div>

              {/* Academic Social Links */}
              {socialLinks.length > 0 && (
                <div className="pt-4 border-t border-gray-200/60 flex flex-wrap gap-2">
                  {socialLinks.map((link: any, idx: number) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-[#123B65] hover:bg-[#123B65] hover:text-white transition-all shadow-xs"
                    >
                      {link.platform} &rarr;
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Education & Professional Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Học vấn */}
          <div className="bg-white border border-[#E4E7EC] rounded-2xl p-7 shadow-xs">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#123B65] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#2F80ED]" />
              </div>
              <h3 className="text-xl font-bold text-[#123B65]">
                Học vấn & Bằng cấp
              </h3>
            </div>

            <div className="space-y-6 relative border-l-2 border-blue-100 pl-6 ml-3">
              {education.map((edu: any, index: number) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#2F80ED] border-2 border-white ring-2 ring-blue-100" />
                  <span className="text-xs font-semibold text-[#2F80ED]">
                    {edu.period}
                  </span>
                  <h4 className="text-base font-bold text-[#123B65] mt-0.5">
                    {edu.degree}
                  </h4>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    {edu.institution}
                  </p>
                  <p className="text-xs text-[#344054] leading-relaxed">
                    {edu.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quá trình công tác & Giảng dạy */}
          <div className="bg-white border border-[#E4E7EC] rounded-2xl p-7 shadow-xs">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#123B65] flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-[#2F80ED]" />
              </div>
              <h3 className="text-xl font-bold text-[#123B65]">
                Quá trình công tác
              </h3>
            </div>

            <div className="space-y-6 relative border-l-2 border-blue-100 pl-6 ml-3">
              {teachingExp.map((exp: any, index: number) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#123B65] border-2 border-white ring-2 ring-gray-100" />
                  <span className="text-xs font-semibold text-[#123B65]">
                    {exp.period}
                  </span>
                  <h4 className="text-base font-bold text-[#123B65] mt-0.5">
                    {exp.role}
                  </h4>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    {exp.organization}
                  </p>
                  <p className="text-xs text-[#344054] leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Lĩnh vực Nghiên cứu & Chuyên môn */}
        <div className="bg-[#F4F7FB] border border-[#E4E7EC] rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#123B65] text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#2F80ED]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#123B65]">
                Chuyên môn & Lĩnh vực nghiên cứu
              </h3>
              <p className="text-xs text-[#344054]">
                Các hướng nghiên cứu học thuật và ứng dụng công nghệ trọng điểm
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {research.map((res: any, index: number) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-[#E4E7EC] shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F80ED] flex items-center justify-center font-bold text-sm mb-4">
                  0{index + 1}
                </div>
                <h4 className="text-base font-bold text-[#123B65] mb-2">
                  {res.topic}
                </h4>
                <p className="text-xs text-[#344054] leading-relaxed">
                  {res.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Hoạt động chuyên môn & Chứng chỉ */}
        <div className="bg-white border border-[#E4E7EC] rounded-2xl p-8 shadow-xs">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#123B65] flex items-center justify-center">
              <Award className="w-5 h-5 text-[#2F80ED]" />
            </div>
            <h3 className="text-xl font-bold text-[#123B65]">
              Hoạt động chuyên môn, Chứng chỉ & Thành tích
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activities.map((act: any, index: number) => (
              <div
                key={index}
                className="p-5 rounded-xl border border-gray-100 bg-[#F4F7FB]/50 hover:bg-[#F4F7FB] transition-colors"
              >
                <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-[#123B65] mb-2">
                  {act.year}
                </span>
                <h4 className="font-bold text-sm text-[#123B65] mb-1">
                  {act.title}
                </h4>
                <p className="text-xs text-[#344054] leading-relaxed">
                  {act.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#123B65] text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Bạn là sinh viên đang theo học học phần?</h3>
            <p className="text-xs text-blue-200 mt-1">
              Xem đề cương các môn học hoặc truy cập cổng nộp bài tập trực tuyến để gửi bài đúng hạn.
            </p>
          </div>
          <div className="flex space-x-3 shrink-0">
            <Link
              href="/teaching"
              className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
            >
              Học phần giảng dạy
            </Link>
            <Link
              href="/submissions"
              className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#2F80ED] hover:bg-[#206bc9] text-white shadow-md transition-all flex items-center"
            >
              <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
              Nộp bài tập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
