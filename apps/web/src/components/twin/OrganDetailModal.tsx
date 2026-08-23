"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OrganData } from "@/types/twin";
import { OrganBadge } from "@/components/ui/OrganBadge";
import {
  X,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface OrganDetailModalProps {
  organ: OrganData | null;
  onClose: () => void;
}

export const OrganDetailModal: React.FC<OrganDetailModalProps> = ({ organ, onClose }) => {
  return (
    <AnimatePresence>
      {organ && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-md"
          />

          {/* Modal Card (Responsive: Bottom Sheet on Mobile, Centered Card on Desktop) */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[85vh] z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Indicator Bar */}
            <div className="sm:hidden w-full flex justify-center pt-2.5 pb-1">
              <div className="w-12 h-1.5 rounded-full bg-slate-200" />
            </div>

            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50/50 via-white to-teal-50/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-600 font-bold shrink-0">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">{organ.name} System</h3>
                    <OrganBadge status={organ.status} />
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                    Digital Twin Physiological Telemetry • Real-Time State
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
              {/* Key Metrics Grid */}
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-sky-500" />
                  Real-Time Biomarkers & Vitals
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {organ.metrics.map((metric, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 rounded-2xl border transition-all ${
                        metric.isAbnormal
                          ? "bg-amber-50/70 border-amber-200/80 text-amber-900"
                          : "bg-slate-50/80 border-slate-200/60 text-slate-800"
                      }`}
                    >
                      <p className="text-[11px] font-medium text-slate-500 truncate">{metric.name}</p>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-base sm:text-lg font-bold text-slate-900">{metric.value}</span>
                        {metric.unit && (
                          <span className="text-[10px] sm:text-xs text-slate-500 font-normal">{metric.unit}</span>
                        )}
                      </div>
                      {metric.isAbnormal && (
                        <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700">
                          <AlertTriangle className="w-2.5 h-2.5" /> Needs Monitoring
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Historical Trend Chart */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-sky-500" />
                    4-Month Health Score Trajectory
                  </h4>
                  <span className="text-xs font-semibold text-sky-600">Current: {organ.score}/100</span>
                </div>
                <div className="h-36 sm:h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={organ.historicalTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis domain={[60, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#0ea5e9"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#scoreGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Clinical Insights & AI Synthesis */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  AI Clinical Summary
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{organ.clinicalInsights}</p>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                  Personalized Recommendations
                </h4>
                <ul className="space-y-1.5">
                  {organ.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
              <span className="hidden sm:inline text-xs text-slate-400">
                Based on 24 validated laboratory & wearable telemetry records
              </span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-colors"
              >
                Close Overview
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
