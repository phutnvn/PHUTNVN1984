"use client";

import { useState } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !subject.trim() || !content.trim()) {
      setErrorMsg("Vui lòng điền đầy đủ các thông tin bắt buộc.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          subject,
          content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Không thể gửi tin nhắn lúc này.");
      } else {
        setSuccessMsg(data.message || "Tin nhắn của bạn đã được gửi thành công!");
        setFullName("");
        setEmail("");
        setSubject("");
        setContent("");
      }
    } catch {
      setErrorMsg("Lỗi kết nối máy chủ. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b border-gray-200 pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#123B65]/10 text-[#123B65] text-xs font-semibold mb-3">
            <Mail className="w-3.5 h-3.5 text-[#2F80ED]" />
            <span>Kết nối & Trao đổi thông tin</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123B65]">
            Thông tin Liên hệ
          </h1>
          <p className="text-base text-[#344054] mt-2 max-w-3xl">
            Kênh liên lạc chính thức dành cho sinh viên, đồng nghiệp và đối tác nghiên cứu khoa học trao đổi học thuật với ThS. Trịnh Minh Phú.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F4F7FB] border border-[#E4E7EC] rounded-3xl p-8 space-y-6 shadow-xs">
              <h2 className="text-xl font-bold text-[#123B65]">
                Thông tin Giảng viên
              </h2>

              <div className="space-y-5 text-sm text-[#344054]">
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#2F80ED] border border-gray-200 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 block uppercase">
                      Đơn vị công tác
                    </span>
                    <p className="font-semibold text-[#123B65] mt-0.5">
                      Khoa Toán - Tin, Trường Đại học Khoa học
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#2F80ED] border border-gray-200 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 block uppercase">
                      Địa chỉ liên hệ
                    </span>
                    <p className="font-semibold text-[#123B65] mt-0.5">
                      Phường Phan Đình Phùng, Thái Nguyên
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#2F80ED] border border-gray-200 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 block uppercase">
                      Email công vụ
                    </span>
                    <a
                      href="mailto:phutm@tnus.edu.vn"
                      className="font-mono font-semibold text-[#2F80ED] hover:underline mt-0.5 block"
                    >
                      phutm@tnus.edu.vn
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#2F80ED] border border-gray-200 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 block uppercase">
                      Điện thoại liên hệ
                    </span>
                    <p className="font-semibold text-[#123B65] mt-0.5">
                      0975090666
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#2F80ED] border border-gray-200 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 block uppercase">
                      Lịch tiếp sinh viên
                    </span>
                    <p className="font-semibold text-[#123B65] mt-0.5">
                      Chiều Thứ 3 & Thứ 5 (14:00 — 16:30)
                    </p>
                  </div>
                </div>
              </div>

              {/* Research Profiles */}
              <div className="pt-6 border-t border-gray-200">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">
                  Hồ sơ học thuật & Mạng lưới
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a
                    href="https://scholar.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white border border-gray-200 text-[#123B65] hover:border-[#2F80ED] hover:text-[#2F80ED] transition-colors flex items-center justify-between"
                  >
                    <span>Google Scholar</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white border border-gray-200 text-[#123B65] hover:border-[#2F80ED] hover:text-[#2F80ED] transition-colors flex items-center justify-between"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white border border-gray-200 text-[#123B65] hover:border-[#2F80ED] hover:text-[#2F80ED] transition-colors flex items-center justify-between"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                  <a
                    href="https://researchgate.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white border border-gray-200 text-[#123B65] hover:border-[#2F80ED] hover:text-[#2F80ED] transition-colors flex items-center justify-between"
                  >
                    <span>ResearchGate</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact form */}
          <div className="lg:col-span-7 bg-white border border-[#E4E7EC] rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#123B65]">
                Gửi Tin nhắn Trực tuyến
              </h2>
              <p className="text-xs text-[#344054] mt-1">
                Điền thông tin vào biểu mẫu dưới đây để gửi câu hỏi hoặc thắc mắc về học phần tới Giảng viên.
              </p>
            </div>

            {successMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#123B65] mb-1.5">
                    Họ và tên của bạn <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#123B65] mb-1.5">
                    Địa chỉ Email phản hồi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="email@student.edu.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B65] mb-1.5">
                  Chủ đề trao đổi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Thắc mắc về bài tập lớn môn Lập trình Web..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B65] mb-1.5">
                  Nội dung chi tiết <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Kính thưa Thầy, em có câu hỏi về nội dung..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#2F80ED] focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-6 rounded-xl text-sm font-bold text-white bg-[#123B65] hover:bg-[#1a4a7e] disabled:bg-gray-400 transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? "Đang gửi tin nhắn..." : "Gửi tin nhắn"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
