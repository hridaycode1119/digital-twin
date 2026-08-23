"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Activity,
  Heart,
  FileText,
  Save,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { initialPatientTwin } from "@/data/mockPatient";
import { OrganBadge } from "@/components/ui/OrganBadge";

interface PatientSummary {
  id: string;
  name: string;
  age: number;
  gender: string;
  score: number;
  riskStatus: "MODERATE" | "HIGH" | "OPTIMAL";
  lastVisit: string;
  flaggedOrgan: string;
}

const mockPatientList: PatientSummary[] = [
  {
    id: "pt_1029384",
    name: "Alex Mercer",
    age: 38,
    gender: "Male",
    score: 87,
    riskStatus: "MODERATE",
    lastVisit: "Aug 15, 2026",
    flaggedOrgan: "Heart & Pancreas (Monitoring)",
  },
  {
    id: "pt_2039485",
    name: "Elena Rostova",
    age: 52,
    gender: "Female",
    score: 72,
    riskStatus: "HIGH",
    lastVisit: "Aug 02, 2026",
    flaggedOrgan: "Cardiovascular (High Risk)",
  },
  {
    id: "pt_3049586",
    name: "Marcus Vance",
    age: 29,
    gender: "Male",
    score: 94,
    riskStatus: "OPTIMAL",
    lastVisit: "Jul 18, 2026",
    flaggedOrgan: "All Systems Optimal",
  },
];

export default function DoctorPortalPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("pt_1029384");
  const [clinicalNotes, setClinicalNotes] = useState<string>(
    "Patient exhibits borderline systolic hypertension (128 mmHg) and early pre-diabetic fasting glucose (108 mg/dL). Recommended 30 minutes of aerobic exercise 5x weekly and sodium restriction. Scheduled for a 3-month follow-up metabolic panel."
  );
  const [isSaved, setIsSaved] = useState(false);

  const selectedPatient =
    mockPatientList.find((p) => p.id === selectedPatientId) || mockPatientList[0];

  const handleSaveNotes = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Doctor Portal Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
              Clinician Review Portal
            </span>
            <span className="text-xs text-slate-400">Dr. Sarah Jenkins, MD (Cardiology)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Patient Digital Twin Review</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Review patient multi-organ telemetries, validate AI-extracted laboratory findings, and append clinical observations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            HIPAA Clinical Session Active
          </div>
        </div>
      </div>

      {/* Main Layout: Patient Directory (4 Cols) + Patient Clinical View (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient Directory */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Assigned Cohort (3)</h3>
            <span className="text-xs text-slate-400">Cardiology Clinic A</span>
          </div>

          <div className="space-y-2.5">
            {mockPatientList.map((pt) => {
              const isSelected = selectedPatientId === pt.id;
              return (
                <div
                  key={pt.id}
                  onClick={() => setSelectedPatientId(pt.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10"
                      : "glass-card hover:bg-white/90 border-slate-200/70"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{pt.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        {pt.age} yrs • {pt.gender} • ID: {pt.id}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        pt.riskStatus === "HIGH"
                          ? "bg-rose-100 text-rose-800"
                          : pt.riskStatus === "MODERATE"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {pt.riskStatus}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{pt.flaggedOrgan}</span>
                    <span className="font-bold text-blue-600">Score: {pt.score}/100</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Patient Clinical Detail & Notes */}
        <div className="lg:col-span-8 space-y-6">
          {/* Patient Header */}
          <div className="glass-card rounded-3xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase text-blue-600">Selected Patient File</span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {selectedPatient.name} ({selectedPatient.age}M)
                </h2>
                <p className="text-xs text-slate-500">
                  Last Synced: {selectedPatient.lastVisit} • Health Score:{" "}
                  <strong className="text-blue-600">{selectedPatient.score}/100</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Status: Monitoring Required
                </span>
              </div>
            </div>

            {/* Quick Organ Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Heart System</span>
                <p className="text-xs font-bold text-slate-800 mt-1">128/82 mmHg</p>
                <OrganBadge status="Monitoring" className="mt-1" />
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Pancreas</span>
                <p className="text-xs font-bold text-slate-800 mt-1">108 mg/dL</p>
                <OrganBadge status="Monitoring" className="mt-1" />
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Lungs</span>
                <p className="text-xs font-bold text-slate-800 mt-1">99% SpO2</p>
                <OrganBadge status="Good" className="mt-1" />
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Kidneys</span>
                <p className="text-xs font-bold text-slate-800 mt-1">0.88 Cr / 108 eGFR</p>
                <OrganBadge status="Normal" className="mt-1" />
              </div>
            </div>
          </div>

          {/* Clinical Notes & Prescriptions Editor */}
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Doctor Clinical Annotations & Orders
              </h3>
              <span className="text-xs text-slate-400">Appended to Patient Digital Twin</span>
            </div>

            <textarea
              rows={4}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                AI assistance: Summaries are separated from physician-signed notes.
              </span>

              <button
                onClick={handleSaveNotes}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all"
              >
                {isSaved ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    Saved to Patient Twin!
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save & Sign Notes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
