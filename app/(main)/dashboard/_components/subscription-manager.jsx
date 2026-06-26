"use client";

import React, { useState } from "react";
import { useLoading } from "@/context/loading-context";
import { createSubscription, deleteSubscription } from "@/actions/dashboard-extras";
import { toast } from "sonner";
import { 
  CreditCard, Plus, Trash2, Calendar, DollarSign, Bell, AlertTriangle, Play
} from "lucide-react";

const CATEGORIES = [
  { value: "entertainment", label: "Entertainment & Media" },
  { value: "software", label: "Software & SaaS" },
  { value: "utilities", label: "Utilities" },
  { value: "health", label: "Health & Wellness" },
  { value: "other", label: "Other Recurring" },
];

export function SubscriptionManager({ initialSubscriptions = [] }) {
  const { showLoading, hideLoading } = useLoading();
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [nextPayment, setNextPayment] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [category, setCategory] = useState("entertainment");

  const handleCreateSub = async (e) => {
    e.preventDefault();
    if (!name || !amount || !startDate || !nextPayment) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      showLoading("Enrolling subscription...");
      const res = await createSubscription({
        name,
        amount: parseFloat(amount),
        billingCycle,
        startDate,
        nextPayment,
        category,
      });

      if (res.success) {
        toast.success(`Subscription "${name}" tracked successfully!`);
        setSubscriptions([res.data, ...subscriptions]);
        // Reset form
        setName("");
        setAmount("");
        setBillingCycle("monthly");
        setCategory("entertainment");
        setIsCreating(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create subscription");
    } finally {
      hideLoading();
    }
  };

  const handleDeleteSub = async (id, subName) => {
    if (!confirm(`Are you sure you want to stop tracking "${subName}"?`)) return;

    try {
      showLoading("Deleting subscription...");
      const res = await deleteSubscription(id);
      if (res.success) {
        toast.success(`Subscription "${subName}" deleted`);
        setSubscriptions(subscriptions.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete subscription");
    } finally {
      hideLoading();
    }
  };

  // Calculations
  const calculateTotalMonthly = () => {
    return subscriptions.reduce((sum, sub) => {
      if (sub.billingCycle.toLowerCase() === "yearly") {
        return sum + (sub.amount / 12);
      }
      return sum + sub.amount;
    }, 0);
  };

  const totalMonthlyCost = calculateTotalMonthly();

  return (
    <div className="space-y-8">
      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-pink-400" />
            Subscription Manager
          </h2>
          <p className="text-gray-400 text-sm font-light">
            Monitor, summarize, and control your recurring bills.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all flex items-center gap-2 shadow-[0_4px_20px_rgba(236,72,153,0.3)] hover:shadow-[0_4px_25px_rgba(236,72,153,0.5)] active:scale-95"
        >
          <Plus className="h-4 w-4" />
          {isCreating ? "Dismiss Panel" : "Track Subscription"}
        </button>
      </div>

      {/* Aggregate Overview Card */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-950/20 to-black/50 relative overflow-hidden md:col-span-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <span className="text-xs font-mono tracking-widest text-purple-400 uppercase">MONTHLY BURN RATE</span>
          <h3 className="text-4xl font-black text-white mt-2 font-mono flex items-baseline">
            ${totalMonthlyCost.toFixed(2)}
            <span className="text-sm font-normal text-gray-400 font-sans ml-1">/mo</span>
          </h3>
          <p className="text-gray-400 text-xs mt-3 leading-relaxed">
            Consolidated across {subscriptions.length} active recurring payment agreements.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-pink-950/20 to-black/50 relative overflow-hidden md:col-span-2 flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <span className="text-xs font-mono tracking-widest text-pink-400 uppercase flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5" /> Upcoming Renewals
            </span>
            <div className="mt-3 space-y-2 max-h-[100px] overflow-y-auto pr-2">
              {subscriptions.length === 0 ? (
                <p className="text-gray-400 text-xs italic">No subscriptions registered.</p>
              ) : (
                subscriptions.slice(0, 3).map((sub) => {
                  const days = Math.max(0, Math.ceil((new Date(sub.nextPayment) - new Date()) / (1000 * 60 * 60 * 24)));
                  return (
                    <div key={sub.id} className="flex justify-between items-center text-xs border-b border-white/5 pb-1">
                      <span className="text-white font-medium">{sub.name}</span>
                      <span className="text-gray-400">
                        Renews in <strong className={days <= 3 ? "text-red-400" : "text-purple-300"}>{days} days</strong> (${sub.amount})
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Creator Form */}
      {isCreating && (
        <form onSubmit={handleCreateSub} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 animate-fadeIn">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-400" />
            Track New Subscription
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-mono text-purple-300 uppercase mb-1">Service / Merchant</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Netflix, OpenAI ChatGPT"
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-purple-300 uppercase mb-1">Cost Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 19.99"
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-purple-300 uppercase mb-1">Billing Cycle</label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value)}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-purple-300 uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-purple-300 uppercase mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-purple-300 uppercase mb-1">Next Payment Date</label>
              <input
                type="date"
                value={nextPayment}
                onChange={(e) => setNextPayment(e.target.value)}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 transition"
            >
              Begin Tracking
            </button>
          </div>
        </form>
      )}

      {/* Subscription Grid List */}
      {subscriptions.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-white/5 flex flex-col items-center justify-center">
          <div className="p-4 rounded-full bg-white/5 border border-white/10 mb-4 animate-pulse">
            <CreditCard className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Active Subscriptions</h3>
          <p className="text-gray-400 text-sm max-w-md font-light">
            Plug leaks. Add software services, media systems, utilities, or gyms to model your annual commitments.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((sub) => {
            const nextPayDate = new Date(sub.nextPayment);
            const daysLeft = Math.max(0, Math.ceil((nextPayDate - new Date()) / (1000 * 60 * 60 * 24)));
            const cycleText = sub.billingCycle.toLowerCase() === "yearly" ? "yr" : "mo";

            return (
              <div
                key={sub.id}
                className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-purple-500/30 hover:shadow-[0_4px_25px_rgba(0,0,0,0.3)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-purple-950/40 text-purple-300 border border-purple-900/30 uppercase">
                      {sub.category}
                    </span>
                    <span className="text-lg font-mono font-black text-white">
                      ${sub.amount.toFixed(2)}
                      <span className="text-[10px] font-normal text-gray-400 font-sans">/{cycleText}</span>
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-white tracking-wide truncate">
                    {sub.name}
                  </h4>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                  <div className="flex justify-between text-xs text-gray-400 font-light">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-purple-400" /> Renews:
                    </span>
                    <span className="font-mono text-white">
                      {nextPayDate.toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Notice status:</span>
                    {daysLeft <= 3 ? (
                      <span className="text-red-400 font-semibold flex items-center gap-1 font-mono">
                        <AlertTriangle className="h-3 w-3 animate-pulse" />
                        In {daysLeft} days!
                      </span>
                    ) : (
                      <span className="text-purple-300 font-semibold font-mono">
                        In {daysLeft} days
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-4 pt-2 border-t border-white/5">
                  <button
                    onClick={() => handleDeleteSub(sub.id, sub.name)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
                    title="Stop tracking"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
