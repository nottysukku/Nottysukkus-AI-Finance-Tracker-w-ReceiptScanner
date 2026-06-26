"use client";

import React, { useState } from "react";
import { AccountCard } from "./account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./budget-progress";
import { DashboardOverview } from "./transaction-overview";
import { GoalsTracker } from "./goals-tracker";
import { SubscriptionManager } from "./subscription-manager";
import { NetWorthHealth } from "./net-worth-health";
import { FinancialTools } from "./financial-tools";

import { 
  LayoutGrid, Target, CreditCard, Landmark, Wrench, Plus 
} from "lucide-react";

export function DashboardTabs({
  accounts = [],
  transactions = [],
  goals = [],
  subscriptions = [],
  budgetData = null
}) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Command Center", icon: LayoutGrid },
    { id: "goals", label: "Goals & Savings", icon: Target },
    { id: "subscriptions", label: "Subscription Hub", icon: CreditCard },
    { id: "diagnostics", label: "Wealth & Health", icon: Landmark },
    { id: "widgets", label: "Calculators & Exports", icon: Wrench },
  ];

  return (
    <div className="space-y-8">
      {/* Glassmorphic Tab Selector Navigation */}
      <div className="glass-panel p-2 rounded-2xl border border-white/10 flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-wrap gap-1.5 w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-purple-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="transition-all duration-500">
        {activeTab === "overview" && (
          <div className="space-y-10 animate-fadeIn">
            {/* Budget Progress */}
            <BudgetProgress
              initialBudget={budgetData?.budget}
              currentExpenses={budgetData?.currentExpenses || 0}
            />

            {/* Dashboard Overview */}
            <DashboardOverview
              accounts={accounts}
              transactions={transactions || []}
            />

            {/* Accounts Grid */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-white">Your Wallets & Accounts</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <CreateAccountDrawer>
                  <div className="glass-panel border-dashed border-white/20 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 rounded-2xl cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-white h-[180px] p-6 group">
                    <div className="p-4 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 group-hover:border-purple-500/30 transition-all mb-4">
                      <Plus className="h-6 w-6 text-purple-400" />
                    </div>
                    <p className="text-sm font-medium">Add New Account</p>
                  </div>
                </CreateAccountDrawer>
                {accounts.length > 0 &&
                  accounts.map((account) => (
                    <AccountCard key={account.id} account={account} />
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "goals" && (
          <div className="animate-fadeIn">
            <GoalsTracker initialGoals={goals} />
          </div>
        )}

        {activeTab === "subscriptions" && (
          <div className="animate-fadeIn">
            <SubscriptionManager initialSubscriptions={subscriptions} />
          </div>
        )}

        {activeTab === "diagnostics" && (
          <div className="animate-fadeIn">
            <NetWorthHealth 
              accounts={accounts} 
              goals={goals} 
              budgetProgress={{
                initialBudget: budgetData?.budget || 0,
                currentExpenses: budgetData?.currentExpenses || 0
              }} 
            />
          </div>
        )}

        {activeTab === "widgets" && (
          <div className="animate-fadeIn">
            <FinancialTools transactions={transactions} accounts={accounts} />
          </div>
        )}
      </div>
    </div>
  );
}
