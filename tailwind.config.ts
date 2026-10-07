import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#123B65",      // Xanh dương đậm chủ đạo
          primary: "#123B65",
          accent: "#2F80ED",    // Xanh dương sáng điểm nhấn
          surface: "#F4F7FB",   // Xám nhạt nền các khu vực nội dung
          muted: "#344054",     // Xám đậm màu chữ phụ
          border: "#E4E7EC",
          card: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "Roboto", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
