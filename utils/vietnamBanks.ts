/**
 * Danh mục các ngân hàng Việt Nam (NAPAS / VietQR)
 * Hỗ trợ tạo mã VietQR chuẩn xác theo mã định danh BIN của từng ngân hàng.
 */

export interface VietnamBank {
  id: string;
  name: string;
  shortName: string;
  code: string;
  bin: string;
}

export const VIETNAM_BANKS: VietnamBank[] = [
  {
    id: "VCB",
    shortName: "Vietcombank",
    name: "Ngân hàng Ngoại thương Việt Nam",
    code: "VCB",
    bin: "970436",
  },
  {
    id: "MB",
    shortName: "MB Bank",
    name: "Ngân hàng Quân Đội",
    code: "MB",
    bin: "970422",
  },
  {
    id: "TCB",
    shortName: "Techcombank",
    name: "Ngân hàng Kỹ thương Việt Nam",
    code: "TCB",
    bin: "970407",
  },
  {
    id: "BIDV",
    shortName: "BIDV",
    name: "Ngân hàng Đầu tư và Phát triển Việt Nam",
    code: "BIDV",
    bin: "970418",
  },
  {
    id: "CTG",
    shortName: "VietinBank",
    name: "Ngân hàng Công thương Việt Nam",
    code: "CTG",
    bin: "970415",
  },
  {
    id: "VBA",
    shortName: "Agribank",
    name: "Ngân hàng Nông nghiệp và PTNT Việt Nam",
    code: "VBA",
    bin: "970405",
  },
  {
    id: "VPB",
    shortName: "VPBank",
    name: "Ngân hàng Việt Nam Thịnh Vượng",
    code: "VPB",
    bin: "970432",
  },
  {
    id: "ACB",
    shortName: "ACB",
    name: "Ngân hàng Á Châu",
    code: "ACB",
    bin: "970416",
  },
  {
    id: "TPB",
    shortName: "TPBank",
    name: "Ngân hàng Tiên Phong",
    code: "TPB",
    bin: "970423",
  },
  {
    id: "STB",
    shortName: "Sacombank",
    name: "Ngân hàng Sài Gòn Thương Tín",
    code: "STB",
    bin: "970403",
  },
  {
    id: "HDB",
    shortName: "HDBank",
    name: "Ngân hàng Phát triển TP.HCM",
    code: "HDB",
    bin: "970437",
  },
  {
    id: "VIB",
    shortName: "VIB",
    name: "Ngân hàng Quốc tế Việt Nam",
    code: "VIB",
    bin: "970441",
  },
  {
    id: "SHB",
    shortName: "SHB",
    name: "Ngân hàng Sài Gòn - Hà Nội",
    code: "SHB",
    bin: "970443",
  },
  {
    id: "MSB",
    shortName: "MSB",
    name: "Ngân hàng Hàng Hải",
    code: "MSB",
    bin: "970426",
  },
  {
    id: "LPB",
    shortName: "LPBank",
    name: "Ngân hàng Lộc Phát Việt Nam",
    code: "LPB",
    bin: "970449",
  },
  {
    id: "SEAB",
    shortName: "SeABank",
    name: "Ngân hàng Đông Nam Á",
    code: "SEAB",
    bin: "970440",
  },
  {
    id: "OCB",
    shortName: "OCB",
    name: "Ngân hàng Phương Đông",
    code: "OCB",
    bin: "970448",
  },
  {
    id: "EIB",
    shortName: "Eximbank",
    name: "Ngân hàng Xuất Nhập Khẩu Việt Nam",
    code: "EIB",
    bin: "970431",
  },
  {
    id: "NAB",
    shortName: "Nam A Bank",
    name: "Ngân hàng Nam Á",
    code: "NAB",
    bin: "970428",
  },
  {
    id: "PVCB",
    shortName: "PVcomBank",
    name: "Ngân hàng Đại Chúng Việt Nam",
    code: "PVCB",
    bin: "970412",
  },
  {
    id: "BAB",
    shortName: "Bac A Bank",
    name: "Ngân hàng Bắc Á",
    code: "BAB",
    bin: "970409",
  },
  {
    id: "BVB",
    shortName: "BVBank (Bản Việt)",
    name: "Ngân hàng Bản Việt",
    code: "BVB",
    bin: "970454",
  },
  {
    id: "ABB",
    shortName: "ABBANK",
    name: "Ngân hàng An Bình",
    code: "ABB",
    bin: "970425",
  },
  {
    id: "VAB",
    shortName: "VietABank",
    name: "Ngân hàng Việt Á",
    code: "VAB",
    bin: "970427",
  },
  {
    id: "KLB",
    shortName: "Kienlongbank",
    name: "Ngân hàng Kiên Long",
    code: "KLB",
    bin: "970452",
  },
  {
    id: "SGB",
    shortName: "Saigonbank",
    name: "Ngân hàng Sài Gòn Công Thương",
    code: "SGB",
    bin: "970400",
  },
  {
    id: "PGB",
    shortName: "PGBank",
    name: "Ngân hàng Thịnh vượng và Phát triển",
    code: "PGB",
    bin: "970430",
  },
  {
    id: "TIMO",
    shortName: "Timo by BVBank",
    name: "Ngân hàng số Timo",
    code: "TIMO",
    bin: "963388",
  },
  {
    id: "CAKE",
    shortName: "Cake by VPBank",
    name: "Ngân hàng số Cake",
    code: "CAKE",
    bin: "546034",
  },
  {
    id: "SHBVN",
    shortName: "Shinhan Bank",
    name: "Ngân hàng Shinhan Việt Nam",
    code: "SHBVN",
    bin: "970424",
  },
  {
    id: "WRB",
    shortName: "Woori Bank",
    name: "Ngân hàng Woori Việt Nam",
    code: "WRB",
    bin: "970457",
  },
  {
    id: "VTLMONEY",
    shortName: "Viettel Money",
    name: "Viettel Money",
    code: "VTLMONEY",
    bin: "971005",
  },
  {
    id: "VNPTMONEY",
    shortName: "VNPT Money",
    name: "VNPT Money",
    code: "VNPTMONEY",
    bin: "971011",
  },
  {
    id: "MOMO",
    shortName: "Ví MoMo",
    name: "Ví điện tử MoMo",
    code: "MOMO",
    bin: "971025",
  },
  {
    id: "ZALOPAY",
    shortName: "ZaloPay",
    name: "Ví điện tử ZaloPay",
    code: "ZALOPAY",
    bin: "971037",
  },
];

