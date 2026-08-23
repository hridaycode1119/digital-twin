import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

export const metadata: Metadata = {
  title: "Digital Twin — AI-Powered 3D Virtual Patient & Health Intelligence",
  description: "Synthesize clinical lab reports, predict disease risks, and simulate multi-organ health with zero hardware or devices required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased flex flex-col min-h-screen transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <ScrollProgress />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
