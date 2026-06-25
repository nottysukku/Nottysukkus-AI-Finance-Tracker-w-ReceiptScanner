import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/account";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function AccountPage({ params }) {
  const { id } = await params;
  const accountData = await getAccountWithTransactions(id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 md:px-8 pb-12 relative z-10 text-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-panel p-6 rounded-2xl border border-white/10 shadow-lg">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight gradient-title capitalize">
            {account.name}
          </h1>
          <p className="text-purple-300/80 text-sm font-medium mt-1">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Wallet
          </p>
        </div>

        <div className="text-left md:text-right">
          <div className="text-3xl md:text-4xl font-black text-white tracking-tight">
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-xs text-gray-400 font-medium mt-1">
            {account._count.transactions} total transactions
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <Suspense
        fallback={<div className="h-60 w-full flex items-center justify-center"><BarLoader className="mt-4" width={"50%"} color="#ec4899" /></div>}
      >
        <AccountChart transactions={transactions} />
      </Suspense>

      {/* Transactions Table */}
      <Suspense
        fallback={<div className="h-60 w-full flex items-center justify-center"><BarLoader className="mt-4" width={"50%"} color="#ec4899" /></div>}
      >
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}
