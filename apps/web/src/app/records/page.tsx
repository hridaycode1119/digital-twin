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
} from "lucide-react";

interface RecordItem {
  id: string;
  title: string;
  category: string;
  date: string;
  facility: string;
  status: "VERIFIED" | "EXTRACTED" | "PROCESSING";
  abnormalCount: number;
  extractedValues: {
    name: string;
    value: number | string;
    unit: string;
    range: string;
    isAbnormal: boolean;
  }[];
  aiSummary: string;
  doctorQuestions: string[];
}

const mockRecords: RecordItem[] = [
  {
    id: "rec_001",
    title: "Comprehensive Metabolic & Lipid Panel",
    category: "Blood Test",
    date: "Aug 15, 2026",
    facility: "Metropolis Diagnostics Lab",
    status: "VERIFIED",
    abnormalCount: 2,
    extractedValues: [
      { name: "Fasting Blood Glucose", value: 108, unit: "mg/dL", range: "70 - 99", isAbnormal: true },
      { name: "Total Cholesterol", value: 208, unit: "mg/dL", range: "125 - 200", isAbnormal: true },
      { name: "HDL Cholesterol", value: 52, unit: "mg/dL", range: "40 - 60", isAbnormal: false },
      { name: "LDL Cholesterol", value: 128, unit: "mg/dL", range: "< 100", isAbnormal: true },
      { name: "Serum Creatinine", value: 0.88, unit: "mg/dL", range: "0.6 - 1.2", isAbnormal: false },
      { name: "ALT (SGPT)", value: 22, unit: "U/L", range: "7 - 56", isAbnormal: false },
    ],
    aiSummary:
      "Metabolic panel indicates pre-diabetic fasting glucose (108 mg/dL) and borderline elevated LDL cholesterol (128 mg/dL). Kidney and liver filtration markers remain in optimal range.",
    doctorQuestions: [
      "Would a follow-up HbA1c test be recommended to establish 3-month glycemic control?",
      "Are lifestyle adjustments sufficient for borderline LDL, or is medication advised?",
    ],
  },
  {
    id: "rec_002",
    title: "12-Lead Electrocardiogram (ECG)",
    category: "Cardiology",
    date: "Jul 02, 2026",
    facility: "St. Jude Cardiology Center",
    status: "VERIFIED",
    abnormalCount: 0,
    extractedValues: [
      { name: "Resting Heart Rate", value: 74, unit: "BPM", range: "60 - 100", isAbnormal: false },
      { name: "PR Interval", value: 156, unit: "ms", range: "120 - 200", isAbnormal: false },
      { name: "QRS Duration", value: 88, unit: "ms", range: "80 - 120", isAbnormal: false },
      { name: "QTc Interval", value: 412, unit: "ms", range: "< 450", isAbnormal: false },
    ],
    aiSummary:
      "Normal sinus rhythm at 74 BPM. No ST-segment elevation, axis deviation, or conduction abnormalities detected.",
    doctorQuestions: ["Maintain routine annual cardiovascular monitoring."],
  },
  {
    id: "rec_003",
    title: "Complete Blood Count (CBC)",
    category: "Hematology",
    date: "May 20, 2026",
    facility: "City Health Clinic",
    status: "VERIFIED",
    abnormalCount: 0,
    extractedValues: [
      { name: "Hemoglobin", value: 15.2, unit: "g/dL", range: "13.5 - 17.5", isAbnormal: false },
      { name: "White Blood Cells", value: 6.8, unit: "10^3/µL", range: "4.5 - 11.0", isAbnormal: false },
      { name: "Platelets", value: 245, unit: "10^3/µL", range: "150 - 450", isAbnormal: false },
    ],
    aiSummary: "All hematological indices, red cell counts, and immune cells are in healthy ranges.",
    doctorQuestions: ["No follow-up action needed."],
  },
];

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordItem[]>(mockRecords);
  const [selectedRecord, setSelectedRecord] = useState<RecordItem>(mockRecords[0]);
  const [isUploading, setIsUploading] = useState(false);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      const newRec: RecordItem = {
        id: `rec_${Date.now()}`,
        title: "Serum Electrolytes & Thyroid Panel",
        category: "Endocrinology",
        date: "Just now",
        facility: "Uploaded Report",
        status: "EXTRACTED",
        abnormalCount: 1,
        extractedValues: [
          { name: "TSH", value: 2.45, unit: "µIU/mL", range: "0.4 - 4.0", isAbnormal: false },
          { name: "Serum Sodium", value: 140, unit: "mmol/L", range: "135 - 145", isAbnormal: false },
          { name: "Serum Potassium", value: 4.8, unit: "mmol/L", range: "3.5 - 5.0", isAbnormal: false },
          { name: "Vitamin D (25-OH)", value: 24.2, unit: "ng/mL", range: "30 - 100", isAbnormal: true },
        ],
        aiSummary: "Thyroid and electrolyte parameters are well balanced. Vitamin D is insufficient (24.2 ng/mL).",
        doctorQuestions: ["Should Vitamin D3 supplementation (e.g. 2000 IU/day) be started?"],
      };
      setRecords([newRec, ...records]);
      setSelectedRecord(newRec);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Upload Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              AI Document Ingestion
            </span>
            <span className="text-xs text-slate-400">OCR & NLP Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Medical Records Explorer</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Upload clinical lab PDFs and diagnostic scans. AI extracts normalized biomarkers and updates your Digital Twin in real-time.
          </p>
        </div>

        {/* Upload Trigger */}
        <div>
          <button
            onClick={handleSimulateUpload}
            disabled={isUploading}
            className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all hover:scale-105"
          >
            <UploadCloud className="w-4 h-4" />
            {isUploading ? "Processing OCR & AI Extraction..." : "Upload New Lab Report (PDF/Image)"}
          </button>
        </div>
      </div>

      {/* Main Grid: Records List (4 Cols) + Extracted Details (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Records List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
            <span>Uploaded Documents ({records.length})</span>
            <span className="text-xs font-normal text-slate-400">All Encrypted</span>
          </h3>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {records.map((rec) => {
              const isSelected = selectedRecord.id === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedRecord(rec)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10"
                      : "glass-card hover:bg-white/90 border-slate-200/70"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {rec.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{rec.date}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">{rec.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{rec.facility}</p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {rec.status}
                    </span>
                    {rec.abnormalCount > 0 ? (
                      <span className="text-amber-600 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {rec.abnormalCount} Abnormal
                      </span>
                    ) : (
                      <span className="text-slate-400">All Normal</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Extracted Lab Values & Clinical AI Summary */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 space-y-6">
          {/* Record Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase text-blue-600">{selectedRecord.category}</span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">{selectedRecord.title}</h2>
              <p className="text-xs text-slate-500">
                Facility: {selectedRecord.facility} • Date: {selectedRecord.date}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                OCR Status: 100% Parsed
              </span>
            </div>
          </div>

          {/* AI Plain-Language Report Summary */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              AI Clinical Report Summary
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{selectedRecord.aiSummary}</p>
          </div>

          {/* Extracted Structured Biomarkers Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-500" />
              Extracted & Normalized Biomarkers
            </h4>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold border-b border-slate-200/80">
                  <tr>
                    <th className="px-4 py-3">Biomarker Test</th>
                    <th className="px-4 py-3">Measured Value</th>
                    <th className="px-4 py-3">Standard Reference Range</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedRecord.extractedValues.map((val, idx) => (
                    <tr key={idx} className={val.isAbnormal ? "bg-amber-50/30" : ""}>
                      <td className="px-4 py-3 font-semibold text-slate-900">{val.name}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {val.value} <span className="font-normal text-slate-500">{val.unit}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{val.range} {val.unit}</td>
                      <td className="px-4 py-3">
                        {val.isAbnormal ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            <AlertTriangle className="w-3 h-3" /> Abnormal
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Suggested Questions for Doctor */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              Suggested Questions for Your Clinician
            </h4>
            <ul className="space-y-1.5">
              {selectedRecord.doctorQuestions.map((q, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
