"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PatientTwinState } from "@/types/twin";
import { generatePersonalizedTwin } from "@/lib/physiology";

export interface UserMedicalRecord {
  id: string;
  title: string;
  category: string;
  date: string;
  facility: string;
  status: "VERIFIED" | "EXTRACTED" | "PROCESSING";
  abnormalCount: number;
  extractedValues: {
    name: string;
    value: number | string;
    unit: string;
    range: string;
    isAbnormal: boolean;
  }[];
  aiSummary: string;
  doctorQuestions: string[];
}

export interface UserProfile {
  id: string;
  patientId: string;
  name: string;
  email: string;
  role: "PATIENT" | "DOCTOR" | "RESEARCHER" | "ADMIN";
  overallScore: number;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  heightCm?: number;
  weightKg?: number;
  bloodPressure?: string;
  heartRate?: number;
  fastingGlucose?: number;
  totalCholesterol?: number;
  hdl?: number;
  ldl?: number;
  triglycerides?: number;
  creatinine?: number;
  hemoglobin?: number;
  hba1c?: number;
  sleepHours?: number;
  exerciseDays?: number;
  dietType?: string;
  smoking?: string;
  stressLevel?: number;
  allergies?: string;
  familyHistory?: string;
  recordsCount?: number;
  riskAlertsCount?: number;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  twin: PatientTwinState;
  records: UserMedicalRecord[];
  login: (userData: Partial<UserProfile> | string) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  addRecord: (record: Omit<UserMedicalRecord, "id">) => void;
  deleteRecord: (id: string) => void;
  syncManualParameters: (params: {
    bloodPressure?: string;
    fastingGlucose?: number;
    heartRate?: number;
    age?: number;
    heightCm?: number;
    weightKg?: number;
    sleepHours?: number;
    exerciseDays?: number;
    dietType?: string;
    smoking?: string;
    stressLevel?: number;
  }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  twin: generatePersonalizedTwin({ name: "Visitor" }),
  records: [],
  login: () => {},
  updateUser: () => {},
  addRecord: () => {},
  deleteRecord: () => {},
  syncManualParameters: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [records, setRecords] = useState<UserMedicalRecord[]>([]);
  const router = useRouter();

  // Load user & records from localStorage on client mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("digitaltwin_user");
      if (storedUser) {
        const parsed: UserProfile = JSON.parse(storedUser);
        if (parsed && parsed.email) {
          setUser(parsed);
          setIsLoggedIn(true);

          const storedRecords = localStorage.getItem(`digitaltwin_records_${parsed.patientId}`);
          if (storedRecords) {
            setRecords(JSON.parse(storedRecords));
          }
        }
      }
    } catch (e) {
      console.warn("Could not load stored user session:", e);
    }
  }, []);

  // Compute live physiological twin state from latest uploaded report or manual calibration
  const twin = useMemo(() => {
    const latestRecord = records.length > 0 ? records[0] : undefined;
    if (!user) {
      return generatePersonalizedTwin({ name: "Guest" }, latestRecord);
    }
    return generatePersonalizedTwin({ ...user, recordsCount: records.length }, latestRecord);
  }, [user, records]);

  const login = (userData: Partial<UserProfile> | string) => {
    let profile: UserProfile;

    if (typeof userData === "string") {
      const email = userData.trim().toLowerCase();
      const derivedName = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const patientId = `pt_${Date.now().toString().slice(-6)}`;
      profile = {
        id: `usr_${Date.now()}`,
        patientId,
        name: derivedName || "Patient",
        email,
        role: "PATIENT",
        overallScore: 88,
        age: 26,
        gender: "Male",
        bloodPressure: "120/80",
        heartRate: 72,
        fastingGlucose: 95,
        totalCholesterol: 185,
        sleepHours: 7.5,
        exerciseDays: 4,
        dietType: "Balanced / Mediterranean",
        smoking: "Never",
        stressLevel: 3,
        recordsCount: 0,
        riskAlertsCount: 0,
      };
    } else {
      const patientId = userData.patientId || `pt_${Date.now().toString().slice(-6)}`;
      profile = {
        id: userData.id || `usr_${Date.now()}`,
        patientId,
        name: userData.name || (userData.email ? userData.email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Patient"),
        email: (userData.email || "user@digitaltwin.health").toLowerCase(),
        role: userData.role || "PATIENT",
        overallScore: userData.overallScore || 88,
        age: userData.age || 26,
        gender: userData.gender || "Male",
        bloodGroup: userData.bloodGroup || "B+",
        heightCm: userData.heightCm || 175,
        weightKg: userData.weightKg || 70,
        bloodPressure: userData.bloodPressure || "120/80",
        heartRate: userData.heartRate || 72,
        fastingGlucose: userData.fastingGlucose || 95,
        totalCholesterol: userData.totalCholesterol || 185,
        hdl: userData.hdl || 54,
        ldl: userData.ldl || 105,
        triglycerides: userData.triglycerides || 135,
        creatinine: userData.creatinine || 0.9,
        hemoglobin: userData.hemoglobin || 15.2,
        sleepHours: userData.sleepHours || 7.5,
        exerciseDays: userData.exerciseDays || 4,
        dietType: userData.dietType || "Balanced / Mediterranean",
        smoking: userData.smoking || "Never",
        stressLevel: userData.stressLevel || 3,
        allergies: userData.allergies || "None",
        familyHistory: userData.familyHistory || "None",
        recordsCount: userData.recordsCount || 0,
        riskAlertsCount: userData.riskAlertsCount || 0,
      };
    }

    setUser(profile);
    setIsLoggedIn(true);

    try {
      localStorage.setItem("digitaltwin_user", JSON.stringify(profile));
      const storedRecs = localStorage.getItem(`digitaltwin_records_${profile.patientId}`);
      if (storedRecs) {
        setRecords(JSON.parse(storedRecs));
      } else {
        setRecords([]);
      }
    } catch (e) {
      console.warn("Storage write failed:", e);
    }
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem("digitaltwin_user", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const addRecord = (newRec: Omit<UserMedicalRecord, "id">) => {
    const record: UserMedicalRecord = {
      ...newRec,
      id: `rec_${Date.now()}`,
    };

    // Extract all updated clinical biomarkers directly from uploaded report
    const updates: Partial<UserProfile> = {
      recordsCount: (records.length || 0) + 1,
    };

    for (const item of record.extractedValues || []) {
      const n = item.name.toLowerCase();
      const val = typeof item.value === "string" ? parseFloat(item.value) : item.value;
      if (!isNaN(val)) {
        if (n.includes("glucose") || n.includes("sugar")) updates.fastingGlucose = val;
        if (n.includes("heart rate") || n.includes("pulse")) updates.heartRate = val;
        if (n.includes("total cholesterol") || (n.includes("cholesterol") && !n.includes("hdl") && !n.includes("ldl"))) {
          updates.totalCholesterol = val;
        }
        if (n.includes("hdl")) updates.hdl = val;
        if (n.includes("ldl")) updates.ldl = val;
        if (n.includes("triglyceride")) updates.triglycerides = val;
        if (n.includes("creatinine")) updates.creatinine = val;
        if (n.includes("hemoglobin") || n.includes("hb")) updates.hemoglobin = val;
        if (n.includes("hba1c")) updates.hba1c = val;
      }
      if (n.includes("blood pressure") && typeof item.value === "string") {
        updates.bloodPressure = item.value;
      } else if (n.includes("systolic") && !isNaN(val)) {
        const currentDiastolic = user?.bloodPressure?.split("/")[1] || "80";
        updates.bloodPressure = `${val}/${currentDiastolic}`;
      }
    }

    // Save records
    setRecords((prev) => {
      const updated = [record, ...prev];
      if (user?.patientId) {
        try {
          localStorage.setItem(`digitaltwin_records_${user.patientId}`, JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });

    // Immediately update patient profile state with extracted biomarkers
    updateUser(updates);
  };

  const syncManualParameters = (params: {
    bloodPressure?: string;
    fastingGlucose?: number;
    heartRate?: number;
    age?: number;
    heightCm?: number;
    weightKg?: number;
    sleepHours?: number;
    exerciseDays?: number;
    dietType?: string;
    smoking?: string;
    stressLevel?: number;
  }) => {
    updateUser(params);
  };

  const deleteRecord = (id: string) => {
    setRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      if (user?.patientId) {
        try {
          localStorage.setItem(`digitaltwin_records_${user.patientId}`, JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setRecords([]);
    try {
      localStorage.removeItem("digitaltwin_user");
    } catch (e) {}
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        twin,
        records,
        login,
        updateUser,
        addRecord,
        deleteRecord,
        syncManualParameters,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
