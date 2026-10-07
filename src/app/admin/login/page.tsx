"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("phutm@tnus.edu.vn");
  const [password, setPassword] = useState("AdminPassword2026@");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Email hoặc mật khẩu không chính xác.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Lỗi kết nối máy chủ khi đăng nhập.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#123B65] flex items-center justify-center text-white shadow-lg">
            <GraduationCap className="w-9 h-9 text-[#2F80ED]" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-extrabold text-[#123B65]">
          CỔNG QUẢN TRỊ GIẢNG VIÊN
        </h2>
        <p className="mt-1 text-center text-xs text-[#344054]">
          Hệ thống Quản lý Học tập & Thu Bài tập Trực tuyến — ThS. Trịnh Minh Phú
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-[#E4E7EC] sm:px-10 space-y-6">
          <div className="flex items-center space-x-2 text-xs text-[#123B65] bg-blue-50/70 p-3 rounded-xl border border-blue-100">
            <ShieldCheck className="w-4 h-4 text-[#2F80ED] shrink-0" />
            <span>Khu vực bảo mật chỉ dành cho Giảng viên và Quản trị viên.</span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#123B65] mb-1">
                Email Giảng viên
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@trinhminhphu.edu.vn"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B65] mb-1">
                Mật khẩu quản trị
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#123B65] hover:bg-[#1c4b7b] disabled:bg-gray-400 transition-all shadow-md shadow-[#123B65]/20 flex items-center justify-center space-x-2"
            >
              <span>{loading ? "Đang xác thực..." : "Đăng nhập Cổng Quản trị"}</span>
            </button>
          </form>

          {/* Quick note on credentials */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-500">
            <p className="font-semibold text-[#123B65]">Tài khoản mẫu đã thiết lập sẵn:</p>
            <p>Email: <code className="text-[#2F80ED]">phutm@tnus.edu.vn</code></p>
            <p>Mật khẩu: <code className="text-[#2F80ED]">AdminPassword2026@</code></p>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center text-xs text-[#344054] hover:text-[#123B65]"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Quay về Trang chủ công khai
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
