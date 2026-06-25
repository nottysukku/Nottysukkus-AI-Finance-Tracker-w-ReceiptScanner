"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import { ReceiptScanner } from "./recipt-scanner";

export function AddTransactionForm({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
          },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const onSubmit = (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
    }
  };

  const handleScanComplete = (scannedData) => {
    if (scannedData && scannedData.amount > 0) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description && scannedData.description !== "Could not parse receipt") {
        setValue("description", scannedData.description);
      }
      if (scannedData.category && scannedData.category !== "other-expense") {
        setValue("category", scannedData.category);
      }
      // Don't show toast here as it's already shown in the scanner component
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode, reset, router]);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Receipt Scanner - Only show in create mode */}
      {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

      {/* Type */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-300">Transaction Type</label>
        <Select
          onValueChange={(value) => setValue("type", value)}
          defaultValue={type}
        >
          <SelectTrigger className="glass-input h-10 rounded-xl border-white/10 text-white">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="glass-panel border-white/10 text-white bg-slate-950/90">
            <SelectItem value="EXPENSE" className="hover:bg-purple-500/20 text-xs">Expense</SelectItem>
            <SelectItem value="INCOME" className="hover:bg-purple-500/20 text-xs">Income</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-xs text-rose-400 mt-1">{errors.type.message}</p>
        )}
      </div>

      {/* Amount and Account */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300">Amount ($)</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")}
            className="glass-input h-10 rounded-xl"
          />
          {errors.amount && (
            <p className="text-xs text-rose-400 mt-1">{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300">Account / Wallet</label>
          <Select
            onValueChange={(value) => setValue("accountId", value)}
            defaultValue={getValues("accountId")}
          >
            <SelectTrigger className="glass-input h-10 rounded-xl border-white/10 text-white">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent className="glass-panel border-white/10 text-white bg-slate-950/95">
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id} className="hover:bg-purple-500/20 text-xs">
                  {account.name} (${parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <Button
                  variant="ghost"
                  className="w-full text-left text-xs text-purple-400 hover:text-purple-300 hover:bg-white/5 justify-start pl-8 pr-2 py-2 font-medium"
                >
                  + Create Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId && (
            <p className="text-xs text-rose-400 mt-1">{errors.accountId.message}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-300">Category</label>
        <Select
          onValueChange={(value) => setValue("category", value)}
          defaultValue={getValues("category")}
        >
          <SelectTrigger className="glass-input h-10 rounded-xl border-white/10 text-white">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="glass-panel border-white/10 text-white bg-slate-950/95 max-h-[250px] overflow-y-auto">
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id} className="hover:bg-purple-500/20 text-xs">
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-xs text-rose-400 mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-300">Transaction Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal glass-input h-10 rounded-xl border-white/10",
                !date && "text-gray-400"
              )}
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 text-purple-400" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 glass-panel border-white/10 rounded-2xl overflow-hidden bg-slate-950/95" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => setValue("date", date)}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
              className="bg-transparent text-white"
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-xs text-rose-400 mt-1">{errors.date.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-300">Memo / Description</label>
        <Input 
          placeholder="Enter details..." 
          {...register("description")} 
          className="glass-input h-10 rounded-xl"
        />
        {errors.description && (
          <p className="text-xs text-rose-400 mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Recurring Toggle */}
      <div className="flex flex-row items-center justify-between rounded-xl glass-panel border-white/10 p-5 shadow-sm">
        <div className="space-y-0.5">
          <label className="text-base font-bold text-white">Recurring Schedule</label>
          <div className="text-xs text-gray-400">
            Automatically duplicate this transaction at a set interval
          </div>
        </div>
        <Switch
          checked={isRecurring}
          onCheckedChange={(checked) => setValue("isRecurring", checked)}
          className="data-[state=checked]:bg-purple-500"
        />
      </div>

      {/* Recurring Interval */}
      {isRecurring && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300">Frequency</label>
          <Select
            onValueChange={(value) => setValue("recurringInterval", value)}
            defaultValue={getValues("recurringInterval")}
          >
            <SelectTrigger className="glass-input h-10 rounded-xl border-white/10 text-white">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent className="glass-panel border-white/10 text-white bg-slate-950/90">
              <SelectItem value="DAILY" className="hover:bg-purple-500/20 text-xs">Daily</SelectItem>
              <SelectItem value="WEEKLY" className="hover:bg-purple-500/20 text-xs">Weekly</SelectItem>
              <SelectItem value="MONTHLY" className="hover:bg-purple-500/20 text-xs">Monthly</SelectItem>
              <SelectItem value="YEARLY" className="hover:bg-purple-500/20 text-xs">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval && (
            <p className="text-xs text-rose-400 mt-1">
              {errors.recurringInterval.message}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          className="w-full glass-panel border-white/10 text-white hover:bg-white/5 hover:border-white/20 rounded-xl h-12"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl border-0 shadow-[0_4px_14px_rgba(236,72,153,0.3)] h-12" 
          disabled={transactionLoading}
        >
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>{editMode ? "Saving Changes..." : "Injecting Details..."}</span>
            </>
          ) : editMode ? (
            "Update Transaction"
          ) : (
            "Create Transaction"
          )}
        </Button>
      </div>
    </form>
  );
}
