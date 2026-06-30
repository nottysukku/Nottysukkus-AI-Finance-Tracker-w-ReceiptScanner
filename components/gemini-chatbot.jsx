"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, Bot, User, Sparkles, Minimize2 } from "lucide-react";

const QUICK_SUGGESTIONS = [
  "How do I add a transaction?",
  "How does receipt scanning work?",
  "Help me set a budget",
  "What features are available?",
];

export default function GeminiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey there! 👋 I'm **Money AI**, your finance assistant. I can help you navigate the platform, set up budgets, track expenses, and more. What can I help you with?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;

    const userMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Build conversation history for context
      const history = messages.slice(-6);

      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history,
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      const botResponse =
        data?.response ||
        "I'm having trouble connecting right now. Please try again in a moment!";

      setMessages((prev) => [...prev, { role: "assistant", content: botResponse }]);
    } catch (err) {
      console.error("Gemini chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't connect to the AI service. You can still explore the app — try the Dashboard or AI Advisor page for help!",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Render markdown-lite (bold only)
  const renderContent = (text) => {
    return text.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group"
          aria-label="Open AI Chat"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-60 group-hover:opacity-90 transition-opacity animate-pulse" />
            <div className="relative w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-white/10">
            Ask Money AI ✨
          </div>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-out ${
            isMinimized
              ? "bottom-6 right-6 w-72"
              : "bottom-6 right-6 w-[380px] h-[520px] max-h-[80vh]"
          }`}
        >
          <div className={`flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-white/10 ${isMinimized ? "" : "h-full"}`}
            style={{
              background: "var(--chat-bg, rgba(255,255,255,0.92))",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="font-semibold text-sm leading-tight">Money AI</div>
                  <div className="text-[10px] text-white/70 font-light">Powered by Gemini</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="Minimize"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { setIsOpen(false); setIsMinimized(false); }}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/50">
                  {messages.map((msg, idx) => {
                    const isBot = msg.role === "assistant";
                    return (
                      <div
                        key={idx}
                        className={`flex gap-2 ${isBot ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                        style={{ maxWidth: "88%" }}
                      >
                        <div
                          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                            isBot
                              ? "bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400"
                              : "bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400"
                          }`}
                        >
                          {isBot ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                        </div>
                        <div
                          className={`px-3 py-2 rounded-2xl text-[13px] leading-relaxed ${
                            isBot
                              ? "bg-white dark:bg-slate-800/80 text-slate-700 dark:text-gray-200 rounded-tl-sm border border-slate-200/60 dark:border-white/5"
                              : "bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-tr-sm"
                          }`}
                        >
                          <p className="whitespace-pre-line">{renderContent(msg.content)}</p>
                        </div>
                      </div>
                    );
                  })}
                  {isTyping && (
                    <div className="flex gap-2 mr-auto" style={{ maxWidth: "80%" }}>
                      <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                        <Bot className="h-3.5 w-3.5 animate-pulse" />
                      </div>
                      <div className="px-3 py-2 rounded-2xl text-[13px] bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/5 text-slate-400 dark:text-purple-300">
                        <div className="flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick suggestions (persisting) */}
                <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-slate-200/50 dark:border-white/5 bg-white/50 dark:bg-slate-900/50">
                  {QUICK_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSend(s)}
                      className="px-2.5 py-1 rounded-full text-[11px] bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border border-purple-200/50 dark:border-purple-500/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="p-3 border-t border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 flex gap-2 items-center shrink-0"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about any feature..."
                    className="flex-1 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-400 dark:focus:border-purple-500 outline-none transition"
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    disabled={isTyping || !input.trim()}
                    className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Inject theme-aware CSS variable for chat background */}
      <style jsx global>{`
        :root {
          --chat-bg: rgba(255, 255, 255, 0.92);
        }
        .dark {
          --chat-bg: rgba(15, 23, 42, 0.92);
        }
      `}</style>
    </>
  );
}
