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
import { useAuth } from "@/context/AuthContext";

export default function SimulatorPage() {
  const { user, twin } = useAuth();
  const patientName = user?.name || "Patient";

  // Simulator State initialized to user's real habits
  const [weightDelta, setWeightDelta] = useState<number>(-2);
  const [exerciseMins, setExerciseMins] = useState<number>((user?.exerciseDays || 3) * 10 + 15);
  const [sleepHours, setSleepHours] = useState<number>(user?.sleepHours || 7.5);
  const [dietScore, setDietScore] = useState<number>(8);

  const baselineScore = twin.overallScore;
  const baselineCvdRisk = 8.5;
  const baselineDiabetesRisk = 7.2;

  const deltaScore =
    -weightDelta * 0.8 +
    (exerciseMins - 30) * 0.15 +
    (sleepHours >= 7 && sleepHours <= 8.5 ? 2.5 : -2) +
    (dietScore - 5) * 0.8;

  const simulatedScore = Math.min(100, Math.max(50, Math.round(baselineScore + deltaScore)));
  const simulatedCvdRisk = Math.max(
    3.5,
    Math.round((baselineCvdRisk - (-weightDelta * 0.5 + (exerciseMins - 30) * 0.08)) * 10) / 10
  );
  const simulatedDiabetesRisk = Math.max(
    3.0,
    Math.round((baselineDiabetesRisk - (-weightDelta * 0.8 + (dietScore - 5) * 0.9)) * 10) / 10
  );

  const trajectoryData = [
    { month: "Current", score: baselineScore, baseline: baselineScore },
    { month: "+2 Mo", score: Math.round(baselineScore + deltaScore * 0.3), baseline: baselineScore },
    { month: "+4 Mo", score: Math.round(baselineScore + deltaScore * 0.6), baseline: baselineScore },
    { month: "+6 Mo", score: Math.round(baselineScore + deltaScore * 0.8), baseline: baselineScore },
    { month: "+9 Mo", score: Math.round(baselineScore + deltaScore * 0.95), baseline: baselineScore },
    { month: "+12 Mo", score: simulatedScore, baseline: baselineScore },
  ];

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8 transition-colors duration-300">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
              Biophysical ODE Simulator
            </span>
            <span className="text-xs text-slate-400 font-mono">Patient: {patientName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-serif">
            What-If Multi-Organ Health Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Simulate lifestyle interventions and project multi-year vitality trajectories for {patientName}.
          </p>
        </div>

        <button
          onClick={() => {
            setWeightDelta(0);
            setExerciseMins(30);
            setSleepHours(user?.sleepHours || 7.5);
            setDietScore(7);
          }}
          className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#0c1611] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-2 border border-slate-200 dark:border-[#1c3328]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset to Current Baseline</span>
        </button>
      </div>

      {/* Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Controls (5 Cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-6 shadow-2xs">
          <div className="border-b border-slate-100 dark:border-[#1c3328] pb-4">
            <span className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-400">
              Intervention Parameters
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 font-serif">
              Adjust Lifestyle Variables
            </h3>
          </div>

          <div className="space-y-5">
            {/* Control 1: Exercise */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" /> Daily Exercise Duration
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-mono">{exerciseMins} mins/day</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={exerciseMins}
                onChange={(e) => setExerciseMins(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#1b4332] dark:accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Sedentary (0m)</span>
                <span>Moderate (30m)</span>
                <span>Athletic (90m)</span>
              </div>
            </div>

            {/* Control 2: Sleep */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-500" /> Target Sleep Duration
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">{sleepHours} hrs/night</span>
              </div>
              <input
                type="range"
                min="5"
                max="10"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#1b4332] dark:accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Deprived (5h)</span>
                <span>Optimal (7.5h)</span>
                <span>Extended (10h)</span>
              </div>
            </div>

            {/* Control 3: Weight Delta */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" /> Projected Weight Target
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-mono">
                  {weightDelta > 0 ? `+${weightDelta}` : weightDelta} kg
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                step="1"
                value={weightDelta}
                onChange={(e) => setWeightDelta(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#1b4332] dark:accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Lose 10 kg</span>
                <span>Maintain (0 kg)</span>
                <span>Gain 10 kg</span>
              </div>
            </div>

            {/* Control 4: Mediterranean Diet Score */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500" /> Nutrition Quality Index
                </span>
                <span className="text-rose-600 dark:text-rose-400 font-mono">{dietScore}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={dietScore}
                onChange={(e) => setDietScore(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#1b4332] dark:accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Processed (1)</span>
                <span>Balanced (6)</span>
                <span>Mediterranean (10)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Projected Trajectory (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Outcome Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-2 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400">Simulated Twin Score</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">{simulatedScore}</span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                  {simulatedScore >= baselineScore ? `+${simulatedScore - baselineScore}` : simulatedScore - baselineScore} pts
                </span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-2 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400">10-Yr CVD Risk</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">{simulatedCvdRisk}%</span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">Projected</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-2 shadow-2xs">
              <span className="text-xs text-slate-500 dark:text-slate-400">Type-2 Diabetes Risk</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">{simulatedDiabetesRisk}%</span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">Projected</span>
              </div>
            </div>
          </div>

          {/* Longitudinal Chart */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1c3328] pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                  12-Month Projected Trajectory
                </h3>
                <p className="text-xs text-slate-400">Longitudinal multiorgan score evolution</p>
              </div>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
                Real-Time ODE Model
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[60, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      color: "#ffffff",
                      borderRadius: "12px",
                      border: "none",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    name="Projected Vitality"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
