import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#F4F7FB]">
      <div className="text-center max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-[#E4E7EC] shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#123B65] flex items-center justify-center mx-auto">
          <FileQuestion className="w-8 h-8 text-[#2F80ED]" />
        </div>
        <h1 className="text-4xl font-extrabold text-[#123B65]">404</h1>
        <h2 className="text-lg font-bold text-[#123B65]">
          Không Tìm Thấy Trang Yêu Cầu
        </h2>
        <p className="text-xs text-[#344054] leading-relaxed">
          Đường dẫn bạn vừa truy cập không tồn tại hoặc tài liệu đã được chuyển sang vị trí khác.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#123B65] hover:bg-[#1f4b7a] transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Quay về Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
