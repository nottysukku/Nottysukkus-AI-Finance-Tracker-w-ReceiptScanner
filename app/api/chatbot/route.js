import { checkUser } from "@/lib/checkUser";
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

STRICT INSTRUCTIONS:
1. CONCRETE HELPER REPLIES:
   - If the user asks "How do I add a transaction?", explain step-by-step: Click the 'Add Transaction' button in the header, fill in details (Amount, Category, Account, Date), and click 'Create Transaction'.
   - If the user asks "How does receipt scanning work?", explain step-by-step: Go to the Add Transaction page, look for the 'Receipt Scanner' card, upload a photo of your receipt, and the AI will automatically parse and pre-fill the form for you.
   - If the user asks "Help me set a budget", explain step-by-step: Go to the Dashboard, look for the Monthly Budget progress bar under the 'Command Center' tab, click the edit budget icon, enter your monthly limit, and click Save.
   - If the user asks "What features are available?", list the main features: Dashboard, Accounts, Transactions, Receipt Scanner, Budget, Goals, Subscriptions, AI Advisor, Market Watch, Life Simulator, Trivia, and Spin the Wheel.

2. STRICT TOPIC FILTER & SARCASM:
   - You MUST ONLY answer questions regarding the Money webapp, personal finance, or features of this platform.
   - If the user asks anything else (e.g. general knowledge, stop signs, math, coding, weather, trivia, history, cooking, etc.), you MUST respond with a highly sarcastic remark, refuse to answer the question, and tell them to ask only regarding this webapp. Do not be helpful with off-topic queries!`;

export async function POST(request) {
  try {
    const { message, history } = await request.json();
    const user = await checkUser();

    const personalizedContext = `${SITE_CONTEXT}

USER PROFILE CONTEXT:
- Name: ${user?.name || "Guest User"}
- Annual Salary: $${user?.salary || 60000}
- Professional Bio/Background: ${user?.bio || "Not specified"}

