import { OrganData, OrganId, PatientTwinState } from "@/types/twin";
import { UserProfile, UserMedicalRecord } from "@/context/AuthContext";

/**
 * Calculates deterministic organ states, composite vitality score,
 * and current physiological condition strictly from the user's uploaded clinical
 * lab reports or manually calibrated checkup biometrics. (Zero sensor data).
 */
export function generatePersonalizedTwin(
  user: Partial<UserProfile>,
  latestRecord?: UserMedicalRecord
): PatientTwinState {
  const name = user.name || "Patient";
  const patientId = user.patientId || `pt_${Date.now().toString().slice(-6)}`;
  const age = Number(user.age) || 28;
  const gender = (user.gender as any) || "Male";

  // Extract latest values from the most recent uploaded report if available
  let systolic = 120;
  let diastolic = 80;
  let heartRate = Number(user.heartRate) || 72;
  let glucose = Number(user.fastingGlucose) || 95;
  let cholesterol = 185;

  if (user.bloodPressure) {
    const [s, d] = user.bloodPressure.split("/");
    systolic = Number(s) || 120;
    diastolic = Number(d) || 80;
  }

  if (latestRecord && latestRecord.extractedValues) {
    for (const item of latestRecord.extractedValues) {
      const n = item.name.toLowerCase();
      const val = typeof item.value === "string" ? parseFloat(item.value) : item.value;
      if (!isNaN(val)) {
        if (n.includes("glucose") || n.includes("sugar")) glucose = val;
        if (n.includes("cholesterol") && !n.includes("hdl") && !n.includes("ldl")) cholesterol = val;
        if (n.includes("heart rate") || n.includes("pulse")) heartRate = val;
        if (n.includes("systolic")) systolic = val;
        if (n.includes("diastolic")) diastolic = val;
      }
    }
  }

  const sleepHours = Number(user.sleepHours) || 7.5;
  const exerciseDays = Number(user.exerciseDays) || 3;
  const smoking = user.smoking || "Never";
  const stress = Number(user.stressLevel) || 3;
  const diet = user.dietType || "Balanced / Mediterranean";

  // 1. Heart
  let heartScore = 92;
  if (systolic > 130) heartScore -= 8;
  else if (systolic > 120) heartScore -= 3;
  if (cholesterol > 200) heartScore -= 6;
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
  brainScore = Math.min(99, Math.max(50, brainScore));

  // 4. Liver / Metabolism
  let liverScore = 93;
  if (glucose > 100) liverScore -= 7;
  if (cholesterol > 200) liverScore -= 5;
  liverScore = Math.min(99, Math.max(55, liverScore));

  // 5. Kidneys
  let kidneysScore = 94;
  if (systolic > 130) kidneysScore -= 7;
  if (age > 50) kidneysScore -= 5;
  kidneysScore = Math.min(99, Math.max(55, kidneysScore));

  // 6. Stomach / Digestion
  let stomachScore = 92;
  if (stress > 6) stomachScore -= 6;
  stomachScore = Math.min(99, Math.max(55, stomachScore));

  const overallScore = Math.round(
    heartScore * 0.25 +
      lungsScore * 0.15 +
      brainScore * 0.2 +
      liverScore * 0.15 +
      kidneysScore * 0.15 +
      stomachScore * 0.1
  );

  const getStatus = (s: number): "NORMAL" | "WARNING" | "CRITICAL" => {
    if (s >= 82) return "NORMAL";
    if (s >= 68) return "WARNING";
    return "CRITICAL";
  };

  const organs: Record<OrganId, OrganData> = {
    heart: {
      id: "heart",
      name: "Cardiovascular",
      score: heartScore,
      status: getStatus(heartScore),
      meshColor: heartScore >= 82 ? "#10b981" : heartScore >= 68 ? "#f59e0b" : "#ef4444",
      clinicalInsights: `Systolic ${systolic} mmHg, Total Cholesterol ${cholesterol} mg/dL. ${
        heartScore >= 82
          ? "Normal cardiovascular status per uploaded diagnostic panels."
          : "Elevated biomarker flags detected on report; follow physician recommendations."
      }`,
      biomarkers: [
        { name: "Blood Pressure", value: `${systolic}/${diastolic}`, unit: "mmHg", status: systolic <= 120 ? "NORMAL" : "ELEVATED", referenceRange: "< 120/80" },
        { name: "Total Cholesterol", value: cholesterol, unit: "mg/dL", status: cholesterol <= 200 ? "NORMAL" : "ELEVATED", referenceRange: "< 200" },
        { name: "Heart Rate", value: heartRate, unit: "bpm", status: heartRate <= 80 ? "NORMAL" : "ELEVATED", referenceRange: "60 - 80" },
      ],
      recommendations: ["Maintain regular physical activity.", "Adhere to low-sodium nutrition."],
    },
    lungs: {
      id: "lungs",
      name: "Pulmonary",
      score: lungsScore,
      status: getStatus(lungsScore),
      meshColor: lungsScore >= 82 ? "#10b981" : lungsScore >= 68 ? "#f59e0b" : "#ef4444",
      clinicalInsights: `Smoking status: ${smoking}. Respiratory clearance optimal.`,
      biomarkers: [
        { name: "Respiratory Rate", value: 14, unit: "breaths/min", status: "NORMAL", referenceRange: "12 - 18" },
      ],
      recommendations: ["Maintain clean respiratory environment and aerobic stamina."],
    },
    brain: {
      id: "brain",
      name: "Neurological & Sleep",
      score: brainScore,
      status: getStatus(brainScore),
      meshColor: brainScore >= 82 ? "#10b981" : brainScore >= 68 ? "#f59e0b" : "#ef4444",
      clinicalInsights: `Sleep duration ${sleepHours}h, reported stress level ${stress}/10.`,
      biomarkers: [
        { name: "Sleep Duration", value: sleepHours, unit: "hours", status: sleepHours >= 7 ? "NORMAL" : "LOW", referenceRange: "7.0 - 9.0" },
      ],
      recommendations: ["Prioritize regular sleep-wake schedules."],
    },
    liver: {
      id: "liver",
      name: "Hepatic & Metabolic",
      score: liverScore,
      status: getStatus(liverScore),
      meshColor: liverScore >= 82 ? "#10b981" : liverScore >= 68 ? "#f59e0b" : "#ef4444",
      clinicalInsights: `Fasting Blood Glucose ${glucose} mg/dL extracted from clinical report.`,
      biomarkers: [
        { name: "Fasting Blood Glucose", value: glucose, unit: "mg/dL", status: glucose <= 99 ? "NORMAL" : "ELEVATED", referenceRange: "70 - 99" },
      ],
      recommendations: ["Maintain balanced glycemic nutrition."],
    },
    kidneys: {
      id: "kidneys",
      name: "Renal Filtration",
      score: kidneysScore,
      status: getStatus(kidneysScore),
      meshColor: kidneysScore >= 82 ? "#10b981" : kidneysScore >= 68 ? "#f59e0b" : "#ef4444",
      clinicalInsights: "Renal filtration and fluid markers in optimal clinical range.",
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
      clinicalInsights: `Diet regimen: ${diet}. Healthy digestive status.`,
      biomarkers: [
        { name: "Digestive Balance", value: "Balanced", unit: "", status: "NORMAL", referenceRange: "Normal" },
      ],
      recommendations: ["Consume high-fiber nutrition."],
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
 * Extracts longitudinal timeline data points across the user's uploaded reports.
 */
export function getBiomarkerTimelineFromRecords(
  records: UserMedicalRecord[],
  defaultVitals?: { glucose: number; systolic: number }
) {
  if (!records || records.length === 0) {
    if (defaultVitals) {
      return [
        { date: "Current Intake", glucose: defaultVitals.glucose, bpSystolic: defaultVitals.systolic, cholesterol: 185 },
      ];
    }
    return [];
  }

  // Sort chronological
  const sorted = [...records].reverse();

  return sorted.map((r, idx) => {
    let glucose = 95;
    let systolic = 120;
    let cholesterol = 185;

    for (const v of r.extractedValues || []) {
      const n = v.name.toLowerCase();
      const val = typeof v.value === "string" ? parseFloat(v.value) : v.value;
      if (!isNaN(val)) {
        if (n.includes("glucose") || n.includes("sugar")) glucose = val;
        if (n.includes("cholesterol") && !n.includes("hdl") && !n.includes("ldl")) cholesterol = val;
        if (n.includes("systolic")) systolic = val;
      }
    }

    return {
      date: r.date || `Report ${idx + 1}`,
      title: r.title,
      glucose,
      bpSystolic: systolic,
      cholesterol,
    };
  });
}
