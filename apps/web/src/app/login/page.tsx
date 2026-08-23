"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  User,
  Stethoscope,
  FlaskConical,
  AlertCircle,
  Database,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type RoleType = "PATIENT" | "DOCTOR" | "RESEARCHER";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [role, setRole] = useState<RoleType>("PATIENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, role }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        login(data.user);
        router.push("/dashboard");
      } else {
        setErrorMsg(data.error || "MongoDB authentication failed. Please verify your credentials.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to communicate with MongoDB authentication server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (selectedRole: RoleType) => {
    setRole(selectedRole);
    if (selectedRole === "DOCTOR") {
      setEmail("dr.jenkins@hospital.org");
    } else if (selectedRole === "RESEARCHER") {
      setEmail("dr.researcher@biotech.edu");
    } else {
      setEmail("alex.mercer@example.com");
    }
    setPassword("password123");
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-7 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-xs">
              <Heart className="w-6 h-6 fill-emerald-600/20" />
            </div>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif">
            Welcome back
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your secure MongoDB Digital Twin account.
          </p>
        </div>

        {/* Card Form */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-sm relative">
          
          {/* Role Switcher Tabs */}
          <div className="mb-6">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Select Portal Access Role
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 dark:bg-[#0c1611] rounded-2xl border border-slate-200/60 dark:border-[#1c3328]">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("PATIENT")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  role === "PATIENT"
                    ? "bg-white dark:bg-[#18392b] text-emerald-800 dark:text-emerald-300 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Patient
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("DOCTOR")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  role === "DOCTOR"
                    ? "bg-white dark:bg-[#18392b] text-emerald-800 dark:text-emerald-300 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                Doctor
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("RESEARCHER")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  role === "RESEARCHER"
                    ? "bg-white dark:bg-[#18392b] text-emerald-800 dark:text-emerald-300 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                Research
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1c3328] bg-white dark:bg-[#0c1611] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-[#1c3328] bg-white dark:bg-[#0c1611] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#1b4332] hover:bg-[#14382c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 group mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating with MongoDB...</span>
              ) : (
                <>
                  <span>Sign In as {role.charAt(0) + role.slice(1).toLowerCase()}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom Switch to Sign Up */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have a Digital Twin account?{" "}
          <Link href="/signup" className="font-bold text-emerald-800 dark:text-emerald-400 hover:underline">
            Create an account
          </Link>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Authenticated via MongoDB • Zero Mock Fallbacks</span>
        </div>
      </div>
    </div>
  );
}
