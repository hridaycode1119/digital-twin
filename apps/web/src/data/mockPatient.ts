import { PatientTwinState } from "@/types/twin";

export const initialPatientTwin: PatientTwinState = {
  patientId: "pt_1029384",
  name: "Alex Mercer",
  age: 38,
  gender: "Male",
  overallScore: 87,
  reportsCount: 24,
  riskAlertsCount: 3,
  upcomingCheckups: 2,
  vitals: {
    bloodPressure: "128/82 mmHg",
    heartRate: 74,
    spo2: 99,
    glucose: 108,
    temperature: 36.8,
    bmi: 24.2,
  },
  organs: {
    brain: {
      id: "brain",
      name: "Brain",
      status: "Normal",
      score: 92,
      riskLevel: "LOW",
      icon: "Brain",
      position: { x: 0, y: 1.6, z: 0 },
      screenPos: { top: "18%", left: "24%" },
      metrics: [
        { name: "Cognitive Index", value: "94/100" },
        { name: "Avg Sleep", value: "7.4", unit: "hrs/night" },
        { name: "Stress Score", value: "3/10 (Mild)" },
        { name: "Stroke Risk", value: "1.8%", unit: "10-yr" },
      ],
      historicalTrend: [
        { month: "Mar", score: 88 },
        { month: "Apr", score: 90 },
        { month: "May", score: 91 },
        { month: "Jun", score: 92 },
      ],
      clinicalInsights: "Neurological vital markers and circadian recovery patterns are well-balanced. Deep sleep ratio is within the optimal 18-22% range.",
      recommendations: [
        "Maintain current sleep consistency (7.5 hours/night).",
        "Consider 10 minutes of mindfulness practice during high-workload afternoons."
      ]
    },
    heart: {
      id: "heart",
      name: "Heart",
      status: "Monitoring",
      score: 74,
      riskLevel: "MODERATE",
      icon: "Heart",
      position: { x: 0.1, y: 0.8, z: 0.1 },
      screenPos: { top: "20%", left: "76%" },
      metrics: [
        { name: "Resting Heart Rate", value: "74", unit: "BPM" },
        { name: "Blood Pressure", value: "128/82", unit: "mmHg", isAbnormal: true },
        { name: "Cardiovascular Risk", value: "14.2%", unit: "10-yr", isAbnormal: true },
        { name: "Total Cholesterol", value: "208", unit: "mg/dL", isAbnormal: true },
        { name: "HDL / LDL Ratio", value: "3.4" },
      ],
      historicalTrend: [
        { month: "Mar", score: 79 },
        { month: "Apr", score: 77 },
        { month: "May", score: 75 },
        { month: "Jun", score: 74 },
      ],
      clinicalInsights: "Systolic blood pressure and total cholesterol are slightly above optimal baseline. Mild cardiovascular risk detected.",
      recommendations: [
        "Incorporate 30 minutes of moderate aerobic cardio 4-5 times weekly.",
        "Reduce sodium intake below 2,000 mg/day.",
        "Schedule a follow-up lipid panel in 90 days."
      ]
    },
    lungs: {
      id: "lungs",
      name: "Lungs",
      status: "Good",
      score: 96,
      riskLevel: "LOW",
      icon: "Wind",
      position: { x: 0, y: 0.75, z: 0 },
      screenPos: { top: "38%", left: "20%" },
      metrics: [
        { name: "SpO2 Oxygen Saturation", value: "99", unit: "%" },
        { name: "Respiratory Rate", value: "14", unit: "breaths/min" },
        { name: "VO2 Max Estimate", value: "44.2", unit: "mL/kg/min" },
        { name: "Smoking Status", value: "Non-smoker" },
      ],
      historicalTrend: [
        { month: "Mar", score: 95 },
        { month: "Apr", score: 96 },
        { month: "May", score: 96 },
        { month: "Jun", score: 96 },
      ],
      clinicalInsights: "Pulmonary oxygen exchange is excellent. No signs of airway restriction or hypoxia.",
      recommendations: [
        "Continue outdoor aerobic activities in low-pollution environments.",
        "Maintain current respiratory conditioning."
      ]
    },
    liver: {
      id: "liver",
      name: "Liver",
      status: "Good",
      score: 90,
      riskLevel: "LOW",
      icon: "ShieldAlert",
      position: { x: -0.2, y: 0.3, z: 0.1 },
      screenPos: { top: "40%", left: "78%" },
      metrics: [
        { name: "ALT (Alanine Aminotransferase)", value: "22", unit: "U/L" },
        { name: "AST (Aspartate Aminotransferase)", value: "19", unit: "U/L" },
        { name: "Total Bilirubin", value: "0.8", unit: "mg/dL" },
        { name: "Albumin", value: "4.4", unit: "g/dL" },
      ],
      historicalTrend: [
        { month: "Mar", score: 89 },
        { month: "Apr", score: 90 },
        { month: "May", score: 90 },
        { month: "Jun", score: 90 },
      ],
      clinicalInsights: "Hepatic enzyme levels and protein synthesis parameters are well within clinical norms.",
      recommendations: [
        "Maintain adequate hydration (2.5 - 3.0 Liters daily).",
        "Keep alcohol consumption minimal."
      ]
    },
    stomach: {
      id: "stomach",
      name: "Stomach",
      status: "Normal",
      score: 88,
      riskLevel: "LOW",
      icon: "Utensils",
      position: { x: 0.15, y: 0.35, z: 0.1 },
      screenPos: { top: "58%", left: "22%" },
      metrics: [
        { name: "Digestive Index", value: "88/100" },
        { name: "Gut Microbiome Diversity", value: "High (Estimated)" },
        { name: "Hydration Status", value: "Optimal (2.6 L/day)" },
        { name: "Dietary Fiber", value: "28g / day" },
      ],
      historicalTrend: [
        { month: "Mar", score: 85 },
        { month: "Apr", score: 86 },
        { month: "May", score: 88 },
        { month: "Jun", score: 88 },
      ],
      clinicalInsights: "Gastrointestinal metrics indicate healthy fiber intake and balanced nutritional absorption.",
      recommendations: [
        "Include prebiotic foods (garlic, oats, legumes) in daily meals.",
        "Avoid eating heavy meals within 2.5 hours before bedtime."
      ]
    },
    kidneys: {
      id: "kidneys",
      name: "Kidneys",
      status: "Normal",
      score: 94,
      riskLevel: "LOW",
      icon: "Activity",
      position: { x: 0, y: 0.1, z: -0.1 },
      screenPos: { top: "60%", left: "76%" },
      metrics: [
        { name: "Serum Creatinine", value: "0.88", unit: "mg/dL" },
        { name: "eGFR (Glomerular Filtration)", value: "108", unit: "mL/min/1.73m²" },
        { name: "BUN (Blood Urea Nitrogen)", value: "14", unit: "mg/dL" },
        { name: "Uric Acid", value: "5.1", unit: "mg/dL" },
      ],
      historicalTrend: [
        { month: "Mar", score: 93 },
        { month: "Apr", score: 94 },
        { month: "May", score: 94 },
        { month: "Jun", score: 94 },
      ],
      clinicalInsights: "Renal filtration efficiency (eGFR > 90) indicates strong kidney function and electrolyte balance.",
      recommendations: [
        "Continue drinking plenty of clean water throughout active hours.",
        "Limit NSAID analgesic usage."
      ]
    }
  }
};
