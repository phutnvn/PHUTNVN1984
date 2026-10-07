"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Save, User } from "lucide-react";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          const p = data.profile;
          setFullName(p.fullName || "");
          setTitle(p.title || "");
          setTagline(p.tagline || "");
          setEmail(p.email || "");
          setPhone(p.phone || "");
          setWorkplace(p.workplace || "");
          setOfficeLocation(p.officeLocation || "");
          setBio(p.bio || "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          title,
          tagline,
          email,
          phone,
          workplace,
          officeLocation,
          bio,
        }),
      });

      if (res.ok) {
        setSuccess("Đã cập nhật thông tin hồ sơ giảng viên thành công!");
      } else {
        alert("Lỗi lưu hồ sơ giảng viên.");
      }
    } catch {
      alert("Lỗi kết nối.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-[#2F80ED] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-gray-500">Đang nạp dữ liệu hồ sơ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#123B65]">
          Quản lý Hồ sơ Giảng viên
        </h1>
        <p className="text-xs text-[#344054] mt-1">
          Chỉnh sửa thông tin cá nhân, chức danh học thuật, địa chỉ phòng làm việc và lời giới thiệu hiển thị ngoài trang chủ và trang giới thiệu.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-[#E4E7EC] rounded-3xl p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-[#123B65] mb-1.5">
              Họ và tên hiển thị <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#123B65] mb-1.5">
              Chức danh / Vị trí <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#123B65] mb-1.5">
            Dòng khẩu hiệu học thuật (Tagline)
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-[#123B65] mb-1.5">
              Email công tác <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#123B65] mb-1.5">
              Số điện thoại
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-[#123B65] mb-1.5">
              Đơn vị công tác (Khoa / Trường)
            </label>
            <input
              type="text"
              value={workplace}
              onChange={(e) => setWorkplace(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#123B65] mb-1.5">
              Văn phòng làm việc / Phòng tiếp sinh viên
            </label>
            <input
              type="text"
              value={officeLocation}
              onChange={(e) => setOfficeLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#123B65] mb-1.5">
            Tiểu sử & Định hướng giáo dục (Bio)
          </label>
          <textarea
            rows={5}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-bold bg-[#2F80ED] text-white hover:bg-[#206bc9] disabled:bg-gray-400 transition-all shadow-md"
          >
            <Save className="w-4 h-4 mr-2" />
            <span>{saving ? "Đang lưu..." : "Lưu Thay Đổi"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
