"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface UserProfile {
  id: string;
  patientId: string;
  name: string;
  email: string;
  role: "PATIENT" | "DOCTOR" | "RESEARCHER" | "ADMIN";
  overallScore: number;
  age?: number;
  gender?: string;
  bloodPressure?: string;
  fastingGlucose?: number;
  recordsCount?: number;
  riskAlertsCount?: number;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (userData: Partial<UserProfile> | string) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  updateUser: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  // Load actual user from localStorage on client mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("digitaltwin_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.email) {
          setUser(parsed);
          setIsLoggedIn(true);
        }
      }
    } catch (e) {
      console.warn("Could not parse stored session:", e);
    }
  }, []);

  const login = (userData: Partial<UserProfile> | string) => {
    let profile: UserProfile;

    if (typeof userData === "string") {
      const email = userData.trim();
      const derivedName = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      profile = {
        id: `usr_${Date.now()}`,
        patientId: `pt_${Date.now().toString().slice(-6)}`,
        name: derivedName || "Patient",
        email,
        role: "PATIENT",
        overallScore: 85,
        recordsCount: 0,
        riskAlertsCount: 0,
      };
    } else {
      profile = {
        id: userData.id || `usr_${Date.now()}`,
        patientId: userData.patientId || `pt_${Date.now().toString().slice(-6)}`,
        name: userData.name || (userData.email ? userData.email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Patient"),
        email: userData.email || "user@digitaltwin.health",
        role: userData.role || "PATIENT",
        overallScore: userData.overallScore || 85,
        age: userData.age || 32,
        gender: userData.gender || "Unspecified",
        bloodPressure: userData.bloodPressure || "120/80",
        fastingGlucose: userData.fastingGlucose || 95,
        recordsCount: userData.recordsCount || 0,
        riskAlertsCount: userData.riskAlertsCount || 0,
      };
    }

    setUser(profile);
    setIsLoggedIn(true);
    try {
      localStorage.setItem("digitaltwin_user", JSON.stringify(profile));
    } catch (e) {
      console.warn("Storage failed:", e);
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

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    try {
      localStorage.removeItem("digitaltwin_user");
    } catch (e) {}
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
