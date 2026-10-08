import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateVN } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Code2,
  Database,
  Download,
  FileText,
  GraduationCap,
  Layers,
  Sparkles,
  UploadCloud,
  Users,
} from "lucide-react";

export const revalidate = 0; // Dynamic server-side rendering

export default async function HomePage() {
  const [profile, courses, recentAssignments, recentAnnouncements, recentResources] =
    await Promise.all([
      prisma.lecturerProfile.findUnique({ where: { id: "default" } }),
      prisma.course.findMany({
        where: { isActive: true },
        take: 4,
        orderBy: { code: "asc" },
      }),
      prisma.assignment.findMany({
        where: { status: { in: ["OPEN", "CLOSING_SOON"] } },
        take: 3,
        include: { course: true },
        orderBy: { deadline: "asc" },
      }),
      prisma.announcement.findMany({
        take: 3,
        include: { course: true },
        orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      }),
      prisma.resource.findMany({
        take: 4,
        include: { course: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F4F7FB] via-white to-white pt-12 pb-20 border-b border-[#E4E7EC]">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#123B65]/10 text-[#123B65] text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#2F80ED]" />
                <span>Trang thông tin học thuật chính thức</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#123B65]">
                  {profile?.fullName || "TRỊNH MINH PHÚ"}
                </h1>
                <p className="text-xl sm:text-2xl font-semibold text-[#2F80ED]">
                  Giảng viên | Công nghệ thông tin | Giáo dục và sáng tạo
                </p>
              </div>

              <p className="text-base sm:text-lg text-[#344054] leading-relaxed max-w-2xl">
                {profile?.bio ||
                  "Tận tâm xây dựng nền tảng tư duy khoa học máy tính vững chắc và kỹ năng lập trình thực chiến cho sinh viên. Cùng khám phá kiến thức công nghệ hiện đại, tài liệu học tập và trải nghiệm hệ thống thu bài trực tuyến chuyên nghiệp."}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/submissions"
                  className="inline-flex items-center px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-[#2F80ED] hover:bg-[#206bc9] shadow-md shadow-[#2F80ED]/20 hover:shadow-lg transition-all"
                >
                  <UploadCloud className="w-5 h-5 mr-2.5" />
                  Nộp bài tập trực tuyến
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center px-6 py-3.5 rounded-xl text-base font-semibold text-[#123B65] bg-white border border-[#123B65]/20 hover:bg-[#F4F7FB] transition-all shadow-sm"
                >
                  Tìm hiểu về tôi
                </Link>
              </div>

              {/* Quick Academic Badges */}
              <div className="pt-4 border-t border-gray-200/80 flex flex-wrap gap-y-2 gap-x-6 text-sm text-[#344054]">
                <div className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
                  <span>{profile?.workplace || "Khoa Toán - Tin, Trường Đại học Khoa học"}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
                  <span>{profile?.officeLocation || "Phường Phan Đình Phùng, Thái Nguyên"}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
                  <span>Cấp biên nhận nộp bài tự động</span>
                </div>
              </div>
            </div>

            {/* Right Portrait Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Background decorative layers */}
                <div className="absolute -top-4 -left-4 w-72 h-72 sm:w-80 sm:h-80 bg-[#2F80ED]/15 rounded-3xl -rotate-3" />
                <div className="absolute -bottom-4 -right-4 w-72 h-72 sm:w-80 sm:h-80 bg-[#123B65]/10 rounded-3xl rotate-3" />

                {/* Portrait container */}
                <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                  <Image
                    src="/images/lecturer-portrait.jpg"
                    alt="Giảng viên Trịnh Minh Phú"
                    fill
                    className="object-cover object-center"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#123B65]/80 via-transparent to-transparent flex items-end p-5">
                    <div className="text-white">
                      <p className="font-bold text-lg">ThS. Trịnh Minh Phú</p>
                      <p className="text-xs text-blue-200">
                        Giảng viên
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS OVERVIEW COUNTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#F4F7FB] border border-[#E4E7EC] rounded-2xl p-6 text-center card-hover">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#123B65] text-white flex items-center justify-center mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-3xl font-extrabold text-[#123B65]">{courses.length}+</p>
            <p className="text-sm font-medium text-[#344054] mt-1">Học phần giảng dạy</p>
          </div>

          <div className="bg-[#F4F7FB] border border-[#E4E7EC] rounded-2xl p-6 text-center card-hover">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#2F80ED] text-white flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-3xl font-extrabold text-[#123B65]">100%</p>
            <p className="text-sm font-medium text-[#344054] mt-1">Nộp bài trực tuyến</p>
          </div>

          <div className="bg-[#F4F7FB] border border-[#E4E7EC] rounded-2xl p-6 text-center card-hover">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#123B65] text-white flex items-center justify-center mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-3xl font-extrabold text-[#123B65]">50+</p>
            <p className="text-sm font-medium text-[#344054] mt-1">Tài liệu & Học liệu</p>
          </div>

          <div className="bg-[#F4F7FB] border border-[#E4E7EC] rounded-2xl p-6 text-center card-hover">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#2F80ED] text-white flex items-center justify-center mb-3">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-3xl font-extrabold text-[#123B65]">800+</p>
            <p className="text-sm font-medium text-[#344054] mt-1">Sinh viên hướng dẫn</p>
          </div>
        </div>
      </section>

      {/* 3. CHUYÊN MÔN & ĐỊNH HƯỚNG NGHIÊN CỨU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-[#2F80ED]">
            Lĩnh Vực Trọng Tâm
          </span>
          <h2 className="text-3xl font-bold text-[#123B65] mt-2">
            Chuyên môn & Định hướng Giảng dạy
          </h2>
          <p className="text-[#344054] mt-3">
            Kết hợp giữa lý thuyết nền tảng khoa học máy tính và các công nghệ thực chiến đang được các doanh nghiệp tuyển dụng hàng đầu săn đón.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-[#E4E7EC] shadow-sm card-hover relative group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2F80ED] flex items-center justify-center mb-6 group-hover:bg-[#123B65] group-hover:text-white transition-colors">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#123B65] mb-3">
              Lập trình Web Nâng cao & Full-stack
            </h3>
            <p className="text-sm text-[#344054] leading-relaxed">
              Trang bị tư duy kiến trúc Next.js App Router, React Server Components, RESTful API, thiết kế hệ thống bảo mật và triển khai ứng dụng đám mây.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-[#E4E7EC] shadow-sm card-hover relative group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2F80ED] flex items-center justify-center mb-6 group-hover:bg-[#123B65] group-hover:text-white transition-colors">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#123B65] mb-3">
              Hệ Quản trị Cơ sở Dữ liệu & Xử lý Dữ liệu
            </h3>
            <p className="text-sm text-[#344054] leading-relaxed">
              Chuẩn hóa dữ liệu quan hệ, tối ưu truy vấn SQL với Execution Plan, chỉ mục (Index) chuyên sâu, giao dịch ACID và lưu trữ dữ liệu phân tán.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-[#E4E7EC] shadow-sm card-hover relative group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2F80ED] flex items-center justify-center mb-6 group-hover:bg-[#123B65] group-hover:text-white transition-colors">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#123B65] mb-3">
              Cấu trúc Dữ liệu & Giải thuật Ứng dụng
            </h3>
            <p className="text-sm text-[#344054] leading-relaxed">
              Rèn luyện năng lực giải quyết vấn đề, phân tích độ phức tạp thuật toán và làm chủ các mô hình dữ liệu căn bản cho các kỳ thi kỹ thuật.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CALLOUT: BÀI TẬP ĐANG MỞ & NỘP BÀI TRỰC TUYẾN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#123B65] to-[#1e4e7e] rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#2F80ED]/30 text-blue-200 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                Cổng thu bài tập trực tuyến học kỳ này
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Sinh viên nộp bài tập & đồ án đúng hạn
              </h2>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                Hệ thống tự động kiểm tra định dạng tệp, ghi nhận mốc thời gian máy chủ và cung cấp Mã Biên Nhận (Receipt Code) duy nhất để sinh viên an tâm tra cứu kết quả.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Link
                href="/submissions?tab=submit"
                className="px-6 py-3.5 rounded-xl text-center text-sm font-bold bg-[#2F80ED] text-white hover:bg-[#206bc9] transition-all shadow-md"
              >
                Nộp bài ngay
              </Link>
              <Link
                href="/submissions?tab=lookup"
                className="px-6 py-3.5 rounded-xl text-center text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              >
                Tra cứu kết quả nộp bài
              </Link>
            </div>
          </div>

          {/* List of active assignments */}
          {recentAssignments.length > 0 && (
            <div className="mt-8 pt-8 border-t border-blue-400/20">
              <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-4">
                Các bài tập đang nhận bài gần nhất:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentAssignments.map((a) => (
                  <div
                    key={a.id}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15 hover:bg-white/15 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs text-blue-200 mb-2">
                      <span className="font-mono bg-blue-900/50 px-2 py-0.5 rounded">
                        {a.course.code}
                      </span>
                      <span className="text-amber-300 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Hạn: {formatDateVN(a.deadline)}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm line-clamp-2 text-white">
                      {a.title}
                    </h4>
                    <Link
                      href={`/submissions?assignmentId=${a.id}&tab=submit`}
                      className="inline-flex items-center text-xs text-[#2F80ED] hover:text-white mt-3 font-medium transition-colors"
                    >
                      Đi đến trang nộp &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. HỌC PHẦN GIẢNG DẠY TIÊU BIỂU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#2F80ED]">
              Chương trình đào tạo
            </span>
            <h2 className="text-3xl font-bold text-[#123B65] mt-1">
              Học phần đang giảng dạy
            </h2>
          </div>
          <Link
            href="/teaching"
            className="text-sm font-semibold text-[#2F80ED] hover:text-[#123B65] inline-flex items-center mt-3 sm:mt-0 transition-colors"
          >
            Xem toàn bộ học phần <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl p-7 border border-[#E4E7EC] shadow-sm card-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold bg-[#123B65]/10 text-[#123B65]">
                    {course.code}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {course.semester} — {course.academicYear}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#123B65] mb-2">
                  {course.name}
                </h3>
                <p className="text-sm text-[#344054] line-clamp-3 mb-4 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <Link
                  href={`/teaching#${course.code}`}
                  className="text-xs font-semibold text-[#123B65] hover:text-[#2F80ED] transition-colors"
                >
                  Xem đề cương chi tiết
                </Link>
                <Link
                  href={`/submissions?courseId=${course.id}`}
                  className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#F4F7FB] text-[#2F80ED] hover:bg-[#2F80ED] hover:text-white transition-all"
                >
                  <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
                  Nộp bài học phần
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. THÔNG BÁO GẦN ĐÂY & TÀI LIỆU MỚI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Thông báo học tập */}
          <div className="lg:col-span-7 bg-[#F4F7FB] border border-[#E4E7EC] rounded-2xl p-7">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#123B65] text-white flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-[#123B65]">
                  Thông báo học tập mới nhất
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              {recentAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-white rounded-xl p-5 border border-[#E4E7EC] shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#2F80ED]">
                      {ann.course ? `${ann.course.code} - ${ann.course.name}` : "Thông báo chung"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDateVN(ann.createdAt)}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#123B65] mb-1">
                    {ann.title}
                  </h4>
                  <p className="text-xs text-[#344054] line-clamp-3 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tài liệu mới cập nhật */}
          <div className="lg:col-span-5 bg-white border border-[#E4E7EC] rounded-2xl p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-[#2F80ED] text-white flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-[#123B65]">
                    Tài liệu mới cập nhật
                  </h3>
                </div>
                <Link
                  href="/resources"
                  className="text-xs font-semibold text-[#2F80ED] hover:underline"
                >
                  Tất cả
                </Link>
              </div>

              <div className="space-y-3">
                {recentResources.map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-[#F4F7FB] transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-start space-x-3 pr-2">
                      <span className="shrink-0 px-2 py-1 rounded text-[10px] font-bold bg-blue-100 text-[#123B65]">
                        {res.fileType}
                      </span>
                      <div>
                        <h4 className="text-xs font-semibold text-[#123B65] group-hover:text-[#2F80ED] line-clamp-1 transition-colors">
                          {res.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {res.course ? res.course.code : "Tài liệu chung"}
                        </p>
                      </div>
                    </div>
                    <a
                      href={res.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 p-2 text-gray-400 group-hover:text-[#2F80ED] hover:bg-white rounded-lg transition-colors"
                      title="Tải xuống / Xem"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link
                href="/resources"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-semibold text-[#123B65] bg-[#F4F7FB] hover:bg-gray-200 transition-colors"
              >
                Truy cập kho học liệu đầy đủ &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
