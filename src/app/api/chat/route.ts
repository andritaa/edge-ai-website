import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the Edge AI website assistant. You work for Edge AI, a company that builds autonomous AI agents that run locally on customer hardware using open-source models.

Key facts:
- Edge AI builds two products: Haba Casa (AI for physical spaces) and The AI Agency (AI for business operations)
- Everything runs on the customer's own hardware — no cloud, no data leaving the network
- We use open-source models that can be inspected, modified, and trusted
- We use the same technology to run our own business
- The company values privacy, autonomy, and transparency

Be concise, helpful, and professional. Keep responses under 3 sentences unless the question requires more detail.`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: "The assistant is currently unavailable. Please contact us at hello@edge-ai.space.",
      });
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20250201",
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await res.json();
    const reply = data?.content?.[0]?.text || "Sorry, I couldn't process that.";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
