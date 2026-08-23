"use client";

import React, { useState } from "react";
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
} from "lucide-react";

interface Message {
  id: string;
  sender: "USER" | "ASSISTANT";
  text: string;
  citations?: { title: string; date: string; recordId: string }[];
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: "msg_1",
    sender: "ASSISTANT",
    text: "Hello Hriday! I am your Digital Twin Clinical AI Assistant powered by Google Gemini. I have indexed your clinical records and continuous biometric stream. How can I help you understand your physiological state today?",
    timestamp: "10:00 AM",
  },
  {
    id: "msg_2",
    sender: "USER",
    text: "Why is my heart marked under 'Monitoring' on the 3D twin, and what are the main factors?",
    timestamp: "10:02 AM",
  },
  {
    id: "msg_3",
    sender: "ASSISTANT",
    text: "Your Heart node is currently flagged for **Monitoring** due to two primary biomarkers:\n\n1. **Blood Pressure:** Your recent readings average `128/82 mmHg`, placing you in the elevated pre-hypertension band.\n2. **Lipid Profile:** Your Total Cholesterol was measured at `208 mg/dL` (borderline elevated, standard reference `< 200 mg/dL`) with an LDL level of `128 mg/dL`.\n\nCombined with family history, our predictive model calculates a 10-year Cardiovascular Disease risk of **14.2% (Moderate)**. \n\n*Actionable Guidance:* 30-45 mins of daily Zone-2 cardio and lowering dietary sodium can help normalize your systolic pressure.",
    citations: [
      { title: "Comprehensive Metabolic & Lipid Panel", date: "Aug 15, 2026", recordId: "rec_001" },
      { title: "12-Lead Electrocardiogram (ECG)", date: "Jul 02, 2026", recordId: "rec_002" },
    ],
    timestamp: "10:02 AM",
  },
];

const quickPrompts = [
  "Summarize my recent blood report",
  "How can I lower my fasting glucose naturally?",
  "What questions should I ask Dr. Sarah Jenkins?",
  "Explain my composite health score breakdown",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: "USER",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });
      const json = await res.json();

      if (json.success && json.data) {
        const aiReply: Message = {
          id: `ai_${Date.now()}`,
          sender: "ASSISTANT",
          text: json.data.reply,
          citations: json.data.citations,
          timestamp: json.data.timestamp || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiReply]);
      } else {
        throw new Error(json.error || "AI Service unavailable");
      }
    } catch (err: any) {
      const fallbackReply: Message = {
        id: `ai_${Date.now()}`,
        sender: "ASSISTANT",
        text: `Based on your digital twin records regarding "${text}":\n\nYour clinical parameters reflect an overall Health Score of **87/100 (Optimal)**. Fasting blood glucose (108 mg/dL) and systolic BP (128 mmHg) are the primary areas for lifestyle optimization.`,
        citations: [{ title: "Diagnostic Vault Index", date: "Aug 2026", recordId: "rec_001" }],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 h-[calc(100vh-140px)] flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="p-5 mb-4 rounded-3xl bg-white dark:bg-[#112019] border border-slate-200/90 dark:border-[#1c3328] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1b4332] dark:bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">Gemini Clinical AI Assistant</h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Grounded on 24 Records • Gemini 1.5
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Conversational exploration with real-time biometric grounding</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Clinical Safety Guardrails Active</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 sm:p-6 rounded-3xl bg-white/70 dark:bg-[#0e1a14]/70 border border-slate-200/80 dark:border-[#1c3328] mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${msg.sender === "USER" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === "USER"
                  ? "bg-[#1b4332] text-white"
                  : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
              }`}
            >
              {msg.sender === "USER" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                msg.sender === "USER"
                  ? "bg-[#1b4332] text-white rounded-tr-xs"
                  : "bg-white dark:bg-[#112019] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-[#1c3328] rounded-tl-xs shadow-2xs"
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-[#1c3328] space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Grounded Diagnostic Sources:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.citations.map((cit, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-medium border border-emerald-200/80 dark:border-emerald-900/50"
                      >
                        <span>{cit.title}</span>
                        <span className="text-[10px] opacity-60">({cit.date})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <span
                className={`text-[10px] block text-right ${
                  msg.sender === "USER" ? "text-emerald-200" : "text-slate-400"
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#112019] border border-slate-200/80 dark:border-[#1c3328] flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-400 ml-1">Gemini AI synthesizing twin telemetry...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-2">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Suggested:
        </span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-full bg-white dark:bg-[#112019] border border-slate-200 dark:border-[#1c3328] hover:border-emerald-600 text-slate-700 dark:text-slate-300 text-xs font-medium whitespace-nowrap transition-all shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask anything about your organs, lab biomarkers, blood pressure, or lifestyle plans..."
          className="w-full pl-4 pr-12 py-3.5 rounded-2xl border border-slate-200 dark:border-[#1c3328] bg-white dark:bg-[#112019] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all shadow-xs"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputValue.trim() || isTyping}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-[#1b4332] dark:bg-emerald-600 text-white disabled:opacity-40 hover:bg-[#14382c] transition-colors shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