Please greet the user by their name when appropriate. Use their salary or career background context to tailor your responses if they ask for recommendations.`;

    const apiKey = process.env.GEMINI_API_KEY;
    
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
            parts: [{ text: personalizedContext }],
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
      const errText = await geminiResponse.text();
      console.error("Gemini Chatbot API error response:", errText);
      throw new Error(`Gemini API request failed: ${geminiResponse.statusText}`);
    }

    const data = await geminiResponse.json();
    const response = data?.candidates?.[0]?.content?.parts?.[0]?.text || getHelpfulResponses(message);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chatbot API error:", error);
    const fallbackResponse = getHelpfulResponses(message);
    return NextResponse.json({ response: fallbackResponse });
  }
}

// Fallback responses when Gemini is unavailable or for local checks
function getHelpfulResponses(message) {
  const lowerMessage = message.toLowerCase().trim();
  
  // 1. Concrete answers for the 4 helper buttons
  if (lowerMessage.includes("how do i add a transaction")) {
    return "To add a transaction:\n1. Click the **'Add Transaction'** button in the header.\n2. Fill in the details (Amount, Category like Groceries/Housing, Account, Date).\n3. Enable 'Recurring' if it's a subscription or monthly bill.\n4. Click 'Create Transaction' to update your dashboard automatically!";
  }
  
  if (lowerMessage.includes("how does receipt scanning work")) {
    return "Receipt scanning uses Gemini AI to log expenses automatically:\n1. Go to the Add Transaction page and look for the **Receipt Scanner** card.\n2. Click 'Choose File' or take a photo of your receipt.\n3. Our AI will automatically parse the image to extract the merchant, date, amount, and category, and pre-fill the transaction form for you!";
  }
  
  if (lowerMessage.includes("help me set a budget")) {
    return "To set a budget:\n1. Open your **Dashboard** and look for the **Monthly Budget** progress bar under the 'Command Center' tab.\n2. Click the edit budget icon, enter your monthly limit (e.g. $2,000), and hit Save.\n3. The progress bar will turn green/yellow/red and alert you when you reach 85% of your budget.";
  }
  
  if (lowerMessage.includes("what features are available")) {
    return "Our platform is fully packed with financial tools:\n- 📊 **Dashboard & Analytics**: Track your net worth, health index, and category breakdowns.\n- 💳 **Accounts & Subscriptions**: Manage credit cards, savings, and active subscriptions.\n- 🎯 **Goals**: Track progress toward targets with custom deadlines.\n- 🤖 **AI Assistant & Advisor**: Ask for personal finance advice based on your salary/bio.\n- 🎮 **Mini Games**: Play the Wealth Simulator, Trivia Quiz, and Spin the Wheel for XP!";
  }

  // 2. Other valid finance/app-related queries
  const validKeywords = [
    "budget", "save", "expense", "track", "receipt", "scan", "goal", "target", "debt", "loan", 
    "money", "finance", "advisor", "wheel", "spin", "trivia", "simulator", "wealth", "sandbox", 
    "stock", "crypto", "account", "clerk", "guest", "hello", "hi", "hey", "help", "feature",
    "theme", "dark", "light", "day", "night", "avatar", "profile", "salary", "bio"
  ];
  
  const isRelated = validKeywords.some(keyword => lowerMessage.includes(keyword));
  
  if (isRelated) {
    if (lowerMessage.includes("budget") || lowerMessage.includes("budgeting")) {
      return "To set a budget:\n1. Open your **Dashboard** and look for the **Monthly Budget** progress bar under the 'Command Center' tab.\n2. Click the edit budget icon, enter your monthly limit (e.g. $2,000), and hit Save.\n3. The progress bar will turn green/yellow/red and alert you when you reach 85% of your budget.";
    }
    if (lowerMessage.includes("save") || lowerMessage.includes("saving") || lowerMessage.includes("goal")) {
      return "Setting financial goals is excellent! Use the SMART method: Specific, Measurable, Achievable, Relevant, Time-bound. Track your goals visually in the Dashboard.";
    }
    if (lowerMessage.includes("expense") || lowerMessage.includes("track") || lowerMessage.includes("transaction")) {
      return "To add a transaction:\n1. Click the **'Add Transaction'** button in the header.\n2. Fill in the details (Amount, Category like Groceries/Housing, Account, Date).\n3. Enable 'Recurring' if it's a subscription or monthly bill.\n4. Click 'Create Transaction' to update your dashboard automatically!";
    }
    if (lowerMessage.includes("receipt") || lowerMessage.includes("scan")) {
      return "Receipt scanning uses Gemini AI to log expenses automatically:\n1. Go to the Add Transaction page and look for the **Receipt Scanner** card.\n2. Click 'Choose File' or take a photo of your receipt.\n3. Our AI will automatically parse the image to extract the merchant, date, amount, and category, and pre-fill the transaction form for you!";
    }
    return "I'm Money AI, your helper for this finance platform! I can assist with budgeting, transactions, receipt scanning, goals, and navigating the app. What would you like to know?";
  }

  // 3. Completely off-topic queries -> Sarcasm response
  const sarcasticReplies = [
    "Oh, fascinating question! However, unless you can pay for that with your budget, I don't care. Ask me about the finance webapp instead.",
    "I'm a financial AI assistant, not Google. Let's stick to budgeting, transactions, or other features of this app, shall we?",
    "Nice try changing the subject! But my database is tuned for money tracking. Please ask only regarding the features of this webapp.",
    "Unless that query is going to help you save some cash or build a budget, I'm going to pass. Ask me about our Dashboard, Wealth Sim, or other tools instead!",
    "That is completely off-topic. I only answer questions regarding the Money finance tracker platform. Let's get back to business."
  ];
  
  const replyIdx = message.length % sarcasticReplies.length;
  return sarcasticReplies[replyIdx];
}
