"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { 
  BarChart3, Calendar, Calculator, RefreshCw, Download, 
  ChevronRight, Sparkles, TrendingUp, HelpCircle
} from "lucide-react";

export function FinancialTools({ transactions = [], accounts = [] }) {
  // --- 1. CASHFLOW CALENDAR HEATMAP ---
  const heatmapDays = useMemo(() => {
    const days = [];
    const today = new Date();
    // Generate last 28 days (4 weeks)
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      
      // Filter transactions for this day
      const dayTransactions = transactions.filter(t => {
        const tDate = new Date(t.date).toISOString().split("T")[0];
        return tDate === dateStr;
      });

      let netChange = 0;
      let count = dayTransactions.length;
      
      dayTransactions.forEach(t => {
        if (t.type === "INCOME") netChange += t.amount;
        else netChange -= t.amount;
      });

      days.push({
        date: d,
        dateStr,
        netChange,
        count,
      });
    }
    return days;
  }, [transactions]);

  // Helper to determine square color intensity based on cashflow net change
  const getHeatmapColor = (netChange, count) => {
    if (count === 0) return "bg-gray-800/40 border-white/5";
    if (netChange > 0) {
      if (netChange > 500) return "bg-emerald-500 border-emerald-400/30 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]";
      if (netChange > 100) return "bg-emerald-600/80 border-emerald-500/20 text-white";
      return "bg-emerald-950 border-emerald-900/20 text-emerald-300";
    } else {
      const absChange = Math.abs(netChange);
      if (absChange > 500) return "bg-pink-500 border-pink-400/30 text-white shadow-[0_0_10px_rgba(236,72,153,0.3)]";
      if (absChange > 100) return "bg-pink-600/80 border-pink-500/20 text-white";
      return "bg-pink-950 border-pink-900/20 text-pink-300";
    }
  };

  // --- 2. CATEGORY-BASED NEXT-MONTH EXPENSE FORECASTING ---
  const forecastData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === "EXPENSE");
    
    // Group by category and calculate total
    const categoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    // For forecasting, we calculate the average (here we mock monthly average by splitting by 2 or projecting)
    // and apply an inflationary/trend modifier (+8% forecast)
    return Object.entries(categoryTotals).map(([category, total]) => {
      const monthlyAverage = Math.round(total / 2) || total; // fallback if short history
      const forecasted = Math.round(monthlyAverage * 1.08); // +8% forecast
      return {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        "Average Spend": monthlyAverage,
        "Forecasted (Next Month)": forecasted,
      };
    }).slice(0, 5); // Limit to top 5 categories
  }, [transactions]);

  // --- 3. INTERACTIVE DEBT PAYDOWN CALCULATOR ---
  const [debt1, setDebt1] = useState(15000);
  const [rate1, setRate1] = useState(18); // Credit Card APR
  const [minPay1, setMinPay1] = useState(300);

  const [debt2, setDebt2] = useState(30000);
  const [rate2, setRate2] = useState(5.5); // Student Loan APR
  const [minPay2, setMinPay2] = useState(250);

  const [extraPayment, setExtraPayment] = useState(200);

  // Run payoff payoff simulation under Snowball & Avalanche methods
  const debtPayoffSim = useMemo(() => {
    const runSimulation = (strategy) => {
      // Create copies
      let debts = [
        { id: 1, name: "Credit Card", balance: debt1, apr: rate1, minPay: minPay1 },
        { id: 2, name: "Student Loan", balance: debt2, apr: rate2, minPay: minPay2 },
      ].filter(d => d.balance > 0);

      let months = 0;
      let totalInterestPaid = 0;
      const monthlyRateFactor = 12 * 100;

      while (debts.some(d => d.balance > 0) && months < 360) {
        months++;
        
        // 1. Accrue interest first
        debts.forEach(d => {
          if (d.balance > 0) {
            const interest = d.balance * (d.apr / monthlyRateFactor);
            totalInterestPaid += interest;
            d.balance += interest;
          }
        });

        // 2. Pay minimums
        let totalBuffer = extraPayment;
        debts.forEach(d => {
          if (d.balance > 0) {
            const pay = Math.min(d.balance, d.minPay);
            d.balance -= pay;
            // if we paid less than minimum because it was cleared, add surplus back to buffer
            if (pay < d.minPay) {
              totalBuffer += (d.minPay - pay);
            }
          }
        });

        // Sort remaining active debts based on strategy
        let activeDebts = debts.filter(d => d.balance > 0);
        if (activeDebts.length > 0) {
          if (strategy === "avalanche") {
            // Avalanche: sort by highest APR first
            activeDebts.sort((a, b) => b.apr - a.apr);
          } else {
            // Snowball: sort by lowest balance first
            activeDebts.sort((a, b) => a.balance - b.balance);
          }

          // Apply extra buffer to primary target
          const targetDebt = activeDebts[0];
          const payExtra = Math.min(targetDebt.balance, totalBuffer);
          targetDebt.balance -= payExtra;
        }
      }

      return {
        months: months === 360 ? "30+ years" : months,
        interest: Math.round(totalInterestPaid),
      };
    };

    return {
      avalanche: runSimulation("avalanche"),
      snowball: runSimulation("snowball"),
    };
  }, [debt1, rate1, minPay1, debt2, rate2, minPay2, extraPayment]);

  // --- 4. LIVE CURRENCY CONVERTER DESK ---
  const [convertAmount, setConvertAmount] = useState(100);
  const [fromCurr, setFromCurr] = useState("USD");
  const [toCurr, setToCurr] = useState("EUR");

  const exchangeRates = {
    USD: 1.00,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 156.40,
    INR: 83.50,
  };

  const convertedResult = useMemo(() => {
    const fromRate = exchangeRates[fromCurr];
    const toRate = exchangeRates[toCurr];
    return ((convertAmount * toRate) / fromRate).toFixed(2);
  }, [convertAmount, fromCurr, toCurr]);

  // --- 5. FINANCIAL DATA EXPORTER ---
  const [exportAccount, setExportAccount] = useState("all");
  const [exportCategory, setExportCategory] = useState("all");
  const [exportType, setExportType] = useState("all");

  const filteredExportTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchAccount = exportAccount === "all" || t.accountId === exportAccount;
      const matchCategory = exportCategory === "all" || t.category === exportCategory;
      const matchType = exportType === "all" || t.type === exportType;
      return matchAccount && matchCategory && matchType;
    });
  }, [transactions, exportAccount, exportCategory, exportType]);

  const handleDownload = (format) => {
    if (filteredExportTransactions.length === 0) {
      alert("No data available to export with current filters.");
      return;
    }

    let fileContent = "";
    let mimeType = "";
    let fileName = `transactions_export_${new Date().toISOString().split("T")[0]}`;

    if (format === "json") {
      fileContent = JSON.stringify(filteredExportTransactions, null, 2);
      mimeType = "application/json";
      fileName += ".json";
    } else {
      // CSV format
      const headers = ["ID", "Date", "Description", "Category", "Account", "Type", "Amount"];
      const rows = filteredExportTransactions.map(t => {
        const accName = accounts.find(a => a.id === t.accountId)?.name || "Unknown";
        return [
          t.id,
          new Date(t.date).toISOString().split("T")[0],
          `"${t.description.replace(/"/g, '""')}"`,
          t.category,
          `"${accName.replace(/"/g, '""')}"`,
          t.type,
          t.amount,
        ];
      });
      fileContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      mimeType = "text/csv";
      fileName += ".csv";
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10">
      {/* 1. Cashflow Heatmap Section */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-400" />
          Cashflow Calendar Heatmap
        </h3>
        <p className="text-xs text-gray-400 font-light max-w-xl">
          Visual matrix mapping transaction frequencies and net positive/negative flows over the last 28 days.
        </p>

        {/* Heatmap Grid */}
        <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
          {heatmapDays.map((day, idx) => {
            const flowText = day.count > 0 
              ? `${day.netChange >= 0 ? "+" : ""}$${day.netChange.toFixed(2)} (${day.count} tx)` 
              : "No activity";
            return (
              <div
                key={day.dateStr}
                className={`w-9 h-9 rounded-lg border flex flex-col items-center justify-center text-[10px] font-mono cursor-pointer transition-all ${getHeatmapColor(day.netChange, day.count)} relative group`}
              >
                <span>{day.date.getDate()}</span>
                {/* Micro Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-slate-950 border border-white/10 p-2 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 text-[10px] text-center text-white shadow-2xl">
                  <div className="font-bold">{day.date.toLocaleDateString()}</div>
                  <div className="text-purple-300 font-mono mt-0.5">{flowText}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 text-[10px] text-gray-400 font-mono pt-2">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" /> Positive cashflow</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-pink-600 inline-block" /> Expenses exceed income</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-gray-800 inline-block" /> No activity</span>
        </div>
      </div>

      {/* 2. Expense Forecasting & Currency Converter */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Forecast Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white tracking-wide border-b border-white/5 pb-2 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              Next-Month Forecast
            </h3>
            <p className="text-xs text-gray-400 font-light mt-1">
              Category projections comparing past averages with next month estimates.
            </p>
          </div>

          <div className="h-[200px] w-full mt-4">
            {forecastData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400 italic">
                Insufficient expense records for forecast modeling.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="category" stroke="rgba(255,255,255,0.4)" fontSize={10} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} />
                  <ChartTooltip 
                    contentStyle={{ backgroundColor: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px" }}
                  />
                  <Bar dataKey="Average Spend" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Forecasted (Next Month)" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Currency converter */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white tracking-wide border-b border-white/5 pb-2 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-pink-400" />
              Live Currency Converter Desk
            </h3>
            <p className="text-xs text-gray-400 font-light mt-1">
              Convert between key currencies using simulated real-time exchange rates.
            </p>
          </div>

          <div className="space-y-3 my-4">
            <div>
              <label className="block text-[10px] font-mono text-purple-300 uppercase mb-1">Convert Amount</label>
              <input
                type="number"
                value={convertAmount}
                onChange={(e) => setConvertAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-purple-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-purple-300 uppercase mb-1">From</label>
                <select
                  value={fromCurr}
                  onChange={(e) => setFromCurr(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white text-xs outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-purple-300 uppercase mb-1">To</label>
                <select
                  value={toCurr}
                  onChange={(e) => setToCurr(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white text-xs outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-950/20 rounded-xl border border-purple-900/30 text-center font-mono">
            <span className="text-gray-400 text-xs">{convertAmount} {fromCurr} =</span>
            <div className="text-2xl font-black text-white mt-1">
              {convertedResult} {toCurr}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Debt Paydown Calculator */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-base font-extrabold text-white tracking-wide border-b border-white/5 pb-2 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-purple-400" />
          Interactive Debt Paydown Calculator
        </h3>
        <p className="text-xs text-gray-400 font-light">
          Simulate the time and money saved by applying the **Snowball** (lowest balance first) vs. **Avalanche** (highest interest rate first) strategies.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-3 md:col-span-1">
            <div>
              <label className="block text-[10px] font-mono text-purple-300 uppercase mb-1">Credit Card Balance ($)</label>
              <input
                type="number"
                value={debt1}
                onChange={(e) => setDebt1(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-purple-300 uppercase mb-1">Student Loan Balance ($)</label>
              <input
                type="number"
                value={debt2}
                onChange={(e) => setDebt2(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-purple-300 uppercase mb-1">Extra Monthly Payment ($)</label>
              <input
                type="number"
                value={extraPayment}
                onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:border-pink-500"
              />
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/5 bg-purple-950/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-purple-400 uppercase">AVALANCHE (APR First)</span>
                <p className="text-[10px] text-gray-400 mt-1">Targets high interest APR debts first for maximum absolute cost savings.</p>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-black text-white font-mono">{debtPayoffSim.avalanche.months} mos</div>
                <span className="text-[10px] text-gray-400 block font-mono">Interest accrued: ${debtPayoffSim.avalanche.interest}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-white/5 bg-pink-950/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-pink-400 uppercase">SNOWBALL (Balance First)</span>
                <p className="text-[10px] text-gray-400 mt-1">Targets low balance debts first to build rapid emotional momentum.</p>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-black text-white font-mono">{debtPayoffSim.snowball.months} mos</div>
                <span className="text-[10px] text-gray-400 block font-mono">Interest accrued: ${debtPayoffSim.snowball.interest}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Financial Data Exporter */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 bg-gradient-to-r from-slate-900/50 to-slate-950/50">
        <div>
          <h3 className="text-base font-extrabold text-white tracking-wide border-b border-white/5 pb-2 flex items-center gap-2">
            <Download className="h-5 w-5 text-emerald-400" />
            Financial Data Exporter Desk
          </h3>
          <p className="text-xs text-gray-400 font-light mt-1">
            Download your ledger records directly in standard formats. Zero third-party transmissions.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-4 items-end">
          <div>
            <label className="block text-[10px] font-mono text-purple-300 uppercase mb-1">Filter Account</label>
            <select
              value={exportAccount}
              onChange={(e) => setExportAccount(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white text-xs outline-none"
            >
              <option value="all">All Accounts</option>
              {accounts.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-purple-300 uppercase mb-1">Filter Category</label>
            <select
              value={exportCategory}
              onChange={(e) => setExportCategory(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white text-xs outline-none"
            >
              <option value="all">All Categories</option>
              <option value="housing">Housing</option>
              <option value="food">Food</option>
              <option value="transportation">Transportation</option>
              <option value="entertainment">Entertainment</option>
              <option value="utilities">Utilities</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-purple-300 uppercase mb-1">Filter Type</label>
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white text-xs outline-none"
            >
              <option value="all">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleDownload("csv")}
              className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-1"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleDownload("json")}
              className="flex-1 py-2 px-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold flex items-center justify-center gap-1"
            >
              Export JSON
            </button>
          </div>
        </div>

        <div className="text-[10px] font-mono text-gray-500 text-right">
          Matching ledger lines: {filteredExportTransactions.length}
        </div>
      </div>
    </div>
  );
}
