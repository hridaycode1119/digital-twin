"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OrganData, OrganId } from "@/types/twin";
import { useAuth } from "@/context/AuthContext";
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
  customOrgans?: OrganData[];
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
  customOrgans,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredOrgan, setHoveredOrgan] = useState<OrganId | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { twin } = useAuth();
  const organsList = customOrgans || Object.values(twin.organs);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    const width = currentMount.clientWidth || 500;
    const height = currentMount.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.1, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    currentMount.appendChild(renderer.domElement);

    // ORBIT CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 3;
    controls.maxPolarAngle = (2 * Math.PI) / 3;

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xa7f3d0, 2.0);
    keyLight.position.set(4, 8, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x6ee7b7, 1.2);
    fillLight.position.set(-4, 2, -3);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0x34d399, 1.5);
    backLight.position.set(0, -4, -4);
    scene.add(backLight);

    // MINT/EMERALD TRANSLUCENT SHADER MATERIAL
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xa7f3d0),
      transparent: true,
      opacity: 0.82,
      roughness: 0.25,
      metalness: 0.05,
      transmission: 0.2,
      ior: 1.3,
      wireframe: isWireframe,
    });

    let bodyMesh: THREE.Object3D | null = null;

    // PROCEDURAL ANATOMICAL MANNEQUIN
    const mannequinGroup = new THREE.Group();

    // Head
    const headGeo = new THREE.SphereGeometry(0.24, 32, 32);
    const head = new THREE.Mesh(headGeo, bodyMaterial);
    head.position.y = 1.95;
    mannequinGroup.add(head);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.15, 24);
    const neck = new THREE.Mesh(neckGeo, bodyMaterial);
    neck.position.y = 1.75;
    mannequinGroup.add(neck);

    // Chest / Torso
    const chestGeo = new THREE.CylinderGeometry(0.38, 0.32, 0.6, 32);
    const chest = new THREE.Mesh(chestGeo, bodyMaterial);
    chest.position.y = 1.35;
    mannequinGroup.add(chest);

    // Abdomen / Pelvis
    const pelvisGeo = new THREE.CylinderGeometry(0.32, 0.28, 0.5, 32);
    const pelvis = new THREE.Mesh(pelvisGeo, bodyMaterial);
    pelvis.position.y = 0.85;
    mannequinGroup.add(pelvis);

    // Left Leg
    const legGeo = new THREE.CylinderGeometry(0.12, 0.08, 0.95, 24);
    const leftLeg = new THREE.Mesh(legGeo, bodyMaterial);
    leftLeg.position.set(-0.16, 0.15, 0);
    mannequinGroup.add(leftLeg);

    // Right Leg
    const rightLeg = new THREE.Mesh(legGeo, bodyMaterial);
    rightLeg.position.set(0.16, 0.15, 0);
    mannequinGroup.add(rightLeg);

    // Left Arm
    const armGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.8, 24);
    const leftArm = new THREE.Mesh(armGeo, bodyMaterial);
    leftArm.position.set(-0.48, 1.25, 0);
    leftArm.rotation.z = 0.15;
    mannequinGroup.add(leftArm);

    // Right Arm
    const rightArm = new THREE.Mesh(armGeo, bodyMaterial);
    rightArm.position.set(0.48, 1.25, 0);
    rightArm.rotation.z = -0.15;
    mannequinGroup.add(rightArm);

    // Center Mannequin
    mannequinGroup.position.y = -1.1;
    scene.add(mannequinGroup);
    bodyMesh = mannequinGroup;

    // Load detailed GLTF model if available
    const loader = new GLTFLoader();
    loader.load(
      "/models/human_body.glb",
      (gltf) => {
        scene.remove(mannequinGroup);
        const model = gltf.scene;

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).material = bodyMaterial;
          }
        });

        // Center and scale GLTF
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.4 / maxDim;

        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));
        model.position.y = -0.1;

        scene.add(model);
        bodyMesh = model;
        setIsLoading(false);
      },
      undefined,
      () => {
        setIsLoading(false);
      }
    );

    // ANIMATION LOOP
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isRotating && bodyMesh) {
        bodyMesh.rotation.y += 0.005;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // RESIZE HANDLER
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
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [isRotating, isWireframe]);

  const leftOrgans = organsList.filter((o) => ["brain", "lungs", "stomach"].includes(o.id));
  const rightOrgans = organsList.filter((o) => ["heart", "liver", "kidneys"].includes(o.id));

  return (
    <div className={`relative flex items-center justify-center w-full min-h-[500px] lg:min-h-[580px] select-none ${className}`}>
      {/* Soft mint circular glow backdrop */}
      <div className="absolute w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] lg:w-[500px] lg:h-[500px] rounded-full border border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 -z-10 pointer-events-none" />

      {/* 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="w-full h-[480px] sm:h-[540px] lg:h-[580px] cursor-grab active:cursor-grabbing" />

      {/* Organ Callout Badges */}
      <div className="absolute inset-0 pointer-events-none flex justify-between p-4 sm:p-6">
        {/* Left Badges (Brain, Lungs, Stomach) */}
        <div className="flex flex-col justify-around pointer-events-auto">
          {leftOrgans.map((organ) => {
            const isHovered = hoveredOrgan === organ.id;
            const isSelected = selectedOrganId === organ.id;
            const isOptimal = organ.score >= 82;

            return (
              <motion.button
                key={organ.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectOrgan && onSelectOrgan(organ)}
                onMouseEnter={() => setHoveredOrgan(organ.id)}
                onMouseLeave={() => setHoveredOrgan(null)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#112019] border transition-all shadow-xs text-left ${
                  isSelected || isHovered
                    ? "border-emerald-600 ring-2 ring-emerald-500/20 shadow-md"
                    : "border-slate-200/90 dark:border-[#1c3328] hover:border-emerald-400"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center shrink-0">
                  {organIconMap[organ.id]}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">{organ.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <span className={`w-1.5 h-1.5 rounded-full ${isOptimal ? "bg-emerald-500" : "bg-amber-500"}`} />
                    {isOptimal ? "Normal" : "Monitoring"} ({organ.score}/100)
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Right Badges (Heart, Liver, Kidneys) */}
        <div className="flex flex-col justify-around pointer-events-auto items-end">
          {rightOrgans.map((organ) => {
            const isHovered = hoveredOrgan === organ.id;
            const isSelected = selectedOrganId === organ.id;
            const isOptimal = organ.score >= 82;

            return (
              <motion.button
                key={organ.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectOrgan && onSelectOrgan(organ)}
                onMouseEnter={() => setHoveredOrgan(organ.id)}
                onMouseLeave={() => setHoveredOrgan(null)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#112019] border transition-all shadow-xs text-left ${
                  isSelected || isHovered
                    ? "border-emerald-600 ring-2 ring-emerald-500/20 shadow-md"
                    : "border-slate-200/90 dark:border-[#1c3328] hover:border-emerald-400"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center shrink-0">
                  {organIconMap[organ.id]}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">{organ.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <span className={`w-1.5 h-1.5 rounded-full ${isOptimal ? "bg-emerald-500" : "bg-amber-500"}`} />
                    {isOptimal ? "Good" : "Monitoring"} ({organ.score}/100)
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Floating Controls Bar */}
      <div className="absolute bottom-4 flex items-center gap-2 p-1.5 rounded-2xl bg-white/90 dark:bg-[#112019]/90 border border-slate-200/80 dark:border-[#1c3328] shadow-xs backdrop-blur-xs">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isRotating
              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Auto-Rotate</span>
        </button>

        <button
          onClick={() => setIsWireframe(!isWireframe)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isWireframe
              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Wireframe</span>
        </button>
      </div>
    </div>
  );
};
