"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle, Star, Sparkles, RefreshCw, Trophy } from "lucide-react";
import { toast } from "sonner";

const SEGMENTS = [
  { text: "No-Spend Weekend", short1: "No-Spend", short2: "Weekend", desc: "Commit to a 48-hour cash lockdown. Cook at home, walk in the park, spend $0.", color: "#8b5cf6" }, // purple
  { text: "Hype Hysa check", short1: "Hype Hysa", short2: "Check", desc: "Audit your current bank savings rates. Shift funds to accounts yielding >4% interest.", color: "#ec4899" }, // pink
  { text: "Purge 1 subscription", short1: "Purge 1", short2: "Sub", desc: "Find one recurring service you haven't used in 30 days and cancel it immediately.", color: "#3b82f6" }, // blue
  { text: "Compound check", short1: "Compound", short2: "Check", desc: "Estimate how long it will take to double your savings using the Rule of 72.", color: "#14b8a6" }, // teal
  { text: "Set a savings goal", short1: "Set a", short2: "Goal", desc: "Create a new goal on your dashboard and deposit $10 into it today.", color: "#f59e0b" }, // amber
  { text: "Card balance audit", short1: "Card", short2: "Audit", desc: "Review credit cards. Formulate a payoff strategy for high-interest balances.", color: "#ef4444" }, // red
];