/**
 * Tìm kiếm ngân hàng tương ứng theo BIN, code hoặc tên
 */
export function findBank(query?: string): VietnamBank | undefined {
  if (!query) return undefined;
  const q = query.trim().toLowerCase();
  return VIETNAM_BANKS.find(
    (b) =>
      b.bin === q ||
      b.code.toLowerCase() === q ||
      b.shortName.toLowerCase() === q ||
      b.name.toLowerCase().includes(q) ||
      q.includes(b.shortName.toLowerCase()) ||
      q.includes(b.code.toLowerCase())
  );
}

/**
 * Tạo URL mã VietQR trực tiếp từ CDN img.vietqr.io với tốc độ cực nhanh
 */
export function generateVietQrUrl(
  bin: string,
  accountNumber: string,
  accountHolder: string = "",
  note: string = ""
): string {
  const cleanBin = bin.trim();
  const cleanAcc = accountNumber.trim().replace(/\s+/g, "");
  if (!cleanBin || !cleanAcc) return "";

  const nameParam = accountHolder
    ? `?accountName=${encodeURIComponent(accountHolder.trim().toUpperCase())}&amount=0`
    : "?amount=0";
  const noteParam = note ? `&addInfo=${encodeURIComponent(note.trim())}` : "";

  // Sử dụng CDN trực tiếp img.vietqr.io (nhanh gấp nhiều lần so với api.vietqr.io)
  return `https://img.vietqr.io/image/${cleanBin}-${cleanAcc}-compact2.jpg${nameParam}${noteParam}`;
}

/**
 * Fallback tạo mã QR đa năng qua QRServer
 */
export function generateGenericQrUrl(data: string, size = 350): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    data
  )}`;
}
