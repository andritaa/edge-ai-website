import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Pool } from "pg";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// In-memory conversation history for anonymous users (with TTL)
const conversationHistory = new Map<string, {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  lastActivity: number;
}>();

// Cleanup old anonymous conversations (1 hour TTL)
const CONVERSATION_TTL = 60 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of conversationHistory.entries()) {
    if (now - data.lastActivity > CONVERSATION_TTL) {
      conversationHistory.delete(sessionId);
    }
  }
}, 15 * 60 * 1000);

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("railway") ? { rejectUnauthorized: false } : undefined,
});

interface UserContext {
  id: string;
  email: string;
  name: string | null;
  role: string;
  organizationId?: string;
  organizationName?: string;
  products: Array<{
    id: string;
    name: string;
    plan: string;
    status: string;
  }>;
  isAdmin: boolean;
}

async function getUserContext(userId: string): Promise<UserContext | null> {
  const client = await pool.connect();
  try {
    const userResult = await client.query('SELECT id, email, name FROM "user" WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) return null;

    const user = userResult.rows[0];
    const isAdmin = user.email?.includes("stephen") || user.email?.includes("admin") || user.id === "1";

    const orgResult = await client.query(`
      SELECT o.id, o.name, m.role
      FROM organization o
      JOIN member m ON o.id = m."organizationId"
      WHERE m."userId" = $1
      LIMIT 1
    `, [userId]);

    let organizationId: string | undefined;
    let organizationName: string | undefined;
    let role = "user";

    if (orgResult.rows.length > 0) {
      organizationId = orgResult.rows[0].id;
      organizationName = orgResult.rows[0].name;
      role = orgResult.rows[0].role;
    }

    const productsResult = await client.query(`
      SELECT p.id, p.name, ps.plan, ps.status
      FROM product p
      JOIN product_subscription ps ON p.id = ps."productId"
      WHERE ps."organizationId" = $1 AND ps.status = 'active' AND p.active = true
      ORDER BY p.name
    `, [organizationId]);

    const products = productsResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      plan: row.plan,
      status: row.status,
    }));

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: isAdmin ? "admin" : role,
      organizationId,
      organizationName,
      products,
      isAdmin,
    };
  } catch (error) {
    console.error("Error getting user context:", error);
    return null;
  } finally {
    client.release();
  }
}

