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
  const ytContainerRef = useRef<HTMLDivElement | null>(null);
  const pendingPlayRef = useRef(false);
  const prevMusicUrlRef = useRef(data.musicUrl);
  const audioCtxRef = useRef<any>(null);
  const mediaSourceConnectedRef = useRef<boolean>(false);

  // Mở khóa toàn diện Audio Hardware trên iOS & Android
  const unlockAudioEngine = useCallback(() => {
    // 1. Cấu hình AudioSession cho iOS 16.4+ để âm thanh phát qua kênh Playback (không phụ thuộc nút gạt rung)
    if (typeof navigator !== "undefined" && "audioSession" in navigator) {
      try {
        (navigator as any).audioSession.type = "playback";
      } catch {
        // ignore
      }
    }

    // 2. Kích hoạt Web Audio Context (đánh thức hệ thống CoreAudio trên iOS)
    try {
      if (typeof window !== "undefined") {
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContextClass();
          }
          const ctx = audioCtxRef.current;
          if (ctx.state === "suspended") {
            ctx.resume().catch(() => {});
          }
          if (ctx.state === "running") {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            gain.gain.value = 0.0001;
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(0);
            osc.stop(0.02);
          }
        }
      }
    } catch {
      // ignore
    }

    // 3. Kích hoạt buffer nạp trước cho file nhạc
    if (audioRef.current) {
      try {
        audioRef.current.load();
      } catch {
        // ignore
      }
    }
  }, []);

  // Đăng ký mở khóa âm thanh ngay từ cử chỉ chạm đầu tiên trên màn hình điện thoại
  useEffect(() => {
    const handleFirstUserInteraction = () => {
      unlockAudioEngine();
      window.removeEventListener("touchstart", handleFirstUserInteraction);
      window.removeEventListener("touchend", handleFirstUserInteraction);
      window.removeEventListener("click", handleFirstUserInteraction);
      window.removeEventListener("pointerdown", handleFirstUserInteraction);
    };

    window.addEventListener("touchstart", handleFirstUserInteraction, { passive: true });
    window.addEventListener("touchend", handleFirstUserInteraction, { passive: true });
    window.addEventListener("click", handleFirstUserInteraction, { passive: true });
    window.addEventListener("pointerdown", handleFirstUserInteraction, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleFirstUserInteraction);
      window.removeEventListener("touchend", handleFirstUserInteraction);
      window.removeEventListener("click", handleFirstUserInteraction);
      window.removeEventListener("pointerdown", handleFirstUserInteraction);
    };
  }, [unlockAudioEngine]);

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

  // Reset CHỈ KHI link nhạc thực sự thay đổi giá trị
  useEffect(() => {
    if (prevMusicUrlRef.current !== data.musicUrl) {
      prevMusicUrlRef.current = data.musicUrl;
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
    }
  }, [data.musicUrl]);

  // Khởi tạo YouTube IFrame API nếu nhạc là YouTube
  useEffect(() => {
    if (!isYt || !ytId || typeof window === "undefined") {
      setIsReady(true);
      return;
    }

    let isSubscribed = true;
    let pollTimer: any = null;

    const initPlayer = () => {
      if (!isSubscribed) return;
      try {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === "function") {
          try {
            ytPlayerRef.current.destroy();
          } catch {
            // ignore
          }
          ytPlayerRef.current = null;
        }

        // Tái tạo phần tử DOM #wedding-yt-player sạch sẽ trước khi gắn YT.Player
        if (ytContainerRef.current) {
          ytContainerRef.current.innerHTML = '<div id="wedding-yt-player" style="width:100%;height:100%"></div>';
        }

        const targetEl = document.getElementById("wedding-yt-player");
        if (!targetEl) {
          return;
        }

        ytPlayerRef.current = new (window as any).YT.Player("wedding-yt-player", {
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
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED, 3 = BUFFERING
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                // Loop lại bài hát
                event.target.playVideo();
              }
            },
            onError: (event: any) => {
              console.warn("YouTube player error code:", event.data);
              if (!isSubscribed) return;
              let reason = "Video YouTube không hỗ trợ nhúng phát nền";
              if (event.data === 101 || event.data === 150) {
                reason = "Video này bị chủ sở hữu chặn nhúng ngoài YouTube";
              } else if (event.data === 100) {
                reason = "Video YouTube không tồn tại hoặc đã chuyển sang riêng tư";
              }
              showToast(`${reason}. Đang chuyển sang nhạc nền Acoustic 🎵`, "info");
              setUseFallbackAudio(true);
              setTimeout(() => {
                if (audioRef.current) {
                  audioRef.current
                    .play()
                    .then(() => setIsPlaying(true))
                    .catch(() => {});
                }
              }, 400);
            },
          },
        });
      } catch (err) {
        console.error("Failed to initialize YouTube player:", err);
      }
    };

    if ((window as any).YT && (window as any).YT.Player) {
      setTimeout(initPlayer, 60);
    } else {
      // Polling kiểm tra API sẵn sàng
      pollTimer = setInterval(() => {
        if ((window as any).YT && (window as any).YT.Player) {
          clearInterval(pollTimer);
          initPlayer();
        }
      }, 120);

      // Tải script iframe_api nếu chưa có
      const existingScript = document.getElementById("youtube-iframe-api");
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.id = "youtube-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const prevOnReady = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (typeof prevOnReady === "function") prevOnReady();
        if (pollTimer) clearInterval(pollTimer);
        initPlayer();
      };
    }

    return () => {
      isSubscribed = false;
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [isYt, ytId, showToast]);

  // Phát âm thanh HTML5 nội bộ (.mp3) với cơ chế mở khóa và bypass chế độ im lặng trên iPhone
  const playLocalAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Đánh thức engine âm thanh Web Audio và cấu hình AudioSession
    unlockAudioEngine();

    // Thử kết nối audio element với Web Audio Context để vượt qua nút gạt rung (Silent Switch) trên iPhone
    try {
      if (audioCtxRef.current && !mediaSourceConnectedRef.current) {
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") {
          ctx.resume().catch(() => {});
        }
        const source = ctx.createMediaElementSource(audio);
        source.connect(ctx.destination);
        mediaSourceConnectedRef.current = true;
      }
    } catch {
      // ignore
    }

    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }

    audio.muted = false;
    audio.volume = 1.0;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          showToast(
            `Đang phát: ${currentSongTitle} 🎵`,
            "success"
          );
        })
        .catch((err) => {
          console.warn("Audio play blocked by mobile policy, attaching instant retry:", err);

          // Cơ chế mở khóa tự động dự phòng: Ngay khi người dùng chạm màn hình, phát ngay
          const unlockOnNextTouch = () => {
            if (audioRef.current) {
              unlockAudioEngine();
              audioRef.current.muted = false;
              audioRef.current.volume = 1.0;
              audioRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                  removeListeners();
                })
                .catch(() => {});
            }
          };

          const removeListeners = () => {
            window.removeEventListener("touchstart", unlockOnNextTouch);
            window.removeEventListener("touchend", unlockOnNextTouch);
            window.removeEventListener("click", unlockOnNextTouch);
          };

          window.addEventListener("touchstart", unlockOnNextTouch, { passive: true, once: true });
          window.addEventListener("touchend", unlockOnNextTouch, { passive: true, once: true });
          window.addEventListener("click", unlockOnNextTouch, { passive: true, once: true });

          showToast("Chạm nhẹ vào màn hình để bật nhạc cưới 🎵", "info");
        });
    }
  }, [currentSongTitle, showToast, unlockAudioEngine]);

  const playMusic = useCallback(() => {
    // Nếu nhạc MP3 đang chạy êm rồi thì giữ nguyên, tránh giật nhạc
    if (!isYt && audioRef.current && !audioRef.current.paused && isPlaying) {
      return;
    }

    unlockAudioEngine();

    // 1. NẾU LÀ BÀI HÁT YOUTUBE:
    if (isYt && ytId && !useFallbackAudio) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === "function") {
        try {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(100);
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
          showToast(`Đang phát: ${currentSongTitle} 🎵`, "success");
        } catch (e) {
          console.warn("Play YT error, fallback to local audio:", e);
          setUseFallbackAudio(true);
          playLocalAudio();
        }
      } else {
        pendingPlayRef.current = true;
        showToast("Đang kết nối nhạc YouTube...", "info");
      }
      return;
    }

    // 2. NẾU LÀ FILE MP3 NỘI BỘ:
    playLocalAudio();
  }, [isYt, ytId, useFallbackAudio, currentSongTitle, showToast, playLocalAudio, unlockAudioEngine, isPlaying]);

  const pauseMusic = useCallback((notify = false) => {
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
    if (notify) {
      showToast("Đã tạm dừng nhạc nền", "info");
    }
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
          {/* Container YouTube: Kích thước chuẩn để không bị WebKit/Safari tạm dừng */}
          <div
            className={`transition-all duration-300 ${
              showVideoPreview
                ? "fixed bottom-20 right-4 z-50 w-72 h-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#E5C368] bg-black pointer-events-auto"
                : "fixed bottom-1 right-1 w-8 h-8 rounded opacity-[0.01] pointer-events-none overflow-hidden z-10"
            }`}
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
            <div ref={ytContainerRef} className="w-full h-full">
              <div id="wedding-yt-player" className="w-full h-full" />
            </div>
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
