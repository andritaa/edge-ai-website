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

    // Simple admin check
    const isAdmin = session.user.email?.includes("stephen") ||
                   session.user.email?.includes("admin") ||
                   session.user.id === "1";

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all organizations with member counts
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT
          o.id,
          o.name,
          o.slug,
          o."createdAt",
          o."updatedAt",
          COUNT(m."userId") as "memberCount"
        FROM organization o
        LEFT JOIN member m ON o.id = m."organizationId"
        GROUP BY o.id, o.name, o.slug, o."createdAt", o."updatedAt"
        ORDER BY o."createdAt" DESC
      `);

      const organizations = result.rows.map(org => ({
        id: org.id,
        name: org.name,
        slug: org.slug,
        createdAt: org.createdAt,
        updatedAt: org.updatedAt,
        memberCount: parseInt(org.memberCount) || 0,
      }));

      return NextResponse.json(organizations);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}