import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Pool } from "pg";
import { ExternalLink, ArrowRight, Plus } from "lucide-react";
import Navigation from "@/components/Navigation";

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("railway") ? { rejectUnauthorized: false } : undefined,
});

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  url: string | null;
  active: boolean;
}

interface ProductSubscription {
  product: Product;
  plan: string;
  status: string;
}

async function getUserProducts(userId: string): Promise<ProductSubscription[]> {
  const client = await pool.connect();
  try {
    // First, get or create user's organization
    let orgResult = await client.query(`
      SELECT o.* FROM organization o
      JOIN member m ON o.id = m."organizationId"
      WHERE m."userId" = $1 AND m.role IN ('owner', 'admin')
      LIMIT 1
    `, [userId]);

    let organizationId: string;

    if (orgResult.rows.length === 0) {
      // Create a personal organization for the user
      const orgId = `org_${userId}_${Date.now()}`;
      await client.query('BEGIN');

      await client.query(`
        INSERT INTO organization (id, name, slug, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [orgId, `Personal`, `personal-${userId.slice(-8)}`]);

      await client.query(`
        INSERT INTO member (id, "organizationId", "userId", role, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, 'owner', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [`member_${userId}_${orgId}`, orgId, userId]);

      await client.query('COMMIT');
      organizationId = orgId;
    } else {
      organizationId = orgResult.rows[0].id;
    }

    // Get products the organization is subscribed to
    const result = await client.query(`
      SELECT
        p.*,
        ps.plan,
        ps.status
      FROM product p
      JOIN product_subscription ps ON p.id = ps."productId"
      WHERE ps."organizationId" = $1 AND ps.status = 'active' AND p.active = true
      ORDER BY p.name
    `, [organizationId]);

    return result.rows.map(row => ({
      product: {
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        icon: row.icon,
        url: row.url,
        active: row.active,
      },
      plan: row.plan,
      status: row.status,
    }));
  } catch (error) {
    console.error('Error fetching user products:', error);
    return [];
  } finally {
    client.release();
  }
}

async function getAllProducts(): Promise<Product[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT * FROM product WHERE active = true ORDER BY name
    `);

    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      icon: row.icon,
      url: row.url,
      active: row.active,
    }));
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  } finally {
    client.release();
  }
}

export default async function ProductsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { user } = session;
  const [userProducts, allProducts] = await Promise.all([
    getUserProducts(user.id),
    getAllProducts()
  ]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="pt-[60px] px-6 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="py-16 border-b border-[#1a1a1a]">
          <p className="text-xs text-[#666] uppercase tracking-[0.1em] mb-3">Product Launcher</p>
          <h1
            className="text-[clamp(32px,5vw,48px)] font-medium tracking-[-0.02em] mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your{" "}
            <span className="text-[#FF6B35]">Edge AI</span>{" "}
            Products
          </h1>
          <p className="text-[15px] text-[#666]">
            Access your AI-native applications and manage your digital environment.
          </p>
        </div>

        {/* Products Grid */}
        {userProducts.length > 0 ? (
          <div className="py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProducts.map(({ product, plan, status }) => (
                <div
                  key={product.id}
                  className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6 hover:border-[#2a2a2a] transition-all duration-200 group"
                >
                  {/* Product Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{product.icon || "🔧"}</div>
                      <div>
                        <h3 className="text-lg font-medium">{product.name}</h3>
                        <span className="text-xs text-[#666] capitalize">{plan} plan</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-1 rounded-md ${
                        status === 'active'
                          ? 'text-green-400 bg-green-400/10 border border-green-400/20'
                          : 'text-[#666] bg-[#111] border border-[#222]'
                      }`}>
                        {status}
                      </span>
                    </div>
                  </div>

                  {/* Product Description */}
                  <p className="text-sm text-[#666] leading-relaxed mb-6 flex-1">
                    {product.description || `Access and manage your ${product.name} environment.`}
                  </p>

                  {/* Action Button */}
                  <div className="flex gap-3">
                    {product.url ? (
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        Open <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <button className="flex-1 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#666] text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-not-allowed">
                        Coming Soon <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* No Products State */
          <div className="py-20 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-lg flex items-center justify-center mx-auto mb-6">
                <Plus className="h-8 w-8 text-[#666]" />
              </div>
              <h2 className="text-xl font-medium mb-2">No products yet</h2>
              <p className="text-[#666] mb-8">
                Get started by exploring our available products and subscribing to the ones that fit your needs.
              </p>

              {/* Available Products */}
              <div className="space-y-3 mb-8">
                <p className="text-sm text-[#666] text-left">Available products:</p>
                {allProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-lg">{product.icon || "🔧"}</div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-[#666]">{product.description}</p>
                      </div>
                    </div>
                    <button className="text-xs text-[#666] bg-[#111] border border-[#222] px-3 py-1.5 rounded-md hover:border-[#333] transition-colors">
                      Subscribe
                    </button>
                  </div>
                ))}
              </div>

              <button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
                Explore Products
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}