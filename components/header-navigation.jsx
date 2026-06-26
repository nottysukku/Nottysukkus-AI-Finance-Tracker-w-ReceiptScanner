"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Sparkles, Gamepad2, Brain, HelpCircle, Landmark } from "lucide-react";

export default function HeaderNavigation({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  const loggedInLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/advisor", label: "AI Advisor", icon: Sparkles },
    { href: "/simulator", label: "Wealth Sim", icon: Landmark },
    { href: "/market", label: "Stock Sandbox", icon: Gamepad2 },
    { href: "/trivia", label: "Trivia Quiz", icon: Brain },
    { href: "/wheel", label: "Daily Spin", icon: HelpCircle },
  ];

  const loggedOutLinks = [
    { href: "/#features", label: "Features" },
    { href: "/#testimonials", label: "Testimonials" },
  ];

  const activeLinks = user ? loggedInLinks : loggedOutLinks;

  return (
    <div className="flex items-center">
      {/* Desktop Navigation Links */}
      <div className="hidden lg:flex items-center space-x-6 mr-6">
        {activeLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-1.5"
            >
              {Icon && <Icon className="h-3.5 w-3.5 text-purple-400" />}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Mobile Hamburger Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition border border-white/5"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="h-5 w-5 text-pink-400 animate-pulse" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-[70px] left-0 w-full glass-panel p-6 rounded-3xl border border-white/10 flex flex-col space-y-4 shadow-2xl z-50 animate-fadeIn lg:hidden">
          {activeLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-bold text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2 p-2 rounded-xl hover:bg-white/5"
              >
                {Icon && <Icon className="h-4 w-4 text-purple-400" />}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
