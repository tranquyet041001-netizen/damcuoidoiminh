/**
 * Tiện ích xử lý đường dẫn Google Maps thông minh và tương thích đa nền tảng
 */

export function getGoogleMapsUrl(event: {
  mapUrl?: string;
  venue?: string;
  address?: string;
}): string {
  // 1. Ưu tiên sử dụng mapUrl nếu người dùng đã thiết lập
  if (event.mapUrl && event.mapUrl.trim()) {
    const rawUrl = event.mapUrl.trim();

    // Link chia sẻ rút gọn từ Google Maps app (ví dụ: https://maps.app.goo.gl/... hoặc goo.gl/maps/...)
    if (/^https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(rawUrl)) {
      return rawUrl;
    }

    // Link Google Maps web chuẩn
    if (/^https?:\/\/.*google\..*\/maps/i.test(rawUrl)) {
      try {
        const parsed = new URL(rawUrl);
        // Nếu có tham số q, chuẩn hóa và encode để tránh lỗi ký tự tiếng Việt có dấu trên di động
        if (parsed.searchParams.has("q")) {
          const q = parsed.searchParams.get("q") || "";
          return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
        }
        return rawUrl;
      } catch {
        return rawUrl;
      }
    }

    // Nếu là URL http/https hợp lệ khác
    if (/^https?:\/\//i.test(rawUrl)) {
      return rawUrl;
    }
  }

  // 2. Fallback thông minh: Tự động tạo URL Google Maps Search từ địa chỉ thực tế
  // LƯU Ý QUAN TRỌNG:
  // Không đưa các từ ngữ tư gia nội bộ như "Tư Gia Họ Nhà Gái", "Tư Gia Họ Nhà Trai", "Hôn Trường Tư Gia Hai Họ"
  // vào chuỗi tìm kiếm vì Google Maps sẽ coi đó là tên cửa hàng / địa điểm (POI) và báo "Không tìm thấy kết quả".
  let queryAddress = (event.address || "").trim();

  // Đảm bảo địa chỉ Xã Minh Châu luôn có "Ba Vì, Hà Nội" để Google Maps định vị chuẩn xác xã đảo Minh Châu
  if (
    queryAddress.toLowerCase().includes("minh châu") &&
    !queryAddress.toLowerCase().includes("ba vì")
  ) {
    queryAddress = queryAddress.replace(
      /xã minh châu/i,
      "Xã Minh Châu, Ba Vì"
    );
  }

  // Kiểm tra nếu là địa điểm công cộng/trung tâm tiệc cưới (không chứa từ tư gia)
  const isPrivateHome = /tư gia|hôn trường|nhà gái|nhà trai/i.test(event.venue || "");
  const cleanVenue = !isPrivateHome && event.venue?.trim() ? event.venue.trim() : "";

  const finalQuery = cleanVenue
    ? `${cleanVenue}, ${queryAddress}`
    : queryAddress || "Xã Minh Châu, Ba Vì, Hà Nội";

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(finalQuery)}`;
}

/**
 * Tự động tạo đường dẫn Google Maps chuẩn từ địa chỉ và địa điểm
 */
export function generateDefaultGoogleMapsUrl(address: string, venue?: string): string {
  return getGoogleMapsUrl({ address, venue });
}
