/* =========================================================
   NỘI DUNG PORTFOLIO — chỉ cần sửa file này.
   - Chữ trong **hai dấu sao** được tô màu nhấn.
   - Dự án:
       youtube: link bản đầy đủ. Ảnh bìa tự lấy từ YouTube.
       video:   (không bắt buộc) đoạn preview MP4 tự chạy, vd "media/bfg.mp4"
       poster:  (không bắt buộc) ảnh bìa riêng, vd "media/bfg.jpg"
       format:  "ngang" (16:9) hoặc "doc" (9:16)
   - Khách hàng: logo trắng nền trong suốt trong media/clients/
       h: chiều cao logo (px), logo dạng đứng nên để cao hơn.
   ========================================================= */
window.PORTFOLIO = {
  name: { first: "Đắc", last: "Nguyễn" },
  logo: "DAC.NGUYEN",
  city: "Hà Nội",
  services: ["Quay", "Dựng", "Chỉnh màu"],

  hero: {
    intro:
      "Videographer tại Hà Nội với **hơn 10 năm** kinh nghiệm. Tôi làm phim thương hiệu, sự kiện và du lịch cho doanh nghiệp trong và ngoài nước.",
    cta: "Xem dự án",
    // Màn hình ngang (máy tính) dùng bản ngang, màn hình dọc (điện thoại) dùng bản dọc.
    video: { ngang: "media/hero-ngang.mp4", doc: "media/hero-doc.mp4" },
    poster: { ngang: "media/hero-ngang.jpg", doc: "media/hero-doc.jpg" }
  },

  manifesto: "Máy quay ghi lại hình ảnh. Tôi giữ lại **cảm xúc.**",

  clients: [
    { name: "BFGoodrich Tires", logo: "media/clients/bfgoodrich.png", h: 30 },
    { name: "Sơn Mài Đất Việt", logo: "media/clients/son-mai-dat-viet.png", h: 64 },
    { name: "NAVATAN", logo: "media/clients/navatan.png", h: 34 },
    { name: "Heritage Travel", logo: "media/clients/heritage.png", h: 64 },
    { name: "Liên Hà", logo: "media/clients/lienha.png", h: 46 },
    { name: "VNEA – Hiệp hội Thang máy Việt Nam", logo: "media/clients/vnea.png", h: 40 },
    { name: "GAMALIFT", logo: "media/clients/gamalift.png", h: 58 }
  ],

  work: {
    title: ["Mỗi khung hình là một câu chuyện.", "Đây là vài câu chuyện của tôi."],
    projects: [
      {
        type: "Phim hành trình",
        title: "BFG KO3 Cross Borders Thailand – Laos",
        client: "BFGoodrich Tires",
        year: "2026",
        role: "",
        format: "ngang",
        youtube: "https://www.youtube.com/watch?v=U1-qNXzuSzk",
        video: "", poster: "media/posters/U1-qNXzuSzk.jpg"
      },
      {
        type: "Phim thương hiệu",
        title: "Sơn Mài – The Art of Elevation",
        client: "Sơn Mài Đất Việt",
        year: "2026",
        role: "",
        format: "ngang",
        youtube: "https://www.youtube.com/watch?v=KX5zuOyXIPI",
        video: "", poster: "media/posters/KX5zuOyXIPI.jpg"
      },
      {
        type: "Sự kiện",
        title: "NAVATAN Grand Opening",
        client: "NAVATAN",
        year: "2026",
        role: "",
        format: "ngang",
        youtube: "https://www.youtube.com/watch?v=kGTMS8Xo8ns",
        video: "", poster: "media/posters/kGTMS8Xo8ns.jpg"
      },
      {
        type: "Du lịch",
        title: "Heritage Cruise Hạ Long",
        client: "Heritage Signature",
        year: "2026",
        role: "",
        format: "ngang",
        youtube: "https://www.youtube.com/watch?v=fip8D96NKgA",
        video: "", poster: "media/posters/fip8D96NKgA.jpg"
      },
      {
        type: "Giới thiệu doanh nghiệp",
        title: "Factory Introduction",
        client: "Liên Hà PUDECOR",
        year: "2026",
        role: "",
        format: "ngang",
        youtube: "https://www.youtube.com/watch?v=BDdrnLCvU7w",
        video: "", poster: "media/posters/BDdrnLCvU7w.jpg"
      }
    ]
  },

  about: {
    title: ["Về", "tôi"],
    // Ảnh cuộn (dọc 4:5). Tự chuyển ảnh sau mỗi vài giây.
    photos: [
      "media/about/01.jpg",
      "media/about/02.jpg",
      "media/about/03.jpg",
      "media/about/04.jpg",
      "media/about/05.jpg"
    ],
    text:
      "Tôi là **Đắc Nguyễn**, 28 tuổi, sống và làm việc tại **Hà Nội**. Hơn 10 năm cầm máy, tôi đã làm hơn 100 video cho hơn 50 khách hàng thuộc nhiều lĩnh vực khác nhau. Với mỗi dự án, tôi tìm khoảnh khắc khiến người xem **dừng lại**.",
    stats: [
      { value: "10+", label: "năm kinh nghiệm" },
      { value: "100+", label: "video đã làm" },
      { value: "50+", label: "khách hàng" }
    ],
    services: ["Quay phim", "Dựng phim", "Chỉnh màu"]
  },

  contact: {
    title: ["Quay cùng", "nhau nhé?"],
    email: "darknguyen.skda@gmail.com",
    phone: "0919 623 455",
    phoneNote: "Gọi / Zalo",
    zalo: "https://zalo.me/0919623455",
    socials: [
      { label: "Instagram", handle: "@dacnguyen1011", url: "https://www.instagram.com/dacnguyen1011/" },
      { label: "TikTok", handle: "Đắc Nguyễn", url: "https://www.tiktok.com/@dacnguyen.picklebal" },
      { label: "Facebook", handle: "Nguyen Dac", url: "https://www.facebook.com/nguyen.dac.1112" }
    ]
  }
};
