"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface StatCardProps {
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  value: string | number;
  label: string;
  subtext?: string;
  badge?: React.ReactNode;
  actionText?: string;
  actionHref?: string;
  className?: string;
  isDashed?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  iconColor = "text-sky-600 dark:text-sky-400",
  iconBg = "bg-sky-50 dark:bg-sky-950/50",
  value,
  label,
  subtext,
  badge,
  actionText,
  actionHref,
  className,
  isDashed = false,
}) => {
  const numericVal = typeof value === "number" ? value : parseInt(value);
  const isNumber = !isNaN(numericVal) && typeof value !== "string";

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "rounded-3xl p-4.5 sm:p-6 relative transition-all duration-300",
        isDashed
          ? "border-2 border-dashed border-slate-200/80 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 flex flex-col items-center justify-center text-center hover:border-sky-400 hover:bg-white/60 min-h-[120px]"
          : "glass-card glass-card-hover flex flex-col justify-between hover:shadow-glow-cyan",
        className
      )}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className={cn(
            "p-2.5 sm:p-3.5 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-2xs",
            iconBg
          )}
        >
          <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {typeof value === "number" ? (
                <AnimatedCounter value={value} />
              ) : isNumber ? (
                <AnimatedCounter value={numericVal} />
              ) : (
                value
              )}
            </span>
            {badge}
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{label}</p>
          {subtext && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{subtext}</p>}
        </div>
      </div>

      {actionText && actionHref && (
        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-100/80 dark:border-slate-800 flex items-center justify-between">
          <Link
            href={actionHref}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1 group"
          >
            {actionText}
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </motion.div>
  );
};
