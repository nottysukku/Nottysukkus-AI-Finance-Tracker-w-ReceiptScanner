"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle, Star, Sparkles, RefreshCw, Trophy } from "lucide-react";
import { toast } from "sonner";

const SEGMENTS = [
  { text: "No-Spend Weekend", desc: "Commit to a 48-hour cash lockdown. Cook at home, walk in the park, spend $0.", color: "#8b5cf6" }, // purple
  { text: "Hype Hysa check", desc: "Audit your current bank savings rates. Shift funds to accounts yielding >4% interest.", color: "#ec4899" }, // pink
  { text: "Purge 1 subscription", desc: "Find one recurring service you haven't used in 30 days and cancel it immediately.", color: "#3b82f6" }, // blue
  { text: "Compound check", desc: "Estimate how long it will take to double your savings using the Rule of 72.", color: "#14b8a6" }, // teal
  { text: "Set a savings goal", desc: "Create a new goal on your dashboard and deposit $10 into it today.", color: "#f59e0b" }, // amber
  { text: "Card balance audit", desc: "Review credit cards. Formulate a payoff strategy for high-interest balances.", color: "#ef4444" }, // red
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
    
    // Add 5-8 full rotations (360 * 5) and offset by segment angle (60 degrees per segment)
    // 6 segments, each is 60 deg. Center of segment is index * 60 + 30
    // We reverse the direction of rotation or segment offsets so it stops accurately at the top arrow pointer (angle 0).
    // Pointer is at 0 degrees (top). So we want segment to align to top.
    // Segment idx starts from right side (0 to 60 deg) and rotates counter-clockwise.
    // Standard calculation: stop angle = 360 - (idx * 60 + 30).
    const segmentAngle = 60;
    const stopAngle = 360 - (randomIdx * segmentAngle) - 30;
    
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
    }, 4000); // 4 seconds transition time
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 relative z-10">
      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-pink-400" />
            Daily Challenge Spin
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-light">
            Spin the visual selector wheel to unlock a daily savings challenge, budget audit, or compounding task.
          </p>
        </div>

        <div className="glass-panel px-4 py-2 rounded-xl border border-purple-500/20 text-xs font-mono text-purple-300 flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
          <Trophy className="h-4.5 w-4.5 text-purple-400 animate-pulse" />
          <span>XP SCORE: <strong className="text-white">{xp}</strong></span>
        </div>
      </div>

      {/* Main Wheel Row */}
      <div className="grid gap-8 md:grid-cols-2 items-center justify-items-center">
        {/* Visual Wheel Container */}
        <div className="relative flex flex-col items-center">
          {/* Top Arrow Pointer Indicator */}
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-pink-500 absolute -top-1 z-30 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)] animate-bounce" />

          {/* Glowing Outer Ring border */}
          <div className="p-3 bg-purple-950/20 rounded-full border border-purple-500/20 shadow-[0_0_40px_rgba(139,92,246,0.2)]">
            {/* Rotating disk */}
            <div
              className="w-64 h-64 rounded-full relative overflow-hidden transition-all duration-[4000ms] ease-[cubic-bezier(0.2,0.8,0.25,1)]"
              style={{
                transform: `rotate(${rotation}deg)`,
                backgroundImage: `conic-gradient(
                  ${SEGMENTS[0].color} 0deg 60deg,
                  ${SEGMENTS[1].color} 60deg 120deg,
                  ${SEGMENTS[2].color} 120deg 180deg,
                  ${SEGMENTS[3].color} 180deg 240deg,
                  ${SEGMENTS[4].color} 240deg 300deg,
                  ${SEGMENTS[5].color} 300deg 360deg
                )`,
              }}
            >
              {/* Inner details / radial labels */}
              {SEGMENTS.map((seg, idx) => {
                const rotationDeg = idx * 60 + 30;
                return (
                  <div
                    key={idx}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-black text-white font-mono uppercase tracking-widest text-center select-none"
                    style={{
                      transform: `rotate(${rotationDeg}deg) translate(75px) rotate(-${rotationDeg}deg)`,
                      width: "60px",
                    }}
                  >
                    {seg.text.split(" ")[0]}
                  </div>
                );
              })}

              {/* Center Cap Hub */}
              <div className="absolute inset-20 bg-slate-950 rounded-full border-2 border-white/10 flex items-center justify-center shadow-inner z-20">
                <Sparkles className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs transition active:scale-95 disabled:opacity-50 flex items-center gap-1.5 shadow-[0_4px_15px_rgba(236,72,153,0.3)]"
          >
            <RefreshCw className={`h-4 w-4 ${isSpinning ? "animate-spin" : ""}`} />
            {isSpinning ? "Spinning Matrix..." : "Spin Wheel"}
          </button>
        </div>

        {/* Selected Challenge Details Card */}
        <div className="w-full max-w-sm">
          {claimedChallenge ? (
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl animate-fadeIn">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] font-mono tracking-widest text-purple-300 uppercase">ACTIVE NEXUS CHALLENGE</span>
                <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                  claimedChallenge.completed 
                    ? "bg-emerald-950/40 border-emerald-900/30 text-emerald-400" 
                    : "bg-yellow-950/40 border-yellow-900/30 text-yellow-400 animate-pulse"
                }`}>
                  {claimedChallenge.completed ? "COMPLETED" : "IN PROGRESS"}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-white">{claimedChallenge.text}</h3>
                <p className="text-xs text-gray-300 leading-relaxed font-light">{claimedChallenge.desc}</p>
              </div>

              {!claimedChallenge.completed ? (
                <button
                  onClick={handleCompleteChallenge}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Star className="h-4 w-4" /> Declare Complete (+150 XP)
                </button>
              ) : (
                <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-center text-xs font-mono text-emerald-400">
                  Challenge logs registered. Re-spin to override.
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-8 text-center rounded-3xl border border-white/5 flex flex-col items-center justify-center">
              <Star className="h-10 w-10 text-gray-600 mb-3 animate-pulse" />
              <h3 className="text-sm font-bold text-white mb-1">No Active Challenge</h3>
              <p className="text-gray-400 text-xs font-light max-w-xs">
                Trigger the Daily Spin selector to receive a random cashflow modifier challenge or savings directive.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
