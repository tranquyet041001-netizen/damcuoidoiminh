import { WeddingData } from "@/types/wedding";

export const weddingData: WeddingData = {
  groom: {
    fullName: "Trần Quang Minh",
    shortName: "Quang Minh",
    roleTitle: "Chú Rể",
    parents: "Quý nam của Ông Trần Quốc Toàn & Bà Phạm Thị Lan",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    bio: "Một người trầm lặng, yêu những nét văn hóa xưa và luôn tìm thấy sự bình yên bên An."
  },
  bride: {
    fullName: "Nguyễn Thục An",
    shortName: "Thục An",
    roleTitle: "Cô Dâu",
    parents: "Ái nữ của Ông Nguyễn Văn Nam & Bà Lê Thị Mai",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    bio: "Thích gốm, mê trà mạn và dành trọn niềm tin cho hành trình trăm năm cùng Minh."
  },
  weddingDate: "2027-01-24T10:30:00+07:00",
  weddingDateFormatted: "Chủ Nhật, 24 Tháng 01 Năm 2027",
  lunarDateFormatted: "Nhằm ngày 17 tháng Chạp năm Bính Ngọ",
  welcomeQuote: "Trăm năm tình viên mãn • Bạc đầu nghĩa phu thê",
  welcomeMessage: "Trong không gian ấm cúng của tình thân và nét văn hóa xưa, chúng mình hân hoan kính mời bạn đến chung vui trong ngày trọng đại này.",
  
  openingLetter: {
    title: "Thư ngỏ gửi người thương mến",
    content: [
      "Người xưa từng nói: 'Có duyên mới gặp, có nợ mới thành đôi'. Trải qua những năm tháng thanh xuân cùng nhau sẻ chia buồn vui, chúng mình hiểu rằng tình yêu đẹp nhất chính là sự đồng điệu và sẻ chia bình dị mỗi ngày.",
      "Hôn lễ này không chỉ là lời hứa trước gia tiên hai họ, mà còn là dịp để chúng mình được tề tựu bên những người thân yêu nhất — những người đã luôn dõi theo, động viên và vun đắp cho hạnh phúc của hai đứa.",
      "Sự hiện diện và lời chúc phúc của quý vị chính là món quà quý giá nhất dành tặng cho ngày khởi đầu của gia đình nhỏ chúng mình."
    ],
    closing: "Thân thương kính mời,\nQuang Minh & Thục An"
  },

  events: [
    {
      id: "ceremony",
      title: "Lễ Thành Hôn",
      subtitle: "Nghi thức bái gia tiên & trao nhẫn",
      date: "Chủ Nhật, 24 Tháng 01 Năm 2027",
      isoDate: "2027-01-24T09:30:00+07:00",
      time: "09:30",
      venue: "Tư gia Nhà Trai",
      address: "Số 68 Đường Tràng Thi, Phường Hàng Trống, Quận Hoàn Kiếm, Hà Nội",
      mapUrl: "https://maps.google.com/?q=68+Trang+Thi+Hoan+Kiem+Ha+Noi",
      notes: "Nghi lễ gia phong theo phong tục truyền thống."
    },
    {
      id: "reception",
      title: "Tiệc Mừng Hạnh Phúc",
      subtitle: "Đón khách & Khai tiệc chung vui",
      date: "Chủ Nhật, 24 Tháng 01 Năm 2027",
      isoDate: "2027-01-24T11:30:00+07:00",
      time: "11:30 (Đón khách: 11:00)",
      venue: "Không gian Tiệc cưới Dó & Sen",
      address: "Trung tâm Hội nghị Sen Vàng, 18 Nguyễn Du, Quận Hai Bà Trưng, Hà Nội",
      mapUrl: "https://maps.google.com/?q=18+Nguyen+Du+Hai+Ba+Trung+Ha+Noi",
      notes: "Kính mời quý khách tới đúng giờ để cùng lưu giữ những khoảnh khắc đẹp."
    }
  ],

  story: [
    {
      yearOrDate: "Thu 2021",
      title: "Chạm mặt giữa phố thu",
      description: "Một chiều thu Hà Nội thoảng hương hoa sữa, hai kẻ xa lạ tình cờ gặp nhau tại một quán trà nhỏ trên phố cổ. Một cái nhìn, một nụ cười ngập ngừng đã mở đầu cho câu chuyện dài sau này.",
      imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
      location: "Phố cổ Hà Nội"
    },
    {
      yearOrDate: "Đông 2022",
      title: "Buổi hẹn đầu & lời ngỏ",
      description: "Dưới cơn gió lạnh đầu mùa, những vòng xe qua cầu Long Biên và cốc trà sen nóng đã sưởi ấm hai trái tim. Lời tỏ tình mộc mạc được trao đi và nhận lại cái gật đầu bẽn lẽn.",
      imageUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop",
      location: "Cầu Long Biên"
    },
    {
      yearOrDate: "Xuân 2025",
      title: "Lời hẹn ước trăm năm",
      description: "Trong chuyến đi về miền cố đô Ninh Bình, giữa dòng sông êm ả và núi non điệp trùng, Minh đã trao cho An chiếc nhẫn đính ước, hẹn nhau cùng đi hết những chặng đường mai sau.",
      imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop",
      location: "Tràng An, Ninh Bình"
    },
    {
      yearOrDate: "24.01.2027",
      title: "Khởi đầu tổ ấm nhỏ",
      description: "Sau bao năm tháng đồng hành, hôm nay chúng mình chính thức về chung một nhà, bắt đầu một chương mới đầy ắp yêu thương, trách nhiệm và bình yên.",
      imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
      location: "Hà Nội"
    }
  ],

  gallery: [
    {
      id: "gal-1",
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop",
      title: "Khoảnh khắc trao nhẫn",
      caption: "Ánh mắt trao nhau chứa đựng cả bầu trời thương mến.",
      aspectRatio: "portrait"
    },
    {
      id: "gal-2",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
      title: "Áo dài truyền thống",
      caption: "Nét duyên dáng trong tà áo dài lụa tơ tằm cổ điển.",
      aspectRatio: "portrait"
    },
    {
      id: "gal-3",
      url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1000&auto=format&fit=crop",
      title: "Nắm tay qua năm tháng",
      caption: "Bàn tay ấm áp chở che qua bao mùa mưa nắng.",
      aspectRatio: "landscape"
    },
    {
      id: "gal-4",
      url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1000&auto=format&fit=crop",
      title: "Nụ cười rạng rỡ",
      caption: "Những ngày tháng thanh xuân rực rỡ nhất.",
      aspectRatio: "square"
    },
    {
      id: "gal-5",
      url: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?q=80&w=1000&auto=format&fit=crop",
      title: "Bên nhau bình yên",
      caption: "Bình yên là khi có ai đó cùng chia sẻ tách trà sớm mai.",
      aspectRatio: "portrait"
    },
    {
      id: "gal-6",
      url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1000&auto=format&fit=crop",
      title: "Lời thề trăm năm",
      caption: "Trọn đời gắn kết, nghĩa tình thắm sâu.",
      aspectRatio: "landscape"
    }
  ],

  bankAccounts: [
    {
      ownerType: "groom",
      label: "Mừng Cưới Chú Rể",
      bankName: "Ngân hàng Ngoại thương (Vietcombank)",
      bankCode: "VCB",
      accountNumber: "1012345678",
      accountHolder: "TRAN QUANG MINH",
      branch: "Chi nhánh Hoàn Kiếm, Hà Nội",
      qrImageUrl: "https://api.vietqr.io/image/970436-1012345678-qMvjUqR.jpg?accountName=TRAN%20QUANG%20MINH&amount=0",
      customNote: "Mừng cưới Quang Minh"
    },
    {
      ownerType: "bride",
      label: "Mừng Cưới Cô Dâu",
      bankName: "Ngân hàng Quân Đội (MB Bank)",
      bankCode: "MB",
      accountNumber: "0987654321",
      accountHolder: "NGUYEN THUC AN",
      branch: "Chi nhánh Hai Bà Trưng, Hà Nội",
      qrImageUrl: "https://api.vietqr.io/image/970422-0987654321-compact.jpg?accountName=NGUYEN%20THUC%20AN&amount=0",
      customNote: "Mừng cưới Thục An"
    }
  ],

  musicUrl: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=acoustic-guitar-wedding-love-story-112191.mp3",
  contactPhone: {
    groom: "0912 345 678",
    bride: "0987 654 321"
  }
};
