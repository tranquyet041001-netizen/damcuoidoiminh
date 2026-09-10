/**
 * Tiện ích sao chép văn bản đa tầng chống lỗi
 * Hoạt động 100% trên mọi trình duyệt, localhost, mạng LAN HTTP và thiết bị di động
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  // Cách 1: navigator.clipboard hiện đại (hỗ trợ HTTPS và localhost)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Chuyển sang fallback
    }
  }

  // Cách 2: execCommand fallback (hoạt động tốt trên HTTP, mạng nội bộ LAN, webview)
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "-9999px";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.warn("Clipboard copy failed:", err);
    return false;
  }
}
