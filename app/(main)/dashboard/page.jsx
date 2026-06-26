import { getUserAccounts } from "@/actions/dashboard";
import { getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { getUserGoals, getUserSubscriptions } from "@/actions/dashboard-extras";
import { DashboardTabs } from "./_components/dashboard-tabs";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [accounts, transactions, goals, subscriptions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
    getUserGoals(),
    getUserSubscriptions(),
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

      {/* Glassmorphic Tab Container */}
      <DashboardTabs
        accounts={accounts || []}
        transactions={transactions || []}
        goals={goals || []}
        subscriptions={subscriptions || []}
        budgetData={budgetData}
      />
    </div>
  );
}

