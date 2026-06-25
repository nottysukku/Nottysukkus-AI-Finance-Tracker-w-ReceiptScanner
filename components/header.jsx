import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import { isGuestUser } from "@/lib/guest";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import GuestUserButton from "./guest-user-button";

const Header = async () => {
  const user = await checkUser();
  const isGuest = user ? await isGuestUser(user.clerkUserId) : false;

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 rounded-full glass-panel border border-white/10 px-6 py-3 shadow-[0_8px_32px_0_rgba(139,92,246,0.1)]">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <Image
            src={"/logo-1.png"}
            alt="Money Logo"
            width={160}
            height={70}
            className="h-9 w-auto brightness-110"
          />
        </Link>

        {/* Navigation Links - Different for signed in/out users */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/#features"
            className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#testimonials"
            className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
          >
            Testimonials
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {/* Show different UI for authenticated users (both Clerk and guest) */}
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" className="glass-panel border-white/10 hover:border-purple-500/30 hover:bg-purple-500/10 text-white rounded-full flex items-center gap-2">
                  <LayoutDashboard size={18} className="text-purple-400" />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </Link>
              <Link href="/transaction/create">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-[0_4px_14px_0_rgba(236,72,153,0.3)] rounded-full flex items-center gap-2">
                  <PenBox size={18} />
                  <span className="hidden md:inline">Add Transaction</span>
                </Button>
              </Link>
              
              {/* Show different user buttons for Clerk vs Guest */}
              {isGuest ? (
                <div className="p-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                  <GuestUserButton />
                </div>
              ) : (
                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9 border-2 border-purple-500/50 rounded-full hover:border-purple-400 transition-all",
                      },
                    }}
                  />
                </SignedIn>
              )}
            </>
          ) : (
            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <Button variant="outline" className="glass-panel border-white/10 hover:border-purple-500/30 hover:bg-purple-500/10 text-white rounded-full">
                  Login
                </Button>
              </SignInButton>
            </SignedOut>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
