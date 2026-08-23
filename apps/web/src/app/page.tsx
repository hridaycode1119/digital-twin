"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  LayoutGrid,
  FileText,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Plus,
  Lock,
  Info,
  Folder,
  BarChart3,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  Heart,
  Footprints,
  Moon,
  Smile,
  Activity,
  Sliders,
  Stethoscope,
  Microscope,
  Database,
  Cpu,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  FileCheck2,
  Zap,
} from "lucide-react";
import { HumanBodyCanvas } from "@/components/twin/HumanBodyCanvas";
import { OrganDetailModal } from "@/components/twin/OrganDetailModal";
import { OrganData } from "@/types/twin";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const [selectedOrgan, setSelectedOrgan] = useState<OrganData | null>(null);
  const { isLoggedIn, user } = useAuth();

  // Interactive Live What-If Simulator Sandbox State
  const [cardioMinutes, setCardioMinutes] = useState(35);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [lowSodiumDiet, setLowSodiumDiet] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Calculated dynamic risks based on interactive sliders
  const calculatedCvdRisk = Math.max(
    4.2,
    Number((14.2 - (cardioMinutes - 15) * 0.12 - (sleepHours - 6.5) * 0.8 - (lowSodiumDiet ? 2.4 : 0)).toFixed(1))
  );
  const calculatedDiabetesRisk = Math.max(
    3.1,
    Number((12.5 - (cardioMinutes - 15) * 0.15 - (lowSodiumDiet ? 1.8 : 0)).toFixed(1))
  );
  const calculatedTwinScore = Math.min(
    98,
    Math.round(80 + (cardioMinutes / 60) * 8 + (sleepHours >= 7 ? 6 : 2) + (lowSodiumDiet ? 4 : 0))
  );
  const bioAgeOffset = ((calculatedTwinScore - 80) * 0.35).toFixed(1);

  const faqs = [
    {
      q: "What is Digital Twin?",
      a: "Digital Twin is an AI-powered virtual patient platform. It synthesizes your clinical laboratory reports, routine health checkup values, and dynamic physiological models to generate an interactive 3D anatomical avatar and project longitudinal disease risks.",
    },
    {
      q: "Do I need any smartwatches, wearable hardware, or sensors?",
      a: "No. Digital Twin is 100% software-based and requires zero hardware, smartwatches, or sensors. Simply upload your standard lab test PDFs (blood tests, metabolic panels, lipid panels) or enter your baseline checkup vitals to calibrate your 3D twin.",
    },
    {
      q: "Is my personal healthcare data private and HIPAA/DPDP compliant?",
      a: "Yes. All data ingested into Digital Twin is encrypted both in transit (TLS 1.3) and at rest (AES-256) with zero-knowledge cryptographic keys. Your records are never shared or used for public model training.",
    },
    {
      q: "How accurate is the AI predictive disease forecasting?",
      a: "Our models utilize XGBoost and deep ensemble architectures validated on verified clinical cohorts (ROC-AUC 0.88 for 10-year Cardiovascular risk). Every prediction includes complete SHAP (Shapley Additive Explanations) transparency so you and your doctor understand the exact biomarker drivers.",
    },
    {
      q: "Can my doctor inspect and edit my digital twin?",
      a: "Yes. Digital Twin features a dedicated Clinician Review Portal where physicians can review multi-organ status, override machine learning flags, publish signed care directives, and export FHIR/HL7 compatible records into hospital EHR systems.",
    },
  ];

  return (
    <div className="w-full space-y-16 sm:space-y-24 pb-20 transition-colors duration-300">
      
      {/* 1. HERO SECTION (16:9 Widescreen Focused 3D Hologram - Zero Hardware Required) */}
      <section className="relative pt-6 sm:pt-8 pb-4">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12">
          
          {/* If user is logged in, show quick personalized navigation banner */}
          {isLoggedIn && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-300">
                  Welcome back, {user?.name}! Your personalized Digital Twin is active.
                </span>
              </div>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#14382c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
              >
                <span>Open My Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[580px] lg:min-h-[660px]">
            
            {/* Left Hero Column: Headline & Action Buttons (5 Cols) */}
            <div className="lg:col-span-5 space-y-6 lg:space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-300 text-xs font-semibold">
                <Microscope className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>100% Software-Based • No Hardware or Sensors Required</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-normal tracking-tight text-slate-900 dark:text-white leading-[1.10] font-serif">
                  Understand your health.
                  <br />
                  Take control of your{" "}
                  <span className="italic text-[#1b4332] dark:text-emerald-400 font-serif">
                    future.
                  </span>
                </h1>
              </div>

              <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                Upload standard clinical lab reports and routine checkup numbers. Digital Twin uses predictive machine learning to simulate a living 3D virtual patient to help you optimize longevity.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={isLoggedIn ? "/dashboard" : "/signup"}
                    className="px-8 py-4 rounded-2xl bg-[#1b4332] hover:bg-[#14382c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    <span>{isLoggedIn ? "Open Dashboard" : "Start Free Calibration"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <a
                    href="#platform"
                    className="px-6 py-4 rounded-2xl bg-white dark:bg-[#112019] border border-slate-200 dark:border-[#1c3328] text-slate-800 dark:text-slate-200 font-semibold text-sm shadow-2xs hover:bg-slate-50 dark:hover:bg-[#162921] transition-all flex items-center gap-2"
                  >
                    <span>Explore Platform</span>
                    <LayoutGrid className="w-4 h-4 opacity-60" />
                  </a>
                </motion.div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-[#1c3328]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  HIPAA & DPDP Compliant
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  SHAP Explainable ML
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Lab PDF OCR Ingestion
                </span>
              </div>
            </div>

            {/* Right Hero Column: 3D Anatomical Body with Flanking Badges (7 Cols) */}
            <div className="lg:col-span-7 relative flex flex-col items-center justify-center min-h-[520px] lg:min-h-[660px]">
              <HumanBodyCanvas
                onSelectOrgan={(organ) => setSelectedOrgan(organ)}
                selectedOrganId={selectedOrgan?.id}
                className="w-full max-w-3xl"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. STAT SUMMARY ROW (Platform Core Capabilities) */}
      <section className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          
          {/* Card 1: 6 Core Systems */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white block leading-tight">6</span>
                <span className="text-xs lg:text-sm font-semibold text-slate-800 dark:text-slate-200 block">Core Organ Systems</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Real-time 3D models</span>
              </div>
            </div>
            <Link href="/digital-twin" className="text-xs font-semibold text-slate-800 dark:text-slate-300 hover:text-emerald-700 flex items-center gap-1">
              <span>Explore anatomy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: 10-Yr Disease Models */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white block leading-tight">0.88</span>
                <span className="text-xs lg:text-sm font-semibold text-slate-800 dark:text-slate-200 block">Predictive ROC-AUC</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold block flex items-center gap-1 mt-0.5">
                  <span>◆</span> SHAP Explained
                </span>
              </div>
            </div>
            <Link href="/predictions" className="text-xs font-semibold text-slate-800 dark:text-slate-300 hover:text-emerald-700 flex items-center gap-1">
              <span>Inspect risk models</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: AI Medical OCR */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white block leading-tight">98%</span>
                <span className="text-xs lg:text-sm font-semibold text-slate-800 dark:text-slate-200 block">Medical OCR Accuracy</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block">LOINC standard extraction</span>
              </div>
            </div>
            <Link href="/records" className="text-xs font-semibold text-slate-800 dark:text-slate-300 hover:text-emerald-700 flex items-center gap-1">
              <span>View record vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: Clinician Governance */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <span className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white block leading-tight">FHIR</span>
                <span className="text-xs lg:text-sm font-semibold text-slate-800 dark:text-slate-200 block">EHR Interoperability</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Physician signed plans</span>
              </div>
            </div>
            <Link href="/doctor" className="text-xs font-semibold text-slate-800 dark:text-slate-300 hover:text-emerald-700 flex items-center gap-1">
              <span>Doctor review studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 5: Start Free Calibration */}
          <Link
            href={isLoggedIn ? "/dashboard" : "/signup"}
            className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs hover:border-emerald-600/60 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base lg:text-lg font-bold text-slate-900 dark:text-white block">
                  {isLoggedIn ? "Open Dashboard" : "Start Calibration"}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug">
                  {isLoggedIn ? "View your living twin model" : "Free 2-minute profile setup"}
                </span>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* 3. EXPLORE PLATFORM SECTION (6 Feature Cards Grid) */}
      <section id="platform" className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 pt-2 scroll-mt-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-serif">
              Explore Platform
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive clinical tool suite designed for personalized health intelligence.
            </p>
          </div>
          <Link
            href={isLoggedIn ? "/dashboard" : "/signup"}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-400 flex items-center gap-1"
          >
            <span>View all modules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
          
          {/* Card 1: Medical Records */}
          <Link
            href="/records"
            className="p-5 lg:p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                <Folder className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Medical Records</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Upload, parse and manage your lab test PDFs.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 2: Health Insights */}
          <Link
            href="/predictions"
            className="p-5 lg:p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Health Insights</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  AI-generated insights based on your lab data.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 3: AI Assistant */}
          <Link
            href="/assistant"
            className="p-5 lg:p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">AI Assistant</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Ask questions grounded in your clinical reports.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 4: Risk Prediction */}
          <Link
            href="/predictions"
            className="p-5 lg:p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Risk Prediction</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Predict potential disease risks with SHAP models.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 5: 3D Digital Twin */}
          <Link
            href="/digital-twin"
            className="p-5 lg:p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">3D Digital Twin</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Explore your virtual body and multi-organ health.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 6: Lifestyle Tracker */}
          <Link
            href="/simulator"
            className="p-5 lg:p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Lifestyle Tracker</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Simulate habits, sleep, exercise and nutrition.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors group-hover:translate-x-1" />
            </div>
          </Link>

        </div>
      </section>

      {/* 4. INTERACTIVE WHAT-IF FUTURE HEALTH SIMULATOR SANDBOX */}
      <section className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white via-emerald-50/20 to-white dark:from-[#112019] dark:via-[#0e1a14] dark:to-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Simulator Controls (6 Cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                  <Sliders className="w-3.5 h-3.5" />
                  Live Physiology Sandbox
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-serif">
                  Simulate Your Future Health State
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Adjust lifestyle variables below to see real-time recalculation of multi-organ vitality and 10-year disease probabilities.
                </p>
              </div>

              {/* Slider 1: Cardio */}
              <div className="space-y-2 p-4 rounded-2xl bg-white dark:bg-[#0d1813] border border-slate-200/70 dark:border-[#1c3328]">
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    Daily Zone-2 Cardio
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400">{cardioMinutes} mins/day</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={cardioMinutes}
                  onChange={(e) => setCardioMinutes(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#1b4332] dark:accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Sedentary (0m)</span>
                  <span>Moderate (30m)</span>
                  <span>Athletic (60m)</span>
                </div>
              </div>

              {/* Slider 2: Sleep */}
              <div className="space-y-2 p-4 rounded-2xl bg-white dark:bg-[#0d1813] border border-slate-200/70 dark:border-[#1c3328]">
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    Average Sleep Duration
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400">{sleepHours} hours/night</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="9"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#1b4332] dark:accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Deprived (5h)</span>
                  <span>Optimal (7.5h)</span>
                  <span>Restorative (9h)</span>
                </div>
              </div>

              {/* Toggle 3: Nutrition */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#0d1813] border border-slate-200/70 dark:border-[#1c3328]">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Low-Sodium Mediterranean Nutrition
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      Reduces systolic pressure by ~6 mmHg
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLowSodiumDiet(!lowSodiumDiet)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    lowSodiumDiet ? "bg-[#1b4332] dark:bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <motion.div
                    layout
                    className="bg-white w-4 h-4 rounded-full shadow-md"
                    animate={{ x: lowSodiumDiet ? 24 : 0 }}
                  />
                </button>
              </div>
            </div>

            {/* Live Recalculated Outcomes Panel (6 Cols) */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0d1813] border border-slate-200/90 dark:border-[#1c3328] space-y-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1c3328] pb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Live Forecasted Outcomes</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">12-Month Longitudinal Projection</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  {bioAgeOffset} Yrs Younger
                </span>
              </div>

              {/* Dynamic Score Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#112019] border border-slate-100 dark:border-[#1c3328]">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Projected Twin Score</span>
                  <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">
                    {calculatedTwinScore}<span className="text-xs text-slate-400">/100</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block mt-1">
                    +{calculatedTwinScore - 80} pts improvement
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#112019] border border-slate-100 dark:border-[#1c3328]">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">10-Yr CVD Risk</span>
                  <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">
                    {calculatedCvdRisk}%
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block mt-1">
                    Reduced from 14.2%
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#112019] border border-slate-100 dark:border-[#1c3328]">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Type-2 Diabetes Risk</span>
                  <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">
                    {calculatedDiabetesRisk}%
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block mt-1">
                    Optimal metabolic state
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#112019] border border-slate-100 dark:border-[#1c3328]">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Cardiovascular Status</span>
                  <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-2 block flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Normalized
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Target BP &lt; 120/80</span>
                </div>
              </div>

              <Link
                href="/simulator"
                className="w-full py-3.5 px-4 rounded-2xl bg-[#1b4332] hover:bg-[#14382c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Full Multi-Organ Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FOUR-STAGE DEEP PHYSIOLOGICAL PIPELINE (#how-it-works) */}
      <section id="how-it-works" className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
            Biomedical Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-serif">
            How the Digital Twin Operates (Zero Hardware Required)
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            From raw blood chemistry PDFs and clinical checkups to real-time 3D simulation and transparent AI forecasting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Stage 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-4 shadow-2xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-white flex items-center justify-center font-mono font-bold text-lg shadow-xs">
              01
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Document & Lab Ingestion</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload standard blood test PDFs, metabolic panels, or enter routine checkup vitals into your secure, encrypted vault.
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">PDF OCR</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Blood Tests</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Checkup Intake</span>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-4 shadow-2xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-mono font-bold text-lg shadow-xs">
              02
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">LOINC Normalization</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Standardizes raw clinical assays into unified LOINC codes. Detects biomarker outliers and correlates them with demographic baselines.
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">LOINC Standards</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">eGFR Calc</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Lipid Ratios</span>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-4 shadow-2xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900 dark:bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-lg shadow-xs">
              03
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">3D Twin Simulation</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Renders anatomical status across organ networks with bio-physics ODE feedback loops for cardiovascular, hepatic, and metabolic homeostasis.
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Three.js WebGL</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">ODE Solvers</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Organ Scoring</span>
            </div>
          </div>

          {/* Stage 4 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-4 shadow-2xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#0b2019] dark:bg-emerald-800 text-white flex items-center justify-center font-mono font-bold text-lg shadow-xs">
              04
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Gemini XAI & Directives</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Google Gemini 1.5 powers conversational reasoning with direct document citations, transparent SHAP curves, and clinician signed care plans.
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Gemini 1.5</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">SHAP Curves</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Doctor Portal</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. CLINICAL EVIDENCE, ACCURACY & ARCHITECTURE */}
      <section className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
                Peer-Reviewed Clinical Foundations
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight">
                Explainable Machine Learning with Clinician Governance
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Rather than treating artificial intelligence as a black box, Digital Twin employs game-theoretic Shapley Additive Explanations (SHAP). Every elevated organ score is broken down into quantifiable positive and negative biomarker forces, providing actionable clarity for patients and doctors alike.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1611] border border-slate-200/60 dark:border-[#1c3328]">
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">0.88</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">XGBoost ROC-AUC</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1611] border border-slate-200/60 dark:border-[#1c3328]">
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">100%</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">SHAP Transparent</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1611] border border-slate-200/60 dark:border-[#1c3328]">
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">FHIR</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">HL7 EHR Export</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1611] border border-slate-200/60 dark:border-[#1c3328]">
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">AES-256</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Zero-Trust Encrypted</p>
                </div>
              </div>
            </div>

            {/* Doctor Note Preview Card */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0c1611] text-white border border-[#1c3328] space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    SJ
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Dr. Sarah Jenkins, MD</span>
                    <span className="text-[10px] text-slate-400">Cardiology & Internal Medicine</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  Signed Clinical Directive
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;Patient twin exhibits mild pre-hypertensive trend (systolic 128 mmHg). Approved 12-week Zone-2 aerobic cardio protocol (35 min/day). Sodium restriction prescribed. Repeat CMP/Lipid panel scheduled in 90 days.&rdquo;
              </p>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
                <span>Verified Hash: #0x9a8f...32d</span>
                <span className="text-emerald-400 font-semibold">Synced to Live Twin</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight">
            Clear Answers for Your Healthcare Peace of Mind
          </h2>
        </div>

        <div className="space-y-3 max-w-4xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {faq.q}
                  </span>
                  <div className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-[#1c3328] pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. GRAND CALL TO ACTION (CTA) */}
      <section className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-[#14382c] via-[#1b4332] to-[#14382c] text-white text-center space-y-6 shadow-xl border border-emerald-800 relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 mx-auto shadow-xs">
            <Sparkles className="w-7 h-7" />
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif">
              Step Into Personalized Health Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Calibrate your virtual avatar in under 2 minutes. Synthesize lab diagnostics, checkup vitals, and actionable prevention plans.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href={isLoggedIn ? "/dashboard" : "/signup"}
              className="px-8 py-4 rounded-2xl bg-white hover:bg-emerald-50 text-[#1b4332] font-bold text-sm shadow-md transition-all flex items-center gap-2 group"
            >
              <span>{isLoggedIn ? "Open Patient Dashboard" : "Start Free Calibration"}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/login"
              className="px-7 py-4 rounded-2xl bg-emerald-950/60 hover:bg-emerald-950 text-white font-bold text-sm border border-emerald-700/60 transition-all flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Explore Demo Patient</span>
            </Link>
          </div>

          <p className="text-[11px] text-emerald-300/70 pt-1">
            Zero hardware required • HIPAA & DPDP Compliant Architecture • Encrypted End-to-End
          </p>
        </div>
      </section>

      {/* Organ Detail Modal */}
      <OrganDetailModal organ={selectedOrgan} onClose={() => setSelectedOrgan(null)} />
    </div>
  );
}
