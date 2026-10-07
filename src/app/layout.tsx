import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "TRINH MINH PHU | Giảng viên Công nghệ Thông tin",
  description:
    "Website cá nhân giảng viên Trịnh Minh Phú — Giảng dạy, tài liệu học tập và hệ thống nộp bài tập trực tuyến an toàn dành cho sinh viên.",
  keywords: [
    "Trịnh Minh Phú",
    "Giảng viên CNTT",
    "Công nghệ thông tin",
    "Nộp bài tập",
    "Tài liệu học tập",
    "Lập trình Web",
    "Cơ sở dữ liệu",
  ],
  authors: [{ name: "Trịnh Minh Phú" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white text-[#1d2939] antialiased selection:bg-[#2F80ED] selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
