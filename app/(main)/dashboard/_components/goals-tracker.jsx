"use client";

import React, { useState } from "react";
import { useLoading } from "@/context/loading-context";
import { createGoal, updateGoalProgress, deleteGoal } from "@/actions/dashboard-extras";
import { toast } from "sonner";
import { 
  Target, Plus, Trash2, PiggyBank, Coins, Calendar, ArrowRight,
  TrendingUp, Award, DollarSign
} from "lucide-react";

export function GoalsTracker({ initialGoals = [] }) {
  const { showLoading, hideLoading } = useLoading();
  const [goals, setGoals] = useState(initialGoals);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [deadline, setDeadline] = useState("");

  // Deposit/Withdrawal states
  const [modifyingGoalId, setModifyingGoalId] = useState(null);
  const [modifyType, setModifyType] = useState("deposit"); // "deposit" or "withdraw"
  const [modifyAmount, setModifyAmount] = useState("");

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!name || !target) {
      toast.error("Name and Target Amount are required");
      return;
    }

    try {
      showLoading("Forging savings goal...");
      const res = await createGoal({
        name,
        target: parseFloat(target),
        current: parseFloat(current) || 0,
        deadline: deadline || null,
      });

      if (res.success) {
        toast.success(`Savings goal "${name}" created successfully!`);
        setGoals([res.data, ...goals]);
        // Reset form
        setName("");
        setTarget("");
        setCurrent("");
        setDeadline("");
        setIsCreating(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create savings goal");
    } finally {
      hideLoading();
    }
  };

  const handleModifyProgress = async (goal) => {
    if (!modifyAmount || parseFloat(modifyAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const value = parseFloat(modifyAmount);
    let newAmount = goal.current;

    if (modifyType === "deposit") {
      newAmount += value;
    } else {
      if (value > goal.current) {
        toast.error("Cannot withdraw more than your current savings");
        return;
      }
      newAmount -= value;
    }

    try {
      showLoading(`${modifyType === "deposit" ? "Depositing" : "Withdrawing"} funds...`);
      const res = await updateGoalProgress(goal.id, newAmount);

      if (res.success) {
        toast.success(`Successfully updated savings for "${goal.name}"!`);
        setGoals(goals.map(g => g.id === goal.id ? res.data : g));
        setModifyAmount("");
        setModifyingGoalId(null);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update savings");
    } finally {
      hideLoading();
    }
  };

  const handleDeleteGoal = async (id, goalName) => {
    if (!confirm(`Are you sure you want to delete the goal "${goalName}"?`)) return;

    try {
      showLoading("Deleting goal...");
      const res = await deleteGoal(id);
      if (res.success) {
        toast.success(`Savings goal "${goalName}" deleted`);
        setGoals(goals.filter(g => g.id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete goal");
    } finally {
      hideLoading();
    }
  };

  // SVGs Circular Progress Calculation
  const renderProgressRing = (currentAmount, targetAmount) => {
    const percent = Math.min(100, Math.round((currentAmount / targetAmount) * 100)) || 0;
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Glow Shadow background */}
        <div className="absolute inset-2 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-md" />
        
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-gray-800"
            strokeWidth="6"
            fill="transparent"
          />
          {/* Animated Progress circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-purple-500 transition-all duration-1000 ease-out"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0px 0px 4px rgba(139, 92, 246, 0.5))"
            }}
          />
        </svg>
        <span className="absolute text-sm font-black text-white font-mono">
          {percent}%
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="h-6 w-6 text-purple-400" />
            Savings Goals Tracker
          </h2>
          <p className="text-gray-400 text-sm font-light">
            Keep tabs on your financial targets. Fund them dynamically.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all flex items-center gap-2 shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_4px_25px_rgba(139,92,246,0.5)] active:scale-95"
        >
          <Plus className="h-4 w-4" />
          {isCreating ? "Dismiss Panel" : "Forge New Goal"}
        </button>
      </div>

      {/* Goal Creator Panel */}
      {isCreating && (
        <form onSubmit={handleCreateGoal} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 animate-fadeIn">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-pink-400" />
            Add Savings Target
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-mono text-purple-300 uppercase mb-1">Goal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tesla Model Y Fund"
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-purple-300 uppercase mb-1">Target Amount ($)</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-purple-300 uppercase mb-1">Current Savings ($)</label>
              <input
                type="number"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-purple-300 uppercase mb-1">Deadline (Optional)</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
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
              Create Goal
            </button>
          </div>
        </form>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-white/5 flex flex-col items-center justify-center">
          <div className="p-4 rounded-full bg-white/5 border border-white/10 mb-4 animate-pulse">
            <Target className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Active Savings Goals</h3>
          <p className="text-gray-400 text-sm max-w-md font-light mb-4">
            Build financial momentum. Declare a savings target and watch your balances expand towards your destination.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {goals.map((goal) => {
            const daysRemaining = goal.deadline
              ? Math.max(0, Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
              : null;
            const isCompleted = goal.current >= goal.target;

            return (
              <div
                key={goal.id}
                className={`glass-panel p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isCompleted 
                    ? "border-pink-500/40 shadow-[0_0_20px_rgba(236,72,153,0.15)] bg-pink-950/10" 
                    : "border-white/10 hover:border-purple-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
                }`}
              >
                {isCompleted && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-pink-500 to-purple-500 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-bl-xl flex items-center gap-1">
                    <Award className="h-3 w-3" /> Fully Funded
                  </div>
                )}

                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="space-y-1">
                    <h4 className="text-lg font-extrabold text-white tracking-wide truncate max-w-[200px]">
                      {goal.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar className="h-3.5 w-3.5 text-purple-400" />
                      {goal.deadline ? (
                        <span>
                          {new Date(goal.deadline).toLocaleDateString()}
                          {daysRemaining !== null && (
                            <span className="font-mono text-purple-300 ml-1">
                              ({daysRemaining}d left)
                            </span>
                          )}
                        </span>
                      ) : (
                        <span>No deadline</span>
                      )}
                    </div>
                  </div>
                  {renderProgressRing(goal.current, goal.target)}
                </div>

                {/* Progress Details */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Savings Rate:</span>
                    <span className="text-white font-bold">
                      ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Actions Panel */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                  {modifyingGoalId === goal.id ? (
                    <div className="flex items-center gap-2 w-full animate-fadeIn">
                      <select
                        value={modifyType}
                        onChange={(e) => setModifyType(e.target.value)}
                        className="bg-black/50 border border-white/10 text-xs rounded-xl px-2.5 py-1.5 text-white outline-none focus:border-purple-500"
                      >
                        <option value="deposit">Deposit</option>
                        <option value="withdraw">Withdraw</option>
                      </select>
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-purple-300" />
                        <input
                          type="number"
                          placeholder="Amount"
                          value={modifyAmount}
                          onChange={(e) => setModifyAmount(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 text-xs rounded-xl pl-7 pr-2.5 py-1.5 text-white outline-none focus:border-purple-500"
                        />
                      </div>
                      <button
                        onClick={() => handleModifyProgress(goal)}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                      >
                        Go
                      </button>
                      <button
                        onClick={() => {
                          setModifyingGoalId(null);
                          setModifyAmount("");
                        }}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setModifyingGoalId(goal.id);
                            setModifyType("deposit");
                          }}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all flex items-center gap-1"
                        >
                          <Coins className="h-3.5 w-3.5 text-purple-400" />
                          Adjust Savings
                        </button>
                      </div>
                      <button
                        onClick={() => handleDeleteGoal(goal.id, goal.name)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
                        title="Delete Goal"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
