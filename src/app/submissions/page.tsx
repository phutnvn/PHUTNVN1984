"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  FileCheck,
  FileUp,
  Info,
  ListOrdered,
  Printer,
  Search,
  Sparkles,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { formatDateVN, formatDateTimeVN, formatBytes } from "@/lib/utils";

interface Assignment {
  id: string;
  title: string;
  courseId: string;
  description: string;
  requirements: string | null;
  deadline: string;
  acceptedFormats: string;
  maxFileSizeMb: number;
  status: string;
  course: {
    id: string;
    code: string;
    name: string;
  };
}

interface Course {
  id: string;
  code: string;
  name: string;
}

interface SubmissionReceipt {
  receiptCode: string;
  studentName: string;
  studentId: string;
  studentClass: string;
  studentEmail: string;
  assignmentTitle: string;
  courseName: string;
  fileName: string;
  fileSize: number;
  submittedAt: string;
  deadline: string;
  isLate: boolean;
}

function SubmissionsContent() {
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab");
  const preselectedAssignmentId = searchParams.get("assignmentId");
  const preselectedCourseId = searchParams.get("courseId");

  const [activeTab, setActiveTab] = useState<"list" | "submit" | "lookup">(
    urlTab === "submit" ? "submit" : urlTab === "lookup" ? "lookup" : "list"
  );

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [selectedCourseId, setSelectedCourseId] = useState<string>(preselectedCourseId || "");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(preselectedAssignmentId || "");
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Submission UI states
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [receiptModal, setReceiptModal] = useState<SubmissionReceipt | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Lookup states
  const [lookupStudentId, setLookupStudentId] = useState("");
  const [lookupKey, setLookupKey] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupResults, setLookupResults] = useState<any[] | null>(null);

  // Fetch assignments and courses
  useEffect(() => {
    Promise.all([
      fetch("/api/assignments").then((res) => res.json()),
      fetch("/api/courses").then((res) => res.json()),
    ])
      .then(([assignData, courseData]) => {
        if (assignData.assignments) setAssignments(assignData.assignments);
        if (courseData.courses) setCourses(courseData.courses);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Sync assignment choice when preselected
  useEffect(() => {
    if (preselectedAssignmentId && assignments.length > 0) {
      const found = assignments.find((a) => a.id === preselectedAssignmentId);
      if (found) {
        setSelectedCourseId(found.courseId);
        setSelectedAssignmentId(found.id);
        setActiveTab("submit");
      }
    }
  }, [preselectedAssignmentId, assignments]);

  const activeAssignment = assignments.find((a) => a.id === selectedAssignmentId);

  // Filtered assignments based on selected course
  const availableAssignmentsForCourse = selectedCourseId
    ? assignments.filter((a) => a.courseId === selectedCourseId && a.status !== "CLOSED")
    : assignments.filter((a) => a.status !== "CLOSED");

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFormError(null);

      // Validate size
      const maxMb = activeAssignment ? activeAssignment.maxFileSizeMb : 50;
      if (selected.size > maxMb * 1024 * 1024) {
        setFormError(`Tệp đã chọn vượt quá giới hạn dung lượng ${maxMb}MB.`);
        return;
      }

      // Validate format
      if (activeAssignment?.acceptedFormats) {
        const ext = selected.name.split(".").pop()?.toUpperCase() || "";
        const allowed = activeAssignment.acceptedFormats
          .split(",")
          .map((f) => f.trim().toUpperCase().replace(/^\./, ""));
        if (!allowed.includes(ext)) {
          setFormError(`Định dạng .${ext.toLowerCase()} không nằm trong danh sách cho phép (${activeAssignment.acceptedFormats}).`);
          return;
        }
      }

      setFile(selected);
    }
  };

  // Handle Form Submit
  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!studentName.trim() || !studentId.trim() || !studentClass.trim() || !studentEmail.trim()) {
      setFormError("Vui lòng điền đầy đủ các thông tin cá nhân bắt buộc.");
      return;
    }

    if (!selectedAssignmentId) {
      setFormError("Vui lòng chọn bài tập cần nộp.");
      return;
    }

    if (!file) {
      setFormError("Vui lòng đính kèm tệp bài làm của bạn.");
      return;
    }

    setSubmitting(true);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append("studentName", studentName);
    formData.append("studentId", studentId);
    formData.append("studentClass", studentClass);
    formData.append("studentEmail", studentEmail);
    formData.append("assignmentId", selectedAssignmentId);
    formData.append("notes", notes);
    formData.append("file", file);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev < 90 ? prev + 15 : prev));
    }, 150);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Không thể nộp bài. Vui lòng kiểm tra lại thông tin.");
      } else {
        setReceiptModal(data.receipt);
        // Clear form
        setFile(null);
        setNotes("");
      }
    } catch (err) {
      clearInterval(progressInterval);
      setFormError("Lỗi kết nối máy chủ khi tải bài lên. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Student Lookup
  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setLookupResults(null);

    if (!lookupStudentId.trim() || !lookupKey.trim()) {
      setLookupError("Vui lòng nhập đầy đủ Mã sinh viên (MSSV) và Mã biên nhận (hoặc Email).");
      return;
    }

    setLookupLoading(true);

    try {
      const res = await fetch("/api/submissions/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: lookupStudentId.trim(),
          queryKey: lookupKey.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLookupError(data.error || "Không tìm thấy dữ liệu bài nộp.");
      } else {
        setLookupResults(data.submissions);
      }
    } catch {
      setLookupError("Lỗi hệ thống khi tra cứu bài nộp.");
    } finally {
      setLookupLoading(false);
    }
  };

  const copyReceiptToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-gray-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#123B65]/10 text-[#123B65] text-xs font-semibold mb-3">
              <UploadCloud className="w-3.5 h-3.5 text-[#2F80ED]" />
              <span>Hệ Thống Thu Bài Tập Trực Tuyến</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123B65]">
              Cổng Nộp & Quản lý Bài tập
            </h1>
            <p className="text-base text-[#344054] mt-2 max-w-2xl">
              Nộp bài tập trực tuyến an toàn, xác nhận đúng hạn theo thời gian máy chủ và cấp mã biên nhận đối chiếu.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="inline-flex p-1.5 rounded-2xl bg-[#F4F7FB] border border-[#E4E7EC] shrink-0">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "list"
                  ? "bg-white text-[#123B65] shadow-xs"
                  : "text-[#344054] hover:text-[#123B65]"
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5 inline mr-1.5" />
              Danh sách bài tập
            </button>
            <button
              onClick={() => setActiveTab("submit")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "submit"
                  ? "bg-[#2F80ED] text-white shadow-xs"
                  : "text-[#344054] hover:text-[#123B65]"
              }`}
            >
              <FileUp className="w-3.5 h-3.5 inline mr-1.5" />
              Biểu mẫu nộp bài
            </button>
            <button
              onClick={() => setActiveTab("lookup")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "lookup"
                  ? "bg-[#123B65] text-white shadow-xs"
                  : "text-[#344054] hover:text-[#123B65]"
              }`}
            >
              <Search className="w-3.5 h-3.5 inline mr-1.5" />
              Tra cứu biên nhận
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: DANH SÁCH BÀI TẬP */}
        {/* ============================================================== */}
        {activeTab === "list" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#123B65]">
                Tất cả bài tập các học phần ({assignments.length})
              </h2>
              <span className="text-xs text-gray-500">
                Lưu ý: Hạn nộp tính theo giờ máy chủ Việt Nam (GMT+7)
              </span>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 border-4 border-[#2F80ED] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-gray-500">Đang tải danh sách bài tập...</p>
              </div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-16 bg-[#F4F7FB] rounded-2xl border border-dashed border-gray-300">
                <p className="text-sm font-semibold text-gray-500">
                  Hiện chưa có bài tập nào được phân công.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assignments.map((assign) => {
                  const isClosed = assign.status === "CLOSED";
                  const isClosingSoon = assign.status === "CLOSING_SOON";

                  return (
                    <div
                      key={assign.id}
                      className="bg-white border border-[#E4E7EC] rounded-2xl p-7 shadow-sm card-hover flex flex-col justify-between"
                    >
                      <div>
                        {/* Status Badges */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#123B65]/10 text-[#123B65]">
                            {assign.course.code} — {assign.course.name}
                          </span>

                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                              isClosed
                                ? "bg-gray-100 text-gray-600"
                                : isClosingSoon
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {isClosed
                              ? "Đã đóng"
                              : isClosingSoon
                              ? "Sắp hết hạn"
                              : "Đang nhận bài"}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-[#123B65] mb-2">
                          {assign.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-[#344054] line-clamp-3 mb-4 leading-relaxed">
                          {assign.description}
                        </p>

                        {/* Requirements */}
                        {assign.requirements && (
                          <div className="bg-[#F4F7FB] rounded-xl p-3 mb-4 text-xs text-[#344054] space-y-1">
                            <span className="font-bold text-[#123B65] block">
                              Yêu cầu thực hiện:
                            </span>
                            <div className="whitespace-pre-line text-gray-600 text-[11px]">
                              {assign.requirements}
                            </div>
                          </div>
                        )}

                        {/* Meta info */}
                        <div className="space-y-1.5 text-xs text-gray-500 mb-6">
                          <div className="flex items-center">
                            <Clock className="w-3.5 h-3.5 text-[#2F80ED] mr-2 shrink-0" />
                            <span>
                              Hạn nộp:{" "}
                              <strong className="text-[#123B65]">
                                {formatDateTimeVN(assign.deadline)}
                              </strong>
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Info className="w-3.5 h-3.5 text-[#2F80ED] mr-2 shrink-0" />
                            <span>
                              Định dạng tệp: <strong>{assign.acceptedFormats}</strong> (Tối đa {assign.maxFileSizeMb}MB)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        {isClosed ? (
                          <span className="text-xs text-gray-400 italic">
                            Bài tập đã kết thúc thời gian nhận bài
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedCourseId(assign.courseId);
                              setSelectedAssignmentId(assign.id);
                              setActiveTab("submit");
                            }}
                            className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#2F80ED] hover:bg-[#206bc9] transition-all shadow-sm"
                          >
                            <UploadCloud className="w-4 h-4 mr-1.5" />
                            Nộp bài tập này ngay
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: BIỂU MẪU NỘP BÀI TẬP */}
        {/* ============================================================== */}
        {activeTab === "submit" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-8 bg-[#F4F7FB] border border-[#E4E7EC] rounded-3xl p-6 sm:p-10 shadow-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#123B65]">
                  Biểu mẫu Nộp bài tập Trực tuyến
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Vui lòng kiểm tra kỹ thông tin cá nhân và định dạng tệp trước khi gửi.
                </p>
              </div>

              {formError && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmission} className="space-y-6">
                {/* Row 1: Course & Assignment Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#123B65] mb-1.5">
                      1. Học phần đào tạo <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={selectedCourseId}
                      onChange={(e) => {
                        setSelectedCourseId(e.target.value);
                        setSelectedAssignmentId("");
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                      required
                    >
                      <option value="">-- Chọn học phần --</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code} — {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#123B65] mb-1.5">
                      2. Bài tập cần nộp <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={selectedAssignmentId}
                      onChange={(e) => setSelectedAssignmentId(e.target.value)}
                      disabled={!selectedCourseId}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#2F80ED] focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                      required
                    >
                      <option value="">-- Chọn bài tập --</option>
                      {availableAssignmentsForCourse.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.title} ({formatDateVN(a.deadline)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Student Identity */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#123B65] mb-1.5">
                      Họ và tên sinh viên <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Nguyễn Văn An"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#123B65] mb-1.5">
                      Mã sinh viên (MSSV) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: 21020015"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white font-mono focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#123B65] mb-1.5">
                      Lớp sinh hoạt <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: D21CNTT01"
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Row 3: Student Email */}
                <div>
                  <label className="block text-xs font-bold text-[#123B65] mb-1.5">
                    Địa chỉ Email sinh viên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="VD: an.nv21020015@student.edu.vn"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white font-mono focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                    required
                  />
                  <span className="text-[11px] text-gray-500 mt-1 block">
                    * Email này được dùng để gửi thông báo và tra cứu kết quả bảo mật.
                  </span>
                </div>

                {/* Row 4: File Upload Area */}
                <div>
                  <label className="block text-xs font-bold text-[#123B65] mb-1.5">
                    Tệp bài làm đính kèm <span className="text-rose-500">*</span>
                  </label>

                  <div className="border-2 border-dashed border-gray-300 hover:border-[#2F80ED] rounded-2xl p-6 bg-white text-center transition-colors">
                    <input
                      type="file"
                      id="submission-file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="submission-file"
                      className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2F80ED] flex items-center justify-center">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#123B65] hover:underline">
                          Nhấn để chọn tệp từ thiết bị
                        </span>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Hỗ trợ: {activeAssignment ? activeAssignment.acceptedFormats : "PDF, DOCX, ZIP,..."} (Tối đa {activeAssignment ? activeAssignment.maxFileSizeMb : 50}MB)
                        </p>
                      </div>
                    </label>

                    {file && (
                      <div className="mt-4 p-3 bg-blue-50/60 rounded-xl border border-blue-200 flex items-center justify-between text-left">
                        <div className="flex items-center space-x-2 truncate">
                          <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-bold text-[#123B65] truncate">
                              {file.name}
                            </p>
                            <p className="text-[11px] text-gray-500">
                              {formatBytes(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="text-xs text-rose-600 hover:underline shrink-0 ml-3"
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 5: Notes */}
                <div>
                  <label className="block text-xs font-bold text-[#123B65] mb-1.5">
                    Ghi chú hoặc lời nhắn thêm đến Giảng viên (Không bắt buộc)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="VD: Em xin gửi link video demo trong README; Nhóm gồm 2 bạn..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                  />
                </div>

                {/* Progress bar if submitting */}
                {submitting && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Đang mã hóa & tải lên máy chủ...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#2F80ED] h-2 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-[#2F80ED] hover:bg-[#206bc9] disabled:bg-gray-400 transition-all shadow-md shadow-[#2F80ED]/20 flex items-center justify-center space-x-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{submitting ? "Đang xử lý nộp bài..." : "Xác nhận & Nộp bài tập"}</span>
                </button>
              </form>
            </div>

            {/* Right Guide Column */}
            <div className="lg:col-span-4 space-y-6">
              {activeAssignment && (
                <div className="bg-white border border-[#E4E7EC] rounded-2xl p-6 shadow-xs">
                  <span className="text-[11px] font-bold text-[#2F80ED] uppercase tracking-wider block mb-1">
                    Thông tin bài tập đang chọn
                  </span>
                  <h3 className="text-base font-bold text-[#123B65] mb-2">
                    {activeAssignment.title}
                  </h3>
                  <div className="space-y-2 text-xs text-[#344054] pt-2 border-t border-gray-100">
                    <p>
                      <strong>Hạn nộp:</strong>{" "}
                      <span className="text-rose-600 font-semibold">
                        {formatDateTimeVN(activeAssignment.deadline)}
                      </span>
                    </p>
                    <p>
                      <strong>Định dạng cho phép:</strong>{" "}
                      <span className="font-mono">{activeAssignment.acceptedFormats}</span>
                    </p>
                    <p>
                      <strong>Dung lượng tối đa:</strong> {activeAssignment.maxFileSizeMb} MB
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-[#123B65] text-white rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#2F80ED]" />
                  <h4 className="font-bold text-sm">Quy chế nộp bài trực tuyến</h4>
                </div>
                <ul className="text-xs text-blue-100/90 space-y-2.5 list-disc pl-4 leading-relaxed">
                  <li>
                    Thời gian nộp bài được ghi nhận tự động theo đồng hồ máy chủ.
                  </li>
                  <li>
                    Các bài nộp sau thời điểm hạn chót sẽ được đánh dấu <strong>Nộp muộn</strong>.
                  </li>
                  <li>
                    Sau khi nộp thành công, sinh viên nhận ngay <strong>Mã biên nhận (Receipt Code)</strong>.
                  </li>
                  <li>
                    Hãy lưu lại Mã biên nhận để tra cứu kết quả chấm điểm hoặc khi có thắc mắc vấn đáp.
                  </li>
                  <li>
                    Bài làm của sinh viên được lưu trữ bảo mật riêng tư, không công khai cho người khác.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: TRA CỨU BIÊN NHẬN & KẾT QUẢ NỘP BÀI */}
        {/* ============================================================== */}
        {activeTab === "lookup" && (
          <div className="space-y-8">
            <div className="max-w-2xl mx-auto bg-[#F4F7FB] border border-[#E4E7EC] rounded-3xl p-6 sm:p-10 shadow-sm text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#123B65] text-white flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#123B65]">
                Tra cứu Trạng thái Nộp bài & Biên nhận
              </h2>
              <p className="text-xs text-[#344054] mt-2 mb-6 max-w-md mx-auto">
                Nhập Mã sinh viên và Mã biên nhận (hoặc Email sinh viên) để kiểm tra thời gian ghi nhận và điểm số.
              </p>

              {lookupError && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-center space-x-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{lookupError}</span>
                </div>
              )}

              <form onSubmit={handleLookup} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-[#123B65] mb-1">
                    Mã sinh viên (MSSV) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 21020015"
                    value={lookupStudentId}
                    onChange={(e) => setLookupStudentId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white font-mono focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#123B65] mb-1">
                    Mã biên nhận (VD: REC-202610-8472) HOẶC Email đã nộp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập Mã biên nhận hoặc Email sinh viên"
                    value={lookupKey}
                    onChange={(e) => setLookupKey(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="w-full py-3 px-6 rounded-xl text-sm font-bold text-white bg-[#123B65] hover:bg-[#1a4a7e] disabled:bg-gray-400 transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{lookupLoading ? "Đang tra cứu..." : "Tra cứu thông tin bài nộp"}</span>
                </button>
              </form>
            </div>

            {/* Lookup Results */}
            {lookupResults && (
              <div className="max-w-4xl mx-auto space-y-4">
                <h3 className="text-lg font-bold text-[#123B65]">
                  Kết quả bài nộp của bạn ({lookupResults.length})
                </h3>

                {lookupResults.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white border border-[#E4E7EC] rounded-2xl p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                      <div>
                        <span className="text-xs font-bold text-[#2F80ED] uppercase">
                          {sub.courseName}
                        </span>
                        <h4 className="text-lg font-bold text-[#123B65]">
                          {sub.assignmentTitle}
                        </h4>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            sub.isLate
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {sub.isLate ? "Nộp muộn" : "Đúng hạn"}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            sub.gradingStatus === "GRADED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {sub.gradingStatus === "GRADED" ? "Đã chấm điểm" : "Chờ giảng viên chấm"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[#344054]">
                      <div>
                        <p className="text-gray-400">Mã Biên Nhận:</p>
                        <p className="font-mono font-bold text-[#123B65]">
                          {sub.receiptCode}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Thời gian máy chủ ghi nhận:</p>
                        <p className="font-semibold">
                          {formatDateTimeVN(sub.submittedAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Tệp đã nộp:</p>
                        <p className="font-semibold truncate">
                          {sub.fileOriginalName} ({formatBytes(sub.fileSize)})
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Điểm số:</p>
                        <p className="text-base font-extrabold text-[#123B65]">
                          {sub.score !== null ? `${sub.score} / 10` : "Chưa có điểm"}
                        </p>
                      </div>
                    </div>

                    {sub.feedback && (
                      <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs">
                        <p className="font-bold text-[#123B65] mb-1">
                          Nhận xét của Giảng viên:
                        </p>
                        <p className="text-[#344054] italic">{sub.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL BIÊN NHẬN NỘP BÀI THÀNH CÔNG */}
        {/* ============================================================== */}
        {receiptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-gray-100 relative space-y-6">
              {/* Top icon */}
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-extrabold text-[#123B65]">
                  Nộp Bài Tập Thành Công!
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Biên nhận chính thức được lưu trên máy chủ giảng viên.
                </p>
              </div>

              {/* Receipt Box */}
              <div className="bg-[#F4F7FB] border border-[#E4E7EC] rounded-2xl p-5 space-y-3 text-xs text-[#344054]">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-500">Mã Biên Nhận (Receipt Code):</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono font-extrabold text-sm text-[#123B65]">
                      {receiptModal.receiptCode}
                    </span>
                    <button
                      onClick={() => copyReceiptToClipboard(receiptModal.receiptCode)}
                      className="p-1 text-gray-500 hover:text-[#2F80ED] rounded"
                      title="Sao chép mã"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400 block">Sinh viên:</span>
                    <strong className="text-[#123B65]">{receiptModal.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Mã số sinh viên:</span>
                    <strong className="text-[#123B65] font-mono">{receiptModal.studentId}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Lớp:</span>
                    <strong className="text-[#123B65]">{receiptModal.studentClass}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Trạng thái:</span>
                    <strong className={receiptModal.isLate ? "text-rose-600" : "text-emerald-600"}>
                      {receiptModal.isLate ? "Nộp muộn" : "Đúng hạn"}
                    </strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-400 block">Bài tập & Môn học:</span>
                  <span className="font-medium text-[#123B65] block">
                    {receiptModal.assignmentTitle}
                  </span>
                  <span className="text-gray-500 text-[11px]">
                    {receiptModal.courseName}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-200 text-[11px] text-gray-500">
                  <span>Thời gian máy chủ: {formatDateTimeVN(receiptModal.submittedAt)}</span>
                  <br />
                  <span>Tệp: {receiptModal.fileName} ({formatBytes(receiptModal.fileSize)})</span>
                </div>
              </div>

              {copiedCode && (
                <p className="text-xs text-center text-emerald-600 font-medium">
                  Đã sao chép Mã Biên Nhận vào bộ nhớ đệm!
                </p>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-1/2 py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-[#123B65] hover:bg-gray-100 flex items-center justify-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In biên nhận</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReceiptModal(null)}
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-[#123B65] text-xs font-bold text-white hover:bg-[#1a4a7e]"
                >
                  Hoàn tất
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SubmissionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-24 text-center">
          <div className="w-8 h-8 border-4 border-[#2F80ED] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Đang tải cổng nộp bài tập...</p>
        </div>
      }
    >
      <SubmissionsContent />
    </Suspense>
  );
}
