import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHealthScore(score: number): { label: string; color: string; badgeBg: string; textColor: string } {
  if (score >= 90) return { label: "Optimal", color: "#10B981", badgeBg: "bg-emerald-50 border-emerald-200", textColor: "text-emerald-700" };
  if (score >= 75) return { label: "Good", color: "#059669", badgeBg: "bg-emerald-50 border-emerald-200", textColor: "text-emerald-600" };
  if (score >= 60) return { label: "Monitoring", color: "#F59E0B", badgeBg: "bg-amber-50 border-amber-200", textColor: "text-amber-600" };
  return { label: "High Risk", color: "#EF4444", badgeBg: "bg-rose-50 border-rose-200", textColor: "text-rose-600" };
}
