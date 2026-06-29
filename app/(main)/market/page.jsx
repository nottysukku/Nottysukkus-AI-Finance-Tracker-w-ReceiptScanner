"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Gamepad2, Coins, ArrowUpRight, ArrowDownRight, RefreshCw, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const INITIAL_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc.", price: 185.00, volatility: 0.006 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 152.50, volatility: 0.008 },
  { symbol: "TSLA", name: "Tesla Motors", price: 215.30, volatility: 0.015 },
  { symbol: "BTC", name: "Bitcoin Core", price: 64200.00, volatility: 0.025 },
  { symbol: "ETH", name: "Ethereum", price: 3450.00, volatility: 0.022 },
];

export default function MarketPage() {
  const [stocks, setStocks] = useState(INITIAL_STOCKS);
  const [cash, setCash] = useState(10000); // $10,000 starting cash
  const [portfolio, setPortfolio] = useState({}); // { symbol: { shares: 0, avgPrice: 0 } }

  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [tradeType, setTradeType] = useState("buy"); // "buy" or "sell"
  const [tradeQty, setTradeQty] = useState(1);

  // Load initial state from local storage if available
  useEffect(() => {
    const savedCash = localStorage.getItem("nexus_market_cash");
    const savedPortfolio = localStorage.getItem("nexus_market_portfolio");
    if (savedCash) setCash(parseFloat(savedCash));
    if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));
  }, []);

  // Save changes to local storage
  const saveState = (newCash, newPortfolio) => {
    setCash(newCash);
    setPortfolio(newPortfolio);
    localStorage.setItem("nexus_market_cash", newCash.toString());
    localStorage.setItem("nexus_market_portfolio", JSON.stringify(newPortfolio));
  };

  // Simulate real-time price ticks every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prevStocks) =>
        prevStocks.map((stock) => {
          const changePercent = (Math.random() - 0.49) * 2 * stock.volatility;
          const newPrice = Math.max(0.1, stock.price * (1 + changePercent));
          const prevPrice = stock.price;
          return {
            ...stock,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat((newPrice - prevPrice).toFixed(2)),
            changePercent: parseFloat((changePercent * 100).toFixed(2)),
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const selectedStock = useMemo(() => {
    return stocks.find((s) => s.symbol === selectedSymbol);
  }, [stocks, selectedSymbol]);

  // Compute total portfolio value
  const totalPortfolioValue = useMemo(() => {
    let holdingsValue = 0;
    Object.entries(portfolio).forEach(([symbol, holding]) => {
      const stock = stocks.find((s) => s.symbol === symbol);
      if (stock && holding.shares > 0) {
        holdingsValue += holding.shares * stock.price;
      }
    });
    return parseFloat((cash + holdingsValue).toFixed(2));
  }, [cash, portfolio, stocks]);

  const handleExecuteTrade = (e) => {
    e.preventDefault();
    if (tradeQty <= 0) {
      toast.error("Please specify a valid quantity");
      return;
    }

    const price = selectedStock.price;
    const totalCost = price * tradeQty;

    const currentHolding = portfolio[selectedSymbol] || { shares: 0, avgPrice: 0 };

    if (tradeType === "buy") {
      if (totalCost > cash) {
        toast.error("Insufficient buying power (cash)");
        return;
      }

      const newCash = cash - totalCost;
      const totalShares = currentHolding.shares + tradeQty;
      const newAvgPrice = ((currentHolding.shares * currentHolding.avgPrice) + totalCost) / totalShares;

      const newPortfolio = {
        ...portfolio,
        [selectedSymbol]: {
          shares: totalShares,
          avgPrice: parseFloat(newAvgPrice.toFixed(2)),
        },
      };

      saveState(newCash, newPortfolio);
      toast.success(`Bought ${tradeQty} shares of ${selectedSymbol} for $${totalCost.toFixed(2)}`);
    } else {
      if (tradeQty > currentHolding.shares) {
        toast.error(`Insufficient shares. You only own ${currentHolding.shares} of ${selectedSymbol}`);
        return;
      }

      const revenue = price * tradeQty;
      const newCash = cash + revenue;
      const totalShares = currentHolding.shares - tradeQty;

      const newPortfolio = { ...portfolio };
      if (totalShares === 0) {
        delete newPortfolio[selectedSymbol];
      } else {
        newPortfolio[selectedSymbol] = {
          ...currentHolding,
          shares: totalShares,
        };
      }

      saveState(newCash, newPortfolio);
      toast.success(`Sold ${tradeQty} shares of ${selectedSymbol} for $${revenue.toFixed(2)}`);
    }
  };

  const handleResetMarket = () => {
    if (!confirm("Are you sure you want to reset your sandbox cash and portfolio?")) return;
    saveState(10000, {});
    toast.success("Sandbox portfolio reset to starting values!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 relative z-10">
      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Gamepad2 className="h-8 w-8 text-purple-500 dark:text-purple-400 animate-pulse-glow" />
            Stock Sandbox Simulator
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm md:text-base font-light">
            Practice paper-trading stocks and crypto. Watch real-time price feeds and execute instant orders.
          </p>
        </div>

        <button
          onClick={handleResetMarket}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 hover:border-red-500/30 hover:bg-red-500/5 dark:hover:bg-red-500/10 transition"
        >
          Reset Sandbox
        </button>
      </div>

      {/* Aggregate Overview Card */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-white/10 text-center">
          <span className="text-[10px] font-mono tracking-widest text-purple-600 dark:text-purple-300 uppercase block mb-1">CASH BALANCE</span>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            ${cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-white/10 text-center">
          <span className="text-[10px] font-mono tracking-widest text-pink-600 dark:text-pink-300 uppercase block mb-1">PORTFOLIO VALUE</span>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-white/10 text-center flex flex-col justify-center">
          <span className="text-[10px] font-mono tracking-widest text-emerald-600 dark:text-emerald-300 uppercase block mb-1">RETURN RATE</span>
          <div className={`text-xl font-black font-mono ${totalPortfolioValue >= 10000 ? "text-emerald-600 dark:text-emerald-400" : "text-red-650 dark:text-red-400"}`}>
            {totalPortfolioValue >= 10000 ? "+" : ""}{(((totalPortfolioValue - 10000) / 10000) * 100).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ticker Feed list */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-white/10 space-y-4 lg:col-span-2">
          <h3 className="text-sm font-mono font-bold text-purple-600 dark:text-purple-300 uppercase border-b border-slate-200/50 dark:border-white/5 pb-2 flex items-center justify-between">
            <span>Market Ticker Feeds</span>
            <span className="text-[10px] text-slate-400 dark:text-gray-500 font-light flex items-center gap-1 font-sans">
              <RefreshCw className="h-3 w-3 animate-spin-slow" /> Ticks live
            </span>
          </h3>

          <div className="space-y-2">
            {stocks.map((stock) => {
              const owned = portfolio[stock.symbol]?.shares || 0;
              const hasGained = (stock.changePercent || 0) >= 0;

              return (
                <div
                  key={stock.symbol}
                  onClick={() => setSelectedSymbol(stock.symbol)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                    selectedSymbol === stock.symbol
                      ? "border-purple-500/40 bg-purple-50 dark:bg-purple-950/10 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                      : "border-slate-200/50 dark:border-white/5 hover:border-purple-300 dark:hover:border-white/10 bg-slate-100/50 dark:bg-black/20"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-black text-slate-900 dark:text-white">{stock.symbol}</span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-500 font-light hidden sm:inline">{stock.name}</span>
                    </div>
                    {owned > 0 && (
                      <span className="text-[9px] font-mono text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/30 px-2 py-0.5 rounded-full">
                        Owned: {owned} shares
                      </span>
                    )}
                  </div>

                  <div className="text-right space-y-0.5">
                    <span className="text-sm font-bold font-mono text-slate-900 dark:text-white block">
                      ${stock.price.toFixed(2)}
                    </span>
                    <span className={`text-[10px] font-mono flex items-center justify-end gap-0.5 ${hasGained ? "text-emerald-600 dark:text-emerald-400" : "text-pink-650 dark:text-pink-400"}`}>
                      {hasGained ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {hasGained ? "+" : ""}{stock.changePercent || "0.00"}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trade desk panel */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-white/10 space-y-4 lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-mono font-bold text-purple-600 dark:text-purple-300 uppercase border-b border-slate-200/50 dark:border-white/5 pb-2 flex items-center gap-1.5">
              <ShoppingCart className="h-4 w-4" /> Trade Desk
            </h3>

            <form onSubmit={handleExecuteTrade} className="space-y-4 mt-4">
              <div>
                <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 block mb-1">Target Instrument</span>
                <div className="p-3 bg-slate-100/50 dark:bg-black/40 border border-slate-200/50 dark:border-white/10 rounded-xl flex justify-between items-center">
                  <span className="text-sm font-black text-slate-900 dark:text-white">{selectedStock.symbol}</span>
                  <span className="text-sm font-mono font-bold text-purple-600 dark:text-purple-300">${selectedStock.price.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 block mb-1">Order Action</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTradeType("buy")}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      tradeType === "buy" 
                        ? "bg-purple-600 text-white shadow-lg" 
                        : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white"
                    }`}
                  >
                    Buy (Long)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTradeType("sell")}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      tradeType === "sell" 
                        ? "bg-pink-600 text-white shadow-lg" 
                        : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white"
                    }`}
                  >
                    Sell (Short)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-purple-600 dark:text-purple-300 uppercase mb-1">Order Quantity (Shares)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={tradeQty}
                  onChange={(e) => setTradeQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2 bg-slate-100/50 dark:bg-black/40 border border-slate-200/50 dark:border-white/10 rounded-xl text-slate-800 dark:text-white text-sm outline-none focus:border-purple-500"
                />
              </div>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-200/50 dark:border-white/5 mt-4 space-y-3">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-500 dark:text-gray-400">Total order cost:</span>
              <span className="text-slate-900 dark:text-white font-bold">${(selectedStock.price * tradeQty).toFixed(2)}</span>
            </div>
            <button
              onClick={handleExecuteTrade}
              className={`w-full py-3 rounded-xl text-xs font-bold text-white transition-all shadow-[0_4px_15px_rgba(0,0,0,0.1)] active:scale-95 ${
                tradeType === "buy" 
                  ? "bg-purple-600 hover:bg-purple-500 shadow-purple-500/20" 
                  : "bg-pink-600 hover:bg-pink-500 shadow-pink-500/20"
              }`}
            >
              Transmit Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
