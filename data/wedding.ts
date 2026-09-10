import { WeddingData } from "@/types/wedding";

export const weddingData: WeddingData = {
  slug: "quyet-han",
  groom: {
    fullName: "Trần Công Quyết",
    shortName: "Công Quyết",
    roleTitle: "Chú Rể",
    parents: "Trưởng nam của Ông Trần Công Luân & Bà Nguyễn Thị Thơm",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    bio: "Chàng trai quê hương Minh Châu hiền hòa, chân thành và luôn mong muốn mang lại bình yên, hạnh phúc trọn vẹn nhất cho Hân.",
    email: "congquyet.wedding@gmail.com",
  },
  bride: {
    fullName: "Lê Ngọc Hân",
    shortName: "Ngọc Hân",
    roleTitle: "Cô Dâu",
    parents: "Ái nữ của Ông Lê Trung T",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    bio: "Cô gái duyên dáng, đảm đang, yêu đời và trao trọn niềm tin cho hành trình trăm năm hạnh phúc cùng Quyết.",
    email: "ngochan.wedding@gmail.com",
  },
  contactEmails: {
    groom: "congquyet.wedding@gmail.com",
    bride: "ngochan.wedding@gmail.com",
  },
  weddingDate: "2027-01-24T10:30:00+07:00",
  weddingDateFormatted: "Chủ Nhật, 24 Tháng 01 Năm 2027",
  lunarDateFormatted: "Nhằm ngày 17 tháng Chạp năm Bính Ngọ",
  welcomeQuote: "Trăm năm tình viên mãn • Bạc đầu nghĩa phu thê",
  welcomeMessage: "Trong niềm hân hoan của ngày trọng đại, gia đình chúng tôi trân trọng kính mời quý vị và các bạn tới chung vui, nâng chén rượu mừng chúc phúc cho đôi uyên ương.",
  
  openingLetter: {
    title: "Thư Ngỏ Gửi Người Thương Mến",
    content: [
      "Người xưa từng dạy: 'Trăm năm kết tóc se tơ, một ngày nên nghĩa tình thơ vẹn tròn'. Cùng sinh ra và lớn lên trên mảnh đất bãi bồi ven sông hiền hòa của quê hương Minh Châu yêu dấu, trải qua những năm tháng thanh xuân cùng nhau sẻ chia buồn vui, chúng con đã tìm thấy ở nhau sự đồng điệu, chân thành và bình yên sâu lắng.",
      "Hôn lễ này không chỉ là lời hẹn ước thiêng liêng trước bàn thờ gia tiên hai họ, mà còn là dịp để gia đình được tề tựu bên bà con lối xóm, người thân và bạn hữu thân quý — những người đã luôn dõi theo, động viên và vun vén cho hạnh phúc của hai đứa.",
      "Sự hiện diện và chén rượu mừng chúc phúc của quý vị chính là món quà quý báu, ý nghĩa nhất chắp cánh cho tổ ấm nhỏ của chúng con bước vào chặng đường mới trăm năm hạnh phúc."
    ],
    closing: "Trân trọng kính mời,\nTrần Công Quyết & Lê Ngọc Hân"
  },

  events: [
    {
      id: "vu-quy",
      title: "Lễ Vu Quy",
      subtitle: "Nghi thức xuất giá cô dâu",
      date: "Chủ Nhật, 24 Tháng 01 Năm 2027",
      isoDate: "2027-01-24T08:30:00+07:00",
      time: "08:30 Sáng",
      venue: "Tư Gia Họ Nhà Gái",
      address: "Khu 5, Xóm 6, Xã Minh Châu, Thành phố Hà Nội",
      mapUrl: "https://maps.google.com/?q=Khu+5+Xóm+6+Minh+Châu+Hà+Nội",
      notes: "Nghi thức bái tạ gia tiên nhà gái và tiễn cô dâu về nhà chồng."
    },
    {
      id: "thanh-hon",
      title: "Lễ Thành Hôn",
      subtitle: "Lễ đón dâu & trao nhẫn ước thề",
      date: "Chủ Nhật, 24 Tháng 01 Năm 2027",
      isoDate: "2027-01-24T10:00:00+07:00",
      time: "10:00 Sáng",
      venue: "Tư Gia Họ Nhà Trai",
      address: "Khu 5, Xóm 6, Xã Minh Châu, Thành phố Hà Nội",
      mapUrl: "https://maps.google.com/?q=Khu+5+Xóm+6+Minh+Châu+Hà+Nội",
      notes: "Nghi thức thành hôn đón dâu và bái gia tiên họ nhà trai."
    },
    {
      id: "tiec-cuoi",
      title: "Tiệc Cưới Chung Vui",
      subtitle: "Đón khách & Khai tiệc chung vui hai họ",
      date: "Chủ Nhật, 24 Tháng 01 Năm 2027",
      isoDate: "2027-01-24T11:30:00+07:00",
      time: "11:30 Trưa (Đón khách từ 11:00)",
      venue: "Hôn Trường Tư Gia Hai Họ",
      address: "Khu 5, Xóm 6, Xã Minh Châu, Thành phố Hà Nội",
      mapUrl: "https://maps.google.com/?q=Khu+5+Xóm+6+Minh+Châu+Hà+Nội",
      notes: "Trân trọng kính mời quý khách dùng bữa cơm thân mật chung vui cùng gia đình."
    }
  ],

  story: [
    {
      yearOrDate: "Thu 2021",
      title: "Duyên gặp gỡ bên bãi bồi",
      description: "Cùng lớn lên bên dòng sông bãi bồi quê hương Minh Châu thanh bình, một buổi chiều tình cờ gặp lại đã nhen nhóm tia lửa đầu tiên cho mối duyên lành.",
      imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
      location: "Xã Minh Châu, Hà Nội"
    },
    {
      yearOrDate: "Đông 2022",
      title: "Buổi hẹn đầu & lời ngỏ",
      description: "Những chiều đông dạo bước bên đường làng, cốc trà nóng thơm và nụ cười bẽn lẽn. Lời tỏ tình mộc mạc mà chân thành đã gắn kết hai trái tim.",
      imageUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop",
      location: "Bến sông Minh Châu"
    },
    {
      yearOrDate: "Xuân 2025",
      title: "Lời hẹn ước trăm năm",
      description: "Giữa sắc xuân rực rỡ của đất trời quê hương, trước sự chứng kiến của những điều thân thương nhất, Quyết trao cho Hân chiếc nhẫn đính ước, nguyện cùng nhau đi trọn đời.",
      imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop",
      location: "Minh Châu, Hà Nội"
    },
    {
      yearOrDate: "24.01.2027",
      title: "Khởi đầu tổ ấm nhỏ",
      description: "Sau bao năm tháng đồng hành và vun đắp, hôm nay chúng mình chính thức về chung một nhà, bắt đầu một mái ấm đong đầy yêu thương, trách nhiệm và bình yên.",
      imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
      location: "Minh Châu, Hà Nội"
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
      caption: "Nét duyên dáng thanh lịch trong tà áo dài cưới ngày vui.",
      aspectRatio: "portrait"
    },
    {
      id: "gal-3",
      url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1000&auto=format&fit=crop",
      title: "Nắm tay qua năm tháng",
      caption: "Bàn tay ấm áp chở che và đồng hành qua bao mùa nắng mưa.",
      aspectRatio: "landscape"
    },
    {
      id: "gal-4",
      url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1000&auto=format&fit=crop",
      title: "Nụ cười rạng rỡ",
      caption: "Những ngày tháng thanh xuân tươi đẹp và hạnh phúc nhất.",
      aspectRatio: "square"
    },
    {
      id: "gal-5",
      url: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?q=80&w=1000&auto=format&fit=crop",
      title: "Bên nhau bình yên",
      caption: "Bình yên là khi có ai đó cùng chia sẻ những điều giản dị mỗi ngày.",
      aspectRatio: "portrait"
    },
    {
      id: "gal-6",
      url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1000&auto=format&fit=crop",
      title: "Lời thề trăm năm",
      caption: "Trọn đời gắn kết, trọn nghĩa phu thê.",
      aspectRatio: "landscape"
    }
  ],

  bankAccounts: [
    {
      ownerType: "groom",
      label: "Mừng Cưới Chú Rể (Công Quyết)",
      bankName: "Ngân hàng Ngoại thương (Vietcombank)",
      bankCode: "VCB",
      accountNumber: "1012345678",
      accountHolder: "TRAN CONG QUYET",
      branch: "Chi nhánh Hà Nội",
      qrImageUrl: "https://api.vietqr.io/image/970436-1012345678-compact.jpg?accountName=TRAN%20CONG%20QUYET&amount=0",
      customNote: "Mừng cưới Công Quyết"
    },
    {
      ownerType: "bride",
      label: "Mừng Cưới Cô Dâu (Ngọc Hân)",
      bankName: "Ngân hàng Quân Đội (MB Bank)",
      bankCode: "MB",
      accountNumber: "0987654321",
      accountHolder: "LE NGOC HAN",
      branch: "Chi nhánh Hà Nội",
      qrImageUrl: "https://api.vietqr.io/image/970422-0987654321-compact.jpg?accountName=LE%20NGOC%20HAN&amount=0",
      customNote: "Mừng cưới Ngọc Hân"
    }
  ],

  musicUrl: "/audio/wedding-acoustic.mp3",
  contactPhone: {
    groom: "0912 345 678",
    bride: "0987 654 321"
  }
};
