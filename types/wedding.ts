export interface PersonInfo {
  fullName: string;
  shortName: string;
  roleTitle?: string; // e.g. "Cô Dâu", "Chú Rể"
  parents: string; // e.g. "Ái nữ của Ông... và Bà..."
  avatarUrl: string;
  bio?: string;
  email?: string; // Email nhận phản hồi RSVP
}

export interface WeddingEvent {
  id: string;
  title: string; // "Lễ Thành Hôn", "Lễ Vu Quy", "Tiệc Cưới"
  subtitle?: string; // "Nhà Trai", "Nhà Gái", "Tiệc Mừng"
  date: string; // "Chủ Nhật, 24 tháng 01 năm 2027"
  isoDate: string; // "2027-01-24T10:30:00+07:00"
  time: string; // "10:30"
  venue: string; // Tên tư gia hoặc trung tâm tiệc cưới
  address: string;
  mapUrl: string;
  mapEmbedUrl?: string;
  notes?: string;
}

export interface StoryMilestone {
  yearOrDate: string;
  title: string;
  description: string;
  imageUrl: string;
  location?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title: string;
  caption?: string;
  aspectRatio?: "square" | "portrait" | "landscape";
}

export interface BankAccount {
  ownerType: "groom" | "bride";
  label: string;
  bankName: string;
  bankCode?: string;
  accountNumber: string;
  accountHolder: string;
  branch?: string;
  qrImageUrl: string;
  customNote?: string;
}

export interface ContactEmails {
  groom: string;
  bride: string;
}

export interface WeddingData {
  slug?: string; // Link rút gọn ví dụ "minh-an" -> /i/minh-an
  groom: PersonInfo;
  bride: PersonInfo;
  contactEmails: ContactEmails;
  weddingDate: string; // ISO 8601 string for countdown
  weddingDateFormatted: string;
  lunarDateFormatted: string;
  welcomeQuote: string;
  welcomeMessage: string;
  openingLetter: {
    title: string;
    content: string[];
    closing: string;
  };
  events: WeddingEvent[];
  story: StoryMilestone[];
  gallery: GalleryItem[];
  bankAccounts: BankAccount[];
  musicUrl: string;
  contactPhone?: {
    groom: string;
    bride: string;
  };
  notifications?: NotificationSettings;
}

export interface NotificationSettings {
  telegram?: {
    enabled?: boolean;
    botToken?: string;
    chatId?: string;
  };
  googleSheet?: {
    enabled?: boolean;
    webhookUrl?: string;
  };
  email?: {
    enabled?: boolean;
    resendApiKey?: string;
  };
}


export interface RSVPSubmission {
  id?: string;
  fullName: string;
  phone: string;
  guestOf: "groom" | "bride" | "both";
  attendance: "attending" | "declined" | "undecided";
  guestCount: number;
  dietaryOrNote?: string;
  createdAt?: string;
  emailSentTo?: string[];
}

export interface WishSubmission {
  id: string;
  name: string;
  relationship?: string;
  content: string;
  createdAt: string;
}
