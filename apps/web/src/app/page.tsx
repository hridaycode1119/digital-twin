"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  LayoutGrid,
  FileText,
  TrendingUp,
  HeartHandshake,
  Calendar,
  Plus,
  ShieldCheck,
  BrainCircuit,
  Users,
  LineChart,
  ChevronRight,
  Activity,
  Zap,
  Layers,
  Clock,
  CheckCircle2,
  Sliders,
  Stethoscope,
  Microscope,
} from "lucide-react";
import { HumanBodyCanvas } from "@/components/twin/HumanBodyCanvas";
import { OrganDetailModal } from "@/components/twin/OrganDetailModal";
import { StatCard } from "@/components/ui/StatCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { OrganData } from "@/types/twin";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const [selectedOrgan, setSelectedOrgan] = useState<OrganData | null>(null);
  const [activeLayer, setActiveLayer] = useState<"ALL" | "CARDIO" | "METABOLIC" | "PULMONARY">("ALL");
  const { isLoggedIn } = useAuth();

  // Interactive mini-simulator preview state
  const [simCardio, setSimCardio] = useState(30);

  return (
    <div className="w-full space-y-20 pb-16 bg-grid-pattern">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 pb-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Live Biometric Telemetry Ticker */}
          <div className="flex justify-center sm:justify-start mb-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-xs backdrop-blur-md"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-700">
                  Telemetry Active
                </span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-600">
                <Activity className="w-3.5 h-3.5 text-rose-500" />
                <span>74 BPM</span>
              </div>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="hidden sm:inline text-[11px] font-mono text-slate-500">
                SpO2 99% • Sinus Rhythm
              </span>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[580px]">
            {/* Left Hero Content (5 Cols) */}
            <ScrollReveal direction="right" duration={0.65} className="lg:col-span-5 space-y-6 z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-50 border border-sky-200/80 text-sky-800 text-xs font-semibold">
                <Microscope className="w-3.5 h-3.5 text-sky-600" />
                <span>Predictive Virtual Patient Architecture</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-1.5">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08]">
                  Continuous Physiology.
                </h1>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-sky-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent leading-[1.08]">
                  Reimagined as a Living Twin.
                </h1>
              </div>

              {/* Editorial Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-lg">
                Your body generates millions of biochemical signals every day. TwinHealth synthesizes raw lab diagnostics, continuous wearable streams, and predictive ML into an interactive 3D virtual patient.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={isLoggedIn ? "/dashboard" : "/signup"}
                    className="px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg shadow-slate-900/20 shadow-tactile transition-all flex items-center gap-2.5 group"
                  >
                    <span>{isLoggedIn ? "Open Patient Dashboard" : "Calibrate Your Digital Twin"}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-sky-400" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}>
                  <a
                    href="#platform"
                    className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 font-bold text-sm shadow-subtle-card transition-all flex items-center gap-2"
                  >
                    <LayoutGrid className="w-4 h-4 text-slate-500" />
                    <span>Explore Platform</span>
                  </a>
                </motion.div>
              </div>

              {/* Security & Compliance Highlights */}
              <div className="pt-2 flex items-center gap-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  HIPAA & DPDP Ready
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <BrainCircuit className="w-4 h-4 text-sky-600" />
                  SHAP Explainable AI
                </span>
              </div>
            </ScrollReveal>

            {/* Right Hero 3D Digital Twin Visualizer (7 Cols) */}
            <ScrollReveal direction="left" delay={0.15} duration={0.7} className="lg:col-span-7 relative flex flex-col items-center justify-center min-h-[580px]">
              {/* Biological Focus Layer Selector */}
              <div className="mb-2 z-20 flex items-center gap-1 p-1 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs">
                {(["ALL", "CARDIO", "METABOLIC", "PULMONARY"] as const).map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setActiveLayer(layer)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                      activeLayer === layer
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {layer === "ALL" ? "All Systems" : layer.charAt(0) + layer.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              <HumanBodyCanvas
                onSelectOrgan={(organ) => setSelectedOrgan(organ)}
                selectedOrganId={selectedOrgan?.id}
                className="w-full max-w-[680px]"
              />
            </ScrollReveal>
          </div>

          {/* 2. STAT CARDS ROW (With Smooth Animated Counters) */}
          <ScrollReveal direction="up" delay={0.2} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
            {/* Card 1: Reports Uploaded */}
            <StatCard
              icon={FileText}
              iconColor="text-sky-600"
              iconBg="bg-sky-50"
              value={24}
              label="Reports Ingested"
              actionText="View all"
              actionHref="/records"
            />

            {/* Card 2: Health Score */}
            <StatCard
              icon={TrendingUp}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-50"
              value={87}
              label="Twin Vitality Index"
              badge={
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Optimal
                </span>
              }
              actionText="Inspect breakdown"
              actionHref="/dashboard"
            />

            {/* Card 3: Risk Alerts */}
            <StatCard
              icon={HeartHandshake}
              iconColor="text-amber-600"
              iconBg="bg-amber-50"
              value={3}
              label="Preventive Flags"
              actionText="View drivers"
              actionHref="/predictions"
            />

            {/* Card 4: Upcoming Checkups */}
            <StatCard
              icon={Calendar}
              iconColor="text-indigo-600"
              iconBg="bg-indigo-50"
              value={2}
              label="Doctor Appointments"
              subtext="Next: Sep 14"
              actionText="View schedule"
              actionHref="/dashboard"
            />

            {/* Card 5: More Features */}
            <StatCard
              icon={Plus}
              iconColor="text-slate-400"
              iconBg="bg-slate-100"
              value="+"
              label="Genomic Profile"
              subtext="Sequencing V2"
              isDashed
            />
          </ScrollReveal>
        </div>
      </section>

      {/* 3. EDITORIAL BENTO GRID PLATFORM SHOWCASE (#platform) */}
      <section id="platform" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Multi-Tier Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How the Virtual Patient Engine Operates
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Bridging fragmented electronic health records with real-time biometric telemetry and transparent predictive artificial intelligence.
          </p>
        </ScrollReveal>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Item 1 (Span 2 Cols): AI Medical OCR & Extraction */}
          <ScrollReveal direction="up" delay={0.1} className="md:col-span-2 glass-card rounded-3xl p-7 flex flex-col justify-between group hover:border-sky-300 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-xs">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  OCR Accuracy: 98.4%
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">AI Medical Report Extraction & Normalization</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Automatically parses unstructured PDF lab reports, prescriptions, and metabolic panels. Normalizes LOINC biomarkers and flags deviations against clinical reference standards.
                </p>
              </div>

              {/* Interactive Mini-Biomarker Widget Preview */}
              <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Extracted Biomarker Panel (Recent CMP)</span>
                  <span className="text-sky-600 text-[11px]">8 Parameters Parsed</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
                    <span className="text-[11px] text-slate-500 block truncate">Fasting Glucose</span>
                    <span className="font-bold text-amber-700 text-sm">108 mg/dL</span>
                    <span className="text-[10px] text-amber-600 block mt-0.5">⚠️ Mild Pre-diabetic</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
                    <span className="text-[11px] text-slate-500 block truncate">Total Cholesterol</span>
                    <span className="font-bold text-slate-900 text-sm">208 mg/dL</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Ref: &lt; 200</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
                    <span className="text-[11px] text-slate-500 block truncate">eGFR (Filtration)</span>
                    <span className="font-bold text-emerald-700 text-sm">108 mL/min</span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">✓ Optimal Function</span>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/records" className="mt-5 flex items-center text-xs font-bold text-sky-600 group-hover:text-sky-700">
              <span>Explore Medical Document Vault</span>
              <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </ScrollReveal>

          {/* Bento Item 2 (Span 1 Col): Explainable SHAP XAI */}
          <ScrollReveal direction="up" delay={0.15} className="glass-card rounded-3xl p-7 flex flex-col justify-between group hover:border-indigo-300 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Explainable AI & SHAP Attribution</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Every disease risk forecast is fully transparent. Waterfall charts show exactly how each biomarker pushes the risk calculation up or down.
                </p>
              </div>

              {/* Mini Waterfall Preview */}
              <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-700">
                  <span>CVD Risk Drivers</span>
                  <span className="text-indigo-600">14.2% (10-Yr)</span>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <div>
                    <div className="flex justify-between text-slate-600">
                      <span>Systolic BP (+4.8%)</span>
                      <span className="text-rose-600 font-bold">+0.048</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-600">
                      <span>Non-Smoker (-6.2%)</span>
                      <span className="text-emerald-600 font-bold">-0.062</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: "80%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/predictions" className="mt-5 flex items-center text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
              <span>View Predictive Risk Models</span>
              <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </ScrollReveal>

          {/* Bento Item 3 (Span 1 Col): Future Health What-If Simulator */}
          <ScrollReveal direction="up" delay={0.2} className="glass-card rounded-3xl p-7 flex flex-col justify-between group hover:border-amber-300 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Future Health Simulator</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Interactive dynamic physiology sandbox. Simulate lifestyle modifications and project 12-month organ trajectory outcomes.
                </p>
              </div>

              {/* Interactive Mini Slider Preview */}
              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-amber-900">
                  <span>Weekly Cardio: {simCardio} min/day</span>
                  <span className="text-emerald-700 font-extrabold">+{(simCardio * 0.15).toFixed(1)} pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={simCardio}
                  onChange={(e) => setSimCardio(Number(e.target.value))}
                  className="w-full h-1.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <p className="text-[10px] text-amber-800">
                  Projected CVD Risk: <strong className="text-slate-900">{(14.2 - simCardio * 0.08).toFixed(1)}%</strong>
                </p>
              </div>
            </div>

            <Link href="/simulator" className="mt-5 flex items-center text-xs font-bold text-amber-600 group-hover:text-amber-700">
              <span>Launch Full What-If Simulator</span>
              <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </ScrollReveal>

          {/* Bento Item 4 (Span 2 Cols): Doctor & Clinician Review Studio */}
          <ScrollReveal direction="up" delay={0.25} className="md:col-span-2 glass-card rounded-3xl p-7 flex flex-col justify-between group hover:border-teal-300 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-xs">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  Clinician Portal Enabled
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Doctor Collaboration & Clinical Notes Editor</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Seamlessly bridge the gap between patient self-monitoring and professional clinical review. Doctors can inspect multi-organ telemetry, override ML flags, and publish signed clinical care plans.
                </p>
              </div>

              {/* Clinician Card Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <h4 className="text-xs font-bold text-slate-900">FHIR / HL7 Export</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Compatible with hospital EHR databases.</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <h4 className="text-xs font-bold text-slate-900">Physician Override</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Clinician-in-the-loop diagnostic governance.</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <h4 className="text-xs font-bold text-slate-900">Signed Directives</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Directly synced to patient twin state.</p>
                </div>
              </div>
            </div>

            <Link href="/doctor" className="mt-5 flex items-center text-xs font-bold text-teal-600 group-hover:text-teal-700">
              <span>Open Doctor Review Studio</span>
              <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. FOUR-STAGE PIPELINE (#how-it-works) */}
      <section id="how-it-works" className="py-12 bg-white/70 border-y border-slate-200/80 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">The Continuous Flow</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">From Raw Vitals to Actionable Care</h2>
            <p className="text-sm text-slate-600 mt-2">
              How the Digital Twin dynamically evolves with every heartbeat, lab test, and lifestyle habit.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1} staggerChildren={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div whileHover={{ y: -5 }} className="glass-card rounded-3xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-mono font-black text-lg mx-auto flex items-center justify-center shadow-md">
                01
              </div>
              <h4 className="text-base font-bold text-slate-900">Multi-Source Ingestion</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect blood tests, CGM glucose, continuous wearable vitals, and sleep logs.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="glass-card rounded-3xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white font-mono font-black text-lg mx-auto flex items-center justify-center shadow-md">
                02
              </div>
              <h4 className="text-base font-bold text-slate-900">Biomarker Synthesis</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Extract LOINC parameters and calculate weighted organ health indices (0-100).
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="glass-card rounded-3xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-mono font-black text-lg mx-auto flex items-center justify-center shadow-md">
                03
              </div>
              <h4 className="text-base font-bold text-slate-900">3D Holographic Twin</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Render physiological status over the anatomical model with real-time bio-radar.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="glass-card rounded-3xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-mono font-black text-lg mx-auto flex items-center justify-center shadow-md">
                04
              </div>
              <h4 className="text-base font-bold text-slate-900">Predictive Action</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Forecast 10-year risks, simulate what-if lifestyle goals, and consult clinicians.
              </p>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. ACADEMIC & RESEARCH FOUNDATIONS (#about & #research) */}
      <section id="about" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div id="research" className="scroll-mt-24">
          <ScrollReveal direction="up" duration={0.65} className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200/80">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  Research & Academic Prototype
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Moving Healthcare from Reactive to Predictive & Preventive
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  TwinHealth is architected as an advanced Computer Science and AI Healthcare research prototype. By unifying electronic health records, diagnostic tests, and wearable telemetry into a stateful Digital Twin, it delivers explainable decision support for both patients and clinicians.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <span className="text-xl font-black text-slate-900 font-mono">0.88</span>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">XGBoost ROC-AUC</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <span className="text-xl font-black text-slate-900 font-mono">100%</span>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">SHAP Explainability</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <span className="text-xl font-black text-slate-900 font-mono">Zero-Trust</span>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">HIPAA Architecture</p>
                  </div>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-900 text-white text-center space-y-5 shadow-xl shadow-slate-900/20 border border-slate-800"
              >
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <BrainCircuit className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Ready to Experience Your Twin?</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                    Complete the guided calibration to generate your personalized 3D physiological avatar.
                  </p>
                </div>
                <Link
                  href="/signup"
                  className="px-6 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <span>Start Calibration</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Organ Detail Modal */}
      <OrganDetailModal organ={selectedOrgan} onClose={() => setSelectedOrgan(null)} />
    </div>
  );
}
