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
import { 
  ShieldAlert, ShieldCheck, Landmark, ShieldQuestion, HelpCircle, 
  TrendingUp, TrendingDown, DollarSign
} from "lucide-react";

export function NetWorthHealth({ accounts = [], goals = [], budgetProgress = null }) {
  // 1. Calculate assets based on user's bank accounts/wallets
  const totalAssets = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  }, [accounts]);

  // 2. Custom liabilities inputs
  const [mortgage, setMortgage] = useState(0);
  const [studentLoan, setStudentLoan] = useState(0);
  const [creditDebt, setCreditDebt] = useState(5000);
  const [otherDebt, setOtherDebt] = useState(0);

  const totalLiabilities = mortgage + studentLoan + creditDebt + otherDebt;
  const netWorth = totalAssets - totalLiabilities;

  // 3. Simulated historical data for Net Worth based on current variables
  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const baseAssets = totalAssets || 25000;
    const baseLiabilities = totalLiabilities;

    // Simulate 6 months of growth/offsets
    return months.map((month, idx) => {
      const assetMult = 0.85 + (idx * 0.03); // simulated asset growth
      const liabMult = 1.1 - (idx * 0.02);  // simulated debt paydown
      const simulatedAssets = baseAssets * assetMult;
      const simulatedLiabilities = baseLiabilities * liabMult;
      return {
        month,
        Assets: Math.round(simulatedAssets),
        Liabilities: Math.round(simulatedLiabilities),
        "Net Worth": Math.round(simulatedAssets - simulatedLiabilities),
      };
    });
  }, [totalAssets, totalLiabilities]);

  // 4. Financial Health Score calculation
  const healthScoreDetails = useMemo(() => {
    // A. Budget utilization factor
    let budgetScore = 75; // Default if no budget
    if (budgetProgress && budgetProgress.initialBudget > 0) {
      const ratio = budgetProgress.currentExpenses / budgetProgress.initialBudget;
      if (ratio <= 0.7) budgetScore = 100;
      else if (ratio <= 0.95) budgetScore = 80;
      else if (ratio <= 1.0) budgetScore = 60;
      else budgetScore = 30;
    }

    // B. Savings target factor
    let savingsScore = 60; // Default if no goals
    if (goals.length > 0) {
      const totalGoalTarget = goals.reduce((sum, g) => sum + g.target, 0);
      const totalGoalCurrent = goals.reduce((sum, g) => sum + g.current, 0);
      if (totalGoalTarget > 0) {
        savingsScore = Math.min(100, Math.round((totalGoalCurrent / totalGoalTarget) * 100));
      }
    }

    // C. Debt-to-Asset ratio factor
    const debtRatio = totalLiabilities / Math.max(1, totalAssets);
    let debtScore = 100;
    if (debtRatio > 1.5) debtScore = 10;
    else if (debtRatio > 1.0) debtScore = 30;
    else if (debtRatio > 0.5) debtScore = 60;
    else if (debtRatio > 0.2) debtScore = 85;

    // Average the weights: Budget(35%), Savings(35%), Debt(30%)
    const score = Math.round((budgetScore * 0.35) + (savingsScore * 0.35) + (debtScore * 0.3));

    // Diagnostic comments
    let statusText = "Steady Progress";
    let statusColor = "text-yellow-400";
    let diagnosticTips = [];

    if (score >= 80) {
      statusText = "Excellent Health";
      statusColor = "text-emerald-400";
      diagnosticTips = [
        "Your low debt-to-asset ratio is superb.",
        "Budget limits are healthy; consider compounding surplus into savings goals.",
        "Your net worth trajectory is highly optimized."
      ];
    } else if (score >= 50) {
      statusText = "Satisfactory Health";
      statusColor = "text-yellow-400";
      diagnosticTips = [
        "Ensure debt paydown calculators are utilized for liabilities.",
        "Increase savings goals contributions to raise liquidity.",
        "Audit subscriptions to trim recurring expense overhead."
      ];
    } else {
      statusText = "Under Financial Stress";
      statusColor = "text-red-400";
      diagnosticTips = [
        "CAUTION: High liabilities detected compared to active wallet balances.",
        "Create strict budgets to restrict discretionary spending.",
        "Clear high-interest credit card debt immediately using the avalanche strategy."
      ];
    }

    return {
      score,
      statusText,
      statusColor,
      diagnosticTips,
      budgetScore,
      savingsScore,
      debtScore
    };
  }, [totalAssets, totalLiabilities, goals, budgetProgress]);

  // SVG Gauge Arch Calculation
  // 180 degrees semi-circle path circumference for r=40 is PI * r = 125.6
  const strokeDashoffset = 125.6 - (healthScoreDetails.score / 100) * 125.6;

  return (
    <div className="space-y-8">
      {/* HUD Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Landmark className="h-6 w-6 text-purple-400" />
          Wealth Intelligence & Diagnostics
        </h2>
        <p className="text-gray-400 text-sm font-light">
          Monitor your net worth velocity and audit your financial safety score.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Liabilities input panels */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5 lg:col-span-1">
          <h3 className="text-base font-extrabold text-white tracking-wide border-b border-white/5 pb-2">
            Configure Liabilities
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-gray-400">Credit Card Debt</span>
                <span className="text-pink-400">${creditDebt.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="30000"
                step="500"
                value={creditDebt}
                onChange={(e) => setCreditDebt(parseFloat(e.target.value))}
                className="w-full accent-pink-500 bg-gray-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-gray-400">Student Loans</span>
                <span className="text-pink-400">${studentLoan.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={studentLoan}
                onChange={(e) => setStudentLoan(parseFloat(e.target.value))}
                className="w-full accent-pink-500 bg-gray-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-gray-400">Mortgage Balance</span>
                <span className="text-pink-400">${mortgage.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="500000"
                step="5000"
                value={mortgage}
                onChange={(e) => setMortgage(parseFloat(e.target.value))}
                className="w-full accent-pink-500 bg-gray-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-gray-400">Other Liabilities</span>
                <span className="text-pink-400">${otherDebt.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50000"
                step="500"
                value={otherDebt}
                onChange={(e) => setOtherDebt(parseFloat(e.target.value))}
                className="w-full accent-pink-500 bg-gray-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-400">Total Assets (Wallets):</span>
              <span className="text-emerald-400 font-bold">${totalAssets.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-400">Total Liabilities:</span>
              <span className="text-pink-400 font-bold">${totalLiabilities.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-mono pt-1 border-t border-white/5 font-extrabold">
              <span className="text-white">Net Worth:</span>
              <span className={netWorth >= 0 ? "text-purple-400" : "text-red-400"}>
                ${netWorth.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Recharts Net Worth Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white tracking-wide border-b border-white/5 pb-2 flex justify-between items-center">
              <span>Net Worth Analytics</span>
              <span className="text-xs font-mono font-light text-gray-400">6-Month Simulation</span>
            </h3>
          </div>

          <div className="h-[230px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                  labelStyle={{ color: "#fff", fontWeight: "bold" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="Net Worth" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorNetWorth)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Health Score HUD */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Animated Semi-Circle Gauge */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-mono tracking-widest text-purple-300 uppercase mb-4">Financial Safety Score</span>
          
          <div className="relative w-44 h-24 mb-2 overflow-hidden flex justify-center">
            {/* SVG semi-circle gauge */}
            <svg viewBox="0 0 100 50" className="w-full">
              <defs>
                <linearGradient id="healthGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              {/* Back track */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#1f2937"
                strokeWidth="7"
                strokeLinecap="round"
              />
              {/* Colored progress track */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="url(#healthGrad)"
                strokeWidth="7"
                strokeDasharray="125.6"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: "drop-shadow(0px 0px 3px rgba(167, 139, 250, 0.4))"
                }}
              />
            </svg>

            {/* Score absolute readout */}
            <div className="absolute bottom-0 text-center">
              <span className="text-4xl font-black text-white font-mono leading-none">
                {healthScoreDetails.score}
              </span>
              <span className="text-[10px] text-gray-500 block uppercase font-bold">out of 100</span>
            </div>
          </div>

          <span className={`text-sm font-extrabold uppercase tracking-wider ${healthScoreDetails.statusColor}`}>
            {healthScoreDetails.statusText}
          </span>
        </div>

        {/* Diagnostics & Diagnostic Tips */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 md:col-span-2 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-mono tracking-wider text-purple-300 uppercase mb-3 flex items-center gap-1.5">
              {healthScoreDetails.score >= 80 ? (
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              ) : (
                <ShieldAlert className="h-4 w-4 text-yellow-400" />
              )}
              Diagnostic Log & System Audit
            </h4>
            <ul className="space-y-2">
              {healthScoreDetails.diagnosticTips.map((tip, idx) => (
                <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                  <span className="text-purple-400 font-mono select-none">[{idx + 1}]</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscore Readouts */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5 mt-4 text-center">
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase block">Budgets</span>
              <span className="text-sm font-black font-mono text-white">{healthScoreDetails.budgetScore}/100</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase block">Savings</span>
              <span className="text-sm font-black font-mono text-white">{healthScoreDetails.savingsScore}/100</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase block">Liabilities</span>
              <span className="text-sm font-black font-mono text-white">{healthScoreDetails.debtScore}/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
