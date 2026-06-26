"use client";

import React, { useState } from "react";
import { Brain, HelpCircle, Award, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const QUESTIONS = [
  {
    id: 1,
    question: "What is the primary function of the 'Rule of 72' in personal finance?",
    options: [
      { text: "Estimating the number of years required to double your investment.", isCorrect: true },
      { text: "Calculating annual federal income tax brackets.", isCorrect: false },
      { text: "Determining if you qualify for a premium mortgage loan.", isCorrect: false },
      { text: "Deciding the percentage of cash to keep in savings versus stocks.", isCorrect: false },
    ],
    explanation: "The Rule of 72 is a quick shortcut: divide 72 by your annual interest rate to find the approximate number of years it takes to double your money. (e.g. at 6% return, doubling takes ~12 years).",
  },
  {
    id: 2,
    question: "If inflation is 4% and your bank savings account pays 1.5% interest, what happens to your money?",
    options: [
      { text: "Its absolute dollar value shrinks, but purchasing power remains steady.", isCorrect: false },
      { text: "Its purchasing power decreases over time because inflation outruns interest.", isCorrect: true },
      { text: "Its purchasing power increases because bank interest compounds daily.", isCorrect: false },
      { text: "Nothing; the purchasing power stays exactly identical.", isCorrect: false },
    ],
    explanation: "When inflation exceeds your interest rate, the real purchasing power of your cash declines, even though the number of dollars in your account continues to rise.",
  },
  {
    id: 3,
    question: "Which debt paydown method prioritizes clearing debts with the highest interest rates first?",
    options: [
      { text: "The Debt Snowball method.", isCorrect: false },
      { text: "The Debt Consolidation method.", isCorrect: false },
      { text: "The Debt Avalanche method.", isCorrect: true },
      { text: "The High-Interest Refinancing method.", isCorrect: false },
    ],
    explanation: "The Debt Avalanche method targets the debt with the highest APR first, which mathematically saves the most amount of money in interest over time.",
  },
  {
    id: 4,
    question: "What does the term 'Bear Market' indicate in stock trading?",
    options: [
      { text: "A period where stock prices drop by 20% or more from recent highs.", isCorrect: true },
      { text: "A period where stock prices surge by 20% or more.", isCorrect: false },
      { text: "A market where only raw commodities (like grains or metals) are traded.", 'isCorrect': false },
      { text: "A trading suspension due to system instability or audits.", isCorrect: false },
    ],
    explanation: "A Bear Market describes prolonged price declines, typically defined as when stock market indices drop by 20% or more from recent peaks amid widespread pessimism.",
  },
  {
    id: 5,
    question: "What is the key mechanism of 'Compound Interest'?",
    options: [
      { text: "Interest calculated only on your initial principal deposit.", isCorrect: false },
      { text: "Interest computed on both the initial principal and previously earned interest.", isCorrect: true },
      { text: "A penalty tax levied on early savings withdrawals.", isCorrect: false },
      { text: "A flat commission fee charged by brokerage firms.", isCorrect: false },
    ],
    explanation: "Compound interest is 'interest on interest.' Over time, your interest earnings generate interest of their own, leading to exponential balance expansion.",
  },
];

export default function TriviaPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelectOption = (optIdx, isCorrect) => {
    if (selectedOptIdx !== null) return; // Only allow one selection per question

    setSelectedOptIdx(optIdx);
    setShowExplanation(true);

    if (isCorrect) {
      setScore((s) => s + 1);
      toast.success("Correct answer!");
    } else {
      toast.error("Incorrect answer!");
    }
  };

  const handleNext = () => {
    setSelectedOptIdx(null);
    setShowExplanation(false);

    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx((idx) => idx + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOptIdx(null);
    setScore(0);
    setIsFinished(false);
    setShowExplanation(false);
  };

  const activeQuestion = QUESTIONS[currentIdx];

  // Grade readouts
  const gradeDetails = () => {
    const rate = (score / QUESTIONS.length) * 100;
    if (rate === 100) return { badge: "Nexus Grandmaster", color: "text-emerald-400" };
    if (rate >= 80) return { badge: "Budget Optimizer", color: "text-purple-400" };
    if (rate >= 60) return { badge: "Financial Apprentice", color: "text-yellow-400" };
    return { badge: "Insolvent Wanderer", color: "text-red-400" };
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 relative z-10">
      {/* HUD Header */}
      <div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-3">
          <Brain className="h-8 w-8 text-purple-400 animate-pulse-glow" />
          Financial Trivia Challenge
        </h1>
        <p className="text-gray-400 text-sm md:text-base font-light">
          Test your financial literacy vectors. Clear the security parameters by choosing the correct variables.
        </p>
      </div>

      {isFinished ? (
        /* Finished Card */
        <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center space-y-6 shadow-2xl max-w-md mx-auto">
          <Award className="h-16 w-16 text-purple-400 mx-auto animate-bounce" />
          
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">Quiz Terminated</h2>
            <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">
              SCORE: {score} / {QUESTIONS.length} ({Math.round((score/QUESTIONS.length)*100)}%)
            </p>
          </div>

          <div className="p-4 bg-purple-950/20 border border-purple-900/30 rounded-2xl">
            <span className="text-[10px] font-mono text-purple-300 block uppercase mb-1">Nexus Rank Grade</span>
            <div className={`text-xl font-black font-mono ${gradeDetails().color}`}>
              {gradeDetails().badge}
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs transition"
          >
            Retake Challenge
          </button>
        </div>
      ) : (
        /* Active Question Card */
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Question HUD counter */}
          <div className="flex justify-between items-center text-xs font-mono text-purple-300 border-b border-white/5 pb-2">
            <span>QUESTION {currentIdx + 1} OF {QUESTIONS.length}</span>
            <span>ACCURACY: {score}/{QUESTIONS.length}</span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-white leading-snug">
            {activeQuestion.question}
          </h3>

          {/* Options Grid */}
          <div className="grid gap-3">
            {activeQuestion.options.map((opt, oIdx) => {
              const isSelected = selectedOptIdx === oIdx;
              const hasSelectedAny = selectedOptIdx !== null;
              
              let styleClass = "border-white/5 hover:border-purple-500/20 bg-black/20 text-gray-300 hover:text-white";
              
              if (hasSelectedAny) {
                if (opt.isCorrect) {
                  styleClass = "border-emerald-500/40 bg-emerald-950/20 text-emerald-400 font-semibold";
                } else if (isSelected) {
                  styleClass = "border-pink-500/40 bg-pink-950/20 text-pink-400 font-semibold";
                } else {
                  styleClass = "border-white/5 bg-black/40 text-gray-500 opacity-60";
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx, opt.isCorrect)}
                  disabled={hasSelectedAny}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${styleClass}`}
                >
                  <span>{opt.text}</span>
                  {hasSelectedAny && opt.isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 ml-2" />}
                  {hasSelectedAny && isSelected && !opt.isCorrect && <XCircle className="h-4 w-4 text-pink-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Explanation HUD */}
          {showExplanation && (
            <div className="p-4 bg-purple-950/20 border border-purple-900/30 rounded-2xl animate-fadeIn space-y-2 text-xs">
              <span className="font-mono text-purple-300 uppercase font-black block">System Audit Log:</span>
              <p className="text-gray-300 leading-relaxed">{activeQuestion.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {selectedOptIdx !== null && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
              >
                <span>{currentIdx + 1 === QUESTIONS.length ? "Finish Quiz" : "Next Question"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
