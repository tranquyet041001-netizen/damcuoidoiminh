"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";
import { WeddingData } from "@/types/wedding";

interface CelestialScene3DProps {
  weddingData: WeddingData;
  onOpenInvitation?: () => void;
  isOpen?: boolean;
  isRedTheme?: boolean;
}

export const CelestialScene3D: React.FC<CelestialScene3DProps> = ({
  weddingData,
  onOpenInvitation,
  isOpen = false,
  isRedTheme = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Trạng thái cinematic intro
  const [introFinished, setIntroFinished] = useState<boolean>(false);
  const [showSkipButton, setShowSkipButton] = useState<boolean>(true);
  const [showCenterBanner, setShowCenterBanner] = useState<boolean>(false);

  // References cho Three.js animation loop
  const animFrameId = useRef<number | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Nhánh đối tượng Three.js
  const dragonMeshRef = useRef<THREE.Mesh | null>(null);
  const phoenixMeshRef = useRef<THREE.Mesh | null>(null);
  const sunMeshRef = useRef<THREE.Mesh | null>(null);
  const palaceMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudsFgMeshRef = useRef<THREE.Mesh | null>(null);
  const bgMeshRef = useRef<THREE.Mesh | null>(null);
  const stardustPointsRef = useRef<THREE.Points | null>(null);
  const petalsMeshGroupRef = useRef<THREE.Group | null>(null);
  const flareMeshRef = useRef<THREE.Mesh | null>(null);

  // Tọa độ chuột cho Parallax mượt mà
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollOffset = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  // Thời gian bắt đầu intro
  const startTimeRef = useRef<number>(Date.now());
  const skipIntroRef = useRef<boolean>(false);

  // 1. Khởi tạo Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // --- SCENE & CAMERA ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
    camera.position.set(0, 0, 520);
    cameraRef.current = camera;

    // --- RENDERER ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0xfff3d6, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffb84d, 2.5, 800);
    sunLight.position.set(0, 0, -20);
    scene.add(sunLight);

    // --- TEXTURE LOADER ---
    const textureLoader = new THREE.TextureLoader();

    // Helper tạo vật liệu trong suốt chuẩn không bị lỗi depth xén viền
    const createTransparentMat = (tex: THREE.Texture, opacity = 1) =>
      new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        opacity,
        side: THREE.DoubleSide,
      });

    // 1. Background Sky Plane (Z: -400)
    textureLoader.load("/images/celestial/celestial-bg.jpg", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const bgGeo = new THREE.PlaneGeometry(1000, 666);
      const bgMat = new THREE.MeshBasicMaterial({ map: tex, depthWrite: false });
      const bgMesh = new THREE.Mesh(bgGeo, bgMat);
      bgMesh.position.set(0, 0, -400);
      scene.add(bgMesh);
      bgMeshRef.current = bgMesh;
    });

    // 2. Ancient Palace Plane (Z: -200)
    textureLoader.load("/images/celestial/celestial-palace.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const palGeo = new THREE.PlaneGeometry(360, 180);
      const palMat = createTransparentMat(tex, 0.95);
      const palMesh = new THREE.Mesh(palGeo, palMat);
      palMesh.position.set(0, -35, -200);
      scene.add(palMesh);
      palaceMeshRef.current = palMesh;
    });

    // 3. Sun Medallion 囍 (Z: -80)
    textureLoader.load("/images/celestial/celestial-xi-sun.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const sunGeo = new THREE.PlaneGeometry(175, 175);
      const sunMat = createTransparentMat(tex, 0.98);
      const sunMesh = new THREE.Mesh(sunGeo, sunMat);
      sunMesh.position.set(0, 0, -80);
      scene.add(sunMesh);
      sunMeshRef.current = sunMesh;
    });

    // 3.1. Radiant Lens Flare Ring xung quanh chữ 囍 (Z: -75)
    const flareGeo = new THREE.RingGeometry(80, 130, 48);
    const flareMat = new THREE.MeshBasicMaterial({
      color: 0xffd166,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const flareMesh = new THREE.Mesh(flareGeo, flareMat);
    flareMesh.position.set(0, 0, -75);
    scene.add(flareMesh);
    flareMeshRef.current = flareMesh;

    // 4. Foreground Clouds (Z: 60)
    textureLoader.load("/images/celestial/celestial-cloud-fg.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const cGeo = new THREE.PlaneGeometry(900, 210);
      const cMat = createTransparentMat(tex, 0.92);
      const cMesh = new THREE.Mesh(cGeo, cMat);
      cMesh.position.set(0, -145, 60);
      scene.add(cMesh);
      cloudsFgMeshRef.current = cMesh;
    });

    // 5. 🐉 Rồng Vàng 3D Mesh (Z: 30)
    textureLoader.load("/images/celestial/celestial-dragon.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const dragGeo = new THREE.PlaneGeometry(380, 570);
      const dragMat = createTransparentMat(tex, 0);
      const dragMesh = new THREE.Mesh(dragGeo, dragMat);
      dragMesh.position.set(-360, 60, -100);
      dragMesh.scale.set(0.85, 0.85, 1);
      scene.add(dragMesh);
      dragonMeshRef.current = dragMesh;
    });

    // 6. 🐦 Phượng Hoàng 3D Mesh (Z: 35)
    textureLoader.load("/images/celestial/celestial-phoenix.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const phxGeo = new THREE.PlaneGeometry(380, 570);
      const phxMat = createTransparentMat(tex, 0);
      const phxMesh = new THREE.Mesh(phxGeo, phxMat);
      phxMesh.position.set(360, -40, -100);
      phxMesh.scale.set(0.85, 0.85, 1);
      scene.add(phxMesh);
      phoenixMeshRef.current = phxMesh;
    });

    // 7. Bụi Vàng Stardust (THREE.Points)
    const particleCount = 220;
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 800;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 500;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffd97d,
      size: 4,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stardust = new THREE.Points(pGeo, pMat);
    scene.add(stardust);
    stardustPointsRef.current = stardust;

    // 8. Cánh Hoa Đào 3D (35 Cánh hoa rơi lượn trong không gian)
    const petalsGroup = new THREE.Group();
    const petalGeo = new THREE.PlaneGeometry(10, 14);
    const petalMat = new THREE.MeshBasicMaterial({
      color: 0xe63946,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    for (let i = 0; i < 35; i++) {
      const pMesh = new THREE.Mesh(petalGeo, petalMat);
      pMesh.position.set(
        (Math.random() - 0.5) * 700,
        Math.random() * 400 - 200,
        (Math.random() - 0.5) * 300 + 40
      );
      pMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      pMesh.userData = {
        speedY: Math.random() * 0.8 + 0.4,
        speedRotX: (Math.random() - 0.5) * 0.04,
        speedRotY: (Math.random() - 0.5) * 0.04,
        swaySpeed: Math.random() * 2 + 1,
        swayAmp: Math.random() * 0.8 + 0.3,
        initialX: pMesh.position.x,
      };
      petalsGroup.add(pMesh);
    }
    scene.add(petalsGroup);
    petalsMeshGroupRef.current = petalsGroup;

    // --- EVENT LISTENERS ---
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mousePos.current.targetX = (e.clientX / w - 0.5) * 2;
      mousePos.current.targetY = -(e.clientY / h - 0.5) * 2;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const h = window.innerHeight;
      scrollOffset.current = Math.min(scrollY / h, 1.5);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Intersection Observer để tạm dừng render loop khi cuộn khuất
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // --- ANIMATION LOOP CHÍNH (60 FPS) ---
    startTimeRef.current = Date.now();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const elapsed = (Date.now() - startTimeRef.current) / 1000;

      // Cập nhật mượt mà tọa độ chuột
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      const mx = mousePos.current.x;
      const my = mousePos.current.y;
      const sc = scrollOffset.current;

      // 1. Camera Parallax & Scroll-driven Fly-through
      const baseCameraZ = 520 - sc * 320;
      camera.position.x = mx * 35;
      camera.position.y = my * 20 - sc * 60;
      camera.position.z = baseCameraZ;
      camera.lookAt(mx * 10, -sc * 30, 0);

      // 2. Parallax đa tầng lớp
      if (bgMeshRef.current) {
        bgMeshRef.current.position.x = -mx * 15;
        bgMeshRef.current.position.y = -my * 10;
      }
      if (palaceMeshRef.current) {
        palaceMeshRef.current.position.x = -mx * 25;
        palaceMeshRef.current.position.y = -35 - my * 15;
      }
      if (sunMeshRef.current) {
        const pulse = Math.sin(elapsed * 2) * 0.025 + 1;
        sunMeshRef.current.scale.set(pulse, pulse, 1);
        sunMeshRef.current.position.x = -mx * 20;
        sunMeshRef.current.position.y = -my * 12;
      }
      if (cloudsFgMeshRef.current) {
        cloudsFgMeshRef.current.position.x = Math.sin(elapsed * 0.3) * 20 + mx * 45;
        cloudsFgMeshRef.current.position.y = -145 + my * 25;
      }

      // 3. Quản lý Cinematic Intro (0s - 10s) vs Vòng lặp ổn định
      const isSkipped = skipIntroRef.current;
      const effectiveT = isSkipped ? Math.max(elapsed, 10) : elapsed;

      if (effectiveT >= 9.5 && !introFinished) {
        setIntroFinished(true);
        setShowCenterBanner(true);
      }

      // --- LOGIC DI CHUYỂN RỒNG VÀ PHƯỢNG ---
      const dragMesh = dragonMeshRef.current;
      const phxMesh = phoenixMeshRef.current;
      const flare = flareMeshRef.current;

      if (dragMesh && phxMesh) {
        const dragMat = dragMesh.material as THREE.MeshBasicMaterial;
        const phxMat = phxMesh.material as THREE.MeshBasicMaterial;

        if (effectiveT < 2.0) {
          // 0 - 2s: Khởi đầu mây sương, rồng phượng còn ẩn mình
          dragMat.opacity = Math.max(0, (effectiveT - 1.0) * 0.8);
          phxMat.opacity = Math.max(0, (effectiveT - 1.0) * 0.8);
          dragMesh.position.set(-340 + effectiveT * 40, 120, -60);
          phxMesh.position.set(340 - effectiveT * 40, -100, -60);
        } else if (effectiveT < 5.0) {
          // 2s - 5s: Rồng từ trái bay vào theo đường cong 3D, Phượng từ phải lượn vào
          const p = (effectiveT - 2.0) / 3.0;
          dragMat.opacity = Math.min(1, 0.8 + p * 0.2);
          phxMat.opacity = Math.min(1, 0.8 + p * 0.2);

          const dragX = -260 + p * 150 + Math.sin(p * Math.PI) * 40;
          const dragY = 120 - Math.sin(p * Math.PI * 1.5) * 60;
          const dragZ = -60 + p * 90;
          dragMesh.position.set(dragX, dragY, dragZ);
          dragMesh.rotation.z = Math.sin(elapsed * 2) * 0.08 - 0.05;

          const phxX = 260 - p * 150 - Math.sin(p * Math.PI) * 40;
          const phxY = -100 + Math.sin(p * Math.PI * 1.5) * 60;
          const phxZ = -60 + p * 90;
          phxMesh.position.set(phxX, phxY, phxZ);
          phxMesh.rotation.z = Math.sin(elapsed * 2.5) * 0.08 + 0.05;
        } else if (effectiveT < 8.5) {
          // 5s - 8.5s: Đôi Rồng Phượng bay xoắn quanh nhau theo quỹ đạo elip 3D quanh chữ 囍
          const angle = (effectiveT - 5.0) * 1.6;
          const radiusX = 135;
          const radiusY = 95;

          const dX = Math.cos(angle + Math.PI) * radiusX;
          const dY = Math.sin(angle + Math.PI) * radiusY + 15;
          const dZ = Math.sin(angle * 2) * 35 + 25;
          dragMesh.position.set(dX, dY, dZ);
          dragMesh.rotation.z = Math.sin(angle) * 0.12;

          const pX = Math.cos(angle) * radiusX;
          const pY = Math.sin(angle) * radiusY - 15;
          const pZ = -Math.sin(angle * 2) * 35 + 25;
          phxMesh.position.set(pX, pY, pZ);
          phxMesh.rotation.z = -Math.sin(angle) * 0.12;

          dragMat.opacity = 1;
          phxMat.opacity = 1;
        } else {
          // 8.5s trở đi: Hoàn tất vòng cung bao quanh chữ 囍
          const settledT = effectiveT - 8.5;
          const settleProgress = Math.min(settledT / 1.5, 1.0);

          // Rồng ngự góc trên trái
          const targetDragX = -110 + Math.sin(elapsed * 1.2) * 8 + mx * 18;
          const targetDragY = 70 + Math.cos(elapsed * 1.5) * 8 + my * 12;
          const targetDragZ = 30;
          dragMesh.position.x += (targetDragX - dragMesh.position.x) * 0.08;
          dragMesh.position.y += (targetDragY - dragMesh.position.y) * 0.08;
          dragMesh.position.z += (targetDragZ - dragMesh.position.z) * 0.08;
          dragMesh.rotation.z = Math.sin(elapsed * 1.5) * 0.04;

          // Phượng ngự góc dưới phải
          const targetPhxX = 110 - Math.sin(elapsed * 1.2) * 8 + mx * 18;
          const targetPhxY = -65 - Math.cos(elapsed * 1.5) * 8 + my * 12;
          const targetPhxZ = 35;
          phxMesh.position.x += (targetPhxX - phxMesh.position.x) * 0.08;
          phxMesh.position.y += (targetPhxY - phxMesh.position.y) * 0.08;
          phxMesh.position.z += (targetPhxZ - phxMesh.position.z) * 0.08;
          phxMesh.rotation.z = -Math.sin(elapsed * 1.8) * 0.04;

          // Hiệu ứng hào quang vàng (lens flare) bừng sáng
          if (flare && settleProgress < 1.0) {
            const flareFlash = Math.sin(settleProgress * Math.PI);
            (flare.material as THREE.MeshBasicMaterial).opacity = flareFlash * 0.7;
            flare.scale.set(1 + flareFlash * 0.5, 1 + flareFlash * 0.5, 1);
          } else if (flare) {
            (flare.material as THREE.MeshBasicMaterial).opacity = 0.05 + Math.sin(elapsed * 2) * 0.05;
          }
        }
      }

      // 4. Bụi vàng Stardust
      if (stardustPointsRef.current) {
        stardustPointsRef.current.rotation.y = elapsed * 0.03;
        stardustPointsRef.current.rotation.z = elapsed * 0.015;
      }

      // 5. Cánh hoa đào bay lượn 3D
      if (petalsMeshGroupRef.current) {
        petalsMeshGroupRef.current.children.forEach((child) => {
          const petal = child as THREE.Mesh;
          const data = petal.userData;
          petal.position.y -= data.speedY;
          petal.position.x = data.initialX + Math.sin(elapsed * data.swaySpeed) * data.swayAmp * 25;
          petal.rotation.x += data.speedRotX;
          petal.rotation.y += data.speedRotY;

          if (petal.position.y < -220) {
            petal.position.y = 220;
            petal.position.x = (Math.random() - 0.5) * 700;
            data.initialX = petal.position.x;
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();

      renderer.dispose();
      scene.clear();
    };
  }, []);

  const handleSkipIntro = () => {
    skipIntroRef.current = true;
    setIntroFinished(true);
    setShowCenterBanner(true);
    setShowSkipButton(false);
  };

  const handleReplayIntro = () => {
    skipIntroRef.current = false;
    startTimeRef.current = Date.now();
    setIntroFinished(false);
    setShowCenterBanner(false);
    setShowSkipButton(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen min-h-[640px] max-h-[960px] overflow-hidden select-none"
      style={{
        background: "radial-gradient(ellipse at center, #881337 0%, #4c0519 60%, #1c0209 100%)",
      }}
    >
      {/* Canvas Three.js WebGL */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block touch-none"
        style={{ zIndex: 1 }}
      />

      {/* Lớp phủ điện ảnh & vignette mềm mại */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(circle at center, transparent 40%, rgba(26, 3, 7, 0.45) 80%, rgba(15, 2, 4, 0.75) 100%)",
        }}
      />

      {/* Nút Bỏ Qua Intro ở góc trên bên phải */}
      {!introFinished && showSkipButton && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute top-6 right-6 z-30"
        >
          <button
            onClick={handleSkipIntro}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-amber-400/40 text-amber-200 text-xs tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-black/40 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: "4s" }} />
            <span>Bỏ qua hoạt ảnh</span>
          </button>
        </motion.div>
      )}

      {/* Nút Xem Lại Hoạt Ảnh khi đã kết thúc intro */}
      {introFinished && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-6 right-6 z-30"
        >
          <button
            onClick={handleReplayIntro}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md border border-amber-300/30 text-amber-200/90 text-xs tracking-wide transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Xem lại hoạt ảnh mở màn Long Phụng"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Xem lại 3D</span>
          </button>
        </motion.div>
      )}

      {/* Thông điệp & Tên Dâu Rể bừng sáng khi Long Phụng hội tụ */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 px-4">
        <AnimatePresence>
          {(showCenterBanner || introFinished) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-lg mx-auto"
            >
              {/* Huy hiệu Long Phụng Hòa Minh */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 px-5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 backdrop-blur-sm mb-3"
              >
                <span className="text-amber-300 text-xs tracking-[0.3em] font-serif uppercase">
                  Long Phụng Hòa Minh
                </span>
              </motion.div>

              {/* Lễ Thành Hôn */}
              <motion.h2
                initial={{ opacity: 0, letterSpacing: "0.1em" }}
                animate={{ opacity: 1, letterSpacing: "0.25em" }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-amber-200/95 font-serif text-sm sm:text-base md:text-lg tracking-[0.25em] uppercase font-light drop-shadow-md mb-2"
              >
                LỄ THÀNH HÔN
              </motion.h2>

              {/* Tên Chú Rể & Cô Dâu */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex items-center justify-center gap-3 sm:gap-5 my-2"
              >
                <span className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-medium drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] tracking-wide">
                  {weddingData.groom.shortName || weddingData.groom.fullName}
                </span>
                <span className="text-amber-400 font-serif text-xl sm:text-2xl italic">&</span>
                <span className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-medium drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] tracking-wide">
                  {weddingData.bride.shortName || weddingData.bride.fullName}
                </span>
              </motion.div>

              {/* Ngày tháng cử hành hôn lễ */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-amber-100/90 text-xs sm:text-sm font-serif tracking-widest mt-2 drop-shadow"
              >
                {weddingData.weddingDateFormatted || "Chủ Nhật, 24 Tháng 01 Năm 2027"}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-amber-300/75 text-[11px] font-serif tracking-wider mt-0.5"
              >
                (Tức {weddingData.lunarDateFormatted || "Ngày 16 tháng Chạp năm Bính Ngọ"})
              </motion.p>

              {/* Nút Khám Phá Thiệp Cưới */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-6 pointer-events-auto"
              >
                <button
                  onClick={() => {
                    onOpenInvitation?.();
                    const nextSection = document.getElementById("letter") || document.getElementById("details");
                    if (nextSection) {
                      nextSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white font-serif text-sm tracking-widest uppercase shadow-xl shadow-amber-950/60 hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105 active:scale-95 border border-amber-300/40 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
                  <span>Kính Mời Mở Thiệp</span>
                  <ChevronDown className="w-4 h-4 text-amber-200 animate-bounce" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chỉ dẫn cuộn chuột ở đáy trang */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center justify-center pointer-events-none z-20 text-amber-200/60 text-xs font-serif tracking-widest">
        <span className="text-[11px] mb-1">Cuộn xuống để khám phá</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-amber-300/80" />
      </div>
    </div>
  );
};
