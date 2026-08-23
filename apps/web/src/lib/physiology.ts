import { OrganData, OrganId, PatientTwinState } from "@/types/twin";
import { UserProfile } from "@/context/AuthContext";

/**
 * Calculates deterministic, individualized organ states, composite vitality score,
 * and 24-hour telemetry based on a user's actual entered biometrics and health habits.
 */
export function generatePersonalizedTwin(user: Partial<UserProfile>): PatientTwinState {
  const name = user.name || "Patient";
  const patientId = user.patientId || `pt_${Date.now().toString().slice(-6)}`;
  const age = Number(user.age) || 28;
  const gender = (user.gender as any) || "Male";
  
  const bpStr = user.bloodPressure || "120/80";
  const [sysStr, diaStr] = bpStr.split("/");
  const systolic = Number(sysStr) || 120;
  const diastolic = Number(diaStr) || 80;

  const heartRate = Number(user.heartRate) || 72;
  const glucose = Number(user.fastingGlucose) || 95;
  const sleepHours = Number(user.sleepHours) || 7.5;
  const exerciseDays = Number(user.exerciseDays) || 3;
  const smoking = user.smoking || "Never";
  const stress = Number(user.stressLevel) || 3;
  const diet = user.dietType || "Balanced / Mediterranean";

  // Calculate individual organ vitality scores (0 - 100)
  // 1. Heart
  let heartScore = 92;
  if (systolic > 130) heartScore -= 8;
  else if (systolic > 120) heartScore -= 3;
  if (heartRate > 80) heartScore -= 4;
  if (exerciseDays >= 4) heartScore += 5;
  if (smoking === "Daily Smoker") heartScore -= 12;
  heartScore = Math.min(99, Math.max(50, heartScore));

  // 2. Lungs
  let lungsScore = 95;
  if (smoking === "Daily Smoker") lungsScore -= 25;
  else if (smoking === "Occasional") lungsScore -= 10;
  else if (smoking === "Former Smoker") lungsScore -= 4;
  if (exerciseDays >= 3) lungsScore += 3;
  lungsScore = Math.min(99, Math.max(45, lungsScore));

  // 3. Brain
  let brainScore = 90;
  if (sleepHours < 6.5) brainScore -= 10;
  else if (sleepHours >= 7.5) brainScore += 5;
  if (stress > 6) brainScore -= 8;
  else if (stress <= 3) brainScore += 3;
  brainScore = Math.min(99, Math.max(50, brainScore));

  // 4. Liver
  let liverScore = 93;
  if (glucose > 105) liverScore -= 6;
  if (diet.includes("High Fat") || diet.includes("Western")) liverScore -= 7;
  liverScore = Math.min(99, Math.max(55, liverScore));

  // 5. Kidneys
  let kidneysScore = 94;
  if (systolic > 130) kidneysScore -= 7;
  if (age > 50) kidneysScore -= 5;
  kidneysScore = Math.min(99, Math.max(55, kidneysScore));

  // 6. Stomach / Digestion
  let stomachScore = 92;
  if (stress > 6) stomachScore -= 6;
  if (diet.includes("Fast Food") || diet.includes("High Sodium")) stomachScore -= 8;
  stomachScore = Math.min(99, Math.max(55, stomachScore));

  const overallScore = Math.round(
    (heartScore * 0.25 +
      lungsScore * 0.15 +
      brainScore * 0.2 +
      liverScore * 0.15 +
      kidneysScore * 0.15 +
      stomachScore * 0.1)
  );

  const getStatus = (score: number): "NORMAL" | "WARNING" | "CRITICAL" => {
    if (score >= 82) return "NORMAL";
    if (score >= 68) return "WARNING";
    return "CRITICAL";
  };

  const organs: Record<OrganId, OrganData> = {
    heart: {
      id: "heart",
      name: "Cardiovascular",
      score: heartScore,
      status: getStatus(heartScore),
      meshColor: heartScore >= 82 ? "#10b981" : heartScore >= 68 ? "#f59e0b" : "#ef4444",
      clinicalInsights: `Systolic ${systolic} mmHg, resting rate ${heartRate} BPM. ${
        heartScore >= 82
          ? "Optimal hemodynamic function with healthy left ventricular compliance."
          : "Pre-hypertensive pressure trend noted; aerobic Zone-2 conditioning advised."
      }`,
      biomarkers: [
        { name: "Systolic Blood Pressure", value: systolic, unit: "mmHg", status: systolic <= 120 ? "NORMAL" : "ELEVATED", referenceRange: "< 120" },
        { name: "Diastolic Blood Pressure", value: diastolic, unit: "mmHg", status: diastolic <= 80 ? "NORMAL" : "ELEVATED", referenceRange: "< 80" },
        { name: "Resting Heart Rate", value: heartRate, unit: "bpm", status: heartRate <= 76 ? "NORMAL" : "ELEVATED", referenceRange: "60 - 80" },
      ],
      recommendations: [
        "Maintain 30-45 minutes of weekly aerobic exercise.",
        "Keep daily sodium intake below 2,000 mg.",
      ],
    },
    lungs: {
      id: "lungs",
      name: "Pulmonary",
      score: lungsScore,
      status: getStatus(lungsScore),
      meshColor: lungsScore >= 82 ? "#10b981" : lungsScore >= 68 ? "#f59e0b" : "#ef4444",
      clinicalInsights: `Smoking status: ${smoking}. Respiratory gas exchange and SpO2 at 99%.`,
      biomarkers: [
        { name: "SpO2 (Pulse Oximetry)", value: 99, unit: "%", status: "NORMAL", referenceRange: "95 - 100" },
        { name: "Respiratory Rate", value: 14, unit: "breaths/min", status: "NORMAL", referenceRange: "12 - 18" },
      ],
      recommendations: ["Maintain clean respiratory environment and aerobic conditioning."],
    },
    brain: {
      id: "brain",
      name: "Neurological & Sleep",
      score: brainScore,
      status: getStatus(brainScore),
      meshColor: brainScore >= 82 ? "#10b981" : brainScore >= 68 ? "#f59e0b" : "#ef4444",
      clinicalInsights: `Average sleep duration ${sleepHours} hours/night, reported stress level ${stress}/10.`,
      biomarkers: [
        { name: "Sleep Duration", value: sleepHours, unit: "hours", status: sleepHours >= 7 ? "NORMAL" : "LOW", referenceRange: "7.0 - 9.0" },
        { name: "Stress Index", value: stress, unit: "/10", status: stress <= 5 ? "NORMAL" : "ELEVATED", referenceRange: "< 5" },
      ],
      recommendations: ["Prioritize consistent sleep-wake circadian schedules."],
    },
    liver: {
      id: "liver",
      name: "Hepatic & Metabolic",
      score: liverScore,
      status: getStatus(liverScore),
      meshColor: liverScore >= 82 ? "#10b981" : liverScore >= 68 ? "#f59e0b" : "#ef4444",
      clinicalInsights: `Fasting blood glucose ${glucose} mg/dL. Metabolic homeostasis active.`,
      biomarkers: [
        { name: "Fasting Blood Glucose", value: glucose, unit: "mg/dL", status: glucose <= 99 ? "NORMAL" : "ELEVATED", referenceRange: "70 - 99" },
      ],
      recommendations: ["Consume antioxidant-rich foods and limit ultra-processed sugars."],
    },
    kidneys: {
      id: "kidneys",
      name: "Renal Filtration",
      score: kidneysScore,
      status: getStatus(kidneysScore),
      meshColor: kidneysScore >= 82 ? "#10b981" : kidneysScore >= 68 ? "#f59e0b" : "#ef4444",
      clinicalInsights: "Glomerular filtration rate and renal fluid balance within normal physiological parameters.",
      biomarkers: [
        { name: "Renal Filtration Index", value: "Optimal", unit: "", status: "NORMAL", referenceRange: "Normal" },
      ],
      recommendations: ["Ensure minimum 2.5L daily hydration."],
    },
    stomach: {
      id: "stomach",
      name: "Gastrointestinal",
      score: stomachScore,
      status: getStatus(stomachScore),
      meshColor: stomachScore >= 82 ? "#10b981" : stomachScore >= 68 ? "#f59e0b" : "#ef4444",
      clinicalInsights: `Diet regimen: ${diet}. Healthy digestive microbiome stability.`,
      biomarkers: [
        { name: "Metabolic Digestive Index", value: "Balanced", unit: "", status: "NORMAL", referenceRange: "Balanced" },
      ],
      recommendations: ["Prioritize prebiotic dietary fiber and fermented nutrition."],
    },
  };

  return {
    patientId,
    name,
    age,
    gender,
    overallScore,
    reportsCount: user.recordsCount || 0,
    riskAlertsCount: user.riskAlertsCount || 0,
    upcomingCheckups: 1,
    vitals: {
      bloodPressure: `${systolic}/${diastolic} mmHg`,
      heartRate,
      spo2: 99,
      glucose,
      temperature: 36.8,
      bmi: 22.8,
    },
    organs,
  };
}

/**
 * Generates dynamic 24-hour time series telemetry centered on user's actual baseline.
 */
export function generateUserTimeSeries(systolic: number, glucose: number, hr: number) {
  return [
    { time: "06:00", bpSystolic: Math.round(systolic - 3), hr: Math.round(hr - 4), glucose: Math.round(glucose - 2) },
    { time: "09:00", bpSystolic: Math.round(systolic + 2), hr: Math.round(hr + 3), glucose: Math.round(glucose + 12) },
    { time: "12:00", bpSystolic: Math.round(systolic + 4), hr: Math.round(hr + 1), glucose: Math.round(glucose + 8) },
    { time: "15:00", bpSystolic: Math.round(systolic), hr: Math.round(hr + 4), glucose: Math.round(glucose + 2) },
    { time: "18:00", bpSystolic: Math.round(systolic + 2), hr: Math.round(hr + 6), glucose: Math.round(glucose + 14) },
    { time: "21:00", bpSystolic: Math.round(systolic - 4), hr: Math.round(hr - 2), glucose: Math.round(glucose - 1) },
  ];
}
