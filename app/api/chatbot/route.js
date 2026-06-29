import { NextResponse } from "next/server";

const SITE_CONTEXT = `You are "Money AI", the built-in intelligent assistant for the Money finance tracking platform.
You know everything about this app and guide users through it. Here is what the platform offers:

PLATFORM FEATURES:
- Dashboard: Overview of all finances with animated charts, net worth tracking, spending breakdowns, and financial health scores.
- Accounts: Users can create multiple accounts (Current, Savings, Credit Card) with balances.
- Transactions: Add income/expenses with categories. Supports recurring transactions.
- Receipt Scanner: AI-powered receipt scanning that auto-extracts details from photos.
- Budget Tracker: Set monthly budgets and get alerts.
- Goals Tracker: Set financial goals with deadlines and track progress.
- Subscription Manager: Track recurring subscriptions with billing cycle management.
- AI Financial Advisor: Full-page Gemini-powered chat for in-depth advice (at /advisor).
- Market Watch: Live crypto and stock market data.
- Life Simulator: Interactive financial life simulation game.
- Finance Trivia: Quiz game to test financial knowledge.
- Spin the Wheel: Prize wheel mini-game.

Be friendly, concise, and helpful. Keep responses under 120 words.`;

export async function POST(request) {
  try {
    const { message, history } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDR_NdlD_W1WLAmitqtBxXbIHCn8aHtjQs";
    
    if (!apiKey) {
      return NextResponse.json({ 
        response: getHelpfulResponses(message) 
      });
    }

    const conversationHistory = (history || []).slice(-6).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SITE_CONTEXT }],
          },
          contents: [
            ...conversationHistory,
            { role: "user", parts: [{ text: message }] },
          ],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error("Gemini API request failed");
    }

    const data = await geminiResponse.json();
    const response = data?.candidates?.[0]?.content?.parts?.[0]?.text || getHelpfulResponses(message);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chatbot API error:", error);
    const fallbackResponse = getHelpfulResponses(
      typeof error === "string" ? error : "help"
    );
    return NextResponse.json({ response: fallbackResponse });
  }
}

// Fallback responses when Gemini is unavailable
function getHelpfulResponses(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("budget") || lowerMessage.includes("budgeting")) {
    return "Great question about budgeting! Start with the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. You can create and track budgets in your dashboard. Would you like tips on any specific category?";
  }
  
  if (lowerMessage.includes("save") || lowerMessage.includes("saving")) {
    return "Smart thinking about saving! Try automating your savings, start small with $25-50/week, and track your progress. Use our expense tracking to see where you can cut back.";
  }
  
  if (lowerMessage.includes("expense") || lowerMessage.includes("track")) {
    return "Expense tracking is key! Log every transaction, categorize your spending, and review weekly. Our app helps you scan receipts and automatically categorize expenses.";
  }
  
  if (lowerMessage.includes("receipt") || lowerMessage.includes("scan")) {
    return "Our Receipt Scanner uses Gemini AI to automatically extract amount, date, category, and merchant from your receipt photos. Just go to Add Transaction and tap the scanner icon!";
  }
  
  if (lowerMessage.includes("goal") || lowerMessage.includes("target")) {
    return "Setting financial goals is excellent! Use the SMART method: Specific, Measurable, Achievable, Relevant, Time-bound. Track your goals visually in the Dashboard.";
  }
  
  if (lowerMessage.includes("debt") || lowerMessage.includes("loan")) {
    return "Managing debt is important. Consider the debt snowball (smallest first) or avalanche (highest interest first) methods. Track all debts in your accounts section.";
  }
  
  return "I'm here to help with the Money platform! I can assist with budgeting, expense tracking, receipt scanning, goal setting, and navigating the app. What would you like to know?";
}
