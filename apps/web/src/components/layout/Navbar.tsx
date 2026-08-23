"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Menu,
  X,
  Sparkles,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// Public Landing Page Navigation Links
const publicNavLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/#platform" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About", href: "/#about" },
  { name: "For Doctors", href: "/doctor" },
  { name: "Research", href: "/#research" },
];

// Authenticated App Navigation Links
const appNavLinks = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Digital Twin", href: "/digital-twin" },
  { name: "Records", href: "/records" },
  { name: "Predictions", href: "/predictions" },
  { name: "Simulator", href: "/simulator" },
  { name: "AI Assistant", href: "/assistant" },
  { name: "For Doctors", href: "/doctor" },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();

  const currentLinks = isLoggedIn ? appNavLinks : publicNavLinks;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20"
          >
            <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-sky-500 via-teal-400 to-slate-900 dark:to-slate-100 bg-clip-text text-transparent">
              Digital Twin
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/60 dark:bg-slate-900/60 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/80 backdrop-blur-md relative">
          {currentLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-200",
                  isActive
                    ? "text-sky-600 dark:text-sky-400"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute inset-0 bg-white dark:bg-slate-800 rounded-full shadow-xs -z-10"
                  />
                )}
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Theme Toggle, Auth State & Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Light / Dark Theme Switcher */}
          <ThemeToggle />

          {isLoggedIn ? (
            /* Logged-In User Profile Pill */
            <div className="flex items-center gap-2.5">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 hover:border-sky-300 transition-all shadow-xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-sky-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    {user?.name?.[0] || "A"}
                  </div>
                  <div className="text-left leading-tight pr-1">
                    <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">{user?.name}</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Score {user?.overallScore}/100
                    </span>
                  </div>
                </Link>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                title="Log Out"
                className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shadow-xs"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            /* Public Landing Page Actions */
            <>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/login"
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors inline-block"
                >
                  Log In
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-slate-900 dark:bg-sky-500 hover:bg-slate-800 dark:hover:bg-sky-400 text-white dark:text-slate-950 shadow-md shadow-slate-900/15 hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400 dark:text-slate-950" />
                  Get Started
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile Menu Hamburger Button & Mobile Theme Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />

          {isLoggedIn && (
            <Link
              href="/dashboard"
              className="p-1.5 rounded-xl bg-slate-900 dark:bg-sky-600 text-white text-xs font-bold w-7 h-7 flex items-center justify-center sm:hidden"
            >
              {user?.name?.[0] || "A"}
            </Link>
          )}

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-2xs"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Drawer with Smooth AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden glass-nav border-t border-slate-200/80 dark:border-slate-800 px-4 pt-3 pb-6 space-y-1 overflow-hidden"
          >
            {currentLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
                  )}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
              );
            })}

            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex flex-col gap-2.5">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    logout();
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
                    className="w-full text-center py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-2xs"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-2xl bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 font-bold text-xs shadow-md"
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
