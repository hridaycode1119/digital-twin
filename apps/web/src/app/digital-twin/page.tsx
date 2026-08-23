"use client";

import React, { useState } from "react";
import {
  Activity,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  ShieldAlert,
  Heart,
  Brain,
  Wind,
  Utensils,
  Flame,
  User,
} from "lucide-react";
import { HumanBodyCanvas } from "@/components/twin/HumanBodyCanvas";
import { OrganDetailModal } from "@/components/twin/OrganDetailModal";
import { OrganBadge } from "@/components/ui/OrganBadge";
import { OrganData } from "@/types/twin";
import { initialPatientTwin } from "@/data/mockPatient";
import { useAuth } from "@/context/AuthContext";

export default function DigitalTwinPage() {
  const [selectedOrgan, setSelectedOrgan] = useState<OrganData | null>(null);
  const [activeLayer, setActiveLayer] = useState<string>("ALL");
  const { user } = useAuth();

  const patientName = user?.name || "Hriday";
  const patientId = user?.patientId || "pt_1029384";
  const overallScore = user?.overallScore || 87;

  const organsList = Object.values(initialPatientTwin.organs);

  const filteredOrgans = organsList.filter((organ) => {
    if (activeLayer === "ALL") return true;
    if (activeLayer === "CARDIO") return organ.id === "heart";
    if (activeLayer === "METABOLIC") return organ.id === "liver" || organ.id === "stomach" || organ.id === "kidneys";
    if (activeLayer === "RESPIRATORY") return organ.id === "lungs";
    return true;
  });

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-6 transition-colors duration-300">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
              3D Virtual Patient Studio
            </span>
            <span className="text-xs text-slate-400 font-mono">Patient: {patientName} (#{patientId})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-serif">
            {patientName}&apos;s Interactive Digital Twin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time anatomical model dynamically calibrated by your clinical biomarkers and physiological sensors.
          </p>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/80 dark:bg-[#0c1611] rounded-2xl border border-slate-200/80 dark:border-[#1c3328] shadow-2xs">
          {["ALL", "CARDIO", "METABOLIC", "RESPIRATORY"].map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeLayer === layer
                  ? "bg-[#1b4332] dark:bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Center 3D Hologram (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] flex flex-col items-center justify-center min-h-[580px] shadow-xs relative">
          <div className="absolute top-6 left-6 z-10">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
              Telemetry Status
            </span>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Bio-Stream Active (Score {overallScore}/100)</span>
            </div>
          </div>

          <HumanBodyCanvas
            onSelectOrgan={(organ) => setSelectedOrgan(organ)}
            selectedOrganId={selectedOrgan?.id}
            className="w-full max-w-2xl"
          />
        </div>

        {/* Right Sidebar: Organ Telemetry Cards (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-serif">
            Organ Network ({filteredOrgans.length})
          </h3>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredOrgans.map((organ) => (
              <button
                key={organ.id}
                onClick={() => setSelectedOrgan(organ)}
                className="w-full p-4 rounded-2xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] hover:border-emerald-600 transition-all text-left space-y-2 group shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                      {organ.name[0]}
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{organ.name} System</span>
                  </div>
                  <OrganBadge status={organ.status} />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 dark:text-slate-400">Vitality Index</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{organ.score}/100</span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {organ.clinicalInsights}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <OrganDetailModal organ={selectedOrgan} onClose={() => setSelectedOrgan(null)} />
    </div>
  );
}
