"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { initialPatientTwin } from "@/data/mockPatient";
import { OrganData, OrganId } from "@/types/twin";
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
  brain: <Brain className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />,
  heart: <Heart className="w-4 h-4 text-amber-700 dark:text-amber-400" />,
  lungs: <Wind className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />,
  liver: <ShieldAlert className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />,
  stomach: <Utensils className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />,
  kidneys: <Activity className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />,
};

// Anatomical anchor point targets on the 3D body
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

    const width = currentMount.clientWidth || 520;
    const height = currentMount.clientHeight || 500;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.05, width < 500 ? 5.2 : 4.6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
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

    // 2. Natural Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xecfdf5, 2.4);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd1fae5, 1.5);
    fillLight.position.set(-3, -2, 3);
    scene.add(fillLight);

    // 3. Subtle Warm Background Arc
    const ringGeo = new THREE.RingGeometry(2.1, 2.12, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(0, 0, -0.6);
    scene.add(ringMesh);

    // 4. Load 3D Human Anatomy Model (GLTF)
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const loader = new GLTFLoader();
    loader.load(
      "/models/human_body.glb",
      (gltf) => {
        const root = gltf.scene;

        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.6 / maxDim;
        root.scale.set(scale, scale, scale);
        root.position.sub(center.multiplyScalar(scale));
        root.position.y += 0.05;

        // Clean Realistic Translucent Material
        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshPhysicalMaterial({
              color: new THREE.Color(0xa7f3d0),
              emissive: new THREE.Color(0x065f46),
              emissiveIntensity: 0.1,
              roughness: 0.35,
              metalness: 0.05,
              transmission: 0.35,
              transparent: true,
              opacity: 0.9,
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

    // 5. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isRotating) {
        modelGroup.rotation.y = Math.sin(elapsedTime * 0.3) * 0.28;
      }
      ringMesh.rotation.z = elapsedTime * 0.02;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.position.z = newWidth < 500 ? 5.2 : 4.6;
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
      {/* 3D Viewport */}
      <div className="relative w-full h-[460px] sm:h-[500px] lg:h-[540px] overflow-visible">
        <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing touch-none z-0" />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-xs z-30 pointer-events-none">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-700 border-t-transparent animate-spin mb-2" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Loading 3D Anatomy...</span>
          </div>
        )}

        {/* Subtle Halo Circle */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
          <div className="w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full bg-radial from-emerald-100/40 via-emerald-50/20 to-transparent dark:from-emerald-950/20 dark:to-transparent border border-emerald-100/40 dark:border-emerald-900/30" />
        </div>

        {/* Organ Callout Badges (Exact Mockup Layout: Circular icon + Name + Green/Amber Status Dot) */}
        <div className="hidden sm:block absolute inset-0 pointer-events-none z-10 overflow-visible">
          {organsList.map((organ, index) => {
            const isSelected = selectedOrganId === organ.id;
            const isHovered = hoveredOrgan === organ.id;
            const anchor = organAnchorPoints[organ.id];
            const isRightSide = parseInt(organ.screenPos.left) > 50;
            const isMonitoring = organ.status.toLowerCase().includes("monitor") || organ.id === "heart";

            return (
              <motion.div
                key={organ.id}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, y: [0, -4, 0] }}
                transition={{
                  y: {
                    duration: 3.5 + (index % 3) * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.15,
                  },
                  scale: { duration: 0.35, delay: index * 0.1 },
                  opacity: { duration: 0.35, delay: index * 0.1 },
                }}
                style={{
                  top: organ.screenPos.top,
                  left: organ.screenPos.left,
                  transform: "translate(-50%, -50%)",
                }}
                className="absolute pointer-events-auto transition-all duration-300 z-10"
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
                    <div className={`w-2 h-2 rounded-full ${isMonitoring ? "bg-amber-500" : "bg-emerald-500"} shadow-xs`} />
                  </div>
                )}

                {/* Organ Badge Card */}
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onSelectOrgan?.(organ)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-sm hover:shadow-md transition-all ${
                    isSelected ? "ring-2 ring-emerald-600 bg-emerald-50/20" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0">
                    {organIconMap[organ.id]}
                  </div>
                  <div className="text-left whitespace-nowrap pr-1">
                    <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {organ.name}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isMonitoring ? "bg-amber-500" : "bg-emerald-500"}`} />
                      {organ.status}
                    </span>
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* 3D Canvas Controls Bar */}
        <div className="absolute bottom-2 left-4 flex items-center gap-1.5 z-20">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="px-2.5 py-1 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-700 flex items-center gap-1.5 shadow-2xs"
          >
            <RotateCw className={`w-3 h-3 ${isRotating ? "animate-spin text-emerald-600" : ""}`} />
            <span>{isRotating ? "Auto-Rotate" : "Paused"}</span>
          </button>
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className="px-2.5 py-1 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-700 flex items-center gap-1.5 shadow-2xs"
          >
            <Layers className="w-3 h-3 text-slate-500" />
            <span>{isWireframe ? "Solid" : "Wireframe"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Tray */}
      <div className="sm:hidden w-full mt-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max px-1">
          {organsList.map((organ) => {
            const isSelected = selectedOrganId === organ.id;
            return (
              <button
                key={organ.id}
                onClick={() => onSelectOrgan?.(organ)}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all text-left ${
                  isSelected
                    ? "bg-[#1b4332] text-white border-[#1b4332]"
                    : "bg-white dark:bg-[#112019] border-slate-200 dark:border-[#1c3328] text-slate-800 dark:text-slate-200"
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {organIconMap[organ.id]}
                </div>
                <div className="pr-1">
                  <span className="block text-xs font-bold leading-tight">{organ.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{organ.status}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
