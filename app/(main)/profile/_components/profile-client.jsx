"use client";

import React, { useState } from "react";
import { updateProfile } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { User, DollarSign, FileText, Image as ImageIcon, CheckCircle, Sparkles } from "lucide-react";

export default function ProfileClient({ initialUser }) {
  const [name, setName] = useState(initialUser?.name || "");
  const [imageUrl, setImageUrl] = useState(initialUser?.imageUrl || "");
  const [salary, setSalary] = useState(initialUser?.salary || 60000);
  const [bio, setBio] = useState(initialUser?.bio || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile({
        name,
        imageUrl,
        salary: parseFloat(salary) || 0,
        bio,
      });
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Default avatar selection helper
  const handleSelectDefaultAvatar = (url) => {
    setImageUrl(url);
    toast.info("Avatar updated! Save profile to confirm.");
  };

  const DEFAULT_AVATARS = [
    "https://api.dicebear.com/7.x/bottts/svg?seed=Felix",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Midnight",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Jack",
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 relative z-10">
      <div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-3">
          <User className="h-8 w-8 text-purple-500 dark:text-purple-400" />
          Profile Settings
        </h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm md:text-base font-light">
          Customize your financial profile. This data determines your starting points in calculations, advisors, and simulation tools.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Avatar Card */}
        <div className="md:col-span-1 space-y-4">
          <Card className="glass-panel border-slate-200/50 dark:border-white/10 overflow-hidden">
            <CardHeader className="text-center pb-4">
              <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-purple-500/50 p-1 bg-white/10">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="User Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                {name || "User Profile"}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-gray-400">
                {initialUser?.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center border-t border-slate-200/30 dark:border-white/5 pt-4">
              <span className="text-[10px] font-mono tracking-widest text-purple-600 dark:text-purple-300 uppercase block mb-2">QUICK AVATARS</span>
              <div className="flex justify-center gap-2">
                {DEFAULT_AVATARS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectDefaultAvatar(url)}
                    className="w-10 h-10 rounded-full border border-slate-200/50 dark:border-white/10 hover:border-purple-500 p-0.5 bg-white/20 transition hover:scale-115"
                  >
                    <img src={url} alt="Default Avatar" className="w-full h-full rounded-full" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Integration Highlight */}
          <Card className="glass-panel border-slate-200/50 dark:border-white/10 bg-gradient-to-br from-purple-100/10 dark:from-purple-950/20 to-slate-100/30 dark:to-black/50">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-300 font-bold text-xs font-mono uppercase">
                <Sparkles className="h-4 w-4 text-purple-500" />
                Cross-App Synergy
              </div>
              <p className="text-[11px] text-slate-600 dark:text-gray-300 leading-relaxed font-light">
                Your **Salary** is automatically loaded as the starting baseline in the **Wealth Simulator**.
              </p>
              <p className="text-[11px] text-slate-600 dark:text-gray-300 leading-relaxed font-light">
                Your **Bio/Resume** is securely fed to the **AI Advisor** and **Gemini Chatbot** as profile context for hyper-personalized feedback.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Settings Fields */}
        <div className="md:col-span-2">
          <Card className="glass-panel border-slate-200/50 dark:border-white/10">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Display Name */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-purple-600 dark:text-purple-300 uppercase block">
                    Display Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="pl-10 bg-slate-100/50 dark:bg-black/40 border border-slate-200/50 dark:border-white/10 rounded-xl text-slate-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Avatar URL */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-purple-600 dark:text-purple-300 uppercase block">
                    Profile Image URL
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/avatar.png"
                      className="pl-10 bg-slate-100/50 dark:bg-black/40 border border-slate-200/50 dark:border-white/10 rounded-xl text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Annual Salary */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-purple-600 dark:text-purple-300 uppercase block">
                    Annual Salary ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="number"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="e.g. 75000"
                      className="pl-10 bg-slate-100/50 dark:bg-black/40 border border-slate-200/50 dark:border-white/10 rounded-xl text-slate-800 dark:text-white"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-gray-500 block">
                    Used to pre-populate lifetime compound calculations in your Wealth Sim sandbox.
                  </span>
                </div>

                {/* Bio / Resume Details */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-purple-600 dark:text-purple-300 uppercase block">
                    Professional Bio / Career Details
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-4 h-4 w-4 text-slate-400" />
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Draft your career overview, monthly expenses, long term investment goals, or debt targets here..."
                      className="pl-10 min-h-[140px] bg-slate-100/50 dark:bg-black/40 border border-slate-200/50 dark:border-white/10 rounded-xl text-slate-800 dark:text-white leading-relaxed placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 outline-none transition"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-gray-500 block">
                    Your financial core advisor scans this detail to customize chat prompts.
                  </span>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(236,72,153,0.3)]"
                  >
                    <CheckCircle className="h-4.5 w-4.5" />
                    {isSaving ? "Saving Profiles..." : "Commit Profile Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