async function loadConversationHistory(userId: string): Promise<Array<{ role: "user" | "assistant"; content: string }>> {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT role, content FROM "conversation_messages"
      WHERE "userId" = $1
      ORDER BY "createdAt" ASC
      LIMIT 20
    `, [userId]);
    return result.rows.map(row => ({ role: row.role as "user" | "assistant", content: row.content }));
  } catch (error) {
    console.error("Error loading conversation history:", error);
    return [];
  } finally {
    client.release();
  }
}

async function saveMessages(
  userId: string,
  sessionId: string,
  messages: Array<{ role: "user" | "assistant"; content: string; site: string }>
): Promise<void> {
  const client = await pool.connect();
  try {
    for (const msg of messages) {
      await client.query(`
        INSERT INTO "conversation_messages" ("userId", "sessionId", "role", "content", "site")
        VALUES ($1, $2, $3, $4, $5)
      `, [userId, sessionId, msg.role, msg.content, msg.site]);
    }
  } catch (error) {
    console.error("Error saving messages:", error);
  } finally {
    client.release();
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, site = "edge-ai" } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ reply: "Please enter a message." }, { status: 400 });
    }

    const session = await auth.api.getSession({
      headers: req.headers,
    });

    let userContext: UserContext | null = null;
    let agentSessionId = sessionId || "web-anon";
    let messages: Array<{ role: "user" | "assistant"; content: string }> = [];

    if (session?.user) {
      userContext = await getUserContext(session.user.id);

      if (userContext) {
        agentSessionId = `user-${session.user.id}`;
        // Load last 20 messages from DB for authenticated users
        messages = await loadConversationHistory(session.user.id);
      }
    } else {
      // Anonymous users: use in-memory fallback
      let conversation = conversationHistory.get(agentSessionId);
      if (!conversation) {
        conversation = { messages: [], lastActivity: Date.now() };
        conversationHistory.set(agentSessionId, conversation);
      }
      messages = conversation.messages;
    }

    const systemPrompt = buildSystemPrompt(userContext);

    const allMessages: Array<{ role: "user" | "assistant"; content: string }> = [
      ...messages,
      { role: "user", content: message }
    ];

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: allMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    });

    const assistantReply = response.content[0]?.type === "text"
      ? response.content[0].text
      : "I apologize, but I couldn't generate a proper response. Please try again.";

    if (session?.user && userContext) {
      // Save to DB for authenticated users
      await saveMessages(session.user.id, agentSessionId, [
        { role: "user", content: message, site },
        { role: "assistant", content: assistantReply, site },
      ]);
    } else {
      // Update in-memory for anonymous users
      const conversation = conversationHistory.get(agentSessionId)!;
      conversation.messages.push(
        { role: "user", content: message },
        { role: "assistant", content: assistantReply }
      );
      conversation.lastActivity = Date.now();
      if (conversation.messages.length > 20) {
        conversation.messages = conversation.messages.slice(-20);
      }
    }

    const responseData: Record<string, unknown> = { reply: assistantReply };

    if (process.env.NODE_ENV === "development" && userContext) {
      responseData._debug = {
        userContext: {
          email: userContext.email,
          role: userContext.role,
          products: userContext.products.length,
          isAdmin: userContext.isAdmin,
        },
        sessionId: agentSessionId,
        messagesLoaded: messages.length,
      };
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "Something went wrong. Please try again or contact hello@edge-ai.space." },
      { status: 500 }
    );
  }
}

function buildSystemPrompt(userContext: UserContext | null): string {
  const basePrompt = `You are the Edge AI assistant on edge-ai.space. You help users understand Edge AI products and services.

**Our Products:**
- **HabaCasa**: Smart environments that manage themselves. Homes, offices, and factories with integrated AI automation. Features voice control, energy optimization, predictive maintenance, and privacy by design.
- **AI Agency**: Autonomous agents for business operations. Customer support, scheduling, and complex workflows that run 24/7. Multi-channel support, workflow automation, integration ready, scalable deployment.
- **Edge Analytics**: Real-time insights and predictive analytics. Process data locally with enterprise-grade security. Real-time processing, custom dashboards, predictive models, API integrations.

**Key Facts:**
- AI runs on local hardware (Jetson devices)
- Data never leaves the building - complete privacy
- Edge-first architecture with no external dependencies
- Open-source models running locally
- Enterprise-grade security and encryption
- Air-gap compatible deployments

**Pricing:**
- Starter: $99/month - Up to 5 agents, basic integrations, email support
- Pro: $299/month - Unlimited agents, advanced integrations, priority support, custom models, API access
- Enterprise: Custom pricing - Everything in Pro plus dedicated support, custom integrations, SLA guarantees

**Your Role:**
- Be concise, friendly, and professional
- Use markdown for formatting when helpful
- Guide users toward sign-up and demos when appropriate
- Explain how local AI works and privacy benefits
- For demo requests, collect: name, email, company, building type

**Demo Collection:**
When users want a demo, gather their information and confirm you'll be in touch soon.`;

  if (userContext) {
    const userInfo = `

**Current User Context:**
- Name: ${userContext.name || "N/A"}
- Email: ${userContext.email}
- Role: ${userContext.role}
- Organization: ${userContext.organizationName || "No organization"}
- Products: ${userContext.products.map(p => `${p.name} (${p.plan})`).join(", ") || "None"}
- Admin Access: ${userContext.isAdmin ? "Yes" : "No"}

You know this user is authenticated. Personalize responses appropriately and refer to their products when relevant.`;

    return basePrompt + userInfo;
  }

  return basePrompt + "\n\nThis user is not authenticated. Encourage sign-up when appropriate.";
}
