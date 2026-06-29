"use client";

import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Landmark, ArrowRight, UserCheck, Flame, ShieldAlert, Sparkles } from "lucide-react";

export default function SimulatorClient({ initialSalary = 60000 }) {
  // Input states
  const [startingAge, setStartingAge] = useState(22);
  const [salary, setSalary] = useState(initialSalary);
  const [savingsRate, setSavingsRate] = useState(20); // % of salary saved

  // Allocations (must add up to 100%)
  const [allocCash, setAllocCash] = useState(30);
  const [allocStocks, setAllocStocks] = useState(50);
  const [allocCrypto, setAllocCrypto] = useState(20);

  // Lifestyle decisions
  const [housing, setHousing] = useState("condo"); // shared ($600/mo), condo ($1800/mo), luxury ($4000/mo)
  const [transit, setTransit] = useState("sedan"); // transit ($80/mo), sedan ($400/mo), supercar ($1500/mo)

  // Simulation run
  const simData = useMemo(() => {
    const data = [];
    let netWorth = 0;
    const yearsToSimulate = 40;

    // Monthly expenses based on selections
    const housingCosts = { shared: 600, condo: 1800, luxury: 4000 };
    const transitCosts = { transit: 80, sedan: 400, supercar: 1500 };

    const monthlyExpenses = housingCosts[housing] + transitCosts[transit];
    const annualExpenses = monthlyExpenses * 12;

    const cashWeight = allocCash / 100;
    const stockWeight = allocStocks / 100;
    const cryptoWeight = allocCrypto / 100;

    // Growth rates
    const cashReturn = 0.025; // 2.5% Hysa
    const stockReturn = 0.08;  // 8% Stock index
    const cryptoReturn = 0.16; // 16% high crypto yield

    for (let year = 1; year <= yearsToSimulate; year++) {
      const age = startingAge + year;
      
      // Calculate annual income after inflation adjustment (+2.5% salary increase per year)
      const adjustedSalary = salary * Math.pow(1.025, year - 1);
      
      // Annual savings added
      const annualSavings = (adjustedSalary * (savingsRate / 100)) - annualExpenses;

      // Net savings (can be negative if lifestyle exceeds savings)
      netWorth += annualSavings;

      // Apply investment growth weighted by allocations
      const cryptoVolatility = (Math.random() - 0.5) * 0.3; // -15% to +15% volatility
      const blendedReturn = 
        (cashReturn * cashWeight) + 
        (stockReturn * stockWeight) + 
        ((cryptoReturn + cryptoVolatility) * cryptoWeight);

      // Earn interest
      if (netWorth > 0) {
        netWorth *= (1 + blendedReturn);
      } else {
        // Debt interest accumulates at 12% if networth is negative
        netWorth *= 1.12;
      }

      data.push({
        year: `Age ${age}`,
        "Net Worth": Math.round(netWorth),
        "Yearly Salary": Math.round(adjustedSalary),
      });
    }
    return data;
  }, [startingAge, salary, savingsRate, allocCash, allocStocks, allocCrypto, housing, transit]);

  const finalNetWorth = simData[simData.length - 1]["Net Worth"];

  // Diagnostics score
  const scoreDetails = useMemo(() => {
    let score = 50;
    let badge = "Novice Saver";
    let comment = "You are maintaining basic wealth parameters. Focus on reducing luxury leaks.";

    if (finalNetWorth > 5000000) {
      score = 98;
      badge = "Apex Optimizer (S-Class)";
      comment = "Exceptional lifetime wealth compounding. Your allocations and lean lifestyle choices unlocked leverage.";
    } else if (finalNetWorth > 2000000) {
      score = 85;
      badge = "Financial Sovereign";
      comment = "Excellent retirement buffer. You successfully avoided high liabilities while maintaining stable asset growth.";
    } else if (finalNetWorth > 500000) {
      score = 65;
      badge = "Mid-tier Accumulator";
      comment = "Modest wealth buffer. Increase your monthly savings rate or stock market allocations to outrun inflation.";
    } else if (finalNetWorth < 0) {
      score = 15;
      badge = "Debt Compounder";
      comment = "CRITICAL: Your lifestyle selections exceed savings. High compounding debt is dragging you into insolvency.";
    }

    return { score, badge, comment };
  }, [finalNetWorth]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 relative z-10">
      {/* HUD Header */}
      <div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-3">
          <Landmark className="h-8 w-8 text-pink-500 dark:text-pink-400" />
          Wealth Simulator Game
        </h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm md:text-base font-light">
          Manipulate career decisions, investment ratios, and lifestyle upgrades to model your lifetime net worth compound path.
        </p>
      </div>

      {/* Simulator Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Controls Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 space-y-6 lg:col-span-1">
          <h3 className="text-sm font-mono font-bold text-purple-600 dark:text-purple-300 uppercase border-b border-slate-200/50 dark:border-white/5 pb-2">
            Simulation Inputs
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-500 dark:text-gray-400">Starting Age</span>
                <span className="text-slate-900 dark:text-white font-bold">{startingAge} yrs</span>
              </div>
              <input
                type="range"
                min="18"
                max="50"
                value={startingAge}
                onChange={(e) => setStartingAge(parseInt(e.target.value))}
                className="w-full accent-purple-500 bg-slate-200 dark:bg-gray-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-500 dark:text-gray-400">Career Starting Salary</span>
                <span className="text-slate-900 dark:text-white font-bold">${salary.toLocaleString()}/yr</span>
              </div>
              <input
                type="range"
                min="20000"
                max="250000"
                step="5000"
                value={salary}
                onChange={(e) => setSalary(parseInt(e.target.value))}
                className="w-full accent-purple-500 bg-slate-200 dark:bg-gray-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-500 dark:text-gray-400">Monthly Savings Rate</span>
                <span className="text-slate-900 dark:text-white font-bold">{savingsRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="75"
                value={savingsRate}
                onChange={(e) => setSavingsRate(parseInt(e.target.value))}
                className="w-full accent-purple-500 bg-slate-200 dark:bg-gray-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>
          </div>

          <h3 className="text-sm font-mono font-bold text-purple-600 dark:text-purple-300 uppercase border-b border-slate-200/50 dark:border-white/5 pb-2 pt-2">
            Asset Allocations (%)
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-500 dark:text-gray-400">HYSA Cash ({allocCash}%)</span>
                <span className="text-slate-500 dark:text-gray-400">Index Stocks ({allocStocks}%)</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Cash"
                  value={allocCash}
                  onChange={(e) => setAllocCash(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                  className="w-1/3 bg-slate-100/50 dark:bg-black/40 border border-slate-200/50 dark:border-white/10 text-xs rounded-xl p-2 text-slate-800 dark:text-white outline-none focus:border-purple-500"
                />
                <input
                  type="number"
                  placeholder="Stocks"
                  value={allocStocks}
                  onChange={(e) => setAllocStocks(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                  className="w-1/3 bg-slate-100/50 dark:bg-black/40 border border-slate-200/50 dark:border-white/10 text-xs rounded-xl p-2 text-slate-800 dark:text-white outline-none focus:border-purple-500"
                />
                <input
                  type="number"
                  placeholder="Crypto"
                  value={allocCrypto}
                  onChange={(e) => setAllocCrypto(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                  className="w-1/3 bg-slate-100/50 dark:bg-black/40 border border-slate-200/50 dark:border-white/10 text-xs rounded-xl p-2 text-slate-800 dark:text-white outline-none focus:border-purple-500"
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400 dark:text-gray-500 block mt-1">
                Total weight: {allocCash + allocStocks + allocCrypto}% (Must be 100% for normal ratios)
              </span>
            </div>
          </div>

          <h3 className="text-sm font-mono font-bold text-purple-600 dark:text-purple-300 uppercase border-b border-slate-200/50 dark:border-white/5 pb-2 pt-2">
            Lifestyle Commitments
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 block mb-1">Housing</span>
              <select
                value={housing}
                onChange={(e) => setHousing(e.target.value)}
                className="w-full bg-slate-100 dark:bg-black/50 border border-slate-200/50 dark:border-white/10 rounded-xl p-2 text-slate-800 dark:text-white"
              >
                <option value="shared" className="text-slate-800 dark:text-white bg-white dark:bg-slate-900">Shared Room ($600/mo)</option>
                <option value="condo" className="text-slate-800 dark:text-white bg-white dark:bg-slate-900">Condo Rental ($1,800/mo)</option>
                <option value="luxury" className="text-slate-800 dark:text-white bg-white dark:bg-slate-900">Luxury Penthouse ($4,000/mo)</option>
              </select>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 block mb-1">Transportation</span>
              <select
                value={transit}
                onChange={(e) => setTransit(e.target.value)}
                className="w-full bg-slate-100 dark:bg-black/50 border border-slate-200/50 dark:border-white/10 rounded-xl p-2 text-slate-800 dark:text-white"
              >
                <option value="transit" className="text-slate-800 dark:text-white bg-white dark:bg-slate-900">Metro Card ($80/mo)</option>
                <option value="sedan" className="text-slate-800 dark:text-white bg-white dark:bg-slate-900">Used Sedan ($400/mo)</option>
                <option value="supercar" className="text-slate-800 dark:text-white bg-white dark:bg-slate-900">Cyber Truck lease ($1,500/mo)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Screen */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          {/* Simulation Graph */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 flex-1 flex flex-col justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-wide border-b border-slate-200/50 dark:border-white/5 pb-2 flex justify-between items-center">
              <span>Lifetime Net Worth Path</span>
              <span className="text-xs font-mono font-light text-slate-500 dark:text-gray-400">40-Year Growth Simulation</span>
            </h3>

            <div className="h-[260px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="simGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
                  <XAxis dataKey="year" stroke="var(--axis-color)" fontSize={10} />
                  <YAxis stroke="var(--axis-color)" fontSize={10} tickFormatter={(v) => `$${v/1000000}M`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "var(--tooltip-bg, rgba(15,23,42,0.9))", border: "1px solid var(--tooltip-border, rgba(255,255,255,0.1))", borderRadius: "12px", color: "var(--tooltip-text, #fff)" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Net Worth" 
                    stroke="#ec4899" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#simGlow)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Diagnostic Grade Card */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-white/10 bg-gradient-to-br from-purple-100/10 dark:from-purple-950/20 to-slate-100/30 dark:to-black/50 text-center flex flex-col justify-center">
              <span className="text-[10px] font-mono tracking-widest text-purple-600 dark:text-purple-300 uppercase block mb-1">PROJECTED WEALTH</span>
              <div className={`text-xl sm:text-2xl font-black font-mono tracking-wide ${finalNetWorth >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-650 dark:text-red-400"}`}>
                ${finalNetWorth.toLocaleString()}
              </div>
              <span className="text-[9px] text-slate-500 dark:text-gray-400 block uppercase mt-0.5">at Age {startingAge + 40}</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-white/10 bg-gradient-to-br from-pink-100/10 dark:from-pink-950/20 to-slate-100/30 dark:to-black/50 text-center flex flex-col justify-center">
              <span className="text-[10px] font-mono tracking-widest text-pink-600 dark:text-pink-300 uppercase block mb-1">OPTIMIZER GRADE</span>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono tracking-wide flex items-center justify-center gap-1">
                {finalNetWorth > 2000000 ? <Sparkles className="h-4.5 w-4.5 text-pink-500 dark:text-pink-400 animate-pulse" /> : null}
                {scoreDetails.badge}
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-white/10 bg-slate-50 dark:bg-black/50 sm:col-span-1 flex items-center justify-center">
              <p className="text-[11px] text-slate-600 dark:text-gray-300 leading-relaxed italic text-center">
                &ldquo;{scoreDetails.comment}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Inject theme-aware variables for Recharts HUD */}
      <style jsx global>{`
        :root {
          --grid-color: rgba(0, 0, 0, 0.08);
          --axis-color: rgba(0, 0, 0, 0.5);
          --tooltip-bg: rgba(255, 255, 255, 0.95);
          --tooltip-border: rgba(0, 0, 0, 0.1);
          --tooltip-text: #0f172a;
        }
        .dark {
          --grid-color: rgba(255, 255, 255, 0.05);
          --axis-color: rgba(255, 255, 255, 0.4);
          --tooltip-bg: rgba(15, 23, 42, 0.95);
          --tooltip-border: rgba(255, 255, 255, 0.1);
          --tooltip-text: #f8fafc;
        }
      `}</style>
    </div>
  );
}
