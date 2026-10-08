const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('--- SEEDING DATABASE ---');

  // Ensure storage directories exist
  const storageDir = path.resolve(process.cwd(), 'private_storage/submissions');
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  // 1. Create Admin / Lecturer User
  const hashedPassword = await bcrypt.hash('AdminPassword2026@', 10);
  const lecturerUser = await prisma.user.upsert({
    where: { email: 'phutm@tnus.edu.vn' },
    update: {
      password: hashedPassword,
      name: 'ThS. Trịnh Minh Phú',
      role: 'LECTURER',
    },
    create: {
      email: 'phutm@tnus.edu.vn',
      password: hashedPassword,
      name: 'ThS. Trịnh Minh Phú',
      role: 'LECTURER',
    },
  });
  console.log('Lecturer user created:', lecturerUser.email);

  // 2. Create Lecturer Profile
  const educationData = [
    {
      degree: 'Thạc sĩ Khoa học Máy tính',
      institution: 'Trường Đại học Bách Khoa',
      period: '2012 — 2015',
      description: 'Chuyên ngành Kỹ thuật Phần mềm và Hệ thống thông tin phân tán. Luận văn nghiên cứu về tối ưu kiến trúc phần mềm hướng dịch vụ.',
    },
    {
      degree: 'Kỹ sư Công nghệ Thông tin',
      institution: 'Trường Đại học Bách Khoa',
      period: '2007 — 2012',
      description: 'Tốt nghiệp loại Giỏi chuyên ngành Công nghệ Phần mềm. Giải Nhì Sinh viên Nghiên cứu Khoa học cấp Trường.',
    },
  ];

  const researchData = [
    {
      topic: 'Kiến trúc Phần mềm Hiện đại & Điện toán Đám mây',
      description: 'Nghiên cứu về Microservices, Serverless và các mẫu thiết kế kiến trúc chịu tải cao.',
    },
    {
      topic: 'Hệ Quản trị Cơ sở Dữ liệu & Xử lý Dữ liệu lớn',
      description: 'Tối ưu hóa chỉ mục (indexing), sharding và lưu trữ phi quan hệ (NoSQL) trong các hệ thống thực tế.',
    },
    {
      topic: 'Ứng dụng AI & Khai phá Dữ liệu trong Giáo dục',
      description: 'Phát triển các mô hình dự báo kết quả học tập và hỗ trợ cá nhân hóa lộ trình đào tạo cho sinh viên.',
    },
  ];

  const teachingExpData = [
    {
      role: 'Giảng viên',
      organization: 'Khoa Công nghệ Thông tin - Trường Đại học',
      period: '2015 — Hiện tại',
      description: 'Giảng dạy các học phần Lập trình Web, Hệ CSDL, Cấu trúc Dữ liệu & Giải thuật. Hướng dẫn hơn 80 khóa luận tốt nghiệp.',
    },
    {
      role: 'Kỹ sư Phần mềm Cao cấp & Cố vấn Kỹ thuật',
      organization: 'Tập đoàn Công nghệ & Dự án Doanh nghiệp',
      period: '2012 — 2015',
      description: 'Tham gia thiết kế và triển khai các giải pháp phần mềm quản trị doanh nghiệp, tích hợp hệ thống thanh toán điện tử.',
    },
  ];

  const activitiesData = [
    {
      title: 'Cố vấn chuyên môn CLB Lập trình Sinh viên (Dev Club)',
      year: '2018 — Nay',
      description: 'Định hướng các hoạt động học thuật, hội thảo kỹ thuật và tổ chức cuộc thi Hackathon sinh viên thường niên.',
    },
    {
      title: 'Chứng nhận Giảng viên Đổi mới Sáng tạo Giáo dục Đại học',
      year: '2021',
      description: 'Áp dụng phương pháp Blended Learning và bài toán thực tế doanh nghiệp vào giảng dạy lý thuyết và thực hành.',
    },
    {
      title: 'Giấy khen Giảng viên có thành tích xuất sắc trong NCKH và Hướng dẫn sinh viên',
      year: '2023',
      description: 'Khen thưởng cấp Khoa và cấp Trường vì thành tích hướng dẫn sinh viên đạt giải cao trong nghiên cứu khoa học.',
    },
  ];

  const socialLinks = [
    { platform: 'Google Scholar', url: 'https://scholar.google.com' },
    { platform: 'GitHub', url: 'https://github.com' },
    { platform: 'LinkedIn', url: 'https://linkedin.com' },
    { platform: 'ResearchGate', url: 'https://researchgate.net' },
  ];

  await prisma.lecturerProfile.upsert({
    where: { id: 'default' },
    update: {
      fullName: 'TRỊNH MINH PHÚ',
      title: 'Giảng viên | Công nghệ thông tin',
      tagline: 'Giảng viên | Công nghệ thông tin | Giáo dục và sáng tạo',
      email: 'phu.tm@university.edu.vn',
      phone: '0912.345.678',
      workplace: 'Khoa Công nghệ Thông tin — Trường Đại học',
      officeLocation: 'Phòng 402, Nhà A1, Khu Giảng đường Chính',
      bio: 'Tôi là giảng viên công tác trong lĩnh vực Công nghệ Thông tin với định hướng giảng dạy thực chiến, kết hợp chặt chẽ giữa nền tảng lý thuyết vững chắc và yêu cầu kỹ năng của thị trường công nghệ hiện đại. Mong muốn lớn nhất của tôi là truyền cảm hứng tự học, tư duy logic phản biện và tinh thần nghiên cứu sáng tạo cho thế hệ kỹ sư trẻ.',
      educationJson: JSON.stringify(educationData),
      researchJson: JSON.stringify(researchData),
      teachingExpJson: JSON.stringify(teachingExpData),
      activitiesJson: JSON.stringify(activitiesData),
      socialLinksJson: JSON.stringify(socialLinks),
      avatarUrl: '/images/lecturer-avatar.png',
    },
    create: {
      id: 'default',
      fullName: 'TRỊNH MINH PHÚ',
      title: 'Giảng viên | Công nghệ thông tin',
      tagline: 'Giảng viên | Công nghệ thông tin | Giáo dục và sáng tạo',
      email: 'phu.tm@university.edu.vn',
      phone: '0912.345.678',
      workplace: 'Khoa Công nghệ Thông tin — Trường Đại học',
      officeLocation: 'Phòng 402, Nhà A1, Khu Giảng đường Chính',
      bio: 'Tôi là giảng viên công tác trong lĩnh vực Công nghệ Thông tin với định hướng giảng dạy thực chiến, kết hợp chặt chẽ giữa nền tảng lý thuyết vững chắc và yêu cầu kỹ năng của thị trường công nghệ hiện đại. Mong muốn lớn nhất của tôi là truyền cảm hứng tự học, tư duy logic phản biện và tinh thần nghiên cứu sáng tạo cho thế hệ kỹ sư trẻ.',
      educationJson: JSON.stringify(educationData),
      researchJson: JSON.stringify(researchData),
      teachingExpJson: JSON.stringify(teachingExpData),
      activitiesJson: JSON.stringify(activitiesData),
      socialLinksJson: JSON.stringify(socialLinks),
      avatarUrl: '/images/lecturer-avatar.png',
    },
  });

  // 3. Create Courses
  const coursesData = [
    {
      code: 'IT3010',
      name: 'Lập trình Web Nâng cao',
      description: 'Học phần trang bị kiến thức và kỹ năng xây dựng ứng dụng web hiện đại (Next.js, React, Node.js, RESTful API, Database, Authentication & Security).',
      targetStudents: 'Sinh viên năm 3 ngành Công nghệ Thông tin, Kỹ thuật Phần mềm',
      objectives: '1. Thành thạo kiến trúc Web hiện đại; 2. Nắm vững Next.js và React Server Components; 3. Thiết kế và bảo mật RESTful APIs; 4. Triển khai ứng dụng lên Cloud.',
      syllabus: 'Chương 1: Kiến trúc Web hiện đại & TypeScript | Chương 2: React Core & Component Design | Chương 3: Next.js App Router | Chương 4: Backend API & Database ORM | Chương 5: Xác thực, Bảo mật & Triển khai',
      semester: 'Học kỳ 1',
      academicYear: '2025 — 2026',
    },
    {
      code: 'IT2020',
      name: 'Hệ Quản trị Cơ sở Dữ liệu',
      description: 'Trang bị nền tảng phân tích, thiết kế mô hình dữ liệu quan hệ, ngôn ngữ truy vấn SQL chuyên sâu, lập chỉ mục và tối ưu hóa hiệu năng cơ sở dữ liệu.',
      targetStudents: 'Sinh viên năm 2 ngành Công nghệ Thông tin, Hệ thống Thông tin',
      objectives: '1. Chuẩn hóa cơ sở dữ liệu (1NF - BCNF); 2. Truy vấn SQL phức hợp; 3. Tối ưu truy vấn với Index và Execution Plan; 4. Quản lý Giao dịch (ACID) và Khóa.',
      syllabus: 'Chương 1: Mô hình E-R và quan hệ | Chương 2: Đại số quan hệ & SQL nâng cao | Chương 3: Chuẩn hóa dữ liệu | Chương 4: Transaction & Concurrency Control | Chương 5: Tối ưu hiệu năng cơ sở dữ liệu',
      semester: 'Học kỳ 1',
      academicYear: '2025 — 2026',
    },
    {
      code: 'IT1050',
      name: 'Cấu trúc Dữ liệu & Giải thuật',
      description: 'Học phần cốt lõi rèn luyện tư duy lập trình cấu trúc, phân tích độ phức tạp thuật toán và làm chủ các cấu trúc dữ liệu nền tảng trong khoa học máy tính.',
      targetStudents: 'Sinh viên năm 1, năm 2 khối ngành Máy tính',
      objectives: '1. Đánh giá độ phức tạp Big-O; 2. Cài đặt Stack, Queue, Linked List; 3. Cài đặt Cây nhị phân tìm kiếm & Đồ thị; 4. Ứng dụng giải thuật tìm kiếm, sắp xếp và quy hoạch động.',
      syllabus: 'Chương 1: Độ phức tạp thuật toán | Chương 2: Danh sách liên kết | Chương 3: Ngăn xếp & Hàng đợi | Chương 4: Cây và Đồ thị | Chương 5: Thuật toán nâng cao',
      semester: 'Học kỳ 1',
      academicYear: '2025 — 2026',
    },
    {
      code: 'IT4080',
      name: 'Trí tuệ Nhân tạo Ứng dụng',
      description: 'Tiếp cận các phương pháp học máy (Machine Learning), xử lý ngôn ngữ tự nhiên và thị giác máy tính với các bài toán ứng dụng thực tế.',
      targetStudents: 'Sinh viên năm 4 ngành CNTT & Khoa học Dữ liệu',
      objectives: '1. Nắm vững quy trình xử lý dữ liệu; 2. Huấn luyện các mô hình phân loại và hồi quy; 3. Tiếp cận Deep Learning cơ bản; 4. Triển khai mô hình AI thành API.',
      syllabus: 'Chương 1: Tổng quan AI & Pipeline ML | Chương 2: Supervised Learning | Chương 3: Unsupervised Learning | Chương 4: Mạng nơ-ron cơ bản | Chương 5: Đồ án ứng dụng',
      semester: 'Học kỳ 1',
      academicYear: '2025 — 2026',
    },
  ];

  const createdCourses = [];
  for (const c of coursesData) {
    const course = await prisma.course.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
    createdCourses.push(course);
  }

  // 4. Create Assignments
  const now = new Date();
  const future7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const future3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const future14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const past5Days = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

  const it3010 = createdCourses.find((c) => c.code === 'IT3010');
  const it2020 = createdCourses.find((c) => c.code === 'IT2020');
  const it1050 = createdCourses.find((c) => c.code === 'IT1050');
  const it4080 = createdCourses.find((c) => c.code === 'IT4080');

  // Clear existing assignments if any to avoid duplication
  await prisma.submission.deleteMany({});
  await prisma.assignment.deleteMany({});

  const assign1 = await prisma.assignment.create({
    data: {
      title: 'Bài tập lớn: Xây dựng Hệ thống Web Full-stack với Next.js & REST API',
      courseId: it3010.id,
      description: 'Sinh viên làm việc theo nhóm 2-3 người hoặc cá nhân, thiết kế và hiện thực hóa một ứng dụng web hoàn chỉnh có chức năng xác thực người dùng, quản trị dữ liệu và giao diện thân thiện.',
      requirements: '1. Mã nguồn hoàn chỉnh đóng gói dạng .ZIP;\n2. Báo cáo định dạng PDF trình bày kiến trúc hệ thống, sơ đồ CSDL và phân công công việc;\n3. Đính kèm liên kết Video Demo hoặc Live Demo nếu có;\n4. Đặt tên file theo định dạng: BTL_Web_NhomXX_HoTen.zip',
      deadline: future7Days,
      acceptedFormats: 'ZIP,RAR,7Z,PDF',
      maxFileSizeMb: 50,
      status: 'OPEN',
    },
  });

  const assign2 = await prisma.assignment.create({
    data: {
      title: 'Thực hành Lab 03: Thiết kế và Tối ưu hóa Truy vấn Cơ sở Dữ liệu',
      courseId: it2020.id,
      description: 'Thực hiện chuẩn hóa dữ liệu từ đề bài cho trước đến 3NF/BCNF. Viết kịch bản SQL tạo bảng, ràng buộc toàn vẹn và tối ưu hóa 5 câu truy vấn phức hợp sử dụng EXPLAIN ANALYZE và Index.',
      requirements: '1. File script SQL thực thi được (.sql hoặc .txt);\n2. File báo cáo ảnh chụp kết quả kiểm thử và phân tích chi phí truy vấn (.pdf hoặc .docx);\n3. Đặt tên file theo cú pháp: Lab03_MSSV_HoTen.zip (hoặc .pdf)',
      deadline: future3Days,
      acceptedFormats: 'PDF,DOCX,ZIP,SQL',
      maxFileSizeMb: 25,
      status: 'CLOSING_SOON',
    },
  });

  const assign3 = await prisma.assignment.create({
    data: {
      title: 'Bài tập tuần 5: Cài đặt Cây tìm kiếm nhị phân (BST) và Cân bằng AVL',
      courseId: it1050.id,
      description: 'Cài đặt cấu trúc dữ liệu BST và cây AVL bằng ngôn ngữ C++ hoặc Java. Thực hiện đầy đủ các thao tác: chèn nút, xóa nút, quay cây đơn/kép và duyệt cây theo thứ tự LNR, NLR, LRN.',
      requirements: '1. Nộp file mã nguồn (.cpp, .java hoặc .zip);\n2. Ghi rõ họ tên, MSSV trong phần comment ở đầu file mã nguồn;\n3. Kiểm tra kỹ không để xảy ra lỗi Memory Leak.',
      deadline: future14Days,
      acceptedFormats: 'CPP,JAVA,ZIP,PDF',
      maxFileSizeMb: 20,
      status: 'OPEN',
    },
  });

  const assign4 = await prisma.assignment.create({
    data: {
      title: 'Tiểu luận Chuyên đề & Đề tài Khảo sát Mô hình Machine Learning',
      courseId: it4080.id,
      description: 'Thực hiện khảo sát và cài đặt thử nghiệm một bài toán phân loại hình ảnh hoặc phân tích cảm xúc văn bản với tập dữ liệu công khai (Kaggle/UCI). Viết báo cáo đánh giá độ chính xác (Precision, Recall, F1-score).',
      requirements: '1. Báo cáo định dạng PDF (tối thiểu 10 trang);\n2. Notebook Jupyter (.ipynb) hoặc mã nguồn Python đính kèm;\n3. Hạn nộp đã kết thúc.',
      deadline: past5Days,
      acceptedFormats: 'PDF,ZIP,IPYNB',
      maxFileSizeMb: 50,
      status: 'CLOSED',
    },
  });

  // Create sample dummy submission files in storageDir
  const sampleFile1 = 'SUB-202610-8472_NguyenVanAn_BTL.zip';
  const sampleFile2 = 'SUB-202610-8473_TranThiBich_BTL.zip';
  const sampleFile3 = 'SUB-202610-8474_LeHoangNam_Lab03.pdf';
  const sampleFile4 = 'SUB-202610-8475_PhamMinhDuc_BST.cpp';

  fs.writeFileSync(path.join(storageDir, sampleFile1), 'MOCK_ZIP_CONTENT_STUDENT_SUBMISSION_1');
  fs.writeFileSync(path.join(storageDir, sampleFile2), 'MOCK_ZIP_CONTENT_STUDENT_SUBMISSION_2');
  fs.writeFileSync(path.join(storageDir, sampleFile3), 'MOCK_PDF_CONTENT_STUDENT_SUBMISSION_3');
  fs.writeFileSync(path.join(storageDir, sampleFile4), 'MOCK_CPP_CONTENT_STUDENT_SUBMISSION_4');

  // 5. Create Sample Submissions
  await prisma.submission.createMany({
    data: [
      {
        receiptCode: 'REC-202610-8472',
        studentName: 'Nguyễn Văn An',
        studentId: '21020015',
        studentClass: 'D21CNTT01',
        studentEmail: 'an.nv21020015@student.edu.vn',
        assignmentId: assign1.id,
        fileName: sampleFile1,
        fileOriginalName: 'BTL_Web_Nhom01_NguyenVanAn.zip',
        filePath: path.join(storageDir, sampleFile1),
        fileSize: 4521000,
        mimeType: 'application/zip',
        notes: 'Em đã đính kèm link YouTube demo và tài khoản admin mẫu trong file README.pdf ạ.',
        submittedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        isLate: false,
        score: 9.5,
        feedback: 'Hệ thống thiết kế chuẩn chỉnh, giao diện đẹp và đáp ứng tốt. Code sạch và có ghi chú rõ ràng.',
        gradingStatus: 'GRADED',
      },
      {
        receiptCode: 'REC-202610-8473',
        studentName: 'Trần Thị Bích',
        studentId: '21020088',
        studentClass: 'D21CNTT01',
        studentEmail: 'bich.tt21020088@student.edu.vn',
        assignmentId: assign1.id,
        fileName: sampleFile2,
        fileOriginalName: 'BTL_Web_Nhom05_TranThiBich.zip',
        filePath: path.join(storageDir, sampleFile2),
        fileSize: 5812000,
        mimeType: 'application/zip',
        notes: 'Nhóm em hoàn thành 4/4 yêu cầu bắt buộc và 1 chức năng mở rộng thanh toán.',
        submittedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        isLate: false,
        score: null,
        feedback: null,
        gradingStatus: 'PENDING',
      },
      {
        receiptCode: 'REC-202610-8474',
        studentName: 'Lê Hoàng Nam',
        studentId: '22020142',
        studentClass: 'D22HTTT02',
        studentEmail: 'nam.lh22020142@student.edu.vn',
        assignmentId: assign2.id,
        fileName: sampleFile3,
        fileOriginalName: 'Lab03_22020142_LeHoangNam.pdf',
        filePath: path.join(storageDir, sampleFile3),
        fileSize: 1245000,
        mimeType: 'application/pdf',
        notes: 'Em đã bổ sung phần giải thích cây chi phí truy vấn tại câu 4 và 5.',
        submittedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        isLate: false,
        score: 8.5,
        feedback: 'Bài làm tốt, phân tích chỉ mục B-tree chính xác. Lưu ý thêm về composite index.',
        gradingStatus: 'GRADED',
      },
      {
        receiptCode: 'REC-202610-8475',
        studentName: 'Phạm Minh Đức',
        studentId: '23020033',
        studentClass: 'D23CNTT03',
        studentEmail: 'duc.pm23020033@student.edu.vn',
        assignmentId: assign3.id,
        fileName: sampleFile4,
        fileOriginalName: 'BST_AVL_23020033_PhamMinhDuc.cpp',
        filePath: path.join(storageDir, sampleFile4),
        fileSize: 18500,
        mimeType: 'text/x-c',
        notes: 'Em nộp bài tập tuần 5. Đã kiểm thử qua 10 test case tự tạo.',
        submittedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        isLate: false,
        score: null,
        feedback: null,
        gradingStatus: 'PENDING',
      },
    ],
  });

  // 6. Create Resources
  await prisma.resource.deleteMany({});
  await prisma.resource.createMany({
    data: [
      {
        title: 'Giáo trình & Slide Bài giảng Lập trình Web Hiện đại (Toàn tập)',
        description: 'Tổng hợp tài liệu slide từ Chương 1 đến Chương 6, kèm tài liệu đọc thêm về Next.js và React Server Components.',
        courseId: it3010.id,
        fileType: 'PDF',
        fileUrl: '/materials/slide-chuong-01-kien-truc-web.pdf',
        isRestricted: false,
        downloadCount: 142,
      },
      {
        title: 'Bộ mã nguồn mẫu Web Starter Kit (TypeScript, Tailwind, Prisma)',
        description: 'Mẫu dự án chuẩn dùng cho các bài thực hành và bài tập lớn học phần Lập trình Web.',
        courseId: it3010.id,
        fileType: 'ZIP',
        fileUrl: '/materials/web-starter-kit.zip',
        isRestricted: false,
        downloadCount: 230,
      },
      {
        title: 'Đề cương chi tiết học phần Hệ Quản trị Cơ sở Dữ liệu 2025-2026',
        description: 'Quy định chuẩn đầu ra, thang điểm đánh giá, lịch trình học tập 15 tuần.',
        courseId: it2020.id,
        fileType: 'DOCX',
        fileUrl: '/materials/de-cuong-it2020.docx',
        isRestricted: false,
        downloadCount: 88,
      },
      {
        title: 'Tập dữ liệu mẫu thực hành tối ưu truy vấn SQL (1,000,000 bản ghi)',
        description: 'Tài nguyên nội bộ dùng cho buổi thực hành phân tích Query Plan và Indexing. Dành riêng cho sinh viên học phần.',
        courseId: it2020.id,
        fileType: 'XLSX',
        fileUrl: '/materials/it2020-dataset-sample.xlsx',
        isRestricted: true,
        downloadCount: 65,
      },
      {
        title: 'Tổng hợp 50 bài tập Cấu trúc dữ liệu và Giải thuật kinh điển (Kèm lời giải)',
        description: 'Tài liệu ôn tập và rèn luyện kỹ năng giải thuật, chuẩn bị cho các kỳ thi học phần và phỏng vấn kỹ thuật.',
        courseId: it1050.id,
        fileType: 'PDF',
        fileUrl: '/materials/it1050-50-data-structure-problems.pdf',
        isRestricted: false,
        downloadCount: 312,
      },
    ],
  });

  // 7. Create Announcements
  await prisma.announcement.deleteMany({});
  await prisma.announcement.createMany({
    data: [
      {
        title: 'Hướng dẫn nộp Bài tập lớn và Quy chế chấm vấn đáp học kỳ 1 (2025 - 2026)',
        content: 'Thầy yêu cầu các nhóm hoàn thiện mã nguồn và nộp trước 23h59 ngày hạn chót qua cổng nộp bài trực tuyến của website. Sau khi nộp, hệ thống sẽ cấp mã biên nhận (Receipt Code). Sinh viên lưu lại mã này để tra cứu kết quả và đối chiếu khi vấn đáp.',
        courseId: it3010.id,
        isPinned: true,
      },
      {
        title: 'Lịch phụ đạo và giải đáp thắc mắc đồ án trực tiếp tại phòng 402-A1',
        content: 'Thầy sẽ có mặt tại phòng làm việc vào các buổi chiều Thứ 3 và Thứ 5 hàng tuần (14h00 - 16h30) để hướng dẫn thêm về kiến trúc cơ sở dữ liệu và triển khai server.',
        courseId: null,
        isPinned: true,
      },
      {
        title: 'Cập nhật tài liệu ôn tập và đề thi mẫu giữa kỳ môn Hệ Quản trị CSDL',
        content: 'Đã bổ sung tài liệu đề thi mẫu các năm trước vào mục Tài liệu học tập. Sinh viên tải về để luyện tập phần chuẩn hóa 3NF và viết câu lệnh SELECT phức hợp.',
        courseId: it2020.id,
        isPinned: false,
      },
    ],
  });

  // 8. Create Contact Message sample
  await prisma.contactMessage.deleteMany({});
  await prisma.contactMessage.create({
    data: {
      fullName: 'Trần Văn Hoàng (Lớp trưởng D21CNTT01)',
      email: 'hoang.tv@student.edu.vn',
      subject: 'Đăng ký lịch bảo vệ đồ án nhóm 4 học phần Lập trình Web',
      content: 'Thưa Thầy, nhóm 4 chúng em đã hoàn thành báo cáo và bài tập lớn. Chúng em xin phép Thầy được đăng ký ca bảo vệ đầu tiên vào sáng Thứ Bảy ạ. Em cảm ơn Thầy!',
      isRead: false,
    },
  });

  console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
