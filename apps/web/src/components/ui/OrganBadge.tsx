import React from "react";
import { HealthStatus } from "@/types/twin";
import { cn } from "@/lib/utils";

interface OrganBadgeProps {
  status: HealthStatus;
  className?: string;
}

export const OrganBadge: React.FC<OrganBadgeProps> = ({ status, className }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "Optimal":
        return {
          dotColor: "bg-emerald-500",
          textColor: "text-emerald-700",
          bgColor: "bg-emerald-50/80 border-emerald-200/60",
        };
      case "Good":
        return {
          dotColor: "bg-emerald-500",
          textColor: "text-emerald-600",
          bgColor: "bg-emerald-50/80 border-emerald-200/60",
        };
      case "Normal":
        return {
          dotColor: "bg-teal-500",
          textColor: "text-teal-700",
          bgColor: "bg-teal-50/80 border-teal-200/60",
        };
      case "Monitoring":
        return {
          dotColor: "bg-amber-500",
          textColor: "text-amber-700",
          bgColor: "bg-amber-50/80 border-amber-200/60",
        };
      case "High Risk":
        return {
          dotColor: "bg-rose-500",
          textColor: "text-rose-700",
          bgColor: "bg-rose-50/80 border-rose-200/60",
        };
      default:
        return {
          dotColor: "bg-slate-400",
          textColor: "text-slate-600",
          bgColor: "bg-slate-50 border-slate-200",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm shadow-sm",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", config.dotColor)} />
      {status}
    </span>
  );
};
