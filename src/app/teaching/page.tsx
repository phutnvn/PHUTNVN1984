import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateVN } from "@/lib/utils";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  ListCheck,
  Target,
  UploadCloud,
  Users,
} from "lucide-react";

export const revalidate = 0;

export default async function TeachingPage() {
  const courses = await prisma.course.findMany({
    where: { isActive: true },
    include: {
      assignments: {
        orderBy: { deadline: "asc" },
      },
      resources: {
        take: 3,
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { code: "asc" },
  });

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Title */}
        <div className="border-b border-gray-200 pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#123B65]/10 text-[#123B65] text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#2F80ED]" />
            <span>Kế hoạch đào tạo & Học phần</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123B65]">
            Học phần Giảng dạy
          </h1>
          <p className="text-base text-[#344054] mt-2 max-w-3xl">
            Danh sách các môn học đại học do ThS. Trịnh Minh Phú trực tiếp phụ trách, kèm đề cương chi tiết, mục tiêu đầu ra, bài tập và kho học liệu trực tuyến.
          </p>
        </div>

        {/* Courses List */}
        <div className="space-y-12">
          {courses.map((course) => (
            <div
              key={course.id}
              id={course.code}
              className="bg-[#F4F7FB] border border-[#E4E7EC] rounded-3xl p-6 sm:p-10 shadow-sm scroll-mt-24 space-y-8"
            >
              {/* Header of Course Card */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/80 pb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#123B65] text-white">
                      {course.code}
                    </span>
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-[#344054]">
                      {course.semester} — {course.academicYear}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123B65]">
                    {course.name}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/resources?courseId=${course.id}`}
                    className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-[#123B65] hover:bg-gray-100 transition-colors shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1.5 text-[#2F80ED]" />
                    Tài liệu môn học
                  </Link>
                  <Link
                    href={`/submissions?courseId=${course.id}&tab=submit`}
                    className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-[#2F80ED] text-white hover:bg-[#206bc9] transition-all shadow-sm"
                  >
                    <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
                    Khu vực nộp bài tập
                  </Link>
                </div>
              </div>

              {/* Course Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left col: Description & Target & Objectives */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Mô tả học phần
                    </h3>
                    <p className="text-sm text-[#344054] leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {course.targetStudents && (
                    <div className="bg-white rounded-xl p-4 border border-gray-200/80">
                      <div className="flex items-center text-xs font-bold text-[#123B65] mb-1">
                        <Users className="w-4 h-4 mr-2 text-[#2F80ED]" />
                        Đối tượng sinh viên:
                      </div>
                      <p className="text-xs text-[#344054] pl-6">
                        {course.targetStudents}
                      </p>
                    </div>
                  )}

                  {course.objectives && (
                    <div className="bg-white rounded-xl p-4 border border-gray-200/80">
                      <div className="flex items-center text-xs font-bold text-[#123B65] mb-2">
                        <Target className="w-4 h-4 mr-2 text-emerald-600" />
                        Mục tiêu học tập & Chuẩn đầu ra:
                      </div>
                      <div className="text-xs text-[#344054] space-y-1.5 pl-6">
                        {course.objectives.split(";").map((obj, i) => (
                          <div key={i} className="flex items-start">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                            <span>{obj.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {course.syllabus && (
                    <div className="bg-white rounded-xl p-4 border border-gray-200/80">
                      <div className="flex items-center text-xs font-bold text-[#123B65] mb-2">
                        <ListCheck className="w-4 h-4 mr-2 text-[#2F80ED]" />
                        Khung đề cương chi tiết:
                      </div>
                      <p className="text-xs text-[#344054] pl-6 leading-relaxed">
                        {course.syllabus}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right col: Assignments & Materials */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Danh sách bài tập */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-[#123B65] flex items-center">
                        <UploadCloud className="w-4 h-4 mr-2 text-[#2F80ED]" />
                        Bài tập & Hạn nộp
                      </h4>
                      <span className="text-[11px] font-semibold text-gray-500">
                        {course.assignments.length} bài tập
                      </span>
                    </div>

                    {course.assignments.length === 0 ? (
                      <p className="text-xs text-gray-400 italic py-2">
                        Hiện chưa có bài tập nào cho học phần này.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {course.assignments.map((assign) => {
                          const isClosed = assign.status === "CLOSED";
                          return (
                            <div
                              key={assign.id}
                              className={`p-3.5 rounded-xl border text-xs transition-all ${
                                isClosed
                                  ? "bg-gray-50 border-gray-200 text-gray-400"
                                  : "bg-[#F4F7FB]/70 border-blue-100 hover:border-blue-300"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    isClosed
                                      ? "bg-gray-200 text-gray-600"
                                      : assign.status === "CLOSING_SOON"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-emerald-100 text-emerald-800"
                                  }`}
                                >
                                  {isClosed
                                    ? "Đã đóng"
                                    : assign.status === "CLOSING_SOON"
                                    ? "Sắp hết hạn"
                                    : "Đang mở"}
                                </span>
                                <span className="text-gray-500 flex items-center">
                                  <Clock className="w-3 h-3 mr-1 text-gray-400" />
                                  Hạn: {formatDateVN(assign.deadline)}
                                </span>
                              </div>

                              <p className="font-bold text-[#123B65] mb-1 line-clamp-1">
                                {assign.title}
                              </p>

                              {!isClosed && (
                                <Link
                                  href={`/submissions?assignmentId=${assign.id}&tab=submit`}
                                  className="inline-flex items-center text-[11px] font-semibold text-[#2F80ED] hover:underline mt-1"
                                >
                                  Nộp bài tập này &rarr;
                                </Link>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Tài liệu mới liên quan */}
                  {course.resources.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-[#123B65] flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-[#2F80ED]" />
                          Học liệu tiêu biểu
                        </h4>
                        <Link
                          href={`/resources?courseId=${course.id}`}
                          className="text-[11px] font-semibold text-[#2F80ED] hover:underline"
                        >
                          Xem tất cả
                        </Link>
                      </div>

                      <div className="space-y-2">
                        {course.resources.map((res) => (
                          <div
                            key={res.id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-xs"
                          >
                            <span className="truncate pr-2 text-[#344054]">
                              {res.title}
                            </span>
                            <a
                              href={res.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-[#2F80ED] p-1"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
