/**
 * Tiện ích xử lý tên khách mời đích danh từ đường dẫn URL
 * Hỗ trợ các tham số: ?to=, ?guest=, ?khach=
 * Tự động giải mã chuẩn xác cả %20 và dấu + (do Zalo/Facebook chuyển đổi)
 */
export function getGuestNameFromUrl(): string {
  if (typeof window === "undefined") return "";
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("to") || params.get("guest") || params.get("khach") || "";
    if (!raw) return "";
    const withSpaces = raw.replace(/\+/g, " ");
    return decodeURIComponent(withSpaces).trim();
  } catch (e) {
    console.warn("Error parsing guest name from URL:", e);
    return "";
  }
}
