"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Heart,
  Brain,
  Wind,
  ShieldAlert,
  Flame,
  Utensils,
  TrendingUp,
  AlertTriangle,
  FileText,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Clock,
  CheckCircle,
} from "lucide-react";
import { initialPatientTwin } from "@/data/mockPatient";
import { OrganBadge } from "@/components/ui/OrganBadge";
import { OrganData } from "@/types/twin";
import { OrganDetailModal } from "@/components/twin/OrganDetailModal";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const vitalsTimeSeriesData = [
  { time: "06:00", bpSystolic: 124, hr: 68, glucose: 98 },
  { time: "09:00", bpSystolic: 128, hr: 76, glucose: 118 },
  { time: "12:00", bpSystolic: 130, hr: 74, glucose: 112 },
  { time: "15:00", bpSystolic: 126, hr: 78, glucose: 104 },
  { time: "18:00", bpSystolic: 128, hr: 82, glucose: 122 },
  { time: "21:00", bpSystolic: 122, hr: 72, glucose: 108 },
];

export default function DashboardPage() {
  const [selectedOrgan, setSelectedOrgan] = useState<OrganData | null>(null);
  const twin = initialPatientTwin;
  const organs = Object.values(twin.organs);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Welcome */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              Active Digital Twin Profile
            </span>
            <span className="text-xs text-slate-400">ID: {twin.patientId}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Welcome back, {twin.name}
          </h1>
          <p className="text-sm text-slate-500">
            Your physiological twin state is synchronized with 24 verified medical records and real-time vitals.
          </p>
        </div>

        {/* Overall Composite Score Gauge Card */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-2xl shadow-lg shadow-blue-500/20 shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex flex-col items-center justify-center border border-white/20">
            <span className="text-2xl font-black">{twin.overallScore}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-100">/ 100</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white">Composite Health Score</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-400/30">
              ● Good Physiological State
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Organ Systems Status Matrix */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Organ Telemetry & Status</h2>
            <p className="text-xs text-slate-500">Click any organ node for biomarker drilldown and clinical AI analysis</p>
          </div>
          <Link
            href="/digital-twin"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Launch 3D View <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {organs.map((organ) => (
            <div
              key={organ.id}
              onClick={() => setSelectedOrgan(organ)}
              className="glass-card glass-card-hover rounded-2xl p-4 cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-blue-600">
                  <Activity className="w-5 h-5" />
                </div>
                <OrganBadge status={organ.status} />
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-bold text-slate-900">{organ.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  Score: <strong className="text-slate-800">{organ.score}/100</strong> • Risk: {organ.riskLevel}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
                <span>View Biomarkers</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Row: Vitals Trend Chart & Active Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vitals Telemetry Chart (8 Cols) */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Intraday Vitals Telemetry
              </h3>
              <p className="text-xs text-slate-500">Live stream: Blood Pressure, Heart Rate & Glucose</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> BP Systolic (mmHg)
              </span>
              <span className="flex items-center gap-1.5 text-rose-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Heart Rate (BPM)
              </span>
              <span className="flex items-center gap-1.5 text-amber-500">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Glucose (mg/dL)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vitalsTimeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[50, 150]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Line type="monotone" dataKey="bpSystolic" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="hr" stroke="#F43F5E" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="glucose" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Risk Alerts & Action Items (4 Cols) */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Active Risk Alerts (3)
              </h3>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                Attention
              </span>
            </div>

            <div className="space-y-3">
              {/* Alert 1 */}
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900">Pre-Diabetic Glycemic Trend</span>
                  <span className="text-[10px] text-amber-700">Pancreas</span>
                </div>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Fasting blood glucose averaged 108 mg/dL over the last 30 days.
                </p>
              </div>

              {/* Alert 2 */}
              <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/70">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900">Elevated Systolic BP</span>
                  <span className="text-[10px] text-rose-700">Heart</span>
                </div>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                  Afternoon readings reached 130 mmHg. Consider dietary sodium reduction.
                </p>
              </div>

              {/* Alert 3 */}
              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/70">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900">Upcoming Cardiology Checkup</span>
                  <span className="text-[10px] text-blue-700">Aug 28</span>
                </div>
                <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                  Dr. Sarah Jenkins • St. Jude Medical Center (2:00 PM).
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/predictions"
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center block transition-colors"
          >
            Launch AI Risk Explainability
          </Link>
        </div>
      </div>

      {/* Organ Detail Slideover */}
      <OrganDetailModal organ={selectedOrgan} onClose={() => setSelectedOrgan(null)} />
    </div>
  );
}
