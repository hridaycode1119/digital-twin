import React from "react";
import Link from "next/link";
import { Activity, Shield, Lock } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white/60 backdrop-blur-md pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
                <Activity className="w-5 h-5 text-sky-400" />
              </div>
              <span className="text-lg font-bold text-slate-900">Digital Twin</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              AI-Powered Virtual Patient & Digital Twin Platform for Predictive, Preventive, and Personalized Healthcare.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit border border-emerald-200">
              <Shield className="w-3.5 h-3.5" />
              HIPAA & DPDP Compliant Architecture
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Platform Modules</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/digital-twin" className="hover:text-sky-600 transition-colors">3D Digital Twin Studio</Link></li>
              <li><Link href="/records" className="hover:text-sky-600 transition-colors">AI Medical Records & OCR</Link></li>
              <li><Link href="/predictions" className="hover:text-sky-600 transition-colors">Predictive Disease Analytics</Link></li>
              <li><Link href="/simulator" className="hover:text-sky-600 transition-colors">Future Health Simulator</Link></li>
              <li><Link href="/assistant" className="hover:text-sky-600 transition-colors">RAG Clinical AI Assistant</Link></li>
            </ul>
          </div>

          {/* For Clinicians & Researchers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Clinicians & Research</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/doctor" className="hover:text-sky-600 transition-colors">Doctor Review Portal</Link></li>
              <li><Link href="/predictions" className="hover:text-sky-600 transition-colors">Explainable AI (SHAP)</Link></li>
              <li><Link href="/records" className="hover:text-sky-600 transition-colors">Biomarker Trends</Link></li>
              <li><Link href="/onboarding" className="hover:text-sky-600 transition-colors">Cohort Anonymization</Link></li>
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Security & Ethics</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              All clinical records are encrypted end-to-end with zero-knowledge keys and role-based access control.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5 text-sky-500" />
              <span>AES-256 Encrypted at Rest</span>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 text-center text-xs text-slate-500 leading-relaxed mb-6">
          <strong>Important Clinical Disclaimer:</strong> Digital Twin is an AI-assisted healthcare decision-support and educational research prototype. It is not an autonomous diagnostic medical device. Always consult licensed clinicians before making medical choices.
        </div>

        <div className="pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Digital Twin Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-600">Privacy Policy</Link>
            <Link href="/" className="hover:text-slate-600">Terms of Service</Link>
            <Link href="/" className="hover:text-slate-600">Security Architecture</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
