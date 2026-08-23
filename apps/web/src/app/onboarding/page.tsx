"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Heart,
  Activity,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "Alex",
    lastName: "Mercer",
    age: "38",
    gender: "Male",
    bloodGroup: "O+",
    heightCm: "178",
    weightKg: "74",
    conditions: "None diagnosed",
    allergies: "Penicillin",
    familyHistory: "Cardiovascular hypertension (Father)",
    sleepHours: "7.5",
    exerciseDays: "4",
    dietType: "Mediterranean / Balanced",
    smoking: "Never",
    alcohol: "Occasional (1-2 units/week)",
    stressLevel: "3",
    bpSystolic: "128",
    bpDiastolic: "82",
    heartRate: "74",
    fastingGlucose: "108",
  });

  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [twinReady, setTwinReady] = useState(false);

  const handleNext = () => {
    if (currentStep === 4) {
      setIsSynthesizing(true);
      setTimeout(() => {
        setIsSynthesizing(false);
        setTwinReady(true);
        setCurrentStep(5);
      }, 2000);
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
          <span>STEP {currentStep} OF 5</span>
          <span>
            {currentStep === 1 && "Personal Biometrics"}
            {currentStep === 2 && "Medical & Family History"}
            {currentStep === 3 && "Lifestyle & Daily Habits"}
            {currentStep === 4 && "Baseline Telemetry & Vitals"}
            {currentStep === 5 && "Digital Twin Initialized"}
          </span>
        </div>
        <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Wizard Form Card */}
      <div className="glass-card rounded-3xl p-8 shadow-xl border border-white relative overflow-hidden">
        {/* Step 1: Personal Biometrics */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Personal Demographics</h2>
              <p className="text-xs text-slate-500 mt-1">
                Your physiological parameters establish baseline metabolic and anatomical calibration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-Binary</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Height (cm)</label>
                <input
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Medical History */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Medical & Family History</h2>
              <p className="text-xs text-slate-500 mt-1">
                Contextual clinical background for disease vulnerability weighting.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Known Allergies</label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Family Health History</label>
                <textarea
                  rows={3}
                  value={formData.familyHistory}
                  onChange={(e) => setFormData({ ...formData, familyHistory: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Lifestyle & Habits */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Lifestyle & Habits</h2>
              <p className="text-xs text-slate-500 mt-1">
                Behavioral factors influencing organ-level recovery and score calculation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Avg Sleep (Hours/Night)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.sleepHours}
                  onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Exercise Frequency (Days/Week)</label>
                <input
                  type="number"
                  value={formData.exerciseDays}
                  onChange={(e) => setFormData({ ...formData, exerciseDays: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Smoking Status</label>
                <select
                  value={formData.smoking}
                  onChange={(e) => setFormData({ ...formData, smoking: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option>Never</option>
                  <option>Former Smoker</option>
                  <option>Occasional</option>
                  <option>Daily Smoker</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Stress Level (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.stressLevel}
                  onChange={(e) => setFormData({ ...formData, stressLevel: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Baseline Vitals */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Baseline Vitals & Lab Telemetry</h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your most recent clinical measurements to calibrate the 3D twin.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Systolic Blood Pressure (mmHg)</label>
                <input
                  type="number"
                  value={formData.bpSystolic}
                  onChange={(e) => setFormData({ ...formData, bpSystolic: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Diastolic Blood Pressure (mmHg)</label>
                <input
                  type="number"
                  value={formData.bpDiastolic}
                  onChange={(e) => setFormData({ ...formData, bpDiastolic: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Resting Heart Rate (BPM)</label>
                <input
                  type="number"
                  value={formData.heartRate}
                  onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Fasting Blood Glucose (mg/dL)</label>
                <input
                  type="number"
                  value={formData.fastingGlucose}
                  onChange={(e) => setFormData({ ...formData, fastingGlucose: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Digital Twin Initialized */}
        {currentStep === 5 && (
          <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-400">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900">Digital Twin Initialized!</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your personalized virtual patient is ready with an initial Composite Health Score of{" "}
                <strong className="text-blue-600 font-bold">87/100</strong>.
              </p>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Link
                href="/dashboard"
                className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <span>Go to Patient Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Actions for Steps 1-4 */}
        {currentStep < 5 && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                onClick={handlePrev}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={isSynthesizing}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-2"
            >
              {isSynthesizing ? (
                <>
                  <Zap className="w-3.5 h-3.5 animate-spin" />
                  Synthesizing Digital Twin...
                </>
              ) : currentStep === 4 ? (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate My Digital Twin
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
