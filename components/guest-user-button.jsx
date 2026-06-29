"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { clearGuestSession } from "@/lib/guest";
import { useRouter } from "next/navigation";

export default function GuestUserButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await clearGuestSession();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to clear guest session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="w-10 h-10">
          <User size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-panel border-slate-200/50 dark:border-white/10 text-slate-800 dark:text-white bg-white/95 dark:bg-slate-950/90 rounded-2xl p-2 min-w-[160px]">
        <DropdownMenuItem disabled className="text-xs font-mono uppercase text-slate-400 dark:text-gray-500 mb-1">
          Guest User
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/profile")} className="hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl cursor-pointer flex items-center p-2.5 text-xs font-semibold">
          <User size={16} className="mr-2 text-purple-500" />
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} disabled={isLoading} className="hover:bg-red-50 dark:hover:bg-red-500/10 text-red-650 dark:text-red-400 rounded-xl cursor-pointer flex items-center p-2.5 text-xs font-semibold">
          <LogOut size={16} className="mr-2" />
          {isLoading ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
