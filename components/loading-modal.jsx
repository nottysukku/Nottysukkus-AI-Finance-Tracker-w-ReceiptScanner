"use client";

import React, { useEffect, useState } from "react";
import { useLoading } from "@/context/loading-context";
import { Loader2 } from "lucide-react";

const FINANCIAL_PHRASES = [
  "Auditing digital accounts...",
  "Running quantitative analytics...",
  "Syncing ledger values...",
  "Recalculating cashflow velocities...",
  "Formatting glass panel visual grids...",
  "Connecting to decentralized vaults...",
  "Hashing cryptographic balances...",
  "Balancing debit-credit columns...",
];

export function LoadingModal() {
  const { isLoading, loadingText } = useLoading();
  const [tickerPhrase, setTickerPhrase] = useState("");

  useEffect(() => {
    if (!isLoading) return;

    let index = 0;
    setTickerPhrase(FINANCIAL_PHRASES[0]);

    const interval = setInterval(() => {
      index = (index + 1) % FINANCIAL_PHRASES.length;
      setTickerPhrase(FINANCIAL_PHRASES[index]);
    }, 2200);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md transition-all duration-300">
      <div className="glass-panel max-w-md w-[90%] p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.3)] text-center relative overflow-hidden flex flex-col items-center">
        {/* Neon rotating visual rings */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-dashed border-purple-500/30 rounded-full animate-spin-slow" />
          <div className="absolute inset-2 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
          <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
        </div>

        <h3 className="text-xl font-black text-white tracking-wide uppercase mb-2 animate-pulse-glow">
          {loadingText}
        </h3>
        
        <p className="text-xs text-purple-300/70 font-mono tracking-widest uppercase h-4 transition-all duration-500">
          {tickerPhrase}
        </p>

        <div className="w-48 h-[2px] bg-white/5 mt-6 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse-glow" style={{
            animation: "laser-scan 1.5s ease-in-out infinite",
            width: "30%"
          }} />
        </div>
      </div>
    </div>
  );
}
