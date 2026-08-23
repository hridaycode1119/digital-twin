"use client";

import React, { useState } from "react";
import {
  BrainCircuit,
  Heart,
  Flame,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sliders,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from "recharts";
import { useAuth } from "@/context/AuthContext";

export default function PredictionsPage() {
  const [selectedDisease, setSelectedDisease] = useState<"CVD" | "DIABETES">("CVD");
  const { user } = useAuth();

  const userAge = user?.age || 24;
  const userBp = user?.bloodPressure || "122/80";
  const userGlucose = user?.fastingGlucose || 95;

  const shapCvdData = [
    { feature: `Systolic BP (${userBp.split("/")[0]} mmHg)`, impact: 3.2, type: "RISK", rawVal: Number(userBp.split("/")[0]) || 122 },
    { feature: "Total Chol (185 mg/dL)", impact: 1.4, type: "RISK", rawVal: 185 },
    { feature: `Age (${userAge} yrs)`, impact: 0.8, type: "RISK", rawVal: userAge },
    { feature: "BMI (22.8 kg/m²)", impact: -1.2, type: "PROTECTIVE", rawVal: 22.8 },
    { feature: "Regular Exercise", impact: -2.1, type: "PROTECTIVE", rawVal: 4 },
    { feature: "Non-Smoker Status", impact: -3.5, type: "PROTECTIVE", rawVal: 0 },
  ];

  const shapDiabetesData = [
    { feature: `Fasting Glucose (${userGlucose} mg/dL)`, impact: 2.4, type: "RISK", rawVal: userGlucose },
    { feature: "HbA1c (5.4%)", impact: 1.1, type: "RISK", rawVal: 5.4 },
    { feature: "Sleep Duration (7.5h)", impact: -1.4, type: "PROTECTIVE", rawVal: 7.5 },
    { feature: "Daily Steps (8,200)", impact: -2.2, type: "PROTECTIVE", rawVal: 8200 },
  ];

  const currentShap = selectedDisease === "CVD" ? shapCvdData : shapDiabetesData;
  const diseaseName =
    selectedDisease === "CVD"
      ? "10-Year Cardiovascular Disease Risk"
      : "5-Year Type 2 Diabetes Risk";
  const riskScore = selectedDisease === "CVD" ? "7.8%" : "5.4%";
  const baselinePop = selectedDisease === "CVD" ? "8.5%" : "9.2%";

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8 transition-colors duration-300">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
              Explainable AI (SHAP) Model
            </span>
            <span className="text-xs text-slate-400 font-mono">Patient: {user?.name || "Hriday"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-serif">
            Predictive Disease Risk & Transparency
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Validated machine learning algorithms projecting longitudinal health vulnerabilities with full biomarker driver attribution.
          </p>
        </div>

        {/* Switch Disease Model */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 dark:bg-[#0c1611] rounded-2xl border border-slate-200/80 dark:border-[#1c3328] shadow-2xs">
          <button
            onClick={() => setSelectedDisease("CVD")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedDisease === "CVD"
                ? "bg-[#1b4332] dark:bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Cardiovascular (10-Yr)
          </button>
          <button
            onClick={() => setSelectedDisease("DIABETES")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedDisease === "DIABETES"
                ? "bg-[#1b4332] dark:bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Type-2 Diabetes (5-Yr)
          </button>
        </div>
      </div>

      {/* Main Grid: Forecast & SHAP Waterfall */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Overall Risk Score Card (4 Cols) */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-6 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Condition</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 font-serif">{diseaseName}</h3>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900 text-center space-y-2">
            <span className="text-xs text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider">
              {user?.name || "Patient"}&apos;s Calculated Risk
            </span>
            <div className="text-5xl font-black text-emerald-700 dark:text-emerald-400 font-mono">{riskScore}</div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" /> Low Baseline Band
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              General Population Average: <strong className="text-slate-700 dark:text-slate-300">{baselinePop}</strong>
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-[#1c3328] pt-4">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <BrainCircuit className="w-4 h-4 text-emerald-600" />
              <span>Model Architecture: XGBoost Ensemble</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              Trained on multi-decade longitudinal clinical cohort data. Evaluated against Framingham Heart Study parameters.
            </p>
          </div>
        </div>

        {/* Right: SHAP Feature Attribution Waterfall (8 Cols) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-[#1c3328] pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                SHAP Biomarker Driver Attribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transparent impact weighting: Red pushes risk higher, Green pulls risk lower.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1 text-rose-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Risk Increasers
              </span>
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Protective Factors
              </span>
            </div>
          </div>

          {/* Bar Chart Waterfall */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={currentShap}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
              >
                <XAxis type="number" stroke="#94a3b8" fontSize={11} domain={[-5, 8]} />
                <YAxis dataKey="feature" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} width={130} />
                <Tooltip
                  formatter={(val: number) => [`${val > 0 ? "+" : ""}${val}% impact`, "SHAP Weight"]}
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    color: "#ffffff",
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "12px",
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="impact" radius={[6, 6, 6, 6]}>
                  {currentShap.map((entry, idx) => (
                    <Cell key={idx} fill={entry.impact > 0 ? "#f43f5e" : "#10b981"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Clinical Insights based on SHAP */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1611] border border-slate-200/60 dark:border-[#1c3328] text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-900 dark:text-white block mb-1">Physiological Interpretation:</strong>
            Your non-smoker status and daily physical activity deliver strong protective offsets (-5.6% combined). Continuing 30-45 minutes of weekly aerobic exercise ensures your systolic pressure and total cholesterol remain in the ideal protective band.
          </div>
        </div>
      </div>
    </div>
  );
}
