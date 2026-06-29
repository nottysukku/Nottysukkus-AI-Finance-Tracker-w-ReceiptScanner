import { checkUser } from "@/lib/checkUser";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { text } = await request.json();
    const userProfile = await checkUser();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        response: "System check failed: GEMINI_API_KEY is not configured on the server." 
      });
    }

    const systemContext = `You are a helpful, professional, and knowledgeable personal finance advisor on the Money platform.
The user's name is ${userProfile?.name || "unknown"}.
Their annual salary is $${userProfile?.salary || "60000"}.
Their career bio / resume details: ${userProfile?.bio || "Not specified"}.
Your goal is to provide concise, actionable financial advice tailored specifically to this user's profile. Use bullet points and clean markdown.
Keep responses under 150 words.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemContext }],
          },
          contents: [
            {
              parts: [
                {
                  text: `User asks: ${text}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to reach Gemini API");
    }

    const data = await response.json();
    const botResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I apologize, my cryptographic nodes are currently overloaded. Please query again shortly.";

    return NextResponse.json({ response: botResponse });
  } catch (error) {
    console.error("AI Advisor error:", error);
    return NextResponse.json({ 
      response: "System check failed: Connection to the intelligence core was interrupted." 
    }, { status: 500 });
  }
}
