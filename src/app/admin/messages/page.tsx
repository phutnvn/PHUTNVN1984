"use client";

import { useEffect, useState } from "react";
import { Check, Mail, MailOpen, Trash2 } from "lucide-react";
import { formatDateTimeVN } from "@/lib/utils";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    setLoading(true);
    fetch("/api/admin/messages")
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) setMessages(data.messages);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: !currentRead }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isRead: !currentRead } : m))
        );
      }
    } catch {
      alert("Lỗi cập nhật.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xóa thư liên hệ này?")) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch {
      alert("Lỗi xóa.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#123B65]">
          Hòm Thư Liên Hệ Từ Sinh Viên
        </h1>
        <p className="text-xs text-[#344054] mt-1">
          Các tin nhắn gửi từ biểu mẫu liên hệ trực tuyến trên website.
        </p>
      </div>

      <div className="bg-white border border-[#E4E7EC] rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-[#2F80ED] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500">Đang tải thư liên hệ...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16">
            <Mail className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-500">Hòm thư trống</p>
            <p className="text-xs text-gray-400 mt-0.5">Chưa có tin nhắn liên hệ mới nào.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-6 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                  msg.isRead ? "bg-white" : "bg-blue-50/40"
                }`}
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        msg.isRead
                          ? "bg-gray-100 text-gray-600"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {msg.isRead ? "Đã đọc" : "Chưa đọc"}
                    </span>
                    <strong className="text-xs text-[#123B65]">{msg.fullName}</strong>
                    <span className="text-xs font-mono text-gray-500">
                      &lt;{msg.email}&gt;
                    </span>
                    <span className="text-[11px] text-gray-400">
                      • {formatDateTimeVN(msg.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#123B65]">{msg.subject}</h3>
                  <p className="text-xs text-[#344054] leading-relaxed whitespace-pre-line bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
                    {msg.content}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => toggleRead(msg.id, msg.isRead)}
                    className="p-2 text-gray-500 hover:text-[#2F80ED] hover:bg-gray-100 rounded-lg transition-colors"
                    title={msg.isRead ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}
                  >
                    {msg.isRead ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Xóa thư"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
