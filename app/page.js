import React from "react";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import HeroSection from "@/components/hero";
import Link from "next/link";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-transparent relative z-10 text-gray-100">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl glass-panel border-white/5 hover:border-purple-500/20 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2 drop-shadow-[0_2px_8px_rgba(168,85,247,0.3)]">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
              Everything you need to manage your finances
            </h2>
            <p className="text-gray-400 text-lg">
              Streamline your financial life with intelligent tracking, automated entry, and modern visualization.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <div className="glass-panel glass-panel-hover p-8 rounded-3xl border border-white/15 flex flex-col justify-between" key={index}>
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">How It Works</h2>
            <p className="text-gray-400 text-lg">
              Get set up in less than 2 minutes and start optimizing your wealth immediately.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {howItWorksData.map((step, index) => (
              <div key={index} className="text-center relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:border-purple-500/30 group-hover:scale-105 transition-all duration-300">
                  <div className="text-purple-400 group-hover:text-pink-400 transition-colors">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm max-w-sm mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
              What Our Users Say
            </h2>
            <p className="text-gray-400 text-lg">
              Hear from professionals who turned their tracking chaos into automated clarity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <div key={index} className="glass-panel glass-panel-hover p-8 rounded-3xl border border-white/15 flex flex-col justify-between">
                <p className="text-gray-300 italic mb-8 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-purple-500/50"
                  />
                  <div className="ml-4">
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-xs text-purple-400 uppercase tracking-wider font-medium">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto p-12 md:p-16 rounded-[2.5rem] glass-panel border-white/10 shadow-[0_20px_50px_rgba(139,92,246,0.15)] relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-500/20 rounded-full blur-[80px] pointer-events-none" />
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
              Join thousands of users who are already managing their finances
              smarter with Money. Scan receipts, set budgets, and unlock deep insights.
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="px-10 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full border-0 shadow-[0_4px_15px_rgba(236,72,153,0.4)] hover:scale-105 transition-all duration-300 font-semibold text-base"
              >
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
