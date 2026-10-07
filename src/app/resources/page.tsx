"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Download,
  ExternalLink,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  Lock,
  Search,
  Unlock,
} from "lucide-react";
import { formatDateVN } from "@/lib/utils";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  fileType: string;
  fileUrl: string;
  isRestricted: boolean;
  downloadCount: number;
  createdAt: string;
  course: {
    id: string;
    code: string;
    name: string;
  } | null;
}

interface CourseOption {
  id: string;
  code: string;
  name: string;
}

function ResourcesContent() {
  const searchParams = useSearchParams();
  const initialCourseId = searchParams.get("courseId") || "all";
  const initialType = searchParams.get("type") || "all";

  const [resources, setResources] = useState<Resource[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>(initialCourseId);
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch courses for dropdown
  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) {
          setCourses(data.courses);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch resources based on filters
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCourse !== "all") params.set("courseId", selectedCourse);
    if (selectedType !== "all") params.set("fileType", selectedType);
    if (searchQuery.trim()) params.set("q", searchQuery.trim());

    fetch(`/api/resources?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.resources) {
          setResources(data.resources);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCourse, selectedType, searchQuery]);

  const getBadgeForType = (type: string) => {
    switch (type.toUpperCase()) {
      case "PDF":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "DOCX":
      case "DOC":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "PPTX":
      case "PPT":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "XLSX":
      case "XLS":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "LINK":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-gray-200 pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#123B65]/10 text-[#123B65] text-xs font-semibold mb-3">
            <FileText className="w-3.5 h-3.5 text-[#2F80ED]" />
            <span>Kho Học Liệu Số & Bài Giảng</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123B65]">
            Tài liệu Học tập
          </h1>
          <p className="text-base text-[#344054] mt-2 max-w-3xl">
            Tìm kiếm bài giảng, slide trình chiếu, tập dữ liệu thực hành và học liệu mở được phân loại theo từng học phần chuyên ngành.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#F4F7FB] border border-[#E4E7EC] rounded-2xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo tên bài giảng hoặc từ khóa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent bg-white"
              />
            </div>

            {/* Course Filter */}
            <div className="md:col-span-4">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent bg-white text-[#344054]"
              >
                <option value="all">Tất cả các học phần</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* File Type Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent bg-white text-[#344054]"
              >
                <option value="all">Tất cả loại định dạng</option>
                <option value="PDF">Tài liệu PDF</option>
                <option value="DOCX">Văn bản Word (.docx)</option>
                <option value="PPTX">Bài giảng PowerPoint (.pptx)</option>
                <option value="XLSX">Bảng tính / Dữ liệu (.xlsx)</option>
                <option value="LINK">Liên kết học liệu trực tuyến</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resources List */}
        <div>
          {loading ? (
            <div className="text-center py-16 text-[#344054]">
              <div className="w-8 h-8 border-4 border-[#2F80ED] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Đang tải danh mục học liệu...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-16 bg-[#F4F7FB] rounded-2xl border border-dashed border-gray-300">
              <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-base font-bold text-[#123B65]">
                Không tìm thấy tài liệu phù hợp
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Vui lòng thử từ khóa khác hoặc điều chỉnh bộ lọc học phần.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="bg-white border border-[#E4E7EC] rounded-2xl p-6 shadow-sm card-hover flex flex-col justify-between"
                >
                  <div>
                    {/* Top badging */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase ${getBadgeForType(
                          res.fileType
                        )}`}
                      >
                        {res.fileType}
                      </span>

                      {res.isRestricted ? (
                        <span className="inline-flex items-center text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Lock className="w-3 h-3 mr-1" />
                          Nội bộ lớp
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <Unlock className="w-3 h-3 mr-1" />
                          Công khai
                        </span>
                      )}
                    </div>

                    {/* Course Code */}
                    <span className="text-[11px] font-bold text-[#2F80ED] uppercase tracking-wide block mb-1">
                      {res.course ? `${res.course.code} — ${res.course.name}` : "Tài liệu học thuật chung"}
                    </span>

                    {/* Title */}
                    <h3 className="text-base font-bold text-[#123B65] line-clamp-2 mb-2">
                      {res.title}
                    </h3>

                    {/* Description */}
                    {res.description && (
                      <p className="text-xs text-[#344054] line-clamp-3 mb-4 leading-relaxed">
                        {res.description}
                      </p>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">
                      Cập nhật: {formatDateVN(res.createdAt)}
                    </span>

                    <a
                      href={res.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={res.fileType !== "LINK"}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#123B65] text-white hover:bg-[#2F80ED] transition-colors"
                    >
                      {res.fileType === "LINK" ? (
                        <>
                          <ExternalLink className="w-3.5 h-3.5 mr-1" />
                          Mở liên kết
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 mr-1" />
                          Tải xuống
                        </>
                      )}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-24 text-center">
          <div className="w-8 h-8 border-4 border-[#2F80ED] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Đang tải kho học liệu...</p>
        </div>
      }
    >
      <ResourcesContent />
    </Suspense>
  );
}
