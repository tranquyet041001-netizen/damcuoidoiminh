import React from "react";

/**
 * Tiện ích xử lý link nhạc YouTube cho thiệp cưới
 */

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

export function isYouTubeUrl(url: string): boolean {
  return Boolean(extractYouTubeId(url));
}

export const YouTubeIcon: React.FC<{ className?: string; size?: number }> = ({
  className = "",
  size = 16,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export interface SuggestedSong {
  title: string;
  artist: string;
  url: string;
  type: "youtube" | "mp3";
}

export const SUGGESTED_WEDDING_SONGS: SuggestedSong[] = [
  {
    title: "Ánh Nắng Của Anh (Acoustic Wedding)",
    artist: "Đức Phúc",
    url: "https://www.youtube.com/watch?v=3gVd3gY8E0o",
    type: "youtube",
  },
  {
    title: "Ngày Đầu Tiên",
    artist: "Đức Phúc",
    url: "https://www.youtube.com/watch?v=9jDkx_k_N_U",
    type: "youtube",
  },
  {
    title: "Until I Found You (Piano & Strings)",
    artist: "Stephen Sanchez",
    url: "https://www.youtube.com/watch?v=GxldQ9eX2wo",
    type: "youtube",
  },
  {
    title: "A Thousand Years (Violin & Piano)",
    artist: "The Piano Guys",
    url: "https://www.youtube.com/watch?v=QgaTQ5-XfMM",
    type: "youtube",
  },
  {
    title: "Acoustic Guitar Lãng Mạn (Mặc Định)",
    artist: "Pixabay Music",
    url: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=acoustic-guitar-wedding-love-story-112191.mp3",
    type: "mp3",
  },
];
