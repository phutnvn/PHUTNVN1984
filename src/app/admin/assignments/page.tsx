"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Edit,
  FileCheck,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { formatDateTimeVN } from "@/lib/utils";

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
  _count?: {
    submissions: number;
  };
}

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal create/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [deadline, setDeadline] = useState("");
  const [acceptedFormats, setAcceptedFormats] = useState("PDF,DOCX,ZIP");
  const [maxFileSizeMb, setMaxFileSizeMb] = useState("50");
  const [status, setStatus] = useState("OPEN");
  const [saving, setSaving] = useState(false);

  const fetchAssignments = () => {
    setLoading(true);
    fetch("/api/assignments")
      .then((res) => res.json())
      .then((data) => {
        if (data.assignments) setAssignments(data.assignments);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAssignments();
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) setCourses(data.courses);
      });
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setCourseId(courses[0]?.id || "");
    setDescription("");
    setRequirements("");
    // Default deadline: 7 days from now formatted for datetime-local
    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const tzOffset = future.getTimezoneOffset() * 60000;
    const localISOTime = new Date(future.getTime() - tzOffset).toISOString().slice(0, 16);
    setDeadline(localISOTime);
    setAcceptedFormats("PDF,DOCX,ZIP");
    setMaxFileSizeMb("50");
    setStatus("OPEN");
    setIsModalOpen(true);
  };

  const openEditModal = (a: Assignment) => {
    setEditingId(a.id);
    setTitle(a.title);
    setCourseId(a.courseId);
    setDescription(a.description);
    setRequirements(a.requirements || "");
    const d = new Date(a.deadline);
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
    setDeadline(localISOTime);
    setAcceptedFormats(a.acceptedFormats);
    setMaxFileSizeMb(String(a.maxFileSizeMb));
    setStatus(a.status);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      id: editingId,
      title,
      courseId,
      description,
      requirements,
      deadline,
      acceptedFormats,
      maxFileSizeMb,
      status,
    };

    try {
      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/admin/assignments", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchAssignments();
      } else {
        const err = await res.json();
        alert(err.error || "Lỗi lưu bài tập.");
      }
    } catch {
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài tập này cùng toàn bộ bài nộp liên quan?"))
      return;

    try {
      const res = await fetch(`/api/admin/assignments?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchAssignments();
      } else {
        alert("Lỗi khi xóa bài tập.");
      }
    } catch {
      alert("Lỗi kết nối máy chủ.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#123B65]">
            Quản lý Bài tập & Hạn nộp
          </h1>
          <p className="text-xs text-[#344054] mt-1">
            Thiết lập các đợt nộp bài tập, quy định định dạng tệp và hạn chót cho từng học phần.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-[#2F80ED] text-white hover:bg-[#206bc9] transition-all shadow-md shadow-[#2F80ED]/20"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Tạo bài tập mới
        </button>
      </div>

      {/* Assignments List Table */}
      <div className="bg-white border border-[#E4E7EC] rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-[#2F80ED] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500">Đang tải danh sách bài tập...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F7FB] text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Tên Bài Tập</th>
                  <th className="py-3 px-3">Học Phần</th>
                  <th className="py-3 px-3">Hạn Nộp</th>
                  <th className="py-3 px-3">Định Dạng / Max Size</th>
                  <th className="py-3 px-3">Trạng Thái</th>
                  <th className="py-3 px-3 text-center">Đã Nộp</th>
                  <th className="py-3 px-4 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assignments.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/80">
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-bold text-[#123B65] line-clamp-1">{a.title}</p>
                      <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                        {a.description}
                      </p>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-mono font-bold bg-blue-50 text-[#123B65] px-2 py-0.5 rounded text-[11px]">
                        {a.course.code}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">
                      {formatDateTimeVN(a.deadline)}
                    </td>

                    <td className="py-3 px-3 text-gray-500">
                      <span className="font-mono text-[11px]">{a.acceptedFormats}</span>
                      <span className="text-[10px] text-gray-400 block">
                        ({a.maxFileSizeMb} MB)
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          a.status === "CLOSED"
                            ? "bg-gray-100 text-gray-600"
                            : a.status === "CLOSING_SOON"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {a.status === "CLOSED"
                          ? "Đã đóng"
                          : a.status === "CLOSING_SOON"
                          ? "Sắp hết hạn"
                          : "Đang mở"}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center font-bold text-[#123B65]">
                      {a._count?.submissions ?? 0}
                    </td>

                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(a)}
                        className="p-1.5 text-gray-500 hover:text-[#2F80ED] hover:bg-blue-50 rounded"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-extrabold text-[#123B65]">
                {editingId ? "Chỉnh Sửa Bài Tập" : "Tạo Bài Tập Mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#123B65] mb-1">
                  Thuộc Học Phần <span className="text-rose-500">*</span>
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                  required
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B65] mb-1">
                  Tiêu đề bài tập <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Bài tập lớn: Xây dựng hệ thống Web Full-stack..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B65] mb-1">
                  Mô tả bài tập <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả mục tiêu và nội dung cơ bản của bài tập..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B65] mb-1">
                  Yêu cầu thực hiện & Đóng gói sản phẩm
                </label>
                <textarea
                  rows={3}
                  placeholder="1. File mã nguồn định dạng .zip;&#10;2. Báo cáo định dạng .pdf;&#10;3. Quy tắc đặt tên file..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#123B65] mb-1">
                    Hạn nộp bài <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#123B65] mb-1">
                    Trạng thái thu bài
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                  >
                    <option value="OPEN">Đang nhận bài (OPEN)</option>
                    <option value="CLOSING_SOON">Sắp đến hạn (CLOSING SOON)</option>
                    <option value="CLOSED">Đã đóng nhận bài (CLOSED)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#123B65] mb-1">
                    Định dạng tệp cho phép (phân cách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    placeholder="PDF,DOCX,ZIP,SQL,CPP"
                    value={acceptedFormats}
                    onChange={(e) => setAcceptedFormats(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono uppercase focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#123B65] mb-1">
                    Dung lượng tối đa (MB)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={maxFileSizeMb}
                    onChange={(e) => setMaxFileSizeMb(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-[#2F80ED] text-xs font-bold text-white hover:bg-[#206bc9] disabled:bg-gray-400 shadow-md"
                >
                  {saving ? "Đang lưu..." : "Lưu Bài Tập"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
