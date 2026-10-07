"use client";

import { useEffect, useState } from "react";
import { Bell, Pin, Plus, Trash2, X } from "lucide-react";
import { formatDateVN } from "@/lib/utils";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [courseId, setCourseId] = useState("none");
  const [isPinned, setIsPinned] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAnnouncements = () => {
    setLoading(true);
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => {
        if (data.announcements) setAnnouncements(data.announcements);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnnouncements();
    fetch("/api/courses")
      .then((r) => r.json())
      .then((d) => {
        if (d.courses) setCourses(d.courses);
      });
  }, []);

  const openModal = () => {
    setTitle("");
    setContent("");
    setCourseId("none");
    setIsPinned(true);
    setIsModalOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          courseId,
          isPinned,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchAnnouncements();
      } else {
        const err = await res.json();
        alert(err.error || "Lỗi tạo thông báo.");
      }
    } catch {
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xóa thông báo này?")) return;
    try {
      const res = await fetch(`/api/admin/announcements?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchAnnouncements();
    } catch {
      alert("Lỗi kết nối.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#123B65]">
            Quản lý Thông báo Học tập
          </h1>
          <p className="text-xs text-[#344054] mt-1">
            Đăng tải thông báo quan trọng, lịch thi, lịch nộp bài hoặc dời phòng học.
          </p>
        </div>

        <button
          onClick={openModal}
          className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-[#2F80ED] text-white hover:bg-[#206bc9] transition-all shadow-md shadow-[#2F80ED]/20"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Tạo thông báo mới
        </button>
      </div>

      <div className="bg-white border border-[#E4E7EC] rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-[#2F80ED] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500">Đang tải danh sách thông báo...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-500">Chưa có thông báo nào</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-6 hover:bg-gray-50/60 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center space-x-2">
                    {ann.isPinned && (
                      <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Pin className="w-3 h-3 mr-1" />
                        Ghim đầu trang
                      </span>
                    )}

                    <span className="text-[11px] font-bold text-[#2F80ED]">
                      {ann.course ? `${ann.course.code} — ${ann.course.name}` : "Thông báo chung"}
                    </span>

                    <span className="text-[11px] text-gray-400">
                      • {formatDateVN(ann.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#123B65]">{ann.title}</h3>
                  <p className="text-xs text-[#344054] leading-relaxed whitespace-pre-line">
                    {ann.content}
                  </p>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Xóa thông báo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-extrabold text-[#123B65]">
                Tạo Thông Báo Mới
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
                  Thuộc học phần
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                >
                  <option value="none">-- Thông báo chung cho mọi sinh viên --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B65] mb-1">
                  Tiêu đề thông báo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Hướng dẫn nộp bài tập lớn và thời gian vấn đáp..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B65] mb-1">
                  Nội dung thông báo <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Nhập nội dung thông báo chi tiết..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="pin-check"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded border-gray-300 text-[#2F80ED] focus:ring-[#2F80ED]"
                />
                <label htmlFor="pin-check" className="text-xs font-semibold text-[#123B65]">
                  Ghim thông báo này lên đầu danh sách
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
                  {saving ? "Đang lưu..." : "Đăng Thông Báo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
