"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative pt-48 pb-20 px-4 overflow-hidden grid-bg">
      <div className="container mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse-glow">
          <span>✨ Introducing Next-Gen AI Finance Tracker</span>
        </div>

        <h1 className="text-5xl md:text-8xl lg:text-[110px] leading-tight pb-6 font-extrabold tracking-tighter gradient-title">
          Smarter Money, <br /> Brighter Future
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          An AI-powered financial management platform that helps you track,
          analyze, and optimize your spending with real-time insights.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-10 py-6 text-base bg-gradient-to-r from-purple-650 to-pink-650 hover:from-purple-500 hover:to-pink-500 text-white rounded-full border-0 shadow-[0_8px_24px_rgba(236,72,153,0.3)] hover:shadow-[0_12px_32px_rgba(236,72,153,0.5)] transition-all duration-300">
              Get Started
            </Button>
          </Link>
          <Link href="https://www.github.com/nottysukku" target="_blank">
            <Button size="lg" variant="outline" className="px-10 py-6 text-base glass-panel border-white/10 hover:border-purple-500/30 hover:bg-purple-500/10 text-white rounded-full transition-all">
              Github
            </Button>
          </Link>
        </div>

        <div className="flex justify-center items-center mt-6 gap-2">
          <span className="text-sm text-gray-400">Or</span>
          <Link href="/sign-in">
            <Button variant="link" className="p-0 h-auto text-purple-400 hover:text-purple-300 underline font-medium">
              try as guest →
            </Button>
          </Link>
        </div>

        <div className="hero-image-wrapper mt-16 md:mt-24">
          <div ref={imageRef} className="hero-image p-3 rounded-2xl glass-panel border-white/10 max-w-5xl mx-auto shadow-[0_20px_50px_rgba(139,92,246,0.2)]">
            <Image
              src="/laptop-lot-money-concept-earning-money-internet-ai-generated_894218-1059.avif"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-xl border border-white/5 mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
