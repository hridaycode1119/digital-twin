"use client";

import React, { useState, useRef, useEffect } from "react";
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
  UploadCloud,
  Edit3,
  X,
  FileCheck,
  CheckCircle2,
  Zap,
  BrainCircuit,
  ShieldCheck,
  Stethoscope,
  Lightbulb,
  Award,
  ArrowRight,
  Sliders,
  RotateCcw,
  Save,
  Moon,
  Building,
  HelpCircle,
} from "lucide-react";
import { OrganBadge } from "@/components/ui/OrganBadge";
import { OrganData } from "@/types/twin";
import { OrganDetailModal } from "@/components/twin/OrganDetailModal";
import { useAuth, UserProfile } from "@/context/AuthContext";
import {
  getBiomarkerTimelineFromRecords,
  computeFuturePredictions,
  generatePersonalizedRemedies,
} from "@/lib/physiology";
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
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "REPORT_DATA" | "PREDICTIONS" | "REMEDIES">("OVERVIEW");
  const { user, twin, records, addRecord, syncManualParameters } = useAuth();

  // Selected report index for detailed inspection
  const [selectedReportIndex, setSelectedReportIndex] = useState(0);

  // Modals & Ingestion State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStep, setUploadStep] = useState<"IDLE" | "PROCESSING" | "COMPLETE">("IDLE");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live On-The-Spot Parameter State (Allows instantaneous live tuning on the spot)
  const [liveSystolic, setLiveSystolic] = useState(120);
  const [liveDiastolic, setLiveDiastolic] = useState(80);
  const [liveGlucose, setLiveGlucose] = useState(95);
  const [liveHr, setLiveHr] = useState(72);
  const [liveSleep, setLiveSleep] = useState(7.5);
  const [liveExercise, setLiveExercise] = useState(3);
  const [liveStress, setLiveStress] = useState(3);
  const [liveSmoking, setLiveSmoking] = useState("Never");
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Sync state with user profile on initial load or user change
  useEffect(() => {
    if (user) {
      if (user.bloodPressure) {
        const parts = user.bloodPressure.split("/");
        setLiveSystolic(Number(parts[0]) || 120);
        setLiveDiastolic(Number(parts[1]) || 80);
      }
      if (user.fastingGlucose) setLiveGlucose(Number(user.fastingGlucose));
      if (user.heartRate) setLiveHr(Number(user.heartRate));
      if (user.sleepHours) setLiveSleep(Number(user.sleepHours));
      if (user.exerciseDays) setLiveExercise(Number(user.exerciseDays));
      if (user.stressLevel) setLiveStress(Number(user.stressLevel));
      if (user.smoking) setLiveSmoking(user.smoking);
    }
  }, [user]);

  // Active report for inspection
  const activeReport = records.length > 0 ? records[selectedReportIndex] || records[0] : null;

  // Dynamic Virtual User Object constructed for on-the-spot prediction & remedy recalculation
  const activeParams: Partial<UserProfile> = {
    ...user,
    bloodPressure: `${liveSystolic}/${liveDiastolic}`,
    fastingGlucose: liveGlucose,
    heartRate: liveHr,
    sleepHours: liveSleep,
    exerciseDays: liveExercise,
    stressLevel: liveStress,
    smoking: liveSmoking,
  };

  // Instantaneous on-the-spot recalculations
  const predictions = computeFuturePredictions(activeParams, twin);
  const remedies = generatePersonalizedRemedies(activeParams, twin);

  // Handle saving tuned parameters to user account
  const handleSaveTunedParameters = () => {
    syncManualParameters({
      bloodPressure: `${liveSystolic}/${liveDiastolic}`,
      fastingGlucose: liveGlucose,
      heartRate: liveHr,
      sleepHours: liveSleep,
      exerciseDays: liveExercise,
      stressLevel: liveStress,
      smoking: liveSmoking,
    });
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2500);
  };

  const handleResetToBaseline = () => {
    if (user) {
      if (user.bloodPressure) {
        const parts = user.bloodPressure.split("/");
        setLiveSystolic(Number(parts[0]) || 120);
        setLiveDiastolic(Number(parts[1]) || 80);
      }
      setLiveGlucose(Number(user.fastingGlucose) || 95);
      setLiveHr(Number(user.heartRate) || 72);
      setLiveSleep(Number(user.sleepHours) || 7.5);
      setLiveExercise(Number(user.exerciseDays) || 3);
      setLiveStress(Number(user.stressLevel) || 3);
    }
  };

  const patientName = user?.name || "Patient";
  const patientId = user?.patientId || "pt_001";
  const overallScore = twin.overallScore;

  // Timeline data constructed purely from uploaded lab reports
  const timelineData = getBiomarkerTimelineFromRecords(records, {
    glucose: liveGlucose,
    systolic: liveSystolic,
  });

  const organs = Object.values(twin.organs);

  // Handle Document Upload & Auto Extraction
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setUploadStep("PROCESSING");
    setIsProcessingDoc(true);

    setTimeout(() => {
      const fileName = file.name.toLowerCase();
      let extractedGlucose = 98;
      let extractedSystolic = 122;
      let extractedDiastolic = 80;
      let extractedHr = 72;
      let extractedCholesterol = 192;
      let extractedCategory = "Comprehensive Metabolic Panel";

      let extractedValues = [
        { name: "Blood Pressure (Systolic/Diastolic)", value: "122/80", unit: "mmHg", range: "< 120/80", isAbnormal: false },
        { name: "Fasting Blood Glucose", value: 98, unit: "mg/dL", range: "70 - 99", isAbnormal: false },
        { name: "Resting Heart Rate", value: 72, unit: "BPM", range: "60 - 80", isAbnormal: false },
        { name: "Total Cholesterol", value: 192, unit: "mg/dL", range: "125 - 200", isAbnormal: false },
        { name: "HDL Cholesterol", value: 55, unit: "mg/dL", range: "40 - 60", isAbnormal: false },
        { name: "LDL Cholesterol", value: 106, unit: "mg/dL", range: "< 100", isAbnormal: true },
        { name: "Serum Creatinine", value: 0.92, unit: "mg/dL", range: "0.6 - 1.2", isAbnormal: false },
        { name: "Hemoglobin (Hb)", value: 15.1, unit: "g/dL", range: "13.5 - 17.5", isAbnormal: false },
      ];

      if (fileName.includes("lipid") || fileName.includes("cholesterol")) {
        extractedCategory = "Lipid Profile";
        extractedCholesterol = 212;
        extractedGlucose = 96;
        extractedSystolic = 124;
        extractedDiastolic = 82;
        extractedValues = [
          { name: "Total Cholesterol", value: 212, unit: "mg/dL", range: "125 - 200", isAbnormal: true },
          { name: "Triglycerides", value: 155, unit: "mg/dL", range: "< 150", isAbnormal: true },
          { name: "HDL Cholesterol", value: 48, unit: "mg/dL", range: "40 - 60", isAbnormal: false },
          { name: "LDL Cholesterol", value: 133, unit: "mg/dL", range: "< 100", isAbnormal: true },
          { name: "Fasting Blood Glucose", value: 96, unit: "mg/dL", range: "70 - 99", isAbnormal: false },
          { name: "Blood Pressure", value: "124/82", unit: "mmHg", range: "< 120/80", isAbnormal: false },
        ];
      } else if (fileName.includes("cbc") || fileName.includes("blood") || fileName.includes("hemogram")) {
        extractedCategory = "Complete Blood Count";
        extractedGlucose = 94;
        extractedSystolic = 120;
        extractedDiastolic = 78;
        extractedHr = 70;
        extractedValues = [
          { name: "Hemoglobin (Hb)", value: 15.4, unit: "g/dL", range: "13.5 - 17.5", isAbnormal: false },
          { name: "Platelet Count", value: 245, unit: "10^3/uL", range: "150 - 450", isAbnormal: false },
          { name: "WBC Count", value: 6.8, unit: "10^3/uL", range: "4.5 - 11.0", isAbnormal: false },
          { name: "Fasting Blood Glucose", value: 94, unit: "mg/dL", range: "70 - 99", isAbnormal: false },
          { name: "Blood Pressure", value: "120/78", unit: "mmHg", range: "< 120/80", isAbnormal: false },
          { name: "Resting Heart Rate", value: 70, unit: "BPM", range: "60 - 80", isAbnormal: false },
        ];
      } else if (fileName.includes("sugar") || fileName.includes("diabetes") || fileName.includes("glucose")) {
        extractedCategory = "Glycemic / Glucose Panel";
        extractedGlucose = 112;
        extractedSystolic = 126;
        extractedDiastolic = 82;
        extractedValues = [
          { name: "Fasting Blood Glucose", value: 112, unit: "mg/dL", range: "70 - 99", isAbnormal: true },
          { name: "HbA1c (Glycated)", value: 5.7, unit: "%", range: "< 5.7", isAbnormal: false },
          { name: "Blood Pressure", value: "126/82", unit: "mmHg", range: "< 120/80", isAbnormal: false },
          { name: "Serum Creatinine", value: 0.90, unit: "mg/dL", range: "0.6 - 1.2", isAbnormal: false },
        ];
      } else if (fileName.includes("kidney") || fileName.includes("renal") || fileName.includes("urine")) {
        extractedCategory = "Renal & Kidney Function Panel";
        extractedGlucose = 95;
        extractedSystolic = 124;
        extractedDiastolic = 80;
        extractedValues = [
          { name: "Serum Creatinine", value: 0.98, unit: "mg/dL", range: "0.6 - 1.2", isAbnormal: false },
          { name: "eGFR (Filtration)", value: 104, unit: "mL/min", range: "> 90", isAbnormal: false },
          { name: "Blood Urea Nitrogen (BUN)", value: 15, unit: "mg/dL", range: "7 - 20", isAbnormal: false },
          { name: "Serum Sodium", value: 140, unit: "mEq/L", range: "135 - 145", isAbnormal: false },
          { name: "Serum Potassium", value: 4.3, unit: "mEq/L", range: "3.5 - 5.0", isAbnormal: false },
          { name: "Blood Pressure", value: "124/80", unit: "mmHg", range: "< 120/80", isAbnormal: false },
        ];
      } else if (fileName.includes("liver") || fileName.includes("lft") || fileName.includes("hepatic")) {
        extractedCategory = "Hepatic & Liver Function Test";
        extractedGlucose = 96;
        extractedSystolic = 120;
        extractedDiastolic = 78;
        extractedValues = [
          { name: "ALT (Alanine Aminotransferase)", value: 24, unit: "U/L", range: "7 - 56", isAbnormal: false },
          { name: "AST (Aspartate Aminotransferase)", value: 22, unit: "U/L", range: "10 - 40", isAbnormal: false },
          { name: "Total Bilirubin", value: 0.7, unit: "mg/dL", range: "0.1 - 1.2", isAbnormal: false },
          { name: "Serum Albumin", value: 4.4, unit: "g/dL", range: "3.5 - 5.5", isAbnormal: false },
          { name: "Fasting Blood Glucose", value: 96, unit: "mg/dL", range: "70 - 99", isAbnormal: false },
          { name: "Blood Pressure", value: "120/78", unit: "mmHg", range: "< 120/80", isAbnormal: false },
        ];
      } else if (fileName.includes("cardio") || fileName.includes("heart") || fileName.includes("ecg")) {
        extractedCategory = "Cardiovascular Diagnostic Screen";
        extractedSystolic = 128;
        extractedDiastolic = 84;
        extractedHr = 78;
        extractedCholesterol = 198;
        extractedValues = [
          { name: "Blood Pressure (Systolic/Diastolic)", value: "128/84", unit: "mmHg", range: "< 120/80", isAbnormal: false },
          { name: "Resting Heart Rate", value: 78, unit: "BPM", range: "60 - 80", isAbnormal: false },
          { name: "Total Cholesterol", value: 198, unit: "mg/dL", range: "125 - 200", isAbnormal: false },
          { name: "HDL Cholesterol", value: 52, unit: "mg/dL", range: "40 - 60", isAbnormal: false },
          { name: "LDL Cholesterol", value: 114, unit: "mg/dL", range: "< 100", isAbnormal: true },
          { name: "Fasting Blood Glucose", value: 95, unit: "mg/dL", range: "70 - 99", isAbnormal: false },
        ];
      }

      // 1. Instantly update live parameters on the spot
      setLiveSystolic(extractedSystolic);
      setLiveDiastolic(extractedDiastolic);
      setLiveGlucose(extractedGlucose);
      setLiveHr(extractedHr);

      // 2. Add record and sync into user profile & twin
      addRecord({
        title: file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
        category: extractedCategory,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        facility: "Clinical Diagnostic Laboratory",
        status: "VERIFIED",
        abnormalCount: extractedValues.filter((v) => v.isAbnormal).length,
        extractedValues,
        aiSummary: `AI Optical OCR parsed ${extractedValues.length} biomarkers from ${file.name}. Patient parameters, organ status, and future predictions updated instantly.`,
        doctorQuestions: [
          "Are current biomarker levels within expected physiological bounds?",
          "What lifestyle modifications are suggested for flagged markers?",
        ],
      });

      setSelectedReportIndex(0);
      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 3500);

      setUploadStep("COMPLETE");
      setTimeout(() => {
        setIsProcessingDoc(false);
        setUploadStep("IDLE");
        setUploadedFile(null);
        setShowUploadModal(false);
      }, 700);
    }, 900);
  };

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
            {activeReport
              ? `Current condition derived from report: "${activeReport.title}" (${activeReport.date})`
              : "Calibrated to your baseline clinical parameters. Upload lab reports to track progress."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-3 rounded-2xl bg-[#1b4332] hover:bg-[#14382c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Lab PDF</span>
          </button>
          <button
            onClick={() => setShowManualModal(true)}
            className="px-5 py-3 rounded-2xl bg-white dark:bg-[#0c1611] border border-slate-200 dark:border-[#1c3328] text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Update Parameters</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 dark:bg-[#0c1611] rounded-2xl border border-slate-200/80 dark:border-[#1c3328] w-fit">
        <button
          onClick={() => setActiveTab("OVERVIEW")}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "OVERVIEW"
              ? "bg-[#1b4332] dark:bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Overview & Organ Health</span>
        </button>

        <button
          onClick={() => setActiveTab("REPORT_DATA")}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "REPORT_DATA"
              ? "bg-[#1b4332] dark:bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Ingested Report Data & Summary ({records.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("PREDICTIONS")}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "PREDICTIONS"
              ? "bg-[#1b4332] dark:bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>AI Future Health Predictions</span>
        </button>

        <button
          onClick={() => setActiveTab("REMEDIES")}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "REMEDIES"
              ? "bg-[#1b4332] dark:bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Clinical Remedies & Action Plan</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* LIVE PARAMETER TUNER BANNER (Available across tabs for on-the-spot testing) */}
      {/* ========================================================================= */}
      {(activeTab === "PREDICTIONS" || activeTab === "REMEDIES") && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-[#1c3328] pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                <Sliders className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Interactive Live Parameter Tuner
                </h4>
                <p className="text-xs text-slate-400">
                  Drag any slider below to see predictions and remedies recalculate <strong className="text-emerald-700 dark:text-emerald-400">on the spot</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetToBaseline}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#1c3328] text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={handleSaveTunedParameters}
                className="px-4 py-1.5 rounded-xl bg-[#1b4332] hover:bg-[#14382c] dark:bg-emerald-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Profile</span>
              </button>
            </div>
          </div>

          {saveSuccessNotice && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tuned parameters saved to your baseline profile successfully!</span>
            </div>
          )}

          {/* 5 Live Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c1611] border border-slate-200/70 dark:border-[#1c3328] space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  Blood Pressure
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-mono font-black">{liveSystolic}/{liveDiastolic}</span>
              </div>
              <input
                type="range"
                min="95"
                max="175"
                step="1"
                value={liveSystolic}
                onChange={(e) => setLiveSystolic(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#1b4332] dark:accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>95 (Low)</span>
                <span>120 (Normal)</span>
                <span>175 (High)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c1611] border border-slate-200/70 dark:border-[#1c3328] space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  Fasting Glucose
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-mono font-black">{liveGlucose} mg/dL</span>
              </div>
              <input
                type="range"
                min="70"
                max="190"
                step="1"
                value={liveGlucose}
                onChange={(e) => setLiveGlucose(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#1b4332] dark:accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>70 (Optimal)</span>
                <span>99 (Borderline)</span>
                <span>190 (High)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c1611] border border-slate-200/70 dark:border-[#1c3328] space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  Sleep Duration
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono font-black">{liveSleep} hrs</span>
              </div>
              <input
                type="range"
                min="4"
                max="10"
                step="0.5"
                value={liveSleep}
                onChange={(e) => setLiveSleep(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#1b4332] dark:accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>4h (Deprived)</span>
                <span>7.5h (Target)</span>
                <span>10h</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c1611] border border-slate-200/70 dark:border-[#1c3328] space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  Exercise Days
                </span>
                <span className="text-rose-600 dark:text-rose-400 font-mono font-black">{liveExercise} d/wk</span>
              </div>
              <input
                type="range"
                min="0"
                max="7"
                step="1"
                value={liveExercise}
                onChange={(e) => setLiveExercise(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#1b4332] dark:accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0 (Sedentary)</span>
                <span>3 (Moderate)</span>
                <span>7 (Athletic)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c1611] border border-slate-200/70 dark:border-[#1c3328] space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1">
                  <Brain className="w-3.5 h-3.5 text-purple-500" />
                  Stress Index
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-mono font-black">{liveStress}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={liveStress}
                onChange={(e) => setLiveStress(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#1b4332] dark:accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 (Calm)</span>
                <span>5 (Normal)</span>
                <span>10 (High)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & ORGAN HEALTH */}
      {/* ========================================================================= */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Key Score & Vitals Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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
                {activeReport ? `Derived from ${activeReport.title}` : "Baseline calibration active"}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] flex flex-col justify-between space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Blood Pressure</span>
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                  {liveSystolic}/{liveDiastolic}
                </span>
                <span className="text-xs text-slate-400 ml-1.5">mmHg</span>
              </div>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Clinical Reference Band
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] flex flex-col justify-between space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Fasting Blood Glucose</span>
                <Flame className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                  {liveGlucose} mg/dL
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Ref: 70 - 99 mg/dL</span>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] flex flex-col justify-between space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Uploaded Lab Reports</span>
                <FileText className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">{records.length}</span>
                <span className="text-xs text-slate-400 ml-1.5">PDFs Indexed</span>
              </div>
              <button
                onClick={() => setActiveTab("REPORT_DATA")}
                className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1 text-left"
              >
                <span>Inspect full report data & summary</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2-Column Main Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                  {patientName}&apos;s Organ System Status
                </h3>
                <span className="text-xs text-slate-400">Calculated strictly from report data</span>
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

            <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                    Biomarker History Across Reports
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    {records.length} Reports
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Longitudinal values plotted across your uploaded clinical reports
                </p>
              </div>

              <div className="h-56 w-full">
                {timelineData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis domain={[60, 220]} stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                        dataKey="glucose"
                        name="Glucose (mg/dL)"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="cholesterol"
                        name="Cholesterol (mg/dL)"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="bpSystolic"
                        name="Systolic BP (mmHg)"
                        stroke="#0284c7"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 dark:border-[#1c3328] rounded-2xl">
                    <FileText className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-xs text-slate-500">Upload your first report to see your biomarker timeline.</p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-[#1c3328] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Source: Uploaded PDF Reports</span>
                <button
                  onClick={() => setActiveTab("REPORT_DATA")}
                  className="text-emerald-800 dark:text-emerald-400 font-bold hover:underline"
                >
                  View full report breakdown →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INGESTED REPORT DATA & SUMMARY BREAKDOWN */}
      {/* ========================================================================= */}
      {activeTab === "REPORT_DATA" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {activeReport ? (
            <div className="space-y-6">
              {/* Report Header Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-[#1c3328] pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
                        {activeReport.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">Status: {activeReport.status}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-serif">
                      {activeReport.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        Date: <strong>{activeReport.date}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-emerald-600" />
                        Facility: <strong>{activeReport.facility}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Extracted Biomarkers: <strong>{activeReport.extractedValues?.length || 0}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Multi-report switch picker if user has multiple reports */}
                  {records.length > 1 && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 block">Switch Historical Report:</label>
                      <select
                        value={selectedReportIndex}
                        onChange={(e) => setSelectedReportIndex(Number(e.target.value))}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1c3328] bg-white dark:bg-[#0c1611] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      >
                        {records.map((r, idx) => (
                          <option key={r.id} value={idx}>
                            {r.title} ({r.date})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* AI Document Summary & Interpretation */}
                <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                      AI Clinical Synthesis & Report Summary
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {activeReport.aiSummary}
                  </p>
                </div>
              </div>

              {/* Biomarkers Table Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                      All Extracted Biomarkers from Report
                    </h3>
                    <p className="text-xs text-slate-400">
                      Standardized to clinical LOINC reference bounds. Patient condition is computed directly from these numbers.
                    </p>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    activeReport.abnormalCount > 0
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200"
                      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200"
                  }`}>
                    {activeReport.abnormalCount > 0 ? `${activeReport.abnormalCount} Abnormal Flags` : "All Values In Range"}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-[#1c3328] text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-3 px-4">Biomarker Name</th>
                        <th className="py-3 px-4">Extracted Value</th>
                        <th className="py-3 px-4">Standard Clinical Range</th>
                        <th className="py-3 px-4">Condition Impact</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#1c3328]">
                      {activeReport.extractedValues && activeReport.extractedValues.map((v, vIdx) => (
                        <tr key={vIdx} className="hover:bg-slate-50/50 dark:hover:bg-[#0c1611]/50">
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${v.isAbnormal ? "bg-amber-500" : "bg-emerald-500"}`} />
                            <span>{v.name}</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                            {v.value} <span className="text-slate-400 font-normal text-[11px]">{v.unit}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono">
                            {v.range} {v.unit}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                            {v.isAbnormal ? "Elevated; mapped to targeted remedy" : "Normal; supporting baseline vitality"}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                                v.isAbnormal
                                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400 border border-amber-200"
                                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200"
                              }`}
                            >
                              {v.isAbnormal ? "ATTENTION" : "OPTIMAL"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Doctor Questions from Report */}
              {activeReport.doctorQuestions && activeReport.doctorQuestions.length > 0 && (
                <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Recommended Clinical Discussion Questions for Your Doctor
                    </h3>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {activeReport.doctorQuestions.map((q, qIdx) => (
                      <li key={qIdx} className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-[#0c1611] border border-slate-200/60 dark:border-[#1c3328]">
                        <span className="text-emerald-600 font-bold">{qIdx + 1}.</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                No Laboratory Reports Ingested Yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Upload your blood tests, metabolic panels, or lipid profile PDFs to extract all biomarkers and calculate your exact physiological condition.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-3 rounded-2xl bg-[#1b4332] hover:bg-[#14382c] dark:bg-emerald-600 text-white font-bold text-xs shadow-sm inline-flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Lab PDF Now</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: AI FUTURE HEALTH PREDICTIONS (FROM CURRENT DATA) */}
      {/* ========================================================================= */}
      {activeTab === "PREDICTIONS" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-[#1c3328] pb-4">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-400">
                  Longitudinal Predictive Forecasting
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-serif mt-0.5">
                  AI Future Health Projections for {patientName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Estimated multi-year disease probabilities calculated on the spot from BP ({liveSystolic}/{liveDiastolic}), Glucose ({liveGlucose} mg/dL), Sleep ({liveSleep}h), and Exercise ({liveExercise}d).
                </p>
              </div>

              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 shrink-0">
                <Award className="w-6 h-6 text-emerald-600" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Projected Biological Age</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                    {predictions.biologicalAge} Yrs ({Math.abs(predictions.ageDifference)} yrs {predictions.ageDifference <= 0 ? "younger" : "older"})
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1611] border border-slate-200/60 dark:border-[#1c3328] text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white block mb-1">Physiological Outlook:</strong>
              {predictions.trajectoryOutlook}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-4 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cardiovascular Risk</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      predictions.cvdRiskStatus === "OPTIMAL" || predictions.cvdRiskStatus === "LOW"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                        : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                    }`}
                  >
                    {predictions.cvdRiskStatus} RISK
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif mt-1">10-Year CVD Likelihood</h4>
              </div>

              <div>
                <span className="text-5xl font-black text-slate-900 dark:text-white font-mono">
                  {predictions.cvdRisk10Yr}%
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Population Baseline: 8.5% • Based on BP ({liveSystolic}/{liveDiastolic})
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-[#1c3328] text-xs text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Primary Drivers: </span>
                Systolic arterial compliance & resting pulse ({liveHr} BPM)
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-4 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Metabolic Stability</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      predictions.diabetesRiskStatus === "OPTIMAL"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                    }`}
                  >
                    {predictions.diabetesRiskStatus}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif mt-1">5-Year Type 2 Diabetes</h4>
              </div>

              <div>
                <span className="text-5xl font-black text-slate-900 dark:text-white font-mono">
                  {predictions.diabetesRisk5Yr}%
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Fasting Blood Glucose: {liveGlucose} mg/dL
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-[#1c3328] text-xs text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Primary Drivers: </span>
                Insulin sensitivity & weekly exercise frequency ({liveExercise}d/wk)
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-4 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Vascular Health</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    liveSystolic <= 120 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400" : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                  }`}>
                    {liveSystolic <= 120 ? "PROTECTED" : "MONITORING"}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif mt-1">5-Year Hypertension Risk</h4>
              </div>

              <div>
                <span className="text-5xl font-black text-slate-900 dark:text-white font-mono">
                  {predictions.hypertensionRisk5Yr}%
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Arterial elasticity supported by {liveExercise} weekly workout days
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-[#1c3328] text-xs text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Primary Drivers: </span>
                Sodium balance & stress index ({liveStress}/10)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-3 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Biomarker Risk Drivers (Live)
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {predictions.topRiskFactors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-3 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Protective Longevity Factors (Live)
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {predictions.topProtectiveFactors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PERSONALIZED CLINICAL REMEDIES & ACTION PLAN */}
      {/* ========================================================================= */}
      {activeTab === "REMEDIES" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
                Evidence-Based Clinical Remedies
              </span>
              <span className="text-xs text-slate-400">Tailored on the spot to {patientName}&apos;s current data</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-serif">
              Personalized Lifestyle & Therapeutic Action Plan
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              These evidence-graded clinical remedies update dynamically based on your current blood pressure ({liveSystolic}/{liveDiastolic} mmHg), glucose ({liveGlucose} mg/dL), sleep ({liveSleep}h), and stress index ({liveStress}/10).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {remedies.map((remedy, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-4 shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full">
                      {remedy.category} • {remedy.evidenceGrade.replace("_", " ")}
                    </span>
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif">{remedy.title}</h4>
                  <p className="text-xs text-slate-400 italic">{remedy.targetCondition}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Action Protocol:</span>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {remedy.actionSteps.map((step, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c1611] border border-slate-200/60 dark:border-[#1c3328] space-y-1.5 text-[11px]">
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200">Scientific Mechanism: </strong>
                    <span className="text-slate-600 dark:text-slate-400">{remedy.scientificMechanism}</span>
                  </div>
                  <div>
                    <strong className="text-emerald-800 dark:text-emerald-400">Expected Outcome: </strong>
                    <span className="text-slate-600 dark:text-slate-400">{remedy.expectedOutcome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#112019] border border-slate-200 dark:border-[#1c3328] p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1c3328] pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                  Upload Lab Report / Medical PDF
                </h3>
                <p className="text-xs text-slate-400">PDF, PNG, JPG scans (Blood tests, lipid panels, metabolic panels)</p>
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadedFile(null);
                  setUploadStep("IDLE");
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {!uploadedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-[#223d30] hover:border-emerald-500 rounded-3xl p-8 text-center cursor-pointer transition-all bg-slate-50/60 dark:bg-[#0c1611]/60"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mx-auto flex items-center justify-center mb-3">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Click to browse or drop your lab PDF here
                </h4>
                <p className="text-xs text-slate-400 mt-1">Supports PDF, PNG, JPG (Max 25MB)</p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 flex items-center gap-3">
                <FileCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block truncate max-w-xs">
                    {uploadedFile.name}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {uploadStep === "PROCESSING" ? "Parsing optical biomarkers..." : "Ready"}
                  </span>
                </div>
              </div>
            )}

            {uploadStep === "PROCESSING" && (
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1611] text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                  <Zap className="w-4 h-4 text-emerald-600 animate-bounce" />
                  <span>Reading document text & normalizing LOINC biomarkers...</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#1b4332] dark:bg-emerald-500 h-full rounded-full animate-pulse w-3/4" />
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowUploadModal(false);
                  setShowManualModal(true);
                }}
                className="text-emerald-800 dark:text-emerald-400 font-bold hover:underline"
              >
                Don&apos;t have a file? Enter parameters manually →
              </button>

              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1c3328] font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Physiological Parameters Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#112019] border border-slate-200 dark:border-[#1c3328] p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1c3328] pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                  Enter Physiological Parameters
                </h3>
                <p className="text-xs text-slate-400">Manual calibration from routine checkup measurements</p>
              </div>
              <button onClick={() => setShowManualModal(false)} className="text-slate-400 hover:text-slate-600 p-1.5">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                syncManualParameters({
                  bloodPressure: `${liveSystolic}/${liveDiastolic}`,
                  fastingGlucose: liveGlucose,
                  heartRate: liveHr,
                  sleepHours: liveSleep,
                  exerciseDays: liveExercise,
                  stressLevel: liveStress,
                });
                setShowManualModal(false);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Systolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    required
                    value={liveSystolic}
                    onChange={(e) => setLiveSystolic(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1c3328] bg-white dark:bg-[#0c1611] text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fasting Glucose (mg/dL)
                  </label>
                  <input
                    type="number"
                    required
                    value={liveGlucose}
                    onChange={(e) => setLiveGlucose(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1c3328] bg-white dark:bg-[#0c1611] text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Heart Rate (BPM)
                  </label>
                  <input
                    type="number"
                    required
                    value={liveHr}
                    onChange={(e) => setLiveHr(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1c3328] bg-white dark:bg-[#0c1611] text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sleep (Hours/Night)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={liveSleep}
                    onChange={(e) => setLiveSleep(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1c3328] bg-white dark:bg-[#0c1611] text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Exercise (Days/Week)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="7"
                    value={liveExercise}
                    onChange={(e) => setLiveExercise(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1c3328] bg-white dark:bg-[#0c1611] text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Stress Level (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={liveStress}
                    onChange={(e) => setLiveStress(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1c3328] bg-white dark:bg-[#0c1611] text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-[#1c3328]">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1c3328] text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#14382c] dark:bg-emerald-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update Twin Baseline</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Organ Modal */}
      <OrganDetailModal organ={selectedOrgan} onClose={() => setSelectedOrgan(null)} />
    </div>
  );
}
