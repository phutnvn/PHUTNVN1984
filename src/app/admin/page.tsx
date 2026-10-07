"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  FileCheck,
  FileText,
  HelpCircle,
  Inbox,
  TrendingUp,
  UploadCloud,
  Users,
} from "lucide-react";
import { formatDateTimeVN, formatBytes } from "@/lib/utils";

interface DashboardStats {
  totalCourses: number;
  openAssignments: number;
  totalSubmissions: number;
  unreviewedSubmissions: number;
  lateSubmissions: number;
  unreadMessagesCount: number;
  recentSubmissions: any[];
  courseStats: Array<{
    id: string;
    code: string;
    name: string;
    submissionsCount: number;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-[#2F80ED] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-gray-500">Đang tổng hợp dữ liệu học phần và bài nộp...</p>
      </div>
    );
  }

  const s = stats || {
    totalCourses: 0,
    openAssignments: 0,
    totalSubmissions: 0,
    unreviewedSubmissions: 0,
    lateSubmissions: 0,
    unreadMessagesCount: 0,
    recentSubmissions: [],
    courseStats: [],
  };

  const maxSub = Math.max(...s.courseStats.map((c) => c.submissionsCount), 1);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#123B65]">
            Dashboard Tổng Quan
          </h1>
          <p className="text-xs text-[#344054] mt-1">
            Theo dõi tiến độ nộp bài, tình trạng học phần và thống kê học tập sinh viên.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/assignments"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#123B65] text-white hover:bg-[#1a4b7f] transition-all shadow-xs"
          >
            + Tạo bài tập mới
          </Link>
          <Link
            href="/admin/submissions"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2F80ED] text-white hover:bg-[#206bc9] transition-all shadow-xs"
          >
            Quản lý bài nộp
          </Link>
        </div>
      </div>

      {/* 1. KEY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Học phần */}
        <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 shadow-xs card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">Tổng Học Phần</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#123B65] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#123B65]">{s.totalCourses}</p>
          <p className="text-[11px] text-gray-400 mt-1">Đang hoạt động trong kỳ</p>
        </div>

        {/* Card 2: Bài tập mở */}
        <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 shadow-xs card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">Bài Tập Đang Mở</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">
            {s.openAssignments}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Đang tiếp nhận bài làm</p>
        </div>

        {/* Card 3: Tổng bài nộp */}
        <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 shadow-xs card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">Tổng Số Bài Nộp</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F80ED] flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#123B65]">{s.totalSubmissions}</p>
          <p className="text-[11px] text-gray-400 mt-1">Tất cả bài sinh viên gửi</p>
        </div>

        {/* Card 4: Bài chưa chấm */}
        <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 shadow-xs card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">Bài Chưa Chấm</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-600">
            {s.unreviewedSubmissions}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Cần đánh giá & cho điểm</p>
        </div>

        {/* Card 5: Bài nộp muộn */}
        <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 shadow-xs card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">Bài Nộp Muộn</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-rose-600">{s.lateSubmissions}</p>
          <p className="text-[11px] text-gray-400 mt-1">Sau mốc hạn chót</p>
        </div>
      </div>

      {/* 2. CHARTS & STATISTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Phân bổ bài nộp theo học phần (Chart visualization) */}
        <div className="lg:col-span-6 bg-white border border-[#E4E7EC] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#123B65] flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-[#2F80ED]" />
                Phân Bổ Bài Nộp Theo Học Phần
              </h3>
              <p className="text-[11px] text-gray-400">
                Thống kê số lượng bài sinh viên đã nộp ở từng môn học
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {s.courseStats.map((cs) => {
              const percent = Math.round((cs.submissionsCount / maxSub) * 100);
              return (
                <div key={cs.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-[#123B65]">
                    <span>
                      {cs.code} — {cs.name}
                    </span>
                    <span>{cs.submissionsCount} bài</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#123B65] to-[#2F80ED] h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percent, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tóm tắt tình trạng nộp bài */}
        <div className="lg:col-span-6 bg-white border border-[#E4E7EC] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-[#123B65] flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                Tỷ Lệ Hoàn Thành & Chấm Bài
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#F4F7FB] border border-gray-100">
                <p className="text-xs text-gray-500 font-medium">Tỷ lệ nộp đúng hạn</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {s.totalSubmissions > 0
                    ? `${Math.round(
                        ((s.totalSubmissions - s.lateSubmissions) / s.totalSubmissions) *
                          100
                      )}%`
                    : "100%"}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {s.totalSubmissions - s.lateSubmissions} / {s.totalSubmissions} bài đúng hạn
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F4F7FB] border border-gray-100">
                <p className="text-xs text-gray-500 font-medium">Tỷ lệ đã chấm điểm</p>
                <p className="text-2xl font-black text-[#2F80ED] mt-1">
                  {s.totalSubmissions > 0
                    ? `${Math.round(
                        ((s.totalSubmissions - s.unreviewedSubmissions) /
                          s.totalSubmissions) *
                          100
                      )}%`
                    : "0%"}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {s.totalSubmissions - s.unreviewedSubmissions} / {s.totalSubmissions} bài đã chấm
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-[#123B65] space-y-1">
              <p className="font-bold">Lối tắt nhanh cho giảng viên:</p>
              <p className="text-gray-600">
                Bạn có {s.unreviewedSubmissions} bài nộp đang chờ chấm điểm. Hãy truy cập mục Quản lý Bài nộp để tải hàng loạt tệp ZIP hoặc nhập điểm số và phản hồi.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4">
            <Link
              href="/admin/submissions"
              className="inline-flex items-center text-xs font-bold text-[#2F80ED] hover:underline"
            >
              Vào chấm bài tập ngay &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 3. RECENT SUBMISSIONS TABLE */}
      <div className="bg-white border border-[#E4E7EC] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#123B65]">
              Bài Nộp Mới Nhất Cần Xem Xét
            </h3>
            <p className="text-xs text-gray-400">
              Danh sách các bài làm sinh viên gửi gần đây nhất
            </p>
          </div>
          <Link
            href="/admin/submissions"
            className="text-xs font-bold text-[#2F80ED] hover:underline flex items-center"
          >
            Xem toàn bộ ({s.totalSubmissions}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {s.recentSubmissions.length === 0 ? (
          <p className="text-xs text-gray-400 italic py-4">Chưa có bài nộp nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F7FB] text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-3">Mã Biên Nhận</th>
                  <th className="py-3 px-3">Sinh Viên</th>
                  <th className="py-3 px-3">Học Phần & Bài Tập</th>
                  <th className="py-3 px-3">Thời Gian Nộp</th>
                  <th className="py-3 px-3">Trạng Thái</th>
                  <th className="py-3 px-3">Điểm Số</th>
                  <th className="py-3 px-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {s.recentSubmissions.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-gray-50/80">
                    <td className="py-3 px-3 font-mono font-bold text-[#123B65]">
                      {sub.receiptCode}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-[#123B65]">{sub.studentName}</p>
                      <p className="text-[11px] text-gray-500 font-mono">
                        {sub.studentId} — {sub.studentClass}
                      </p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-[#123B65]">
                        {sub.assignment.title}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {sub.assignment.course.code}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-gray-500">
                      {formatDateTimeVN(sub.submittedAt)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          sub.isLate
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {sub.isLate ? "Nộp muộn" : "Đúng hạn"}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-[#123B65]">
                      {sub.score !== null ? `${sub.score} đ` : "—"}
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <a
                        href={`/api/submissions/${sub.id}/download`}
                        className="inline-flex items-center p-1.5 text-gray-500 hover:text-[#2F80ED] rounded bg-gray-100 hover:bg-gray-200"
                        title="Tải tệp bài nộp"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
