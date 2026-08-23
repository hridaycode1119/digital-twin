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
  iconColor = "text-blue-600",
  iconBg = "bg-blue-50",
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
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "rounded-3xl p-6 relative transition-shadow duration-300",
        isDashed
          ? "border-2 border-dashed border-slate-200/80 bg-white/40 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-white/60"
          : "glass-card glass-card-hover flex flex-col justify-between hover:shadow-glow-blue",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "p-3.5 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110",
            iconBg
          )}
        >
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
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
          <p className="text-sm font-medium text-slate-500 mt-0.5">{label}</p>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
      </div>

      {actionText && actionHref && (
        <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between">
          <Link
            href={actionHref}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            {actionText}
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </motion.div>
  );
};
