"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "PATIENT" | "DOCTOR" | "RESEARCHER" | "ADMIN";
  overallScore: number;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (email?: string) => void;
  logout: () => void;
}

const defaultUser: UserProfile = {
  id: "pt_1029384",
  name: "Alex Mercer",
  email: "alex.mercer@example.com",
  role: "PATIENT",
  overallScore: 87,
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Read stored auth or detect dashboard routes
  useEffect(() => {
    const storedAuth = localStorage.getItem("twinhealth_auth");
    if (storedAuth === "true") {
      setIsLoggedIn(true);
      setUser(defaultUser);
    } else if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/digital-twin") ||
      pathname.startsWith("/records") ||
      pathname.startsWith("/predictions") ||
      pathname.startsWith("/simulator") ||
      pathname.startsWith("/assistant")
    ) {
      // If user directly navigated to an app page, keep them logged in
      setIsLoggedIn(true);
      setUser(defaultUser);
      localStorage.setItem("twinhealth_auth", "true");
    }
  }, [pathname]);

  const login = (email = "alex.mercer@example.com") => {
    setIsLoggedIn(true);
    setUser({ ...defaultUser, email });
    localStorage.setItem("twinhealth_auth", "true");
    router.push("/dashboard");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("twinhealth_auth");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
