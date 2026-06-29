"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Send, Bot, User, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const QUICK_PROMPTS = [
  "Draft a strict budget plan for a student.",
  "Explain the difference between Snowball and Avalanche debt payoffs.",
  "How can I build an emergency fund from scratch?",
  "What is compound interest and why does it matter?",
];

export default function AdvisorClient({ userProfile }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Greetings, ${userProfile?.name || "citizen"}. I am your Nexus AI Financial Assistant. Ask me anything about budgeting, debt strategies, savings, or investments. How can I optimize your cashflow today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const apiKey = "AIzaSyDR_NdlD_W1WLAmitqtBxXbIHCn8aHtjQs";
      
      const systemContext = `You are a helpful, professional, and knowledgeable personal finance advisor on the Money platform.
      The user's name is ${userProfile?.name || "unknown"}.
      Their annual salary is $${userProfile?.salary || "60000"}.
      Their career bio / resume details: ${userProfile?.bio || "Not specified"}.
      Your goal is to provide concise, actionable financial advice tailored specifically to this user's profile. Use bullet points and clean markdown.
      Keep responses under 150 words.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemContext }],
            },
            contents: [
              {
                parts: [
                  {
                    text: `User asks: ${text}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reach Gemini API");
      }

      const data = await response.json();
      const botResponse =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I apologize, my cryptographic nodes are currently overloaded. Please query again shortly.";

      setMessages((prev) => [...prev, { role: "assistant", content: botResponse }]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate financial advice");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "System check failed: Connection to the intelligence core was interrupted. Please check your network.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 relative z-10">
      <div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-purple-500 dark:text-purple-400 animate-pulse-glow" />
          AI Financial Advisor
        </h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm md:text-base font-light">
          Futuristic financial intelligence core. Ask questions or run budget scenarios in real-time.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Quick prompt panel */}
        <div className="md:col-span-1 space-y-4">
          <div className="glass-panel p-4 rounded-2xl border border-slate-200/50 dark:border-white/10">
            <h3 className="text-xs font-mono font-bold text-purple-600 dark:text-purple-300 uppercase mb-3 flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" /> Quick Queries
            </h3>
            <div className="flex flex-col gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 hover:border-purple-500/30 text-[11px] text-slate-600 dark:text-gray-300 hover:text-slate-900 hover:dark:text-white transition-all text-ellipsis overflow-hidden leading-relaxed"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat terminal */}
        <div className="md:col-span-3 glass-panel rounded-3xl border border-slate-200/50 dark:border-white/10 flex flex-col h-[500px] overflow-hidden relative shadow-2xl">
          {/* Messages box */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 dark:bg-transparent">
            {messages.map((msg, idx) => {
              const isBot = msg.role === "assistant";
              return (
                <div
                  key={idx}
                  className={`flex gap-3 max-w-[85%] ${isBot ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                >
                  <div className={`p-2 h-8 w-8 rounded-full flex items-center justify-center border ${
                    isBot ? "bg-purple-100 dark:bg-purple-950/40 border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400" : "bg-pink-100 dark:bg-pink-950/40 border-pink-200 dark:border-pink-500/20 text-pink-600 dark:text-pink-400"
                  }`}>
                    {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                    isBot 
                      ? "bg-white dark:bg-slate-900/60 border-slate-200/50 dark:border-white/5 text-slate-700 dark:text-gray-100 rounded-tl-none" 
                      : "bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-200 dark:border-purple-500/20 text-slate-800 dark:text-white rounded-tr-none font-medium"
                  }`}>
                    <p className="whitespace-pre-line leading-relaxed font-sans">{msg.content}</p>
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex gap-3 max-w-[80%] mr-auto">
                <div className="p-2 h-8 w-8 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400">
                  <Bot className="h-4 w-4 animate-bounce" />
                </div>
                <div className="p-4 rounded-2xl text-sm bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-white/5 text-purple-600 dark:text-purple-300 font-mono tracking-widest flex items-center gap-1.5">
                  Analyzing core vectors<span className="animate-pulse">...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="p-4 border-t border-slate-200/50 dark:border-white/10 bg-slate-50 dark:bg-slate-950/50 flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for financial strategies..."
              className="flex-1 bg-slate-100/50 dark:bg-black/40 border border-slate-200/50 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 outline-none transition"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={isTyping}
              className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center disabled:opacity-50"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
