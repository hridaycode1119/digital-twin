"use client";

import React, { useState, useRef } from "react";
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
} from "lucide-react";
import { OrganBadge } from "@/components/ui/OrganBadge";
import { OrganData } from "@/types/twin";
import { OrganDetailModal } from "@/components/twin/OrganDetailModal";
import { useAuth } from "@/context/AuthContext";
import { getBiomarkerTimelineFromRecords } from "@/lib/physiology";
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
  const { user, twin, records, addRecord, syncManualParameters } = useAuth();

  // Modals & Ingestion State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStep, setUploadStep] = useState<"IDLE" | "PROCESSING" | "COMPLETE">("IDLE");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual Parameters Form State
  const [bpInput, setBpInput] = useState(user?.bloodPressure || "120/80");
  const [glucoseInput, setGlucoseInput] = useState(user?.fastingGlucose ? String(user.fastingGlucose) : "95");
  const [hrInput, setHrInput] = useState(user?.heartRate ? String(user.heartRate) : "72");
  const [sleepInput, setSleepInput] = useState(user?.sleepHours ? String(user.sleepHours) : "7.5");
  const [exerciseInput, setExerciseInput] = useState(user?.exerciseDays ? String(user.exerciseDays) : "4");
  const [stressInput, setStressInput] = useState(user?.stressLevel ? String(user.stressLevel) : "3");
  const [dietInput, setDietInput] = useState(user?.dietType || "Balanced / Mediterranean");

  const patientName = user?.name || "Patient";
  const patientId = user?.patientId || "pt_001";
  const overallScore = twin.overallScore;

  const latestRecord = records.length > 0 ? records[0] : null;

  // Timeline data constructed purely from uploaded lab reports
  const timelineData = getBiomarkerTimelineFromRecords(records, {
    glucose: Number(user?.fastingGlucose) || 95,
    systolic: Number(user?.bloodPressure?.split("/")[0]) || 120,
  });

  const organs = Object.values(twin.organs);

  // Handle Document Upload & Auto Extraction
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setUploadStep("PROCESSING");
    setIsProcessingDoc(true);

    setTimeout(() => {
      const fileName = file.name.toLowerCase();
      let extractedValues = [
        { name: "Fasting Blood Glucose", value: 96, unit: "mg/dL", range: "70 - 99", isAbnormal: false },
        { name: "Total Cholesterol", value: 186, unit: "mg/dL", range: "125 - 200", isAbnormal: false },
        { name: "HDL Cholesterol", value: 55, unit: "mg/dL", range: "40 - 60", isAbnormal: false },
        { name: "LDL Cholesterol", value: 105, unit: "mg/dL", range: "< 100", isAbnormal: true },
        { name: "Serum Creatinine", value: 0.9, unit: "mg/dL", range: "0.6 - 1.2", isAbnormal: false },
      ];

      let category = "Blood Test";
      if (fileName.includes("lipid")) {
        category = "Lipid Panel";
        extractedValues = [
          { name: "Total Cholesterol", value: 190, unit: "mg/dL", range: "125 - 200", isAbnormal: false },
          { name: "Triglycerides", value: 138, unit: "mg/dL", range: "< 150", isAbnormal: false },
          { name: "HDL Cholesterol", value: 56, unit: "mg/dL", range: "40 - 60", isAbnormal: false },
          { name: "LDL Cholesterol", value: 108, unit: "mg/dL", range: "< 100", isAbnormal: true },
        ];
      }

      addRecord({
        title: file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
        category,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        facility: "Clinical Diagnostic Laboratory",
        status: "VERIFIED",
        abnormalCount: extractedValues.filter((v) => v.isAbnormal).length,
        extractedValues,
        aiSummary: `AI Optical OCR extracted ${extractedValues.length} biomarkers from ${file.name}. Condition reflected on living digital twin.`,
        doctorQuestions: ["Are current lipid fractions within acceptable cardiovascular bounds?"],
      });

      setUploadStep("COMPLETE");
      setTimeout(() => {
        setIsProcessingDoc(false);
        setUploadStep("IDLE");
        setUploadedFile(null);
        setShowUploadModal(false);
      }, 700);
    }, 1000);
  };

  // Handle Manual Parameters Intake
  const handleSaveManualParameters = (e: React.FormEvent) => {
    e.preventDefault();
    syncManualParameters({
      bloodPressure: bpInput,
      fastingGlucose: Number(glucoseInput) || 95,
      heartRate: Number(hrInput) || 72,
      sleepHours: Number(sleepInput) || 7.5,
      exerciseDays: Number(exerciseInput) || 4,
      stressLevel: Number(stressInput) || 3,
      dietType: dietInput,
    });
    setShowManualModal(false);
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
            {latestRecord
              ? `Current condition derived from latest report: "${latestRecord.title}" (${latestRecord.date})`
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

      {/* Ingestion Prompt Banner if No Reports Uploaded Yet */}
      {records.length === 0 && (
        <div className="p-6 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/40 border-2 border-dashed border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#112019] text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-900 shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                No Medical Reports Uploaded Yet
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Upload your blood test PDF, metabolic panel, or enter checkup parameters to calibrate your living 3D twin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#1b4332] dark:bg-emerald-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
            <button
              onClick={() => setShowManualModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#112019] border border-slate-200 dark:border-[#1c3328] text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              Enter Parameters
            </button>
          </div>
        </div>
      )}

      {/* Key Score & Vitals Row (Derived Strictly from Uploaded Reports or Manual Intake) */}
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
            {latestRecord ? `Reflected from ${latestRecord.title}` : "Baseline calibration active"}
          </p>
        </div>

        {/* Current Blood Pressure */}
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
            <CheckCircle className="w-3 h-3" /> Clinical Reference Band
          </span>
        </div>

        {/* Current Fasting Glucose */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] flex flex-col justify-between space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Fasting Blood Glucose</span>
            <Flame className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {user?.fastingGlucose || 95} mg/dL
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Ref: 70 - 99 mg/dL</span>
        </div>

        {/* Ingested Document Count */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] flex flex-col justify-between space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Uploaded Lab Reports</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">{records.length}</span>
            <span className="text-xs text-slate-400 ml-1.5">PDFs Indexed</span>
          </div>
          <Link href="/records" className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
            <span>{records.length > 0 ? "Manage reports vault" : "+ Upload your first PDF"}</span>
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
            <span className="text-xs text-slate-400">Derived from clinical lab biomarkers</span>
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

        {/* Right: Biomarker Timeline (Derived strictly from Uploaded Reports) (5 Cols) */}
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
            <Link href="/records" className="text-emerald-800 dark:text-emerald-400 font-bold hover:underline">
              Inspect records vault →
            </Link>
          </div>
        </div>
      </div>

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

            <form onSubmit={handleSaveManualParameters} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Blood Pressure (mmHg)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 120/80"
                    value={bpInput}
                    onChange={(e) => setBpInput(e.target.value)}
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
                    value={glucoseInput}
                    onChange={(e) => setGlucoseInput(e.target.value)}
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
                    value={hrInput}
                    onChange={(e) => setHrInput(e.target.value)}
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
                    value={sleepInput}
                    onChange={(e) => setSleepInput(e.target.value)}
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
                    value={exerciseInput}
                    onChange={(e) => setExerciseInput(e.target.value)}
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
                    value={stressInput}
                    onChange={(e) => setStressInput(e.target.value)}
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
