/**
 * Tiện ích xử lý và nén ảnh phía client:
 * Đọc file từ thẻ <input type="file">, nén bằng HTML5 Canvas và trả về Data URL (Base64)
 * Giúp xem trước ngay lập tức mà không cần phụ thuộc server lưu trữ bên ngoài.
 */
export async function processAndUploadImage(
  file: File,
  options: { maxWidth?: number; maxHeight?: number; quality?: number } = {}
): Promise<string> {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.8 } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Vui lòng chỉ chọn file hình ảnh (JPG, PNG, WebP)"));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Không thể đọc file hình ảnh"));
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("Không thể tải hình ảnh"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Tính toán kích thước tối ưu giữ nguyên tỷ lệ khung hình
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Trình duyệt không hỗ trợ Canvas 2D"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
