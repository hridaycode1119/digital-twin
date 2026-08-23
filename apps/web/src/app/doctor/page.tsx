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
  Stethoscope,
  CheckCircle2,
} from "lucide-react";
import { OrganBadge } from "@/components/ui/OrganBadge";
import { useAuth } from "@/context/AuthContext";

export default function DoctorReviewPage() {
  const { user, twin } = useAuth();
  const [selectedPatientId, setSelectedPatientId] = useState<string>(user?.patientId || "pt_primary");
  const [physicianNote, setPhysicianNote] = useState<string>(
    `Patient exhibits balanced physiological parameters (BP ${user?.bloodPressure || "120/80"}, Glucose ${user?.fastingGlucose || 95} mg/dL). Continued aerobic conditioning and routine follow-up recommended.`
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const patientName = user?.name || "Patient";
  const patientId = user?.patientId || "pt_primary";
  const score = twin.overallScore;
  const organs = Object.values(twin.organs);

  const handleSaveDirective = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 600);
  };

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8 transition-colors duration-300">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
              Clinician Review Studio
            </span>
            <span className="text-xs text-slate-400 font-mono">Dr. Sarah Jenkins, MD (Attending)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-serif">
            Physician Governance & Care Directives
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Review patient digital twins, override machine learning risk scores, and publish signed FHIR care plans.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs font-bold text-emerald-800 dark:text-emerald-300">
          <Stethoscope className="w-4 h-4 text-emerald-600" />
          <span>FHIR HL7 Synchronized</span>
        </div>
      </div>

      {/* Main Split Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Patient Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Patient Registry (1)
          </h3>

          <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/30 border-2 border-emerald-600/70 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                  ID: #{patientId}
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">{patientName}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.age || 26} yrs • {user?.gender || "Male"} • Blood Type: {user?.bloodGroup || "B+"}
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">{score}</span>
                <span className="text-xs text-slate-400">/100</span>
                <span className="block text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Optimal</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-emerald-200/60 dark:border-[#1c3328] text-xs">
              <div className="p-3 rounded-2xl bg-white dark:bg-[#112019] border border-slate-200/70 dark:border-[#1c3328]">
                <span className="text-slate-400 text-[10px] block">Blood Pressure</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{user?.bloodPressure || "120/80"}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-[#112019] border border-slate-200/70 dark:border-[#1c3328]">
                <span className="text-slate-400 text-[10px] block">Fasting Glucose</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{user?.fastingGlucose || 95} mg/dL</span>
              </div>
            </div>
          </div>

          {/* Organ Vitality Breakdown for Doctor */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-3 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Multiorgan Homeostasis Telemetry
            </h4>

            <div className="space-y-2.5">
              {organs.map((organ) => (
                <div key={organ.id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1611]">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{organ.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{organ.score}/100</span>
                    <OrganBadge status={organ.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Physician Directive Form & Signing (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-6 shadow-2xs">
          <div className="border-b border-slate-100 dark:border-[#1c3328] pb-4">
            <span className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-400">
              Clinical Directive Studio
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 font-serif">
              Publish Signed Physician Plan for {patientName}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Directives written here sync immediately to the patient&apos;s digital twin and mobile dashboard.
            </p>
          </div>

          <form onSubmit={handleSaveDirective} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Clinical Note & Lifestyle Prescription
              </label>
              <textarea
                rows={5}
                required
                value={physicianNote}
                onChange={(e) => setPhysicianNote(e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-[#1c3328] bg-white dark:bg-[#0c1611] text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1611] border border-slate-200/60 dark:border-[#1c3328] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Cryptographic Signature: Dr. Sarah Jenkins (NPI #198273645)
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">TLS 1.3 Verified</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              {isSaved && (
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" /> Directive signed and synced to live twin!
                </span>
              )}
              {!isSaved && <div />}

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 rounded-2xl bg-[#1b4332] hover:bg-[#14382c] dark:bg-emerald-600 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Publishing Directive..." : "Sign & Publish Directive"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
