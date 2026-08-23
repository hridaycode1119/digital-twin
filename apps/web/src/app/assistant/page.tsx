"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  Bot,
  User,
  FileText,
  ShieldAlert,
  HelpCircle,
  Clock,
  ArrowRight,
  ExternalLink,
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
    text: "Hello Alex! I am your AI Health Assistant. I have indexed your 24 medical records, including your latest Comprehensive Metabolic Panel from Aug 15, 2026. How can I help you understand your Digital Twin state today?",
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
    text: "Your Heart node is currently flagged for **Monitoring** due to two primary biomarkers:\n\n1. **Blood Pressure:** Your recent readings average `128/82 mmHg`, placing you in the elevated pre-hypertension band.\n2. **Lipid Profile:** Your Total Cholesterol was measured at `208 mg/dL` (borderline elevated, standard reference `< 200 mg/dL`) with an LDL level of `128 mg/dL`.\n\nCombined with your family history of hypertension, our XGBoost model calculates a 10-year Cardiovascular Disease risk of **14.2% (Moderate)**. \n\n*Actionable Guidance:* Increasing moderate aerobic activity to 45 mins/day and reducing dietary sodium can help bring your systolic pressure back below 120 mmHg.",
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

  const handleSend = (textToSend?: string) => {
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

    setTimeout(() => {
      setIsTyping(false);
      const aiReply: Message = {
        id: `ai_${Date.now()}`,
        sender: "ASSISTANT",
        text: `Based on your recent diagnostic reports and vitals history regarding "${text}":\n\nYour clinical parameters indicate stable organ function overall with a Health Score of **87/100**. Your fasting glucose (108 mg/dL) remains the key metric to monitor. Regular physical activity (8,500+ steps) and minimizing processed sugars are strongly supported by current clinical guidelines to optimize this score.\n\n*Reminder: This is educational guidance based on your Digital Twin records.*`,
        citations: [
          { title: "Comprehensive Metabolic & Lipid Panel", date: "Aug 15, 2026", recordId: "rec_001" },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="glass-card rounded-3xl p-5 mb-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">RAG AI Health Assistant</h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Grounded on 24 Records
              </span>
            </div>
            <p className="text-xs text-slate-500">Conversational exploration with document citations</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldAlert className="w-4 h-4 text-blue-500" />
          <span>Non-Prescriptive Safety Guardrails Active</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 glass-card rounded-3xl mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === "USER" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "ASSISTANT" && (
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === "USER"
                  ? "bg-blue-600 text-white font-medium rounded-tr-sm shadow-md"
                  : "bg-white border border-slate-200/80 text-slate-800 rounded-tl-sm shadow-xs"
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Document Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-blue-500" /> Referenced Sources:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.citations.map((cite, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50/80 text-blue-700 text-[11px] font-semibold border border-blue-200/60"
                      >
                        {cite.title} ({cite.date})
                        <ExternalLink className="w-3 h-3 text-blue-500" />
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <span
                className={`block text-[10px] mt-1.5 ${
                  msg.sender === "USER" ? "text-blue-100 text-right" : "text-slate-400"
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === "USER" && (
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl text-xs text-slate-500 flex items-center gap-2">
              <span>Retrieving medical record vectors & generating grounded answer...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-full bg-white/80 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 shrink-0 transition-colors shadow-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a question about your blood tests, vitals, or health score..."
          className="flex-1 px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <button
          onClick={() => handleSend()}
          className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 flex items-center gap-1.5 transition-colors"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </div>
  );
}
