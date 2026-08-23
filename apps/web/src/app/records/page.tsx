"use client";

import React, { useState } from "react";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Search,
  Filter,
  Eye,
  Download,
  HelpCircle,
  Activity,
  ChevronRight,
  Plus,
  Trash2,
  FileCheck,
  FolderOpen,
} from "lucide-react";
import { useAuth, UserMedicalRecord } from "@/context/AuthContext";

export default function RecordsPage() {
  const { user, records, addRecord, deleteRecord } = useAuth();
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // New Record Form State
  const [newTitle, setNewTitle] = useState("Comprehensive Blood Panel");
  const [newCategory, setNewCategory] = useState("Blood Test");
  const [newFacility, setNewFacility] = useState("Clinical Diagnostics Lab");
  const [newGlucose, setNewGlucose] = useState(user?.fastingGlucose ? String(user.fastingGlucose) : "95");
  const [newCholesterol, setNewCholesterol] = useState("185");
  const [newHdl, setNewHdl] = useState("54");
  const [newLdl, setNewLdl] = useState("110");

  const selectedRecord = records.find((r) => r.id === selectedRecordId) || records[0] || null;

  const filteredRecords = records.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateBaseline = () => {
    const fGlucose = Number(user?.fastingGlucose) || 95;
    const isGlucoseHigh = fGlucose > 100;

    addRecord({
      title: "Baseline Onboarding & Physiological Intake",
      category: "Biometric Calibration",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      facility: "Digital Twin Telemetry Core",
      status: "VERIFIED",
      abnormalCount: isGlucoseHigh ? 1 : 0,
      extractedValues: [
        {
          name: "Blood Pressure (Systolic/Diastolic)",
          value: user?.bloodPressure || "120/80",
          unit: "mmHg",
          range: "< 120/80",
          isAbnormal: Number(user?.bloodPressure?.split("/")[0]) > 125,
        },
        {
          name: "Fasting Blood Glucose",
          value: fGlucose,
          unit: "mg/dL",
          range: "70 - 99",
          isAbnormal: isGlucoseHigh,
        },
        {
          name: "Resting Heart Rate",
          value: user?.heartRate || 72,
          unit: "BPM",
          range: "60 - 80",
          isAbnormal: false,
        },
        {
          name: "Sleep Architecture",
          value: `${user?.sleepHours || 7.5} hrs`,
          unit: "",
          range: "7.0 - 9.0",
          isAbnormal: (user?.sleepHours || 7.5) < 6.5,
        },
      ],
      aiSummary: `Initial calibrated physiological profile for ${user?.name || "Patient"}. Multi-organ baseline synthesized with composite vitality score ${user?.overallScore || 88}/100.`,
      doctorQuestions: [
        "Are there any specific annual lab panels recommended for my age profile?",
        "Should we establish a continuous CGM monitoring protocol?",
      ],
    });
  };

  const handleCreateCustomRecord = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    const fGlucose = Number(newGlucose) || 95;
    const chol = Number(newCholesterol) || 185;
    const ldl = Number(newLdl) || 110;

    setTimeout(() => {
      addRecord({
        title: newTitle,
        category: newCategory,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        facility: newFacility,
        status: "VERIFIED",
        abnormalCount: (fGlucose > 100 ? 1 : 0) + (chol > 200 ? 1 : 0) + (ldl > 100 ? 1 : 0),
        extractedValues: [
          { name: "Fasting Blood Glucose", value: fGlucose, unit: "mg/dL", range: "70 - 99", isAbnormal: fGlucose > 100 },
          { name: "Total Cholesterol", value: chol, unit: "mg/dL", range: "125 - 200", isAbnormal: chol > 200 },
          { name: "HDL Cholesterol", value: Number(newHdl) || 54, unit: "mg/dL", range: "40 - 60", isAbnormal: false },
          { name: "LDL Cholesterol", value: ldl, unit: "mg/dL", range: "< 100", isAbnormal: ldl > 100 },
        ],
        aiSummary: `AI extraction parsed ${newTitle} from ${newFacility}. Key metabolic and lipid markers normalized to LOINC taxonomy.`,
        doctorQuestions: [
          "Do these lipid fractions require therapeutic lifestyle changes?",
          "When should repeat screening be scheduled?",
        ],
      });
      setIsUploading(false);
      setShowUploadModal(false);
    }, 800);
  };

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8 transition-colors duration-300">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
              Personal Record Vault
            </span>
            <span className="text-xs text-slate-400 font-mono">Patient: {user?.name} (#{user?.patientId})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-serif">
            Medical Records & AI Extraction
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Securely store clinical lab reports, imaging PDFs, and LOINC biomarker extractions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {records.length === 0 && (
            <button
              onClick={handleGenerateBaseline}
              className="px-4 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Create Baseline Record</span>
            </button>
          )}

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-3 rounded-2xl bg-[#1b4332] hover:bg-[#14382c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Report</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {records.length === 0 ? (
        /* Empty State */
        <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mx-auto flex items-center justify-center">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif">No Reports Uploaded Yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload your blood test PDF, imaging scan, or diagnostic report to automatically extract clinical biomarkers into your digital twin.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 rounded-2xl bg-[#1b4332] dark:bg-emerald-600 text-white font-bold text-xs shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Clinical Report</span>
            </button>
            <button
              onClick={handleGenerateBaseline}
              className="px-6 py-3 rounded-2xl bg-white dark:bg-[#0c1611] border border-slate-200 dark:border-[#1c3328] text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Generate Intake Baseline</span>
            </button>
          </div>
        </div>
      ) : (
        /* Records Split View (List + Details) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Records List (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by title, lab or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-[#1c3328] bg-white dark:bg-[#112019] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-3">
              {filteredRecords.map((rec) => {
                const isSelected = selectedRecord?.id === rec.id;
                return (
                  <div
                    key={rec.id}
                    onClick={() => setSelectedRecordId(rec.id)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-600/70 shadow-xs"
                        : "bg-white dark:bg-[#112019] border-slate-200/90 dark:border-[#1c3328] hover:border-emerald-500/50 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                          {rec.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">{rec.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{rec.facility} • {rec.date}</p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRecord(rec.id);
                        }}
                        title="Delete Record"
                        className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-[#1c3328]">
                      <span className="text-slate-500 dark:text-slate-400">
                        {rec.extractedValues.length} biomarkers extracted
                      </span>
                      {rec.abnormalCount > 0 ? (
                        <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {rec.abnormalCount} Flagged
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> All Optimal
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Record Details & Extraction (7 Cols) */}
          <div className="lg:col-span-7">
            {selectedRecord && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-6 shadow-2xs">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-[#1c3328] pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-400">
                      Extracted Report Summary
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 font-serif">
                      {selectedRecord.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedRecord.facility} • {selectedRecord.date}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5" /> LOINC Verified
                  </span>
                </div>

                {/* AI Summary Box */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1611] border border-slate-200/60 dark:border-[#1c3328] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>AI Clinical Interpretation</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedRecord.aiSummary}
                  </p>
                </div>

                {/* Biomarker Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Extracted Biomarkers ({selectedRecord.extractedValues.length})
                  </h4>

                  <div className="divide-y divide-slate-100 dark:divide-[#1c3328] rounded-2xl border border-slate-100 dark:border-[#1c3328] overflow-hidden">
                    {selectedRecord.extractedValues.map((bm, i) => (
                      <div key={i} className="p-3.5 bg-white dark:bg-[#112019] flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{bm.name}</span>
                          <span className="text-[11px] text-slate-400">Ref: {bm.range} {bm.unit}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black font-mono text-slate-900 dark:text-white block">
                            {bm.value} {bm.unit}
                          </span>
                          <span
                            className={`text-[10px] font-bold ${
                              bm.isAbnormal ? "text-rose-600" : "text-emerald-700 dark:text-emerald-400"
                            }`}
                          >
                            {bm.isAbnormal ? "Elevated" : "Optimal"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Questions for Doctor */}
                {selectedRecord.doctorQuestions?.length > 0 && (
                  <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900 space-y-2">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Suggested Discussion Points for Your Physician
                    </span>
                    <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      {selectedRecord.doctorQuestions.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#112019] border border-slate-200 dark:border-[#1c3328] p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1c3328] pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">Upload & Parse Clinical Report</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateCustomRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Report Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1c3328] bg-white dark:bg-[#0c1611] text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1c3328] bg-white dark:bg-[#0c1611] text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option>Blood Test</option>
                    <option>Lipid Panel</option>
                    <option>Urinalysis</option>
                    <option>ECG / Cardiac</option>
                    <option>Metabolic Panel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Diagnostic Facility</label>
                  <input
                    type="text"
                    required
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1c3328] bg-white dark:bg-[#0c1611] text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Fasting Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={newGlucose}
                    onChange={(e) => setNewGlucose(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1c3328] bg-white dark:bg-[#0c1611] text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Total Cholesterol (mg/dL)</label>
                  <input
                    type="number"
                    value={newCholesterol}
                    onChange={(e) => setNewCholesterol(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1c3328] bg-white dark:bg-[#0c1611] text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1c3328] text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-[#1b4332] hover:bg-[#14382c] dark:bg-emerald-600 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  {isUploading ? "Extracting Biomarkers..." : "Upload & Ingest"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
