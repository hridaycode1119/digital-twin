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
} from "lucide-react";

import { motion } from "framer-motion";

interface HumanBodyCanvasProps {
  onSelectOrgan?: (organ: OrganData) => void;
  selectedOrganId?: OrganId | null;
  className?: string;
}

const organIconMap: Record<OrganId, React.ReactNode> = {
  brain: <Brain className="w-5 h-5 text-sky-500" />,
  heart: <Heart className="w-5 h-5 text-rose-500 fill-rose-100" />,
  lungs: <Wind className="w-5 h-5 text-blue-500" />,
  liver: <ShieldAlert className="w-5 h-5 text-emerald-500" />,
  stomach: <Utensils className="w-5 h-5 text-amber-500" />,
  kidneys: <Activity className="w-5 h-5 text-indigo-500" />,
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

    const width = currentMount.clientWidth || 640;
    const height = currentMount.clientHeight || 580;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.05, 4.7);

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
    controls.maxDistance = 8.0;
    controls.maxPolarAngle = Math.PI / 1.7;
    controls.minPolarAngle = Math.PI / 3;

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
    <div className={`relative w-full h-full min-h-[580px] select-none ${className}`}>
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-xs z-30 pointer-events-none">
          <div className="w-10 h-10 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mb-3" />
          <span className="text-xs font-bold text-slate-700">Loading 3D Virtual Patient...</span>
        </div>
      )}

      {/* Radial Background Holographic Circle (Matching Mockup) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[460px] h-[460px] rounded-full bg-gradient-to-tr from-blue-100/50 via-sky-50/70 to-blue-50/30 border border-blue-100/60 shadow-inner -z-10" />
      </div>

      {/* Anatomical Organ Callout Badges - Balanced Left & Right (Matching Mockup) */}
      <div className="absolute inset-0 pointer-events-none">
        {organsList.map((organ, index) => {
          const isSelected = selectedOrganId === organ.id;
          const isHovered = hoveredOrgan === organ.id;
          const anchor = organAnchorPoints[organ.id];
          const isRightSide = parseInt(organ.screenPos.left) > 50;

          // Staggered floating float duration (3s, 3.5s, 4s...)
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
                    [isRightSide ? "left" : "right"]: "-14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm animate-ping opacity-75 absolute inset-0" />
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm relative" />
                </div>
              )}

              {/* Organ Badge Card */}
              <motion.button
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelectOrgan?.(organ)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-card transition-shadow duration-300 shadow-md ${
                  isSelected
                    ? "ring-2 ring-blue-500 shadow-glow-blue bg-white"
                    : isHovered
                    ? "shadow-lg bg-white border-blue-300"
                    : "bg-white/95"
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shadow-xs flex items-center justify-center shrink-0">
                  {organIconMap[organ.id]}
                </div>
                <div className="text-left whitespace-nowrap">
                  <span className="block text-xs font-bold text-slate-900 leading-tight">
                    {organ.name}
                  </span>
                  <OrganBadge status={organ.status} className="mt-0.5 scale-90 -ml-1" />
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* 3D Canvas Controls Bar */}
      <div className="absolute bottom-4 left-6 flex flex-wrap items-center gap-2 z-20">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className="px-3 py-1.5 rounded-xl glass-card text-xs font-medium text-slate-700 hover:text-blue-600 flex items-center gap-1.5 shadow-sm transition-all bg-white/80"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? "animate-spin text-blue-500" : ""}`} />
          {isRotating ? "Auto-Rotate On" : "Paused"}
        </button>

        <button
          onClick={() => setIsWireframe(!isWireframe)}
          className="px-3 py-1.5 rounded-xl glass-card text-xs font-medium text-slate-700 hover:text-blue-600 flex items-center gap-1.5 shadow-sm transition-all bg-white/80"
        >
          <Layers className="w-3.5 h-3.5 text-indigo-500" />
          {isWireframe ? "Solid Mesh" : "Wireframe"}
        </button>

        <span className="hidden sm:flex px-3 py-1.5 rounded-xl bg-white/70 backdrop-blur-md border border-slate-200/60 text-[11px] text-slate-500 items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Drag to rotate • Click organ to inspect
        </span>
      </div>
    </div>
  );
};
