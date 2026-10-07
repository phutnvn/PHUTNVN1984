"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  ChevronRight,
  ExternalLink,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  ShieldCheck,
  UploadCloud,
  User,
  X,
} from "lucide-react";

const ADMIN_NAV = [
  { label: "Dashboard Thống kê", href: "/admin", icon: LayoutDashboard },
  { label: "Quản lý Bài tập", href: "/admin/assignments", icon: UploadCloud },
  { label: "Quản lý Bài nộp", href: "/admin/submissions", icon: FileText },
  { label: "Quản lý Học phần", href: "/admin/courses", icon: BookOpen },
  { label: "Quản lý Tài liệu", href: "/admin/resources", icon: GraduationCap },
  { label: "Quản lý Thông báo", href: "/admin/announcements", icon: Bell },
  { label: "Hồ sơ Giảng viên", href: "/admin/profile", icon: User },
  { label: "Thư Liên hệ", href: "/admin/messages", icon: Mail },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, render children directly
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    fetch("/api/admin/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.replace("/admin/login");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data && data.user) {
          setCurrentUser(data.user);
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        router.replace("/admin/login");
      });
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#2F80ED] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-[#123B65]">
            Đang xác thực quyền truy cập giảng viên...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-[#123B65] text-white shrink-0 shadow-xl">
        {/* Brand */}
        <div className="p-6 border-b border-blue-900/50 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#2F80ED] flex items-center justify-center text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-white">
              TRINH MINH PHU
            </h1>
            <p className="text-[11px] text-blue-200">Khu vực Giảng viên</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#2F80ED] text-white shadow-md shadow-[#2F80ED]/30"
                    : "text-blue-100 hover:bg-blue-900/50 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 mr-3 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom user profile & logout */}
        <div className="p-4 border-t border-blue-900/50 space-y-3">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold text-xs">
              P
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {currentUser?.name || "ThS. Trịnh Minh Phú"}
              </p>
              <p className="text-[10px] text-blue-300 truncate font-mono">
                {currentUser?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-200 hover:bg-rose-500 hover:text-white transition-all"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-[#E4E7EC] h-16 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-400">
              <span>Hệ thống Quản lý Giảng dạy</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-[#123B65]">Trang Quản trị</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-[#123B65] bg-[#F4F7FB] border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-[#2F80ED]" />
              Xem trang web chính
            </Link>

            <div className="h-4 w-px bg-gray-200" />

            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-[#123B65] hidden md:inline">
                {currentUser?.name || "Giảng viên"}
              </span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-64 bg-[#123B65] text-white flex flex-col z-10 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900">
              <span className="font-bold text-sm">TRINH MINH PHU</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 text-blue-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {ADMIN_NAV.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-lg text-xs font-semibold ${
                      isActive
                        ? "bg-[#2F80ED] text-white"
                        : "text-blue-100 hover:bg-blue-900"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="w-full py-2 text-center text-xs font-semibold bg-rose-600 rounded-lg text-white"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
