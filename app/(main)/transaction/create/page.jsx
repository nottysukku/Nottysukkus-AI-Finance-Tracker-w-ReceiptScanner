import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";
import { redirect } from "next/navigation";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function AddTransactionPage({ searchParams }) {
  const accounts = await getUserAccounts();
  const editId = (await searchParams)?.edit;

  // If no accounts, redirect to dashboard (this handles build-time issues)
  if (!accounts || accounts.length === 0) {
    redirect('/dashboard');
  }

  let initialData = null;
  if (editId) {
    try {
      const transaction = await getTransaction(editId);
      initialData = transaction;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      // Continue without initial data if there's an error
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 pb-12 relative z-10 text-gray-100">
      <div className="flex justify-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight gradient-title">
          {editId ? "Modify Transaction" : "Transaction Control Unit"}
        </h1>
      </div>
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 shadow-xl">
        <AddTransactionForm
          accounts={accounts}
          categories={defaultCategories}
          editMode={!!editId}
          initialData={initialData}
        />
      </div>
    </div>
  );
}
