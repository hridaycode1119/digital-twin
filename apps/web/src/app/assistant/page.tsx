"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldAlert,
  HelpCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Heart,
  Activity,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Message {
  id: string;
  sender: "USER" | "ASSISTANT";
  text: string;
  citations?: { title: string; date: string; recordId: string }[];
  timestamp: string;
}

const quickPrompts = [
  "Summarize my physiological digital twin status",
  "How can I optimize my blood pressure naturally?",
  "What questions should I ask my physician?",
  "Explain my composite health score breakdown",
];

export default function AssistantPage() {
  const { user, twin, records } = useAuth();
  const patientName = user?.name || "Patient";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg_init",
      sender: "ASSISTANT",
      text: `Hello ${patientName}! I am your Digital Twin Clinical AI Assistant powered by Google Gemini. I have indexed your biometrics (BP ${user?.bloodPressure || "120/80"}, Glucose ${user?.fastingGlucose || 95} mg/dL, Twin Score ${twin.overallScore}/100) and ${records.length} clinical records. How can I assist you with your health today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: "USER",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          patientContext: {
            name: patientName,
            age: user?.age || 26,
            gender: user?.gender || "Male",
            bloodPressure: user?.bloodPressure || "120/80",
            fastingGlucose: user?.fastingGlucose || 95,
            overallScore: twin.overallScore,
            recordsCount: records.length,
            recentRecords: records.map((r) => ({ title: r.title, date: r.date, summary: r.aiSummary })),
          },
        }),
      });

      const data = await response.json();

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: "ASSISTANT",
        text:
          data.reply ||
          `Based on your Digital Twin parameters, your vitals and organ scores are in the ${twin.overallScore >= 82 ? "optimal" : "monitoring"} band. Continue adhering to your lifestyle regimen.`,
        citations: data.citations || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: "ASSISTANT",
        text: `Your current biometric readings show Blood Pressure at **${user?.bloodPressure || "120/80"}** and Fasting Glucose at **${user?.fastingGlucose || 95} mg/dL**, yielding a healthy Twin Vitality Score of **${twin.overallScore}/100**. Keep maintaining regular aerobic exercise and balanced nutrition.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-6 transition-colors duration-300">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
              Google Gemini 1.5 Clinical AI
            </span>
            <span className="text-xs text-slate-400 font-mono">Patient: {patientName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-serif">
            Digital Twin AI Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Ask questions grounded directly in your personal biomarkers, records, and 3D physiological models.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-4 py-2 rounded-2xl border border-emerald-200 dark:border-emerald-900">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Biometric Grounding Active</span>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chat History & Input (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] shadow-xs flex flex-col h-[640px]">
          {/* Scrollable Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === "USER" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ASSISTANT" && (
                  <div className="w-8 h-8 rounded-full bg-[#1b4332] text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl p-4 rounded-3xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                    msg.sender === "USER"
                      ? "bg-[#1b4332] dark:bg-emerald-600 text-white rounded-tr-none shadow-xs"
                      : "bg-slate-50 dark:bg-[#0c1611] text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/70 dark:border-[#1c3328]"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60 dark:border-[#1c3328] space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        Evidence Sources:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.citations.map((cite, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-[#112019] border border-slate-200 dark:border-[#1c3328] text-[10px] font-semibold text-emerald-800 dark:text-emerald-400"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            {cite.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <span
                    className={`block text-[10px] text-right ${
                      msg.sender === "USER" ? "text-emerald-200" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === "USER" && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    {patientName[0]}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-[#1b4332] text-white flex items-center justify-center shrink-0 text-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#0c1611] border border-slate-200/70 dark:border-[#1c3328] text-xs text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  Gemini is analyzing {patientName}&apos;s continuous telemetry...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="pt-4 border-t border-slate-100 dark:border-[#1c3328] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask Gemini about ${patientName}'s biometrics, reports, or care plan...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-[#1c3328] bg-white dark:bg-[#0c1611] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-3 rounded-2xl bg-[#1b4332] hover:bg-[#14382c] dark:bg-emerald-600 text-white disabled:opacity-40 transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Grounded Biometrics & Quick Prompts (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Grounded Vitals Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-3 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Grounded Physiological Stream
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1611] flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Blood Pressure</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{user?.bloodPressure || "120/80"} mmHg</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1611] flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Fasting Glucose</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{user?.fastingGlucose || 95} mg/dL</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1611] flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Twin Vitality Score</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">{twin.overallScore}/100</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1611] flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Indexed Reports</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{records.length} Documents</span>
              </div>
            </div>
          </div>

          {/* Suggested Quick Prompts */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] space-y-3 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Suggested Questions
            </h3>

            <div className="space-y-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1611] border border-slate-200/60 dark:border-[#1c3328] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{prompt}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
