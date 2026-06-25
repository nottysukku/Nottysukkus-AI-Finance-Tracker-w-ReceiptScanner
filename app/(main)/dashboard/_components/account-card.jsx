"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";

import Link from "next/link";
import { updateDefaultAccount } from "@/actions/account";
import { toast } from "sonner";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault(); // Prevent navigation

    if (isDefault) {
      toast.warning("You need atleast 1 default account");
      return; // Don't allow toggling off the default account
    }

    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl border border-white/10 overflow-hidden relative group shadow-lg hover:shadow-[0_8px_30px_rgb(139,92,246,0.15)] transition-all duration-300">
      <Link href={`/account/${id}`} className="block p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold capitalize text-white group-hover:text-purple-400 transition-colors">
            {name}
          </h3>
          <div onClick={(e) => e.stopPropagation()}>
            <Switch
              checked={isDefault}
              onClick={handleDefaultChange}
              disabled={updateDefaultLoading}
              className="data-[state=checked]:bg-purple-500"
            />
          </div>
        </div>
        <div className="mb-6">
          <div className="text-3xl font-extrabold text-white tracking-tight">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-xs text-purple-300/70 font-medium mt-1">
            {type.charAt(0) + type.slice(1).toLowerCase()} Wallet
          </p>
        </div>
        <div className="flex justify-between items-center text-xs border-t border-white/5 pt-4 text-gray-400 font-medium">
          <div className="flex items-center gap-1 hover:text-green-400 transition-colors">
            <ArrowUpRight className="h-4 w-4 text-green-400" />
            <span>Income</span>
          </div>
          <div className="flex items-center gap-1 hover:text-red-400 transition-colors">
            <ArrowDownRight className="h-4 w-4 text-red-400" />
            <span>Expense</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
