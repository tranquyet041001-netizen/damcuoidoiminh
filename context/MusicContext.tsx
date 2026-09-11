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
  const unlockListenerAttachedRef = useRef(false);

  // Cấu hình âm thanh chuẩn Media Playback cho iOS Safari để không bị ngắt bởi nút gạt rung/im lặng
  useEffect(() => {
    if (typeof navigator !== "undefined" && "audioSession" in navigator) {
      try {
        (navigator as any).audioSession.type = "playback";
      } catch {
        // ignore
      }
    }
  }, []);

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
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            loop: 1,
            playlist: ytId,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            enablejsapi: 1,
            origin: typeof window !== "undefined" ? window.location.origin : undefined,
          },
          events: {
            onReady: (event: any) => {
              if (!isSubscribed) return;
              setIsReady(true);
              try {
                event.target.unMute();
                event.target.setVolume(100);
                const iframe = event.target.getIframe?.();
                if (iframe) {
                  iframe.setAttribute("playsinline", "1");
                  iframe.setAttribute("webkit-playsinline", "true");
                  iframe.setAttribute("allow", "autoplay; encrypted-media");
                  iframe.setAttribute("tabindex", "-1");
                  iframe.style.pointerEvents = "none";
                }
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
              showToast(
                "Đang phát nhạc nền tiệc cưới lãng mạn 🎵",
                "info"
              );
              setUseFallbackAudio(true);
              setTimeout(() => {
                if (audioRef.current) {
                  audioRef.current
                    .play()
                    .then(() => setIsPlaying(true))
                    .catch(() => {});
                }
              }, 300);
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

  // Phát âm thanh HTML5 nội bộ (.mp3) với cơ chế mở khóa tự động trên mobile
  const playLocalAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = false;
    audio.volume = 1.0;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          showToast(`Đang phát: ${currentSongTitle} 🎵`, "success");
        })
        .catch((err) => {
          console.warn("Audio play prevented on mobile, registering touch unlocker:", err);

          // Cơ chế mở khóa tự động: Ngay khi người dùng chạm hoặc cuộn trang lần đầu, âm thanh sẽ phát ngay
          if (!unlockListenerAttachedRef.current) {
            unlockListenerAttachedRef.current = true;

            const unlockAudio = () => {
              if (audioRef.current) {
                audioRef.current.muted = false;
                audioRef.current.volume = 1.0;
                audioRef.current
                  .play()
                  .then(() => {
                    setIsPlaying(true);
                    cleanup();
                  })
                  .catch(() => {});
              }
            };

            const cleanup = () => {
              unlockListenerAttachedRef.current = false;
              window.removeEventListener("touchstart", unlockAudio);
              window.removeEventListener("touchend", unlockAudio);
              window.removeEventListener("click", unlockAudio);
              window.removeEventListener("scroll", unlockAudio);
            };

            window.addEventListener("touchstart", unlockAudio, { passive: true });
            window.addEventListener("touchend", unlockAudio, { passive: true });
            window.addEventListener("click", unlockAudio, { passive: true });
            window.addEventListener("scroll", unlockAudio, { passive: true });
          }

          showToast("Chạm nhẹ vào màn hình để bật nhạc cưới 🎵", "info");
        });
    }
  }, [currentSongTitle, showToast]);

  const playMusic = useCallback(() => {
    if (typeof navigator !== "undefined" && "audioSession" in navigator) {
      try {
        (navigator as any).audioSession.type = "playback";
      } catch {
        // ignore
      }
    }

    const isMobileDevice =
      typeof window !== "undefined" &&
      (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
        window.innerWidth <= 768);

    // Trên điện thoại, YouTube iframe nền bị iOS Safari & Android Chrome chặn phát tự động
    // Chuyển sang file MP3 nội bộ để âm thanh luôn vang lên mượt mà nhất
    if (isYt && ytId && !useFallbackAudio && !isMobileDevice) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === "function") {
        try {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(100);
          ytPlayerRef.current.playVideo();
          const iframe = ytPlayerRef.current.getIframe?.();
          if (iframe) {
            iframe.blur?.();
          }
          setIsPlaying(true);
          showToast(`Đang phát: ${currentSongTitle} 🎵`, "success");
        } catch (e) {
          console.warn("Play YT error, fallback to local audio:", e);
          setUseFallbackAudio(true);
          playLocalAudio();
        }
      } else {
        pendingPlayRef.current = true;
        showToast("Đang tải nhạc nền...", "info");
      }
    } else {
      if (isMobileDevice && isYt && !useFallbackAudio) {
        setUseFallbackAudio(true);
      }
      playLocalAudio();
    }
  }, [isYt, ytId, useFallbackAudio, currentSongTitle, showToast, playLocalAudio]);

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

  // Chuẩn bị sẵn bộ đệm âm thanh
  useEffect(() => {
    if (audioRef.current) {
      try {
        audioRef.current.load();
      } catch {
        // ignore
      }
    }
  }, [effectiveAudioSrc]);

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
          {/* Container YouTube: Khi ẩn sẽ ở ngoài màn hình với kích thước chuẩn 16:9 để tránh iOS fullscreen và không bị nhảy cuộn trang */}
          <div
            className={`transition-all duration-300 ${
              showVideoPreview
                ? "fixed bottom-20 right-4 z-50 w-72 h-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C9A84C] bg-black pointer-events-auto"
                : "fixed -top-[9999px] -left-[9999px] w-[320px] h-[180px] pointer-events-none overflow-hidden"
            }`}
            style={showVideoPreview ? {} : { opacity: 0.001, pointerEvents: "none" }}
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
