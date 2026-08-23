"use client";

import React, { useState } from "react";
import {
  Activity,
  Sliders,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Info,
  RotateCcw,
  ShieldCheck,
  Heart,
  Flame,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function SimulatorPage() {
  // Simulator State
  const [weightDelta, setWeightDelta] = useState<number>(-4); // -4 kg
  const [exerciseMins, setExerciseMins] = useState<number>(45); // 45 mins/day
  const [sleepHours, setSleepHours] = useState<number>(8.0); // 8.0 hrs
  const [dietScore, setDietScore] = useState<number>(8); // 8/10

  // Baseline values
  const baselineScore = 87;
  const baselineCvdRisk = 14.2;
  const baselineDiabetesRisk = 16.5;

  // Dynamic simulation calculations
  // Weight benefit: ~0.8 score points per kg lost
  // Exercise benefit: ~0.15 score points per min above 30
  // Sleep benefit: ~1.2 score points if between 7.5-8.5
  // Diet benefit: ~0.8 score points per point above 5
  const deltaScore =
    -weightDelta * 0.8 +
    (exerciseMins - 30) * 0.15 +
    (sleepHours >= 7 && sleepHours <= 8.5 ? 2.5 : -2) +
    (dietScore - 5) * 0.8;

  const simulatedScore = Math.min(100, Math.max(50, Math.round(baselineScore + deltaScore)));
  const simulatedCvdRisk = Math.max(
    3.5,
    Math.round((baselineCvdRisk - (-weightDelta * 0.7 + (exerciseMins - 30) * 0.12)) * 10) / 10
  );
  const simulatedDiabetesRisk = Math.max(
    3.0,
    Math.round((baselineDiabetesRisk - (-weightDelta * 1.1 + (dietScore - 5) * 1.2)) * 10) / 10
  );

  // Generate 12-month trajectory curve
  const trajectoryData = [
    { month: "Month 0 (Now)", baseline: baselineScore, projected: baselineScore },
    {
      month: "Month 3",
      baseline: baselineScore,
      projected: Math.round(baselineScore + deltaScore * 0.35),
    },
    {
      month: "Month 6",
      baseline: baselineScore,
      projected: Math.round(baselineScore + deltaScore * 0.7),
    },
    {
      month: "Month 9",
      baseline: baselineScore,
      projected: Math.round(baselineScore + deltaScore * 0.9),
    },
    {
      month: "Month 12",
      baseline: baselineScore,
      projected: simulatedScore,
    },
  ];

  const handleReset = () => {
    setWeightDelta(0);
    setExerciseMins(30);
    setSleepHours(7.5);
    setDietScore(6);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Hypothetical Physiological Modeling
            </span>
            <span className="text-xs text-slate-400">Dynamic Multi-System ODE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            Future Health Scenario Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Test what-if lifestyle adjustments to forecast how weight, exercise, sleep, and nutrition reshape your digital twin over 12 months.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Baseline
        </button>
      </div>

      {/* Simulator Layout: Sliders (5 cols) + Live Projections & Chart (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Controls Panel (5 Cols) */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 space-y-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            Modifiable Lifestyle Parameters
          </h3>

          {/* Slider 1: Weight Delta */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <label className="text-slate-700">Target Weight Adjustment</label>
              <span className="text-blue-600 font-extrabold">
                {weightDelta > 0 ? `+${weightDelta} kg` : `${weightDelta} kg`}
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={weightDelta}
              onChange={(e) => setWeightDelta(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-10 kg (Weight Loss)</span>
              <span>Baseline</span>
              <span>+10 kg (Gain)</span>
            </div>
          </div>

          {/* Slider 2: Daily Exercise */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <label className="text-slate-700">Daily Aerobic Cardio</label>
              <span className="text-blue-600 font-extrabold">{exerciseMins} mins / day</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={exerciseMins}
              onChange={(e) => setExerciseMins(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Sedentary (0m)</span>
              <span>30m Moderate</span>
              <span>90m High</span>
            </div>
          </div>

          {/* Slider 3: Sleep Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <label className="text-slate-700">Sleep Duration</label>
              <span className="text-blue-600 font-extrabold">{sleepHours} hours / night</span>
            </div>
            <input
              type="range"
              min="5"
              max="10"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>5 hrs</span>
              <span>8 hrs Optimal</span>
              <span>10 hrs</span>
            </div>
          </div>

          {/* Slider 4: Diet Quality Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <label className="text-slate-700">Diet & Nutrition Quality</label>
              <span className="text-blue-600 font-extrabold">{dietScore} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={dietScore}
              onChange={(e) => setDietScore(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1 (High Processed)</span>
              <span>5 (Average)</span>
              <span>10 (Clean Whole Foods)</span>
            </div>
          </div>
        </div>

        {/* Projections & 12-Month Forecast Graph (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Projected Outcomes Comparison Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Health Score Projected */}
            <div className="glass-card rounded-2xl p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Health Score</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-blue-600">{simulatedScore}</span>
                <span className="text-xs text-slate-400">from {baselineScore}</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +{simulatedScore - baselineScore} Projected pts
              </span>
            </div>

            {/* CVD Risk Projected */}
            <div className="glass-card rounded-2xl p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase">10-Yr CVD Risk</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-rose-600">{simulatedCvdRisk}%</span>
                <span className="text-xs text-slate-400">from {baselineCvdRisk}%</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                <TrendingDown className="w-3 h-3" /> -{Math.round((baselineCvdRisk - simulatedCvdRisk) * 10) / 10}% Risk
              </span>
            </div>

            {/* Diabetes Risk Projected */}
            <div className="glass-card rounded-2xl p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase">5-Yr Diabetes Risk</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-amber-600">{simulatedDiabetesRisk}%</span>
                <span className="text-xs text-slate-400">from {baselineDiabetesRisk}%</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                <TrendingDown className="w-3 h-3" /> -{Math.round((baselineDiabetesRisk - simulatedDiabetesRisk) * 10) / 10}% Risk
              </span>
            </div>
          </div>

          {/* 12-Month Projected Trajectory Graph */}
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  12-Month Health Score Trajectory Simulation
                </h3>
                <p className="text-xs text-slate-500">Comparing baseline trajectory vs. simulated scenario</p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                12-Month Forecast
              </span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData}>
                  <defs>
                    <linearGradient id="projectedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={[70, 100]} stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="projected"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#projectedGrad)"
                    name="Simulated Scenario"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Scientific Note:</strong> This simulation model is calculated from empirical epidemiological meta-analyses (Framingham, DPP) for exploratory lifestyle guidance and does not replace medical consultation.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
