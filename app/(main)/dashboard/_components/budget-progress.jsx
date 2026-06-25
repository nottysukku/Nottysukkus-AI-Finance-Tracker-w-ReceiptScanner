"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";


import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  return (
    <div className="glass-panel rounded-2xl border border-white/10 p-6 shadow-[0_8px_30px_rgba(139,92,246,0.05)]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4">
        <div className="flex-1">
          <h3 className="text-base font-bold text-white mb-1">
            Global Budget Overview (Default Account)
          </h3>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-36 glass-input h-9 text-white rounded-lg"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                  className="hover:bg-green-500/20"
                >
                  <Check className="h-4 w-4 text-green-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="hover:bg-red-500/20"
                >
                  <X className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-300">
                  {initialBudget
                    ? `$${currentExpenses.toFixed(2)} of $${initialBudget.amount.toFixed(2)} spent`
                    : "No budget set"}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6 text-gray-400 hover:text-white hover:bg-white/5 rounded-full"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {initialBudget && (
        <div className="space-y-3 mt-2">
          <Progress
            value={percentUsed}
            extraStyles={`${
              percentUsed >= 90
                ? "bg-gradient-to-r from-red-500 to-rose-600 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                : percentUsed >= 75
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                  : "bg-gradient-to-r from-purple-400 to-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.5)]"
            }`}
          />
          <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
            <span className="text-purple-300">{percentUsed >= 100 ? "Limit Exceeded!" : `${(100 - percentUsed).toFixed(1)}% remaining`}</span>
            <span>{percentUsed.toFixed(1)}% used</span>
          </div>
        </div>
      )}
    </div>
  );
}
