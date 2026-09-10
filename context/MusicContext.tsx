"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useWeddingData } from "./WeddingDataContext";
import { extractYouTubeId, isYouTubeUrl } from "@/utils/youtube";
import { useToast } from "@/components/ui/Toast";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface MusicContextType {
  isPlaying: boolean;
  isReady: boolean;
  isMuted: boolean;
  isYouTube: boolean;
  currentSongTitle: string;
  useFallbackAudio: boolean;
  showVideoPreview: boolean;
  setShowVideoPreview: (show: boolean) => void;
  toggleMusic: () => void;
  playMusic: () => void;
  pauseMusic: () => void;
  toggleMute: () => void;
  musicUrl: string;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const LOCAL_FALLBACK_AUDIO = "/audio/wedding-acoustic.mp3";

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data } = useWeddingData();
  const { showToast } = useToast();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [useFallbackAudio, setUseFallbackAudio] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [currentSongTitle, setCurrentSongTitle] = useState(
    "Acoustic Guitar Lãng Mạn"
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const pendingPlayRef = useRef(false);

  const rawMusicUrl = data.musicUrl || LOCAL_FALLBACK_AUDIO;
  const isYt = !useFallbackAudio && isYouTubeUrl(rawMusicUrl);
  const ytId = isYt ? extractYouTubeId(rawMusicUrl) : null;

  // Cập nhật tiêu đề bài hát khi URL thay đổi
  useEffect(() => {
    if (useFallbackAudio) {
      setCurrentSongTitle("Acoustic Guitar Lãng Mạn (Dự Phòng)");
    } else if (isYt) {
      if (rawMusicUrl.includes("rIXhXaQ8tiM")) {
        setCurrentSongTitle("Ngày Đầu Tiên - Đức Phúc");
      } else if (rawMusicUrl.includes("1P4DaXgzVnE")) {
        setCurrentSongTitle("Ánh Nắng Của Anh - Đức Phúc");
      } else if (rawMusicUrl.includes("QgaTQ5-XfMM")) {
        setCurrentSongTitle("A Thousand Years - The Piano Guys");
      } else if (rawMusicUrl.includes("GxldQ9eX2wo")) {
        setCurrentSongTitle("Until I Found You - Stephen Sanchez");
      } else {
        setCurrentSongTitle("Nhạc Nền YouTube");
      }
    } else {
      setCurrentSongTitle("Acoustic Guitar Lãng Mạn");
    }
  }, [rawMusicUrl, isYt, useFallbackAudio]);

  // Reset khi thay đổi link nhạc
  useEffect(() => {
    setIsPlaying(false);
    setUseFallbackAudio(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === "function") {
      try {
        ytPlayerRef.current.pauseVideo();
      } catch {
        // ignore
      }
    }
  }, [data.musicUrl]);

  // Khởi tạo YouTube IFrame API nếu nhạc là YouTube
  useEffect(() => {
    if (!isYt || !ytId || typeof window === "undefined") {
      setIsReady(true);
      return;
    }

    let isSubscribed = true;

    const initPlayer = () => {
      if (!isSubscribed) return;
      try {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === "function") {
          ytPlayerRef.current.destroy();
        }

        ytPlayerRef.current = new window.YT.Player("wedding-yt-player", {
          videoId: ytId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            disablekb: 1,
            fs: 0,
            loop: 1,
            playlist: ytId,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              if (!isSubscribed) return;
              setIsReady(true);
              try {
                event.target.unMute();
                event.target.setVolume(100);
              } catch {
                // ignore
              }
              if (pendingPlayRef.current) {
                pendingPlayRef.current = false;
                event.target.playVideo();
                setIsPlaying(true);
              }
            },
            onStateChange: (event: any) => {
              if (!isSubscribed) return;
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                // Loop
                event.target.playVideo();
              }
            },
            onError: (event: any) => {
              console.warn("YouTube player error code:", event.data);
              if (!isSubscribed) return;
              // 101/150 = owner disabled embedding, 100 = not found, 2 = invalid param
              if (event.data === 101 || event.data === 150 || event.data === 100 || event.data === 2) {
                showToast(
                  "Video YouTube này bị giới hạn nhúng ngoài trang. Tự động chuyển sang nhạc acoustic lãng mạn 🎵",
                  "info"
                );
                setUseFallbackAudio(true);
                // Tự động phát nhạc thay thế
                setTimeout(() => {
                  if (audioRef.current) {
                    audioRef.current
                      .play()
                      .then(() => setIsPlaying(true))
                      .catch(() => {});
                  }
                }, 300);
              }
            },
          },
        });
      } catch (err) {
        console.error("Failed to initialize YouTube player:", err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Tải script iframe_api
      const existingScript = document.getElementById("youtube-iframe-api");
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.id = "youtube-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const prevOnReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevOnReady === "function") prevOnReady();
        initPlayer();
      };
    }

    return () => {
      isSubscribed = false;
    };
  }, [isYt, ytId, showToast]);

  const playMusic = useCallback(() => {
    if (isYt && ytId && !useFallbackAudio) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === "function") {
        try {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(100);
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
          showToast(`Đang phát: ${currentSongTitle} 🎵`, "success");
        } catch (e) {
          console.warn("Play YT error:", e);
        }
      } else {
        pendingPlayRef.current = true;
        showToast("Đang tải nhạc nền...", "info");
      }
    } else {
      // HTML5 Audio
      if (!audioRef.current) return;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          showToast(`Đang phát: ${currentSongTitle} 🎵`, "success");
        })
        .catch((err) => {
          console.warn("Audio play prevented:", err);
          showToast("Vui lòng chạm vào màn hình để bật âm thanh", "info");
        });
    }
  }, [isYt, ytId, useFallbackAudio, currentSongTitle, showToast]);

  const pauseMusic = useCallback(() => {
    if (isYt && ytId && !useFallbackAudio) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === "function") {
        try {
          ytPlayerRef.current.pauseVideo();
        } catch {
          // ignore
        }
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
    setIsPlaying(false);
    showToast("Đã tạm dừng nhạc nền", "info");
  }, [isYt, ytId, useFallbackAudio, showToast]);

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }, [isPlaying, playMusic, pauseMusic]);

  const toggleMute = useCallback(() => {
    if (isYt && ytId && !useFallbackAudio) {
      if (ytPlayerRef.current) {
        try {
          if (isMuted) {
            ytPlayerRef.current.unMute();
            setIsMuted(false);
          } else {
            ytPlayerRef.current.mute();
            setIsMuted(true);
          }
        } catch {
          // ignore
        }
      }
    } else {
      if (audioRef.current) {
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    }
  }, [isYt, ytId, useFallbackAudio, isMuted]);

  const effectiveAudioSrc = useFallbackAudio
    ? LOCAL_FALLBACK_AUDIO
    : !isYt
    ? rawMusicUrl.startsWith("http") || rawMusicUrl.startsWith("/")
      ? rawMusicUrl
      : LOCAL_FALLBACK_AUDIO
    : LOCAL_FALLBACK_AUDIO;

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        isReady,
        isMuted,
        isYouTube: isYt && !useFallbackAudio,
        currentSongTitle,
        useFallbackAudio,
        showVideoPreview,
        setShowVideoPreview,
        toggleMusic,
        playMusic,
        pauseMusic,
        toggleMute,
        musicUrl: rawMusicUrl,
      }}
    >
      {children}

      {/* Trình phát file âm thanh HTML5 (.mp3) */}
      <audio
        ref={audioRef}
        src={effectiveAudioSrc}
        preload="auto"
        loop
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => {
          console.warn("Audio element error, falling back to local file:", e);
          if (!useFallbackAudio) {
            setUseFallbackAudio(true);
          }
        }}
      />

      {/* Trình phát YouTube */}
      {isYt && ytId && !useFallbackAudio && (
        <>
          {/* Container YouTube ẩn nhưng nằm trong viewport để Chrome không tắt âm thanh */}
          <div
            className={`transition-all duration-300 ${
              showVideoPreview
                ? "fixed bottom-20 right-4 z-50 w-72 h-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C9A84C] bg-black"
                : "fixed bottom-0 left-0 w-8 h-8 pointer-events-none overflow-hidden z-[-1]"
            }`}
            style={showVideoPreview ? {} : { opacity: 0.01 }}
            aria-hidden={!showVideoPreview}
          >
            {showVideoPreview && (
              <div className="absolute top-2 right-2 z-10">
                <button
                  type="button"
                  onClick={() => setShowVideoPreview(false)}
                  className="w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-xs hover:bg-black cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
            <div id="wedding-yt-player" className="w-full h-full" />
          </div>
        </>
      )}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};
