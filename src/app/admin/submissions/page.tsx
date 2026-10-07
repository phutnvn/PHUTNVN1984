"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  Clock,
  Download,
  Edit,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  RefreshCw,
  Search,
  UploadCloud,
  X,
} from "lucide-react";
import { formatDateTimeVN, formatBytes } from "@/lib/utils";

interface SubmissionItem {
  id: string;
  receiptCode: string;
  studentName: string;
  studentId: string;
  studentClass: string;
  studentEmail: string;
  fileName: string;
  fileOriginalName: string;
  fileSize: number;
  notes: string | null;
  submittedAt: string;
  isLate: boolean;
  score: number | null;
  feedback: string | null;
  gradingStatus: string;
  assignment: {
    id: string;
    title: string;
    deadline: string;
    course: {
      id: string;
      code: string;
      name: string;
    };
  };
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timingFilter, setTimingFilter] = useState("all");

  // Filter options from database
  const [courses, setCourses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchDownloading, setBatchDownloading] = useState(false);

  // Grading Modal
  const [activeGradingSub, setActiveGradingSub] = useState<SubmissionItem | null>(null);
  const [scoreInput, setScoreInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [gradingStatusInput, setGradingStatusInput] = useState("GRADED");
  const [gradingSaving, setGradingSaving] = useState(false);
  const [gradeSuccess, setGradeSuccess] = useState<string | null>(null);

  const fetchSubmissions = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (courseFilter !== "all") params.set("courseId", courseFilter);
    if (assignmentFilter !== "all") params.set("assignmentId", assignmentFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (timingFilter !== "all") params.set("timing", timingFilter);

    fetch(`/api/admin/submissions?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.submissions) setSubmissions(data.submissions);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Initial fetch
    fetchSubmissions();

    // Fetch filters
    Promise.all([
      fetch("/api/courses").then((r) => r.json()),
      fetch("/api/assignments").then((r) => r.json()),
    ]).then(([courseData, assignData]) => {
      if (courseData.courses) setCourses(courseData.courses);
      if (assignData.assignments) setAssignments(assignData.assignments);
    });
  }, [courseFilter, assignmentFilter, statusFilter, timingFilter]);

  // Handle Select All
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(submissions.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Batch Download as ZIP
  const handleBatchDownload = async () => {
    if (selectedIds.length === 0 && assignmentFilter === "all") {
      alert("Vui lòng chọn ít nhất một bài nộp hoặc chọn một bài tập cụ thể để tải về.");
      return;
    }

    setBatchDownloading(true);

    try {
      const res = await fetch("/api/admin/submissions/batch-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionIds: selectedIds.length > 0 ? selectedIds : undefined,
          assignmentId: selectedIds.length === 0 ? assignmentFilter : undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Lỗi tạo tệp ZIP.");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `BaiNop_SinhVien_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      alert("Lỗi tải tệp ZIP hàng loạt.");
    } finally {
      setBatchDownloading(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const params = new URLSearchParams();
    if (assignmentFilter !== "all") params.set("assignmentId", assignmentFilter);
    if (courseFilter !== "all") params.set("courseId", courseFilter);

    window.open(`/api/admin/submissions/export?${params.toString()}`, "_blank");
  };

  // Open grading modal
  const openGradingModal = (sub: SubmissionItem) => {
    setActiveGradingSub(sub);
    setScoreInput(sub.score !== null ? String(sub.score) : "");
    setFeedbackInput(sub.feedback || "");
    setGradingStatusInput(sub.gradingStatus || "GRADED");
    setGradeSuccess(null);
  };

  // Save grade
  const saveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGradingSub) return;

    setGradingSaving(true);
    setGradeSuccess(null);

    try {
      const res = await fetch(`/api/admin/submissions/${activeGradingSub.id}/grade`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: scoreInput,
          feedback: feedbackInput,
          gradingStatus: gradingStatusInput,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Lỗi lưu điểm.");
      } else {
        setGradeSuccess("Đã lưu điểm và nhận xét thành công!");
        // Update local state
        setSubmissions((prev) =>
          prev.map((s) => (s.id === activeGradingSub.id ? { ...s, ...data.submission } : s))
        );
        setTimeout(() => {
          setActiveGradingSub(null);
        }, 1000);
      }
    } catch {
      alert("Lỗi kết nối khi lưu điểm.");
    } finally {
      setGradingSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Bulk Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#123B65]">
            Quản lý Bài nộp của Sinh viên
          </h1>
          <p className="text-xs text-[#344054] mt-1">
            Tổng cộng: <strong>{submissions.length} bài nộp</strong> ({submissions.filter((s) => s.isLate).length} bài nộp muộn)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleBatchDownload}
            disabled={batchDownloading}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#123B65] text-white hover:bg-[#1b4b7c] disabled:bg-gray-400 transition-all flex items-center shadow-xs"
          >
            <Archive className="w-3.5 h-3.5 mr-1.5" />
            <span>
              {batchDownloading
                ? "Đang đóng gói ZIP..."
                : selectedIds.length > 0
                ? `Tải ${selectedIds.length} bài đã chọn (ZIP)`
                : "Tải toàn bộ bộ lọc (ZIP)"}
            </span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
            <span>Xuất Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo MSSV, Họ tên, Lớp, Mã biên nhận..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchSubmissions()}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
            />
          </div>

          {/* Filter Course */}
          <div className="lg:col-span-3">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
            >
              <option value="all">Tất cả môn học</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Assignment */}
          <div className="lg:col-span-3">
            <select
              value={assignmentFilter}
              onChange={(e) => setAssignmentFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
            >
              <option value="all">Tất cả bài tập</option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Timing */}
          <div className="lg:col-span-2">
            <select
              value={timingFilter}
              onChange={(e) => setTimingFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="on_time">Đúng hạn</option>
              <option value="late">Nộp muộn</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <span>
              Đang chọn: <strong>{selectedIds.length}</strong> bài nộp
            </span>
            <button
              onClick={fetchSubmissions}
              className="text-[#2F80ED] hover:underline flex items-center font-semibold"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Làm mới danh sách
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-gray-400">Lọc chấm điểm:</span>
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2 py-0.5 rounded text-[11px] ${
                statusFilter === "all" ? "bg-[#123B65] text-white font-bold" : "bg-gray-100"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStatusFilter("PENDING")}
              className={`px-2 py-0.5 rounded text-[11px] ${
                statusFilter === "PENDING" ? "bg-amber-600 text-white font-bold" : "bg-gray-100"
              }`}
            >
              Chờ chấm
            </button>
            <button
              onClick={() => setStatusFilter("GRADED")}
              className={`px-2 py-0.5 rounded text-[11px] ${
                statusFilter === "GRADED" ? "bg-emerald-600 text-white font-bold" : "bg-gray-100"
              }`}
            >
              Đã chấm
            </button>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white border border-[#E4E7EC] rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-[#2F80ED] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500">Đang nạp danh sách bài nộp...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-500">Không tìm thấy bài nộp nào</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại bộ lọc.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F7FB] text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        submissions.length > 0 && selectedIds.length === submissions.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-[#2F80ED] focus:ring-[#2F80ED]"
                    />
                  </th>
                  <th className="py-3 px-3">Mã Biên Nhận</th>
                  <th className="py-3 px-3">Sinh Viên</th>
                  <th className="py-3 px-3">Lớp & Email</th>
                  <th className="py-3 px-3">Học Phần & Bài Tập</th>
                  <th className="py-3 px-3">Tệp Bài Làm</th>
                  <th className="py-3 px-3">Thời Gian Nộp</th>
                  <th className="py-3 px-3">Hạn & Trạng Thái</th>
                  <th className="py-3 px-3 text-center">Điểm Số</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((sub) => {
                  const isSelected = selectedIds.includes(sub.id);
                  return (
                    <tr
                      key={sub.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        isSelected ? "bg-blue-50/70" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(sub.id)}
                          className="rounded border-gray-300 text-[#2F80ED] focus:ring-[#2F80ED]"
                        />
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-[#123B65]">
                        {sub.receiptCode}
                      </td>

                      <td className="py-3 px-3">
                        <p className="font-bold text-[#123B65]">{sub.studentName}</p>
                        <p className="text-[11px] text-gray-500 font-mono">
                          MSSV: {sub.studentId}
                        </p>
                      </td>

                      <td className="py-3 px-3">
                        <p className="font-semibold text-gray-700">{sub.studentClass}</p>
                        <p className="text-[11px] text-gray-400 font-mono truncate max-w-[140px]">
                          {sub.studentEmail}
                        </p>
                      </td>

                      <td className="py-3 px-3 max-w-[200px]">
                        <p className="font-bold text-[#123B65] truncate">
                          {sub.assignment.title}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {sub.assignment.course.code}
                        </p>
                      </td>

                      <td className="py-3 px-3">
                        <a
                          href={`/api/submissions/${sub.id}/download`}
                          className="font-medium text-[#2F80ED] hover:underline flex items-center truncate max-w-[160px]"
                          title="Tải tệp này"
                        >
                          <Download className="w-3 h-3 mr-1 shrink-0" />
                          <span className="truncate">{sub.fileOriginalName}</span>
                        </a>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          {formatBytes(sub.fileSize)}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-gray-500 whitespace-nowrap">
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
                        <span
                          className={`inline-block ml-1 px-1.5 py-0.5 rounded text-[10px] ${
                            sub.gradingStatus === "GRADED"
                              ? "bg-blue-100 text-blue-700 font-bold"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {sub.gradingStatus === "GRADED" ? "Đã chấm" : "Chờ"}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        {sub.score !== null ? (
                          <span className="font-extrabold text-sm text-[#123B65] bg-blue-50 px-2 py-0.5 rounded">
                            {sub.score}
                          </span>
                        ) : (
                          <span className="text-gray-300 font-bold">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => openGradingModal(sub)}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#2F80ED] text-white hover:bg-[#206bc9] transition-colors"
                          title="Chấm điểm và nhận xét"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Chấm bài
                        </button>
                        <a
                          href={`/api/submissions/${sub.id}/download`}
                          className="inline-flex items-center p-1.5 text-gray-500 hover:text-[#123B65] bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Tải tệp bài nộp"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* GRADING MODAL */}
      {/* ============================================================== */}
      {activeGradingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-extrabold text-[#123B65]">
                Chấm Điểm & Đánh Giá Bài Nộp
              </h3>
              <button
                onClick={() => setActiveGradingSub(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Submission brief */}
            <div className="bg-[#F4F7FB] p-4 rounded-2xl text-xs space-y-1.5 text-[#344054]">
              <div className="flex justify-between">
                <span>Sinh viên:</span>
                <strong className="text-[#123B65]">
                  {activeGradingSub.studentName} ({activeGradingSub.studentId})
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Lớp:</span>
                <span>{activeGradingSub.studentClass}</span>
              </div>
              <div className="flex justify-between">
                <span>Bài tập:</span>
                <span className="font-semibold">{activeGradingSub.assignment.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Tệp bài làm:</span>
                <a
                  href={`/api/submissions/${activeGradingSub.id}/download`}
                  className="text-[#2F80ED] hover:underline font-bold flex items-center"
                >
                  <Download className="w-3 h-3 mr-1" />
                  {activeGradingSub.fileOriginalName}
                </a>
              </div>
              {activeGradingSub.notes && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-400 block">Lời nhắn của sinh viên:</span>
                  <p className="italic text-gray-600">{activeGradingSub.notes}</p>
                </div>
              )}
            </div>

            {gradeSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{gradeSuccess}</span>
              </div>
            )}

            <form onSubmit={saveGrade} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#123B65] mb-1">
                    Điểm số (Thang điểm 10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="VD: 8.5"
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#123B65] focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#123B65] mb-1">
                    Trạng thái chấm
                  </label>
                  <select
                    value={gradingStatusInput}
                    onChange={(e) => setGradingStatusInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                  >
                    <option value="GRADED">Đã chấm điểm</option>
                    <option value="PENDING">Chờ chấm / Chưa hoàn tất</option>
                    <option value="NEEDS_REVISION">Yêu cầu nộp lại / chỉnh sửa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B65] mb-1">
                  Nhận xét & Góp ý của Giảng viên
                </label>
                <textarea
                  rows={4}
                  placeholder="Ghi nhận ưu điểm và các lỗi kỹ thuật sinh viên cần cải thiện..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveGradingSub(null)}
                  className="w-1/2 py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={gradingSaving}
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-[#2F80ED] text-xs font-bold text-white hover:bg-[#206bc9] disabled:bg-gray-400 shadow-md"
                >
                  {gradingSaving ? "Đang lưu..." : "Lưu Điểm & Phản Hồi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
