"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Building2, Package, CreditCard, Search, ArrowUpDown } from "lucide-react";
import Navigation from "@/components/Navigation";

interface User {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  role?: string;
}

interface Organization {
  id: string;
  name: string;
  slug: string | null;
  memberCount: number;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  active: boolean;
  createdAt: string;
}

interface Subscription {
  id: string;
  organizationName: string;
  productName: string;
  productIcon: string | null;
  plan: string;
  status: string;
  createdAt: string;
}

type TabType = "users" | "organizations" | "products" | "subscriptions";

export default function AdminPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Check if user is admin (for now, check if email contains "stephen" or is the first user)
  const isAdmin = session?.user && (
    session.user.email?.includes("stephen") ||
    session.user.email?.includes("admin") ||
    session.user.id === "1" // First user
  );

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
      return;
    }

    if (!isPending && session && !isAdmin) {
      router.push("/products");
      return;
    }

    if (session && isAdmin) {
      fetchData();
    }
  }, [session, isPending, isAdmin, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, orgsRes, productsRes, subscriptionsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/organizations"),
        fetch("/api/admin/products"),
        fetch("/api/admin/subscriptions"),
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (orgsRes.ok) setOrganizations(await orgsRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
      if (subscriptionsRes.ok) setSubscriptions(await subscriptionsRes.json());
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading admin dashboard...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-[#666] mb-4">You don't have permission to access this page.</p>
          <Link href="/products" className="text-[#FF6B35] hover:underline">
            Return to Products
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "users", label: "Users", icon: Users, count: users.length },
    { id: "organizations", label: "Organizations", icon: Building2, count: organizations.length },
    { id: "products", label: "Products", icon: Package, count: products.length },
    { id: "subscriptions", label: "Subscriptions", icon: CreditCard, count: subscriptions.length },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredUsers = users
    .filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField as keyof User] || "";
      const bVal = b[sortField as keyof User] || "";
      const comparison = aVal > bVal ? 1 : -1;
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const filteredOrganizations = organizations
    .filter(org =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (org.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    )
    .sort((a, b) => {
      const aVal = a[sortField as keyof Organization] || "";
      const bVal = b[sortField as keyof Organization] || "";
      const comparison = aVal > bVal ? 1 : -1;
      return sortDirection === "asc" ? comparison : -comparison;
    });

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="pt-[60px] px-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="py-16 border-b border-[#1a1a1a]">
          <p className="text-xs text-[#666] uppercase tracking-[0.1em] mb-3">Admin Dashboard</p>
          <h1 className="text-[clamp(32px,5vw,48px)] font-medium tracking-[-0.02em] mb-3">
            System <span className="text-[#FF6B35]">Overview</span>
          </h1>
          <p className="text-[15px] text-[#666]">
            Manage users, organizations, products, and subscriptions across the Edge AI platform.
          </p>
        </div>

        {/* Tabs */}
        <div className="py-8 border-b border-[#1a1a1a]">
          <div className="flex gap-1 bg-[#0a0a0a] p-1 rounded-lg w-fit">
            {tabs.map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === id
                    ? "bg-[#FF6B35] text-white"
                    : "text-[#666] hover:text-white hover:bg-[#1a1a1a]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  activeTab === id ? "bg-white/20" : "bg-[#1a1a1a] text-[#666]"
                }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="py-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666]" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-sm text-white placeholder-[#666] focus:border-[#FF6B35] focus:outline-none"
            />
          </div>
        </div>

        {/* Content */}
        <div className="pb-16">
          {activeTab === "users" && (
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#111] border-b border-[#1a1a1a]">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-[#666] cursor-pointer hover:text-white" onClick={() => handleSort("name")}>
                      <div className="flex items-center gap-2">
                        Name <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-[#666] cursor-pointer hover:text-white" onClick={() => handleSort("email")}>
                      <div className="flex items-center gap-2">
                        Email <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-[#666]">Role</th>
                    <th className="text-left p-4 text-sm font-medium text-[#666] cursor-pointer hover:text-white" onClick={() => handleSort("createdAt")}>
                      <div className="flex items-center gap-2">
                        Joined <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-[#1a1a1a] hover:bg-[#0f0f0f] transition-colors">
                      <td className="p-4">
                        <div className="font-medium">{user.name || "—"}</div>
                      </td>
                      <td className="p-4 text-[#666]">{user.email}</td>
                      <td className="p-4">
                        <span className="text-xs px-2 py-1 bg-[#1a1a1a] text-[#666] rounded">
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="p-4 text-[#666] text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "organizations" && (
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#111] border-b border-[#1a1a1a]">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-[#666]">Organization</th>
                    <th className="text-left p-4 text-sm font-medium text-[#666]">Slug</th>
                    <th className="text-left p-4 text-sm font-medium text-[#666]">Members</th>
                    <th className="text-left p-4 text-sm font-medium text-[#666]">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrganizations.map((org) => (
                    <tr key={org.id} className="border-b border-[#1a1a1a] hover:bg-[#0f0f0f] transition-colors">
                      <td className="p-4 font-medium">{org.name}</td>
                      <td className="p-4 text-[#666]">{org.slug || "—"}</td>
                      <td className="p-4 text-[#666]">{org.memberCount}</td>
                      <td className="p-4 text-[#666] text-sm">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "products" && (
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#111] border-b border-[#1a1a1a]">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-[#666]">Product</th>
                    <th className="text-left p-4 text-sm font-medium text-[#666]">Description</th>
                    <th className="text-left p-4 text-sm font-medium text-[#666]">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-[#666]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-[#1a1a1a] hover:bg-[#0f0f0f] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{product.icon || "🔧"}</span>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-[#666]">{product.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-[#666] max-w-xs truncate">
                        {product.description || "—"}
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded ${
                          product.active
                            ? "bg-green-400/10 text-green-400 border border-green-400/20"
                            : "bg-[#1a1a1a] text-[#666]"
                        }`}>
                          {product.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="text-xs text-[#666] hover:text-white transition-colors">
                          Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "subscriptions" && (
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#111] border-b border-[#1a1a1a]">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-[#666]">Organization</th>
                    <th className="text-left p-4 text-sm font-medium text-[#666]">Product</th>
                    <th className="text-left p-4 text-sm font-medium text-[#666]">Plan</th>
                    <th className="text-left p-4 text-sm font-medium text-[#666]">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-[#666]">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b border-[#1a1a1a] hover:bg-[#0f0f0f] transition-colors">
                      <td className="p-4 font-medium">{sub.organizationName}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span>{sub.productIcon || "🔧"}</span>
                          {sub.productName}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs px-2 py-1 bg-[#1a1a1a] text-[#666] rounded capitalize">
                          {sub.plan}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded capitalize ${
                          sub.status === 'active'
                            ? "bg-green-400/10 text-green-400 border border-green-400/20"
                            : "bg-[#1a1a1a] text-[#666]"
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-4 text-[#666] text-sm">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}