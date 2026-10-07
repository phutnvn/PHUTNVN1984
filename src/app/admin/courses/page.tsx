"use client";

import { useEffect, useState } from "react";
import { BookOpen, Edit, Plus, Trash2, X } from "lucide-react";

interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  targetStudents: string | null;
  objectives: string | null;
  syllabus: string | null;
  semester: string | null;
  academicYear: string | null;
  isActive: boolean;
  _count?: {
    assignments: number;
    resources: number;
  };
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal create/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetStudents, setTargetStudents] = useState("");
  const [objectives, setObjectives] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [semester, setSemester] = useState("Học kỳ 1");
  const [academicYear, setAcademicYear] = useState("2025 — 2026");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCourses = () => {
    setLoading(true);
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) setCourses(data.courses);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setCode("");
    setName("");
    setDescription("");
    setTargetStudents("");
    setObjectives("");
    setSyllabus("");
    setSemester("Học kỳ 1");
    setAcademicYear("2025 — 2026");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (c: Course) => {
    setEditingId(c.id);
    setCode(c.code);
    setName(c.name);
    setDescription(c.description);
    setTargetStudents(c.targetStudents || "");
    setObjectives(c.objectives || "");
    setSyllabus(c.syllabus || "");
    setSemester(c.semester || "Học kỳ 1");
    setAcademicYear(c.academicYear || "2025 — 2026");
    setIsActive(c.isActive);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      id: editingId,
      code,
      name,
      description,
      targetStudents,
      objectives,
      syllabus,
      semester,
      academicYear,
      isActive,
    };

    try {
      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/admin/courses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchCourses();
      } else {
        const err = await res.json();
        alert(err.error || "Lỗi lưu học phần.");
      }
    } catch {
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa học phần này cùng toàn bộ bài tập và tài liệu liên quan?"))
      return;

    try {
      const res = await fetch(`/api/admin/courses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCourses();
      } else {
        alert("Lỗi xóa học phần.");
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
            Quản lý Học phần Giảng dạy
          </h1>
          <p className="text-xs text-[#344054] mt-1">
            Thêm mới, cập nhật đề cương hoặc ẩn/hiện môn học trên giao diện sinh viên.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-[#2F80ED] text-white hover:bg-[#206bc9] transition-all shadow-md shadow-[#2F80ED]/20"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Thêm học phần mới
        </button>
      </div>

      {/* Courses List */}
      <div className="bg-white border border-[#E4E7EC] rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-[#2F80ED] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500">Đang tải danh sách môn học...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F7FB] text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Mã Môn</th>
                  <th className="py-3 px-3">Tên Môn Học</th>
                  <th className="py-3 px-3">Học Kỳ & Năm Học</th>
                  <th className="py-3 px-3 text-center">Bài Tập</th>
                  <th className="py-3 px-3 text-center">Tài Liệu</th>
                  <th className="py-3 px-3">Hiển Thị</th>
                  <th className="py-3 px-4 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-[#123B65]">
                      {c.code}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-[#123B65]">{c.name}</p>
                      <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                        {c.description}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-gray-600">
                      {c.semester} — {c.academicYear}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-[#123B65]">
                      {c._count?.assignments ?? 0}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-[#123B65]">
                      {c._count?.resources ?? 0}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {c.isActive ? "Đang mở" : "Đã ẩn"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 text-gray-500 hover:text-[#2F80ED] hover:bg-blue-50 rounded"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
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

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-extrabold text-[#123B65]">
                {editingId ? "Chỉnh Sửa Học Phần" : "Thêm Học Phần Mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#123B65] mb-1">
                    Mã môn học <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: IT3010"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono uppercase focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#123B65] mb-1">
                    Tên môn học <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Lập trình Web Nâng cao"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B65] mb-1">
                  Mô tả môn học <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả tóm tắt nội dung và mục tiêu học phần..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B65] mb-1">
                  Đối tượng sinh viên
                </label>
                <input
                  type="text"
                  placeholder="VD: Sinh viên năm 3 ngành CNTT..."
                  value={targetStudents}
                  onChange={(e) => setTargetStudents(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B65] mb-1">
                  Chuẩn đầu ra / Mục tiêu học tập (phân cách bằng dấu chấm phẩy ;)
                </label>
                <textarea
                  rows={2}
                  placeholder="1. Thành thạo Next.js; 2. Thiết kế RESTful API; 3. Triển khai Cloud"
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B65] mb-1">
                  Khung đề cương chi tiết
                </label>
                <textarea
                  rows={3}
                  placeholder="Chương 1: ... | Chương 2: ... | Chương 3: ..."
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#123B65] mb-1">
                    Học kỳ
                  </label>
                  <input
                    type="text"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#123B65] mb-1">
                    Năm học
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="course-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-gray-300 text-[#2F80ED] focus:ring-[#2F80ED]"
                />
                <label htmlFor="course-active" className="text-xs font-semibold text-[#123B65]">
                  Hiển thị học phần công khai cho sinh viên
                </label>
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
                  {saving ? "Đang lưu..." : "Lưu Học Phần"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
