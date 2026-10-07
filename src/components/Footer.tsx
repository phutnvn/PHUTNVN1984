import Link from "next/link";
import { GraduationCap, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#123B65] text-white pt-14 pb-8 border-t border-blue-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Bio / Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#2F80ED] flex items-center justify-center text-white">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white block">
                  TRỊNH MINH PHÚ
                </span>
                <span className="text-xs text-blue-200">
                  Khoa Toán - Tin, Trường Đại học Khoa học
                </span>
              </div>
            </div>
            <p className="text-sm text-blue-100/80 leading-relaxed">
              Trang thông tin học thuật, tài liệu bài giảng và cổng nộp bài tập trực tuyến chính thức phục vụ sinh viên các học phần công nghệ thông tin.
            </p>
            <div className="flex items-center space-x-3 text-xs text-blue-200">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Cổng nộp bài đang mở cho học kỳ hiện tại</span>
            </div>
          </div>

          {/* Col 2: Liên kết nhanh */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-blue-200 mb-4">
              Điều hướng chính
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-blue-100 hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-blue-100 hover:text-white transition-colors">
                  Giới thiệu & Quá trình công tác
                </Link>
              </li>
              <li>
                <Link href="/teaching" className="text-blue-100 hover:text-white transition-colors">
                  Học phần & Đề cương
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-blue-100 hover:text-white transition-colors">
                  Tài liệu & Học liệu số
                </Link>
              </li>
              <li>
                <Link href="/submissions" className="text-blue-100 hover:text-white transition-colors">
                  Cổng nộp bài tập trực tuyến
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-blue-100 hover:text-white transition-colors">
                  Liên hệ giảng viên
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Dành cho Sinh viên */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-blue-200 mb-4">
              Dành cho Sinh viên
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/submissions?tab=submit" className="text-blue-100 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F80ED] mr-2"></span>
                  Nộp bài tập trực tuyến
                </Link>
              </li>
              <li>
                <Link href="/submissions?tab=lookup" className="text-blue-100 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F80ED] mr-2"></span>
                  Tra cứu biên nhận nộp bài
                </Link>
              </li>
              <li>
                <Link href="/resources?type=PDF" className="text-blue-100 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F80ED] mr-2"></span>
                  Tải Slide bài giảng (PDF)
                </Link>
              </li>
              <li>
                <Link href="/teaching" className="text-blue-100 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F80ED] mr-2"></span>
                  Đề cương chi tiết môn học
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Thông tin Liên hệ */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-blue-200 mb-4">
              Thông tin liên hệ
            </h3>
            <div className="space-y-3 text-sm text-blue-100/90">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-[#2F80ED] mr-2.5 mt-0.5 shrink-0" />
                <span>Phường Phan Đình Phùng, Thái Nguyên</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-[#2F80ED] mr-2.5 shrink-0" />
                <a href="mailto:phutm@tnus.edu.vn" className="hover:text-white transition-colors">
                  phutm@tnus.edu.vn
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-[#2F80ED] mr-2.5 shrink-0" />
                <span>0975090666</span>
              </div>
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center text-xs text-blue-200 hover:text-white bg-blue-900/60 px-2.5 py-1.5 rounded border border-blue-700/50"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#2F80ED]" />
                  Quản trị viên / Giảng viên
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-blue-900/50 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-200/70">
          <p>© {new Date().getFullYear()} ThS. Trịnh Minh Phú. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Hệ thống quản lý học tập & thu bài tập đại học trực tuyến.
          </p>
        </div>
      </div>
    </footer>
  );
}
