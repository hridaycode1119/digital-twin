import React from "react";
import Link from "next/link";
import { Activity, Shield, Lock } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md pt-12 pb-8 mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white dark:text-slate-950 shadow-xs">
                <Activity className="w-5 h-5 text-sky-400 dark:text-slate-950" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">Digital Twin</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              AI-Powered Virtual Patient & Digital Twin Platform for Predictive, Preventive, and Personalized Healthcare.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full w-fit border border-emerald-200 dark:border-emerald-900/60">
              <Shield className="w-3.5 h-3.5" />
              HIPAA & DPDP Compliant Architecture
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">Platform Modules</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/digital-twin" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">3D Digital Twin Studio</Link></li>
              <li><Link href="/records" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">AI Medical Records & OCR</Link></li>
              <li><Link href="/predictions" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Predictive Disease Analytics</Link></li>
              <li><Link href="/simulator" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Future Health Simulator</Link></li>
              <li><Link href="/assistant" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">RAG Clinical AI Assistant</Link></li>
            </ul>
          </div>

          {/* For Clinicians & Researchers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">Clinicians & Research</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/doctor" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Doctor Review Portal</Link></li>
              <li><Link href="/predictions" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Explainable AI (SHAP)</Link></li>
              <li><Link href="/records" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Biomarker Trends</Link></li>
              <li><Link href="/onboarding" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Cohort Anonymization</Link></li>
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">Security & Ethics</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              All clinical records are encrypted end-to-end with zero-knowledge keys and role-based access control.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Lock className="w-3.5 h-3.5 text-sky-500" />
              <span>AES-256 Encrypted at Rest</span>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-center text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          <strong className="text-slate-700 dark:text-slate-300">Important Clinical Disclaimer:</strong> Digital Twin is an AI-assisted healthcare decision-support and educational research prototype. It is not an autonomous diagnostic medical device. Always consult licensed clinicians before making medical choices.
        </div>

        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-4">
          <p>© 2026 Digital Twin Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</Link>
            <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</Link>
            <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-300">Security Architecture</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
