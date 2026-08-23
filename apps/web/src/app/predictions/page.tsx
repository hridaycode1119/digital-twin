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

const shapCvdData = [
  { feature: "Systolic BP (128 mmHg)", impact: 4.5, type: "RISK", rawVal: 128 },
  { feature: "Total Chol (208 mg/dL)", impact: 2.8, type: "RISK", rawVal: 208 },
  { feature: "Age (38 yrs)", impact: 1.8, type: "RISK", rawVal: 38 },
  { feature: "BMI (24.2 kg/m²)", impact: -0.9, type: "PROTECTIVE", rawVal: 24.2 },
  { feature: "Exercise (4 days/wk)", impact: -1.5, type: "PROTECTIVE", rawVal: 4 },
  { feature: "Non-Smoker Status", impact: -2.2, type: "PROTECTIVE", rawVal: 0 },
];

const shapDiabetesData = [
  { feature: "Fasting Glucose (108 mg/dL)", impact: 6.2, type: "RISK", rawVal: 108 },
  { feature: "HbA1c (5.8%)", impact: 3.4, type: "RISK", rawVal: 5.8 },
  { feature: "Family History (Father)", impact: 2.1, type: "RISK", rawVal: 1 },
  { feature: "Sleep Duration (7.5h)", impact: -1.2, type: "PROTECTIVE", rawVal: 7.5 },
  { feature: "Daily Steps (8,500)", impact: -1.8, type: "PROTECTIVE", rawVal: 8500 },
];

export default function PredictionsPage() {
  const [selectedDisease, setSelectedDisease] = useState<"CVD" | "DIABETES">("CVD");

  const currentShap = selectedDisease === "CVD" ? shapCvdData : shapDiabetesData;
  const diseaseName =
    selectedDisease === "CVD"
      ? "10-Year Cardiovascular Disease Risk"
      : "5-Year Type 2 Diabetes Risk";
  const riskScore = selectedDisease === "CVD" ? "14.2%" : "16.5%";
  const baselinePop = selectedDisease === "CVD" ? "8.5%" : "9.2%";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              Predictive ML & Explainable AI (XAI)
            </span>
            <span className="text-xs text-slate-400">XGBoost & SHAP Framework</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Disease Risk Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Multi-factor tree ensemble models evaluate your physiological biomarkers and provide transparent SHAP feature attributions.
          </p>
        </div>

        {/* Model Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => setSelectedDisease("CVD")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedDisease === "CVD"
                ? "bg-white text-rose-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Cardiovascular (CVD)
          </button>
          <button
            onClick={() => setSelectedDisease("DIABETES")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedDisease === "DIABETES"
                ? "bg-white text-amber-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Type 2 Diabetes
          </button>
        </div>
      </div>

      {/* Model Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Probability Gauge */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400">Estimated Absolute Risk</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-black text-slate-900">{riskScore}</span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Moderate Risk
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Baseline population average for your age demographic is <strong>{baselinePop}</strong>.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Model: XGBoost v1.4</span>
            <span>AUC: 0.88</span>
          </div>
        </div>

        {/* Key Positive Risk Driver */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-rose-500 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Primary Risk Driver
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-2">
              {selectedDisease === "CVD" ? "Systolic Blood Pressure" : "Fasting Blood Glucose"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {selectedDisease === "CVD"
                ? "Systolic reading of 128 mmHg contributes +4.5% to the 10-year risk curve."
                : "Fasting glucose of 108 mg/dL contributes +6.2% to the 5-year diabetes probability."}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-rose-600">
            Action: Targeted lifestyle intervention recommended
          </div>
        </div>

        {/* Key Protective Factor */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Strongest Protective Factor
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-2">
              {selectedDisease === "CVD" ? "Non-Smoker Status" : "Active Exercise & Sleep"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {selectedDisease === "CVD"
                ? "Zero tobacco exposure protects your baseline vascular score by -2.2%."
                : "Regular physical activity (8,500 daily steps) lowers glycemic resistance."}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-600">
            Action: Maintain healthy lifestyle habits
          </div>
        </div>
      </div>

      {/* Main SHAP Waterfall Explanation Visualization */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-600" />
              SHAP Feature Attribution (Explainable AI Waterfall)
            </h3>
            <p className="text-xs text-slate-500">
              Shows how individual patient biomarkers shift the risk probability away from the base population average.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-rose-600">
              <span className="w-3 h-3 rounded-md bg-rose-500" /> Increases Risk (+%)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-3 h-3 rounded-md bg-emerald-500" /> Protective (-%)
            </span>
          </div>
        </div>

        {/* SHAP Horizontal Bar Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={currentShap}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 140, bottom: 10 }}
            >
              <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `${val}%`} />
              <YAxis dataKey="feature" type="category" stroke="#475569" fontSize={11} tickLine={false} />
              <Tooltip
                formatter={(val: any) => [`${val > 0 ? "+" : ""}${val}% impact`, "Attribution"]}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <ReferenceLine x={0} stroke="#cbd5e1" strokeWidth={1.5} />
              <Bar dataKey="impact" radius={[4, 4, 4, 4]}>
                {currentShap.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.impact > 0 ? "#F43F5E" : "#10B981"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Plain Language Clinical Synthesis */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            AI Clinical Narrative Synthesis
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {selectedDisease === "CVD"
              ? "Your estimated 10-year cardiovascular risk is 14.2% (Moderate). The primary contributors increasing risk are elevated systolic blood pressure (128 mmHg) and total cholesterol (208 mg/dL). However, your non-smoking lifestyle and regular physical activity significantly protect your vascular age."
              : "Your 5-year Type 2 Diabetes risk is 16.5% (Moderate). Fasting glucose of 108 mg/dL and early HbA1c elevation (5.8%) indicate mild insulin resistance. Maintaining current daily step counts (8,500+) and reducing refined sugars can reverse this trajectory."}
          </p>
        </div>
      </div>
    </div>
  );
}
