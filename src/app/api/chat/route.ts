import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Pool } from "pg";

const AGENT_API_URL = process.env.AGENT_API_URL || "https://agent-api-production-d953.up.railway.app";

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
    // Get user basic info
    const userResult = await client.query('SELECT id, email, name FROM "user" WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) return null;

    const user = userResult.rows[0];

    // Check if user is admin
    const isAdmin = user.email?.includes("stephen") || user.email?.includes("admin") || user.id === "1";

    // Get user's organization
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

    // Get user's product access
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

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();

    // Extract session from request headers
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    let userContext: UserContext | null = null;
    let agentSessionId = sessionId || "web-anon";

    if (session?.user) {
      // Get detailed user context with permissions
      userContext = await getUserContext(session.user.id);

      if (userContext) {
        // Use authenticated user ID as session ID for consistency
        agentSessionId = `user-${session.user.id}`;
      }
    }

    // Prepare the request payload with user context
    const payload = {
      tenant: "edge-ai",
      message,
      sessionId: agentSessionId,
      ...(userContext && {
        user: {
          id: userContext.id,
          email: userContext.email,
          name: userContext.name,
          role: userContext.role,
          organizationId: userContext.organizationId,
          organizationName: userContext.organizationName,
          products: userContext.products,
          isAdmin: userContext.isAdmin,
          permissions: {
            canAccessAdmin: userContext.isAdmin,
            canManageProducts: userContext.role === "owner" || userContext.role === "admin" || userContext.isAdmin,
            canViewAnalytics: userContext.products.length > 0,
            availableProducts: userContext.products.map(p => p.id),
          },
        },
      }),
    };

    const res = await fetch(`${AGENT_API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    // Add context to the response for debugging (only in development)
    const response: any = { reply: data.reply || "Sorry, something went wrong." };

    if (process.env.NODE_ENV === "development" && userContext) {
      response._debug = {
        userContext: {
          email: userContext.email,
          role: userContext.role,
          products: userContext.products.length,
          isAdmin: userContext.isAdmin,
        },
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "Something went wrong. Please try again or contact hello@edge-ai.space." },
      { status: 500 }
    );
  }
}
