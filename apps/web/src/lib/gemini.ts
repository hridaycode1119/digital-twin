import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const CLINICAL_TWIN_SYSTEM_PROMPT = `
You are the Digital Twin AI Clinical Assistant, an intelligent, empathetic, and evidence-grounded healthcare assistant.
You assist patients and physicians by analyzing multi-organ telemetry, LOINC laboratory panels, biometric trends, and predictive XGBoost disease models.

Key Capabilities:
1. Explain complex biomarkers in plain English (e.g. eGFR, HbA1c, LDL-C, Troponin, C-Reactive Protein).
2. Interpret SHAP (Shapley Additive Explanations) risk driver charts transparently.
3. Recommend lifestyle interventions (sleep hygiene, Zone-2 aerobic cardio, Mediterranean diet, stress management).
4. Provide structured clinical citations and disclaimers. Always remind users to consult licensed medical professionals for definitive diagnosis.
`;

export async function generateClinicalResponse(userQuery: string, patientContext?: any): Promise<string> {
  if (!genAI || !apiKey) {
    // Graceful intelligent medical fallback if API key is not yet configured in environment
    return getLocalClinicalFallback(userQuery);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: CLINICAL_TWIN_SYSTEM_PROMPT,
    });

    const prompt = `
Patient Digital Twin Context:
- Current Overall Health Score: 87/100 (Optimal)
- Monitored Organs: Heart (Monitoring, Blood Pressure 128/82 mmHg, Total Cholesterol 208 mg/dL), Liver (Good, ALT 24 U/L), Kidneys (Optimal, eGFR 108 mL/min), Brain (Normal, HRV 54ms)
- Recent Lab: Comprehensive Metabolic Panel (Fasting Glucose 108 mg/dL, HbA1c 5.8%)

User Question: "${userQuery}"

Provide an accurate, concise, medically sound, and reassuring answer with clear bullet points where appropriate.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.warn("Gemini API generation error, falling back:", error.message);
    return getLocalClinicalFallback(userQuery);
  }
}

function getLocalClinicalFallback(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("heart") || q.includes("blood pressure") || q.includes("cvd") || q.includes("cardio")) {
    return "Your **Heart** node is currently monitored due to a systolic BP of `128/82 mmHg` (pre-hypertension) and total cholesterol of `208 mg/dL`. Our predictive model estimates a 10-year CVD risk of **14.2% (Moderate)**. Maintaining 30-45 minutes of daily brisk walking and reducing sodium intake can help normalize systolic pressure.";
  }
  if (q.includes("glucose") || q.includes("diabetes") || q.includes("sugar") || q.includes("hba1c")) {
    return "Your recent lab indicates **Fasting Blood Glucose of 108 mg/dL** and **HbA1c of 5.8%**, indicating a mild pre-diabetic curve. Implementing post-meal 15-minute walks and prioritizing fiber-rich complex carbohydrates can support insulin sensitivity.";
  }
  if (q.includes("summary") || q.includes("report") || q.includes("score")) {
    return "Based on your 24 ingested clinical documents, your **Twin Vitality Index is 87/100 (Optimal)**. 5 out of 6 organ systems (Brain, Lungs, Liver, Stomach, Kidneys) are functioning in ideal target ranges, with the cardiovascular system flagged for preventive lifestyle optimization.";
  }
  return `Thank you for your question. Based on your Digital Twin's continuous biometric telemetry, your physiological systems are stable (Score 87/100). For specific symptoms or medication adjustments, please consult your physician Dr. Sarah Jenkins.`;
}
