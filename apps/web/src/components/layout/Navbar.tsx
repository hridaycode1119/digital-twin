"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Heart,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Reports", href: "/records" },
  { name: "Insights", href: "/predictions" },
  { name: "AI Assistant", href: "/assistant" },
  { name: "Doctors", href: "/doctor" },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-300 bg-white/95 dark:bg-[#0b1410]/95 border-b border-[#eef1f0] dark:border-[#1c3328]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Tagline (Matching Mockup) */}
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

        {/* Center Navigation Links (Matching Mockup) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
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

          {/* More Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2"
            >
              <span>More</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {moreDropdownOpen && (
              <div
                className="absolute top-full right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setMoreDropdownOpen(false)}
              >
                <Link
                  href="/simulator"
                  onClick={() => setMoreDropdownOpen(false)}
                  className="block px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-emerald-950/30"
                >
                  Future Health Simulator
                </Link>
                <Link
                  href="/digital-twin"
                  onClick={() => setMoreDropdownOpen(false)}
                  className="block px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-emerald-950/30"
                >
                  3D Body Explorer
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right Section: Notification, Profile, Theme Toggle (Matching Mockup) */}
        <div className="hidden sm:flex items-center gap-3.5">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notification Bell with Badge */}
          <button
            title="Notifications"
            className="relative p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Profile Pill (Matching Mockup: "H | Hi, Hriday - View profile ⌵") */}
          <div className="flex items-center gap-2.5 pl-1.5">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
            >
              <div className="w-9 h-9 rounded-full bg-[#1b4332] text-white flex items-center justify-center text-sm font-bold shadow-xs">
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
            </Link>
          </div>
        </div>

        {/* Mobile Menu Hamburger */}
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

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden px-4 pt-3 pb-6 space-y-1.5 bg-white dark:bg-[#0b1410] border-t border-slate-200 dark:border-[#1c3328] overflow-hidden"
          >
            {navLinks.map((link) => {
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