export default function WheelPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prizeIndex, setPrizeIndex] = useState(null);
  const [xp, setXp] = useState(0);
  const [claimedChallenge, setClaimedChallenge] = useState(null);

  useEffect(() => {
    const savedXp = localStorage.getItem("nexus_wheel_xp");
    const savedChallenge = localStorage.getItem("nexus_wheel_challenge");
    if (savedXp) setXp(parseInt(savedXp));
    if (savedChallenge) setClaimedChallenge(JSON.parse(savedChallenge));
  }, []);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setPrizeIndex(null);

    // Pick a random index (0 to 5)
    const randomIdx = Math.floor(Math.random() * SEGMENTS.length);
    
    // Calculate stop angle to center the winning segment at 12 o'clock (top pointer)
    const segmentAngle = 60;
    const stopAngle = 360 - (randomIdx * segmentAngle);
    
    const extraSpins = 360 * 6; // 6 full spins
    const targetRotation = rotation + extraSpins + stopAngle;

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setPrizeIndex(randomIdx);
      const challenge = SEGMENTS[randomIdx];
      setClaimedChallenge({ ...challenge, completed: false });
      localStorage.setItem("nexus_wheel_challenge", JSON.stringify({ ...challenge, completed: false }));
      toast.success(`Landfall! Challenge rolled: ${challenge.text}`);
    }, 6000); // 6 seconds transition time
  };

  const handleCompleteChallenge = () => {
    if (!claimedChallenge || claimedChallenge.completed) return;

    const newXp = xp + 150;
    setXp(newXp);
    localStorage.setItem("nexus_wheel_xp", newXp.toString());

    const updated = { ...claimedChallenge, completed: true };
    setClaimedChallenge(updated);
    localStorage.setItem("nexus_wheel_challenge", JSON.stringify(updated));
    toast.success("Challenge completed! +150 XP awarded!");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 relative z-10">
      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-pink-500 dark:text-pink-400" />
            Daily Challenge Spin
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm md:text-base font-light">
            Spin the visual selector wheel to unlock a daily savings challenge, budget audit, or compounding task.
          </p>
        </div>

        <div className="glass-panel px-4 py-2 rounded-xl border border-purple-200 dark:border-purple-500/20 text-xs font-mono text-purple-600 dark:text-purple-300 flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
          <Trophy className="h-4.5 w-4.5 text-purple-500 dark:text-purple-400 animate-pulse" />
          <span>XP SCORE: <strong className="text-slate-900 dark:text-white">{xp}</strong></span>
        </div>
      </div>

      {/* Main Wheel Row */}
      <div className="grid gap-8 md:grid-cols-12 items-center justify-items-center">
        {/* Visual Wheel Container */}
        <div className="md:col-span-7 flex flex-col items-center w-full">
          {/* Wheel Frame */}
          <div className="relative w-80 h-80 sm:w-[420px] sm:h-[420px] flex items-center justify-center">
            {/* Top Arrow Pointer Indicator */}
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[20px] border-t-pink-500 absolute -top-2 left-1/2 -translate-x-1/2 z-30 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)] animate-pulse" />

            {/* Glowing Outer Ring border */}
            <div className="w-full h-full p-4 bg-purple-100/10 dark:bg-purple-950/20 rounded-full border border-purple-200 dark:border-purple-500/20 shadow-[0_0_50px_rgba(139,92,246,0.15)] dark:shadow-[0_0_50px_rgba(139,92,246,0.3)] flex items-center justify-center">
              {/* Rotating disk */}
              <div
                className="w-full h-full rounded-full relative overflow-hidden shadow-2xl"
                style={{
                  transform: `rotate(${rotation - 90}deg)`,
                  transition: "transform 6000ms cubic-bezier(0.1, 0.9, 0.15, 1)",
                }}
              >
                <svg viewBox="0 0 400 400" className="w-full h-full select-none">
                  <defs>
                    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3"/>
                    </filter>
                  </defs>
                  
                  {/* Wheel Sectors */}
                  {SEGMENTS.map((seg, idx) => {
                    const startAngle = idx * 60;
                    return (
                      <g key={idx} transform={`rotate(${startAngle}, 200, 200)`}>
                        {/* 60 degree sector slice path */}
                        <path
                          d="M 200 200 L 364.5 105 A 190 190 0 0 1 364.5 295 Z"
                          fill={seg.color}
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="2"
                        />
                        {/* Radial large text */}
                        <text
                          x="295"
                          y="200"
                          textAnchor="middle"
                          className="fill-white font-black text-[13px] tracking-wider uppercase font-sans"
                          transform="rotate(0, 295, 200)"
                          filter="url(#shadow)"
                        >
                          {seg.short2 ? (
                            <>
                              <tspan x="295" dy="-5">{seg.short1}</tspan>
                              <tspan x="295" dy="15">{seg.short2}</tspan>
                            </>
                          ) : (
                            <tspan x="295" dy="5">{seg.short1}</tspan>
                          )}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Outer clean border line inside slices */}
                  <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="4" />
                </svg>

                {/* Center Cap Hub */}
                <div className="absolute inset-[38%] bg-white dark:bg-slate-900 rounded-full border-4 border-purple-500/30 dark:border-purple-500/60 flex items-center justify-center shadow-2xl z-20">
                  <div className="w-[80%] h-[80%] rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-inner">
                    <Sparkles className="h-6 w-6 text-white animate-spin-slow" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="mt-8 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm transition active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-[0_6px_20px_rgba(236,72,153,0.3)] hover:shadow-[0_8px_25px_rgba(236,72,153,0.5)]"
          >
            <RefreshCw className={`h-4.5 w-4.5 ${isSpinning ? "animate-spin" : ""}`} />
            {isSpinning ? "Decrypting Savings Matrix..." : "Spin Matrix Selector"}
          </button>
        </div>

        {/* Selected Challenge Details Card */}
        <div className="md:col-span-5 w-full">
          {claimedChallenge ? (
            <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 space-y-4 shadow-2xl animate-fadeIn">
              <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-white/5 pb-2">
                <span className="text-[10px] font-mono tracking-widest text-purple-600 dark:text-purple-300 uppercase">ACTIVE CHALLENGE DIRECTIVE</span>
                <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                  claimedChallenge.completed 
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400" 
                    : "bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-900/30 text-yellow-600 dark:text-yellow-400 animate-pulse"
                }`}>
                  {claimedChallenge.completed ? "COMPLETED" : "IN PROGRESS"}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{claimedChallenge.text}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-light">{claimedChallenge.desc}</p>
              </div>

              {!claimedChallenge.completed ? (
                <button
                  onClick={handleCompleteChallenge}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
                >
                  <Star className="h-4 w-4" /> Declare Complete (+150 XP)
                </button>
              ) : (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl text-center text-xs font-mono text-emerald-600 dark:text-emerald-400">
                  Challenge logs registered. Re-spin to override.
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-8 text-center rounded-3xl border border-slate-200/50 dark:border-white/5 flex flex-col items-center justify-center space-y-4">
              <Star className="h-10 w-10 text-slate-350 dark:text-gray-600 animate-pulse" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">No Active Challenge</h3>
                <p className="text-slate-500 dark:text-gray-400 text-xs font-light max-w-xs leading-relaxed">
                  Trigger the Daily Spin selector to receive a random cashflow modifier challenge or savings directive.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
