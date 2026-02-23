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

    // Fetch all products
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT
          id,
          name,
          slug,
          description,
          icon,
          url,
          active,
          "createdAt",
          "updatedAt"
        FROM product
        ORDER BY name ASC
      `);

      const products = result.rows.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        icon: product.icon,
        url: product.url,
        active: product.active,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }));

      return NextResponse.json(products);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
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

    const { productId, active } = await request.json();

    if (!productId || typeof active !== "boolean") {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // Update product status
    const client = await pool.connect();
    try {
      await client.query(`
        UPDATE product
        SET active = $1, "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = $2
      `, [active, productId]);

      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}