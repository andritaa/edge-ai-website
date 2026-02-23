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

    // Fetch all subscriptions with organization and product details
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT
          ps.id,
          ps.plan,
          ps.status,
          ps."createdAt",
          ps."updatedAt",
          ps."billingId",
          ps."trialEndsAt",
          ps."currentPeriodEnd",
          o.name as "organizationName",
          o.slug as "organizationSlug",
          p.name as "productName",
          p.icon as "productIcon",
          p.slug as "productSlug"
        FROM product_subscription ps
        JOIN organization o ON ps."organizationId" = o.id
        JOIN product p ON ps."productId" = p.id
        ORDER BY ps."createdAt" DESC
      `);

      const subscriptions = result.rows.map(sub => ({
        id: sub.id,
        plan: sub.plan,
        status: sub.status,
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt,
        billingId: sub.billingId,
        trialEndsAt: sub.trialEndsAt,
        currentPeriodEnd: sub.currentPeriodEnd,
        organizationName: sub.organizationName,
        organizationSlug: sub.organizationSlug,
        productName: sub.productName,
        productIcon: sub.productIcon,
        productSlug: sub.productSlug,
      }));

      return NextResponse.json(subscriptions);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}