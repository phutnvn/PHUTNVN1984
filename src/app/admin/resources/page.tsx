"use client";

import { useEffect, useState } from "react";
import { Download, ExternalLink, FileText, Lock, Plus, Trash2, Unlock, X } from "lucide-react";
import { formatDateVN } from "@/lib/utils";

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("none");
  const [fileType, setFileType] = useState("PDF");
  const [fileUrl, setFileUrl] = useState("");
  const [isRestricted, setIsRestricted] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchResources = () => {
    setLoading(true);
    fetch("/api/resources")
      .then((res) => res.json())
      .then((data) => {
        if (data.resources) setResources(data.resources);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResources();
    fetch("/api/courses")
      .then((r) => r.json())
      .then((d) => {
        if (d.courses) setCourses(d.courses);
      });
  }, []);

  const openModal = () => {
    setTitle("");
    setDescription("");
    setCourseId("none");
    setFileType("PDF");
    setFileUrl("");
    setIsRestricted(false);
    setIsModalOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          courseId,
          fileType,
          fileUrl,
          isRestricted,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchResources();
      } else {
        const err = await res.json();
        alert(err.error || "Lỗi lưu tài liệu.");
      }
    } catch {
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xóa tài liệu này?")) return;
    try {
      const res = await fetch(`/api/admin/resources?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchResources();
    } catch {
      alert("Lỗi kết nối.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#123B65]">
            Quản lý Tài liệu & Học liệu số
          </h1>
          <p className="text-xs text-[#344054] mt-1">
            Đăng tải slide bài giảng, đề cương và giáo trình cho sinh viên tham khảo.
          </p>
        </div>

        <button
          onClick={openModal}
          className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-[#2F80ED] text-white hover:bg-[#206bc9] transition-all shadow-md shadow-[#2F80ED]/20"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Thêm tài liệu mới
        </button>
      </div>

      <div className="bg-white border border-[#E4E7EC] rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-[#2F80ED] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500">Đang tải danh mục tài liệu...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F7FB] text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Tên Tài Liệu</th>
                  <th className="py-3 px-3">Loại</th>
                  <th className="py-3 px-3">Học Phần</th>
                  <th className="py-3 px-3">Quyền Truy Cập</th>
                  <th className="py-3 px-3">Ngày Đăng</th>
                  <th className="py-3 px-4 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {resources.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/80">
                    <td className="py-3 px-4 max-w-sm">
                      <p className="font-bold text-[#123B65] line-clamp-1">{r.title}</p>
                      <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                        {r.description || "—"}
                      </p>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono font-bold bg-blue-100 text-[#123B65] px-2 py-0.5 rounded text-[10px]">
                        {r.fileType}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      {r.course ? (
                        <span className="font-semibold text-gray-700">
                          {r.course.code}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Chung</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      {r.isRestricted ? (
                        <span className="inline-flex items-center text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Lock className="w-3 h-3 mr-1" />
                          Nội bộ
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <Unlock className="w-3 h-3 mr-1" />
                          Công khai
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-gray-500 whitespace-nowrap">
                      {formatDateVN(r.createdAt)}
                    </td>

                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <a
                        href={r.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center p-1.5 text-gray-500 hover:text-[#2F80ED] rounded"
                        title="Xem liên kết"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded"
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

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-extrabold text-[#123B65]">
                Thêm Tài Liệu Học Tập Mới
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#123B65] mb-1">
                  Tên tài liệu / Bài giảng <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Giáo trình & Slide Chương 3 - Next.js App Router"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B65] mb-1">
                  Mô tả ngắn
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả tóm tắt nội dung tài liệu..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#123B65] mb-1">
                    Thuộc học phần
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                  >
                    <option value="none">-- Tài liệu chung --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#123B65] mb-1">
                    Loại định dạng
                  </label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX (Word)</option>
                    <option value="PPTX">PPTX (PowerPoint)</option>
                    <option value="XLSX">XLSX (Excel)</option>
                    <option value="LINK">Liên kết trực tuyến</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B65] mb-1">
                  Đường dẫn tệp (URL / Google Drive / Github / ...) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... hoặc https://github.com/..."
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none font-mono"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="restricted-check"
                  checked={isRestricted}
                  onChange={(e) => setIsRestricted(e.target.checked)}
                  className="rounded border-gray-300 text-[#2F80ED] focus:ring-[#2F80ED]"
                />
                <label htmlFor="restricted-check" className="text-xs font-semibold text-[#123B65]">
                  Chỉ dành cho sinh viên nội bộ của học phần (Có gắn nhãn Nội bộ)
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
                  {saving ? "Đang lưu..." : "Lưu Tài Liệu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
