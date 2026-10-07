"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  GraduationCap,
  BookOpen,
  FileText,
  UploadCloud,
  Mail,
  User,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Trang chủ", href: "/", icon: GraduationCap },
  { label: "Giới thiệu", href: "/about", icon: User },
  { label: "Giảng dạy", href: "/teaching", icon: BookOpen },
  { label: "Tài liệu học tập", href: "/resources", icon: FileText },
  { label: "Nộp bài tập", href: "/submissions", icon: UploadCloud, highlight: true },
  { label: "Liên hệ", href: "/contact", icon: Mail },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // If in admin dashboard, don't show public navbar
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E4E7EC] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand Name */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-[#123B65] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <GraduationCap className="w-6 h-6 text-[#2F80ED]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#123B65] group-hover:text-[#2F80ED] transition-colors">
                TRINH MINH PHU
              </span>
              <span className="text-xs font-medium text-[#344054] tracking-wide">
                Giảng viên | Công nghệ thông tin
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              if (item.highlight) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`ml-2 inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                      isActive
                        ? "bg-[#123B65] text-white shadow-md ring-2 ring-[#2F80ED]/30"
                        : "bg-[#2F80ED] hover:bg-[#256fd1] text-white"
                    }`}
                  >
                    <UploadCloud className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#123B65] font-semibold bg-[#F4F7FB]"
                      : "text-[#344054] hover:text-[#123B65] hover:bg-[#F4F7FB]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="h-5 w-px bg-gray-200 mx-2" />

            {/* Portal Link */}
            <Link
              href="/admin"
              className="inline-flex items-center px-3 py-2 text-xs font-medium text-[#344054] hover:text-[#123B65] hover:bg-[#F4F7FB] rounded-lg transition-colors border border-gray-200"
              title="Khu vực dành cho Giảng viên quản lý"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#123B65]" />
              Cổng Giảng Viên
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden space-x-2">
            <Link
              href="/submissions"
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#2F80ED] text-white"
            >
              <UploadCloud className="w-3.5 h-3.5 mr-1" />
              Nộp bài
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-lg text-gray-600 hover:text-[#123B65] hover:bg-gray-100 focus:outline-none"
              aria-label="Mở menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 shadow-xl animate-fadeIn">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-base font-medium ${
                    isActive
                      ? "bg-[#123B65] text-white"
                      : "text-[#344054] hover:bg-[#F4F7FB] hover:text-[#123B65]"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mr-3 ${
                      isActive ? "text-white" : "text-[#2F80ED]"
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-gray-100 mt-2">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <ShieldCheck className="w-5 h-5 mr-3 text-gray-500" />
                Cổng quản trị Giảng viên
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
