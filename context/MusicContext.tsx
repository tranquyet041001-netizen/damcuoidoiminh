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
    // Nếu nhạc đang chạy êm rồi thì giữ nguyên, tránh giật nhạc
    if (audioRef.current && !audioRef.current.paused && isPlaying) {
      return;
    }

    unlockAudioEngine();

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
