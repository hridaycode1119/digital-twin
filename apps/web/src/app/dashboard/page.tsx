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
  PlusCircle,
} from "lucide-react";
import { OrganBadge } from "@/components/ui/OrganBadge";
import { OrganData } from "@/types/twin";
import { OrganDetailModal } from "@/components/twin/OrganDetailModal";
import { useAuth } from "@/context/AuthContext";
import { generateUserTimeSeries } from "@/lib/physiology";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const [selectedOrgan, setSelectedOrgan] = useState<OrganData | null>(null);
  const { user, twin, records } = useAuth();

  const patientName = user?.name || "Patient";
  const patientId = user?.patientId || "pt_001";
  const overallScore = twin.overallScore;

  const systolic = Number(user?.bloodPressure?.split("/")[0]) || 120;
  const glucose = Number(user?.fastingGlucose) || 95;
  const hr = Number(user?.heartRate) || 72;

  const vitalsTimeSeriesData = generateUserTimeSeries(systolic, glucose, hr);
  const organs = Object.values(twin.organs);

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8 transition-colors duration-300">
      {/* Top Banner / Welcome */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
              Active Digital Twin Profile
            </span>
            <span className="text-xs text-slate-400 font-mono">Patient ID: #{patientId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-serif">
            Welcome back, {patientName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time biometric continuous telemetry & multiorgan homeostasis index.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/digital-twin"
            className="px-5 py-3 rounded-2xl bg-[#1b4332] hover:bg-[#14382c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch 3D Explorer</span>
          </Link>
          <Link
            href="/records"
            className="px-5 py-3 rounded-2xl bg-white dark:bg-[#0c1611] border border-slate-200 dark:border-[#1c3328] text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Reports ({records.length})</span>
          </Link>
        </div>
      </div>

      {/* Key Score & Vitals Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Overall Score */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] flex flex-col justify-between space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Twin Vitality Index</span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
              {overallScore >= 82 ? "Optimal" : "Monitoring"}
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-slate-900 dark:text-white font-mono">{overallScore}</span>
              <span className="text-xs text-slate-400">/100</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#1b4332] dark:bg-emerald-500 h-full rounded-full" style={{ width: `${overallScore}%` }} />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Calculated from {patientName}&apos;s real biometrics and habits.
          </p>
        </div>

        {/* Real-time Vitals 1 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] flex flex-col justify-between space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Blood Pressure</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {user?.bloodPressure || "120/80"}
            </span>
            <span className="text-xs text-slate-400 ml-1.5">mmHg</span>
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> User Calibration Active
          </span>
        </div>

        {/* Real-time Vitals 2 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] flex flex-col justify-between space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Fasting Blood Glucose</span>
            <Flame className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">{glucose} mg/dL</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Ref: 70 - 99 mg/dL</span>
        </div>

        {/* Uploaded Records */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] flex flex-col justify-between space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Uploaded Lab Reports</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">{records.length}</span>
            <span className="text-xs text-slate-400 ml-1.5">Documents</span>
          </div>
          <Link href="/records" className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
            <span>{records.length > 0 ? "Manage records" : "+ Upload your first report"}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2-Column Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Organ System Status Grid (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
              {patientName}&apos;s Organ System Status
            </h3>
            <span className="text-xs text-slate-400">Click any organ to inspect biomarkers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {organs.map((organ) => (
              <button
                key={organ.id}
                onClick={() => setSelectedOrgan(organ)}
                className="p-5 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] hover:border-emerald-600 transition-all text-left space-y-3 group shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                      {organ.name[0]}
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{organ.name}</span>
                  </div>
                  <OrganBadge status={organ.status} />
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Vitality Score</span>
                  <span className="text-base font-black text-slate-900 dark:text-white font-mono">{organ.score}/100</span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {organ.clinicalInsights}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Vitals Time Series Telemetry (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                Daily Physiological Projection
              </h3>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                AI Modeled
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Circadian baseline calibrated from {patientName}&apos;s lab reports
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vitalsTimeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[50, 150]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    color: "#ffffff",
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bpSystolic"
                  name="Systolic BP (mmHg)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="glucose"
                  name="Glucose (mg/dL)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-[#1c3328] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Last sync: Just now</span>
            <Link href="/records" className="text-emerald-800 dark:text-emerald-400 font-bold hover:underline">
              Inspect records vault →
            </Link>
          </div>
        </div>
      </div>

      {/* Organ Modal */}
      <OrganDetailModal organ={selectedOrgan} onClose={() => setSelectedOrgan(null)} />
    </div>
  );
}
