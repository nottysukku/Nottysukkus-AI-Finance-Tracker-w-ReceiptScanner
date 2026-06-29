"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createGuestSession } from "@/lib/guest";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

export default function GuestSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGuestSignIn = async () => {
    try {
      setIsLoading(true);
      await createGuestSession();
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Failed to create guest session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleGuestSignIn}
      disabled={isLoading}
      className="w-full flex items-center gap-2"
    >
      <User size={18} />
      {isLoading ? "Creating guest session..." : "Continue as Guest"}
    </Button>
  );
}
