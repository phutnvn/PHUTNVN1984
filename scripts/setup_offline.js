const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('=== CHUẨN BỊ TÀI NGUYÊN HOẠT ĐỘNG HOÀN TOÀN OFFLINE ===');

  const materialsDir = path.join(process.cwd(), 'public', 'materials');
  if (!fs.existsSync(materialsDir)) {
    fs.mkdirSync(materialsDir, { recursive: true });
  }

  // 1. Tạo các tệp tài liệu mẫu offline trong public/materials
  const files = [
    {
      name: 'slide-chuong-01-kien-truc-web.pdf',
      content: '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000099 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n182\n%%EOF',
    },
    {
      name: 'de-cuong-it2020.docx',
      content: 'ĐỀ CƯƠNG CHI TIẾT HỌC PHẦN HỆ QUẢN TRỊ CƠ SỞ DỮ LIỆU\nGiảng viên: ThS. Trịnh Minh Phú\nKhoa Toán - Tin, Trường Đại học Khoa học - ĐHTN',
    },
    {
      name: 'it2020-dataset-sample.xlsx',
      content: 'ID,CustomerName,OrderDate,Amount\n1,Nguyen Van A,2026-01-10,1500000\n2,Tran Thi B,2026-01-11,2800000\n3,Le Hoang C,2026-01-12,950000',
    },
    {
      name: 'it1050-50-data-structure-problems.pdf',
      content: '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000099 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n182\n%%EOF',
    },
    {
      name: 'web-starter-kit.zip',
      content: 'PK\x03\x04\x14\x00\x00\x00\x00\x00\x00\x00!\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x0b\x00\x00\x00README.mdStarter kit offline source code packagePK\x01\x02\x14\x00\x14\x00\x00\x00\x00\x00\x00\x00!\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x0b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00README.mdPK\x05\x06\x00\x00\x00\x00\x01\x00\x01\x009\x00\x00\x00.\x00\x00\x00\x00\x00',
    },
  ];

  for (const f of files) {
    const filePath = path.join(materialsDir, f.name);
    fs.writeFileSync(filePath, f.content);
    console.log(`Đã tạo tệp offline: public/materials/${f.name}`);
  }

  // 2. Cập nhật các đường dẫn fileUrl trong database sang URL nội bộ /materials/...
  const resources = await prisma.resource.findMany();
  for (const res of resources) {
    let newUrl = res.fileUrl;
    if (res.title.includes('Chương 01') || res.title.includes('Kiến trúc ứng dụng') || res.title.includes('Lập trình Web Hiện đại')) {
      newUrl = '/materials/slide-chuong-01-kien-truc-web.pdf';
    } else if (res.title.includes('Tin Đại Cương')) {
      newUrl = '/materials/slide-chuong-01-kien-truc-web.pdf';
    } else if (res.title.includes('Đề cương')) {
      newUrl = '/materials/de-cuong-it2020.docx';
    } else if (res.title.includes('tối ưu truy vấn SQL') || res.fileType === 'XLSX') {
      newUrl = '/materials/it2020-dataset-sample.xlsx';
    } else if (res.title.includes('50 bài tập')) {
      newUrl = '/materials/it1050-50-data-structure-problems.pdf';
    } else if (res.title.includes('Web Starter Kit') || res.fileType === 'LINK' || res.fileType === 'ZIP') {
      newUrl = '/materials/web-starter-kit.zip';
    }

    if (newUrl !== res.fileUrl) {
      await prisma.resource.update({
        where: { id: res.id },
        data: { fileUrl: newUrl },
      });
      console.log(`Đã cập nhật Resource [${res.id}]: ${res.title} -> ${newUrl}`);
    }
  }

  // 3. Đảm bảo thư mục lưu bài nộp offline tồn tại
  const storageDir = path.join(process.cwd(), 'private_storage', 'submissions');
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  console.log('✅ Hoàn tất thiết lập tài nguyên offline!');
}

main()
  .catch((e) => {
    console.error('Lỗi khi thiết lập offline:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
