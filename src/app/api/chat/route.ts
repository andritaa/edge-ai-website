import { NextRequest, NextResponse } from "next/server";

const AGENT_API_URL = process.env.AGENT_API_URL || "https://agent-api-production-d953.up.railway.app";

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();

    const res = await fetch(`${AGENT_API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenant: "edge-ai",
        message,
        sessionId: sessionId || "web-anon",
      }),
    });

    const data = await res.json();
    return NextResponse.json({ reply: data.reply || "Sorry, something went wrong." });
  } catch {
    return NextResponse.json(
      { reply: "Something went wrong. Please try again or contact hello@edge-ai.space." },
      { status: 500 }
    );
  }
}
