"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  ChevronRight,
  Folder,
  BarChart3,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  Heart,
  Footprints,
  Moon,
  Activity,
  Smile,
} from "lucide-react";
import { HumanBodyCanvas } from "@/components/twin/HumanBodyCanvas";
import { OrganDetailModal } from "@/components/twin/OrganDetailModal";
import { OrganData } from "@/types/twin";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const [selectedOrgan, setSelectedOrgan] = useState<OrganData | null>(null);
  const { user } = useAuth();

  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-16 transition-colors duration-300">
      {/* 1. HERO SECTION (Matching Design Mockup) */}
      <section className="relative pt-6 sm:pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left Hero Column: Headline & Action Buttons (4 Cols) */}
            <div className="lg:col-span-4 space-y-6 z-10">
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-normal tracking-tight text-slate-900 dark:text-white leading-[1.12] font-serif">
                  Understand your health.
                  <br />
                  Take control of your{" "}
                  <span className="italic text-[#1b4332] dark:text-emerald-400 font-serif">
                    future.
                  </span>
                </h1>
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
                Your Digital Twin unifies your medical records, lifestyle data, and advanced AI to give you personalized insights and help you live a healthier life.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/dashboard"
                    className="px-6 py-3.5 rounded-2xl bg-[#1b4332] hover:bg-[#14382c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <a
                    href="#platform"
                    className="px-5 py-3.5 rounded-2xl bg-white dark:bg-[#112019] border border-slate-200 dark:border-[#1c3328] text-slate-800 dark:text-slate-200 font-semibold text-sm shadow-2xs hover:bg-slate-50 dark:hover:bg-[#162921] transition-all flex items-center gap-2"
                  >
                    <span>Explore Features</span>
                    <LayoutGrid className="w-4 h-4 opacity-60" />
                  </a>
                </motion.div>
              </div>

              {/* Privacy Badge */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Your data is encrypted and 100% private</span>
              </div>
            </div>

            {/* Center Hero Column: 3D Anatomical Body with Flanking Badges (5 Cols) */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[480px]">
              <HumanBodyCanvas
                onSelectOrgan={(organ) => setSelectedOrgan(organ)}
                selectedOrganId={selectedOrgan?.id}
                className="w-full"
              />
            </div>

            {/* Right Hero Column: Health Overview Card (3 Cols - Matching Mockup) */}
            <div className="lg:col-span-3">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-sm space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Health Overview</h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Updated just now</p>
                  </div>
                  <button title="Overview Information" className="text-slate-400 hover:text-slate-600">
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                {/* Big Health Score Metric */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">Health Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                      87
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/100</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1b4332] dark:bg-emerald-500 h-full rounded-full" style={{ width: "87%" }} />
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-400 pt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Optimal</span>
                  </div>
                </div>

                {/* Vitals Breakdown Table (Matching Mockup) */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-[#1c3328] text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Footprints className="w-4 h-4 text-slate-400" />
                      <span>Steps (Today)</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">7,842</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Moon className="w-4 h-4 text-slate-400" />
                      <span>Sleep (Last Night)</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">7h 23m</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Heart Rate</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">72 bpm</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Smile className="w-4 h-4 text-emerald-600" />
                      <span>Stress Level</span>
                    </div>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Low</span>
                  </div>
                </div>

                {/* Bottom Action Link */}
                <div className="pt-2 border-t border-slate-100 dark:border-[#1c3328]">
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white hover:text-emerald-700 transition-colors group"
                  >
                    <span>View full dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STAT SUMMARY ROW (5 Cards Matching Mockup) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Card 1: Reports Uploaded */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white block leading-tight">24</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Reports Uploaded</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block">This month</span>
              </div>
            </div>
            <Link href="/records" className="text-xs font-semibold text-slate-800 dark:text-slate-300 hover:text-emerald-700 flex items-center gap-1">
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Health Score */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white block leading-tight">87</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Health Score</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold block flex items-center gap-1 mt-0.5">
                  <span>◆</span> Optimal
                </span>
              </div>
            </div>
            <Link href="/dashboard" className="text-xs font-semibold text-slate-800 dark:text-slate-300 hover:text-emerald-700 flex items-center gap-1">
              <span>View details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Health Alerts */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white block leading-tight">3</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Health Alerts</span>
              </div>
            </div>
            <Link href="/predictions" className="text-xs font-semibold text-slate-800 dark:text-slate-300 hover:text-emerald-700 flex items-center gap-1">
              <span>View alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: Upcoming Appointments */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white block leading-tight">2</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Upcoming Appointments</span>
              </div>
            </div>
            <Link href="/dashboard" className="text-xs font-semibold text-slate-800 dark:text-slate-300 hover:text-emerald-700 flex items-center gap-1">
              <span>View schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 5: Add New Quick Action */}
          <Link
            href="/records"
            className="p-5 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs hover:border-emerald-600/60 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold text-slate-900 dark:text-white block">Add New</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug">
                  Upload reports, logs, or health data
                </span>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* 3. EXPLORE PLATFORM SECTION (6 Feature Cards Matching Mockup) */}
      <section id="platform" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Explore Platform
          </h2>
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-400 flex items-center gap-1"
          >
            <span>View all features</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          
          {/* Card 1: Medical Records */}
          <Link
            href="/records"
            className="p-5 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                <Folder className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Medical Records</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Upload, store and manage all your medical documents.
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
            className="p-5 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Health Insights</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  AI-generated insights based on your health data.
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
            className="p-5 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">AI Assistant</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Ask questions and get reliable answers about your health.
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
            className="p-5 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Risk Prediction</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Predict potential risks and stay one step ahead.
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
            className="p-5 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">3D Digital Twin</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Explore your interactive virtual body and organ health.
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
            className="p-5 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Lifestyle Tracker</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Track habits, sleep, activity, nutrition and more.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors group-hover:translate-x-1" />
            </div>
          </Link>

        </div>
      </section>

      {/* Organ Detail Modal */}
      <OrganDetailModal organ={selectedOrgan} onClose={() => setSelectedOrgan(null)} />
    </div>
  );
}
