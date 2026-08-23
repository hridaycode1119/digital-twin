"use client";

import React, { useState } from "react";
import {
  Activity,
  Layers,
  History,
  Calendar,
  Sparkles,
  Info,
  ChevronRight,
  ShieldAlert,
  Heart,
  Brain,
  Wind,
  Utensils,
  Flame,
} from "lucide-react";
import { HumanBodyCanvas } from "@/components/twin/HumanBodyCanvas";
import { OrganDetailModal } from "@/components/twin/OrganDetailModal";
import { OrganBadge } from "@/components/ui/OrganBadge";
import { OrganData, OrganId } from "@/types/twin";
import { initialPatientTwin } from "@/data/mockPatient";

const timeSnapshots = [
  { label: "Today (Current)", date: "Aug 2026", score: 87, active: true },
  { label: "30 Days Ago", date: "Jul 2026", score: 85, active: false },
  { label: "90 Days Ago", date: "May 2026", score: 82, active: false },
  { label: "Baseline Onboarding", date: "Jan 2026", score: 79, active: false },
];

export default function DigitalTwinPage() {
  const [selectedOrgan, setSelectedOrgan] = useState<OrganData | null>(null);
  const [activeLayer, setActiveLayer] = useState<string>("ALL");
  const [selectedSnapshot, setSelectedSnapshot] = useState<number>(0);
  const twin = initialPatientTwin;
  const organsList = Object.values(twin.organs);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              3D Virtual Patient Studio
            </span>
            <span className="text-xs text-slate-400">Mesh v2.4 Holographic</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            Interactive Digital Twin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time anatomical model dynamically textured by laboratory biomarkers and physiological sensors.
          </p>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          {["ALL", "CARDIO", "METABOLIC", "RESPIRATORY"].map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeLayer === layer
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Canvas Area & Side Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Human Canvas (8 Cols) */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 relative min-h-[580px] flex flex-col justify-between overflow-hidden">
          {/* Top Canvas Badges */}
          <div className="flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-700">Digital Twin Telemetry Active</span>
            </div>
            <span className="text-xs text-slate-500 font-medium bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200/60">
              Composite Score: <strong className="text-blue-600">87/100</strong>
            </span>
          </div>

          {/* 3D Model */}
          <div className="my-auto">
            <HumanBodyCanvas
              onSelectOrgan={(organ) => setSelectedOrgan(organ)}
              selectedOrganId={selectedOrgan?.id}
              className="w-full max-w-[580px] mx-auto"
            />
          </div>

          {/* Time Machine / Historical Scrubber */}
          <div className="z-20 pt-4 border-t border-slate-100 bg-white/70 backdrop-blur-md -mx-6 -mb-6 p-4 px-6 rounded-b-3xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-blue-600" />
                Historical State Scrubber
              </span>
              <span className="text-[11px] text-slate-400">Comparing past physiological snapshots</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {timeSnapshots.map((snap, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSnapshot(idx)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    selectedSnapshot === idx
                      ? "bg-blue-50 border-blue-300 ring-2 ring-blue-500/20"
                      : "bg-white border-slate-200/70 hover:bg-slate-50"
                  }`}
                >
                  <p className="text-[11px] font-bold text-slate-800 truncate">{snap.label}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[10px] text-slate-500">{snap.date}</span>
                    <span className="text-[10px] font-bold text-blue-600">{snap.score}/100</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel: Organ Systems Quick List (4 Cols) */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Organ System Telemetry
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Direct live parameters mapped to the virtual human model.
            </p>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {organsList.map((organ) => (
                <div
                  key={organ.id}
                  onClick={() => setSelectedOrgan(organ)}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/70 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{organ.name}</h4>
                      <p className="text-[10px] text-slate-500">Score: {organ.score}/100</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <OrganBadge status={organ.status} />
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-slate-600">
            <p className="font-semibold text-blue-900 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              AI Continuous Sync
            </p>
            New reports uploaded to the records explorer automatically update these 3D organ states.
          </div>
        </div>
      </div>

      {/* Organ Detail Modal */}
      <OrganDetailModal organ={selectedOrgan} onClose={() => setSelectedOrgan(null)} />
    </div>
  );
}
