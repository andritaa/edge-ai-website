import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("railway") ? { rejectUnauthorized: false } : undefined,
});

export async function GET() {
  try {
    // Check authentication and admin status
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Simple admin check - in production, use proper admin plugin
    const isAdmin = session.user.email?.includes("stephen") ||
                   session.user.email?.includes("admin") ||
                   session.user.id === "1";

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all users
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT
          id,
          name,
          email,
          "emailVerified",
          "createdAt",
          "updatedAt"
        FROM "user"
        ORDER BY "createdAt" DESC
      `);

      const users = result.rows.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.email?.includes("stephen") || user.email?.includes("admin") ? "admin" : "user",
      }));

      return NextResponse.json(users);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}