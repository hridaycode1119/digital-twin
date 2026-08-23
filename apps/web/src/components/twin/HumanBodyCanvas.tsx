"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { initialPatientTwin } from "@/data/mockPatient";
import { OrganData, OrganId } from "@/types/twin";
import { OrganBadge } from "@/components/ui/OrganBadge";
import {
  Brain,
  Heart,
  Wind,
  ShieldAlert,
  Utensils,
  Activity,
  RotateCw,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react";

import { motion } from "framer-motion";

interface HumanBodyCanvasProps {
  onSelectOrgan?: (organ: OrganData) => void;
  selectedOrganId?: OrganId | null;
  className?: string;
}

const organIconMap: Record<OrganId, React.ReactNode> = {
  brain: <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500" />,
  heart: <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-100" />,
  lungs: <Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />,
  liver: <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />,
  stomach: <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />,
  kidneys: <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />,
};

// Anatomical anchor point targets on the 3D body (center coordinates % for connector lines)
const organAnchorPoints: Record<OrganId, { x: string; y: string }> = {
  brain: { x: "49%", y: "20%" },
  lungs: { x: "47%", y: "36%" },
  stomach: { x: "48%", y: "52%" },
  heart: { x: "53%", y: "34%" },
  liver: { x: "54%", y: "45%" },
  kidneys: { x: "52%", y: "54%" },
};

export const HumanBodyCanvas: React.FC<HumanBodyCanvasProps> = ({
  onSelectOrgan,
  selectedOrganId,
  className = "",
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredOrgan, setHoveredOrgan] = useState<OrganId | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const organsList = Object.values(initialPatientTwin.organs);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 580;
    const height = currentMount.clientHeight || 520;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.05, width < 500 ? 5.2 : 4.7);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 2.5;
    controls.maxDistance = 8.5;
    controls.maxPolarAngle = Math.PI / 1.7;
    controls.minPolarAngle = Math.PI / 3;
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };

    // 2. Futuristic Clinical Biotechnology Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.6);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x2dd4bf, 1.8);
    fillLight.position.set(-3, -2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x6366f1, 3.2, 22);
    rimLight.position.set(0, 3.5, -3.5);
    scene.add(rimLight);

    // 3. Background Hologram Precision Disc
    const ringGeo = new THREE.RingGeometry(2.1, 2.13, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(0, 0, -0.6);
    scene.add(ringMesh);

    const outerRingGeo = new THREE.RingGeometry(2.7, 2.72, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x14b8a6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.22,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.position.set(0, 0, -0.7);
    scene.add(outerRing);

    // 4. Load 3D Human Anatomy Model (GLTF)
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const loader = new GLTFLoader();
    loader.load(
      "/models/human_body.glb",
      (gltf) => {
        const root = gltf.scene;

        // Auto-center precisely at (0, 0, 0)
        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.6 / maxDim;
        root.scale.set(scale, scale, scale);
        root.position.sub(center.multiplyScalar(scale));
        root.position.y += 0.05;

        // Holographic Translucent Bio-Skin Shader
        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            mesh.material = new THREE.MeshPhysicalMaterial({
              color: new THREE.Color(0x38bdf8),
              emissive: new THREE.Color(0x0f766e),
              emissiveIntensity: 0.14,
              roughness: 0.28,
              metalness: 0.1,
              transmission: 0.38,
              transparent: true,
              opacity: 0.88,
              wireframe: isWireframe,
            });
          }
        });

        modelGroup.add(root);
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.warn("Could not load GLB:", error);
        setIsLoading(false);
      }
    );

    // 5. Floating Bio-Aura Particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2.2;
      positions[i + 1] = (Math.random() - 0.5) * 4.0;
      positions[i + 2] = (Math.random() - 0.5) * 1.5;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.03,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isRotating) {
        modelGroup.rotation.y = Math.sin(elapsedTime * 0.3) * 0.28;
      }

      ringMesh.rotation.z = elapsedTime * 0.03;
      outerRing.rotation.z = -elapsedTime * 0.02;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 7. Handle Resize
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.position.z = newWidth < 500 ? 5.2 : 4.7;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRotating, isWireframe]);

  return (
    <div className={`relative w-full flex flex-col items-center select-none overflow-visible ${className}`}>
      {/* 3D Canvas & Holographic Stage Viewport */}
      <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] overflow-visible">
        {/* 3D WebGL Mount */}
        <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing touch-none z-0" />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-xs z-30 pointer-events-none">
            <div className="w-9 h-9 rounded-full border-2 border-sky-600 border-t-transparent animate-spin mb-2" />
            <span className="text-xs font-bold text-slate-700">Loading 3D Virtual Patient...</span>
          </div>
        )}

        {/* Radial Background Holographic Circle */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
          <div className="w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] rounded-full bg-gradient-to-tr from-sky-100/50 via-teal-50/70 to-blue-50/30 border border-sky-100/60 shadow-inner" />
        </div>

        {/* Desktop/Tablet Floating Callouts (Cleanly positioned, overflow-visible) */}
        <div className="hidden sm:block absolute inset-0 pointer-events-none z-10 overflow-visible">
          {organsList.map((organ, index) => {
            const isSelected = selectedOrganId === organ.id;
            const isHovered = hoveredOrgan === organ.id;
            const anchor = organAnchorPoints[organ.id];
            const isRightSide = parseInt(organ.screenPos.left) > 50;
            const floatDuration = 3 + (index % 3) * 0.6;

            return (
              <motion.div
                key={organ.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: [0, -5, 0],
                }}
                transition={{
                  y: {
                    duration: floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2,
                  },
                  scale: { duration: 0.4, delay: index * 0.1 },
                  opacity: { duration: 0.4, delay: index * 0.1 },
                }}
                style={{
                  top: organ.screenPos.top,
                  left: organ.screenPos.left,
                  transform: "translate(-50%, -50%)",
                }}
                className="absolute pointer-events-auto transition-all duration-300 z-10 scale-90 lg:scale-100"
                onMouseEnter={() => setHoveredOrgan(organ.id)}
                onMouseLeave={() => setHoveredOrgan(null)}
              >
                {/* Connector Dot */}
                {anchor && (
                  <div
                    className={`absolute pointer-events-none transition-opacity duration-300 ${
                      isHovered || isSelected ? "opacity-100" : "opacity-40"
                    }`}
                    style={{
                      [isRightSide ? "left" : "right"]: "-10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-sky-500 shadow-sm animate-ping opacity-75 absolute inset-0" />
                    <div className="w-2 h-2 rounded-full bg-sky-600 shadow-sm relative" />
                  </div>
                )}

                {/* Organ Badge Card */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onSelectOrgan?.(organ)}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl glass-card transition-shadow duration-300 shadow-md border border-white/90 ${
                    isSelected
                      ? "ring-2 ring-sky-500 shadow-glow-cyan bg-white"
                      : isHovered
                      ? "shadow-lg bg-white border-sky-300"
                      : "bg-white/95"
                  }`}
                >
                  <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-100 shadow-xs flex items-center justify-center shrink-0">
                    {organIconMap[organ.id]}
                  </div>
                  <div className="text-left whitespace-nowrap pr-1">
                    <span className="block text-xs font-bold text-slate-900 leading-tight">
                      {organ.name}
                    </span>
                    <OrganBadge status={organ.status} className="mt-0.5 scale-85 -ml-1" />
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* 3D Canvas Controls Bar */}
        <div className="absolute bottom-3 left-4 right-4 sm:right-auto flex flex-wrap items-center justify-between sm:justify-start gap-2 z-20">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl glass-card text-[11px] sm:text-xs font-medium text-slate-700 hover:text-sky-600 flex items-center gap-1.5 shadow-xs transition-all bg-white/85"
            >
              <RotateCw className={`w-3 h-3 ${isRotating ? "animate-spin text-sky-500" : ""}`} />
              <span>{isRotating ? "Auto-Rotate" : "Paused"}</span>
            </button>

            <button
              onClick={() => setIsWireframe(!isWireframe)}
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl glass-card text-[11px] sm:text-xs font-medium text-slate-700 hover:text-sky-600 flex items-center gap-1.5 shadow-xs transition-all bg-white/85"
            >
              <Layers className="w-3 h-3 text-indigo-500" />
              <span>{isWireframe ? "Solid" : "Wireframe"}</span>
            </button>
          </div>

          <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium px-2 py-0.5 bg-white/70 backdrop-blur-md rounded-lg border border-slate-200/60 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
            Drag to rotate 360°
          </span>
        </div>
      </div>

      {/* Mobile-First Swipable Organ Inspection Tray (Visible on small screens) */}
      <div className="sm:hidden w-full mt-3 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max px-1">
          {organsList.map((organ) => {
            const isSelected = selectedOrganId === organ.id;
            return (
              <button
                key={organ.id}
                onClick={() => onSelectOrgan?.(organ)}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all text-left ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white/90 border-slate-200/80 text-slate-800 shadow-2xs"
                }`}
              >
                <div className="p-1.5 rounded-xl bg-slate-100/80 flex items-center justify-center shrink-0">
                  {organIconMap[organ.id]}
                </div>
                <div className="pr-1">
                  <span className={`block text-xs font-bold leading-tight ${isSelected ? "text-white" : "text-slate-900"}`}>
                    {organ.name}
                  </span>
                  <span className={`text-[10px] font-semibold block ${isSelected ? "text-sky-300" : "text-slate-500"}`}>
                    {organ.status} • {organ.score}/100
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50 ml-1" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
