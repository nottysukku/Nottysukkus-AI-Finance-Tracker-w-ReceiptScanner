import { getUserAccounts } from "@/actions/dashboard";
import { getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";

import { Plus } from "lucide-react";
import { DashboardOverview } from "./_components/transaction-overview";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  const defaultAccount = accounts?.find((account) => account.isDefault);

  // Get budget for default account
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 md:px-8 pb-12 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
            Financial Nexus
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-light">
            Real-time analytics, automated budgets, and AI insights.
          </p>
        </div>
      </div>

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
            accounts?.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
        </div>
      </div>
    </div>
  );
}
