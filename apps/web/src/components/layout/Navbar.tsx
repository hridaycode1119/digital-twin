"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ChevronDown,
  Menu,
  X,
  Heart,
  ChevronRight,
  LogOut,
  User,
  Shield,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// Public navigation links (Visible before logging in)
const publicNavLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/#platform" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "Architecture", href: "/#architecture" },
  { name: "Clinicians", href: "/#clinicians" },
  { name: "FAQ", href: "/#faq" },
];

// Authenticated navigation links (Visible ONLY after login)
const authAppNavLinks = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "3D Twin", href: "/digital-twin" },
  { name: "Reports", href: "/records" },
  { name: "Insights", href: "/predictions" },
  { name: "AI Assistant", href: "/assistant" },
  { name: "Simulator", href: "/simulator" },
  { name: "Doctor Review", href: "/doctor" },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();

  // Dynamic link set depending on authentication state
  const currentNavLinks = isLoggedIn ? authAppNavLinks : publicNavLinks;

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-300 bg-white/95 dark:bg-[#0b1410]/95 border-b border-[#eef1f0] dark:border-[#1c3328]">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl border border-emerald-600/30 bg-emerald-50/60 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
            <Heart className="w-5 h-5 fill-emerald-600/20" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight font-sans">
              Digital Twin
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5">
              Your Health. Reimagined.
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Public vs Authenticated) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          {currentNavLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : link.href.startsWith("/#")
                ? false
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative py-2 transition-colors duration-200",
                  isActive
                    ? "text-emerald-800 dark:text-emerald-400 font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-800 dark:bg-emerald-400 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Theme Toggle & Auth State */}
        <div className="hidden sm:flex items-center gap-3.5">
          <ThemeToggle />

          {isLoggedIn ? (
            /* Logged-In State with Notifications & User Dropdown */
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button
                title="Notifications"
                className="relative p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Profile Pill with Interactive Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 pl-1.5 hover:opacity-90 transition-opacity text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-[#1b4332] dark:bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                    {user?.name?.[0] || "H"}
                  </div>
                  <div className="text-left leading-tight">
                    <span className="block text-xs font-bold text-slate-900 dark:text-white">
                      Hi, {user?.name?.split(" ")[0] || "Hriday"}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-0.5">
                      View profile <ChevronDown className="w-3 h-3" />
                    </span>
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      onMouseLeave={() => setProfileDropdownOpen(false)}
                      className="absolute right-0 top-full mt-2 w-56 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-xl p-2.5 z-50 space-y-1"
                    >
                      <div className="p-3 bg-slate-50 dark:bg-[#0d1813] rounded-2xl mb-1 border border-slate-100 dark:border-[#1c3328]">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          ID: {user?.patientId || "pt_1029384"}
                        </div>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-emerald-950/40"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Patient Dashboard
                      </Link>

                      <Link
                        href="/onboarding"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-emerald-950/40"
                      >
                        <Shield className="w-4 h-4 text-slate-400" />
                        Calibrate Biomarkers
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            /* Logged-Out State */
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-800 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#1b4332] hover:bg-[#14382c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-sm transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden px-4 pt-3 pb-6 space-y-2 bg-white dark:bg-[#0b1410] border-t border-slate-200 dark:border-[#1c3328] overflow-hidden"
          >
            {currentNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
                  )}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-200 dark:border-[#1c3328] flex flex-col gap-2">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-200/80 dark:border-rose-900/50"
                >
                  Log Out ({user?.name})
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-2xl bg-white dark:bg-[#112019] border border-slate-200 dark:border-[#1c3328] text-slate-800 dark:text-slate-200 font-bold text-xs"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-2xl bg-[#1b4332] dark:bg-emerald-600 text-white font-bold text-xs shadow-sm"
                  >
                    Create Free Account
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
