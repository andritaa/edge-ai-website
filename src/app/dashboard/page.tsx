import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

const BUILDING_TYPE_LABELS: Record<string, string> = {
  home: "Home",
  office: "Office",
  restaurant: "Restaurant",
  hospital: "Hospital",
  factory: "Factory",
  other: "Other",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { user } = session;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildingType = (user as any).buildingType as string | undefined;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 h-[60px] flex items-center justify-between bg-black/80 backdrop-blur-xl border-b border-white/5">
        <Link href="/" className="font-semibold text-base tracking-tight">
          Edge AI
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#666] hidden sm:block">{user.email}</span>
          <SignOutButton />
        </div>
      </nav>

      <main className="pt-[60px] px-6 max-w-[900px] mx-auto">
        {/* Header */}
        <div className="py-16 border-b border-[#1a1a1a]">
          <p className="text-xs text-[#666] uppercase tracking-[0.1em] mb-3">Dashboard</p>
          <h1
            className="text-[clamp(32px,5vw,48px)] font-medium tracking-[-0.02em] mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Welcome back
            {user.name ? (
              <>
                ,{" "}
                <span className="text-[#FF6B35]">
                  {user.name.split(" ")[0]}
                </span>
              </>
            ) : null}
            .
          </h1>
          <p className="text-[15px] text-[#666]">
            Your edge AI environment is ready.
          </p>
        </div>

        {/* User info cards */}
        <div className="py-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
            <p className="text-xs text-[#555] uppercase tracking-[0.1em] mb-3">Account</p>
            <p className="text-sm font-medium mb-1">{user.name || "—"}</p>
            <p className="text-sm text-[#666]">{user.email}</p>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
            <p className="text-xs text-[#555] uppercase tracking-[0.1em] mb-3">Environment</p>
            <p className="text-sm font-medium mb-1">
              {BUILDING_TYPE_LABELS[buildingType ?? "other"] ?? "Other"}
            </p>
            <p className="text-sm text-[#666]">Building type</p>
          </div>
        </div>

        {/* Coming soon section */}
        <div className="pb-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Agents",
              desc: "Autonomous AI agents running on your hardware",
              status: "Coming soon",
            },
            {
              label: "Integrations",
              desc: "Connect sensors, cameras, and smart devices",
              status: "Coming soon",
            },
            {
              label: "Analytics",
              desc: "Real-time insights from your environment",
              status: "Coming soon",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm font-medium">{item.label}</p>
                <span className="text-[10px] text-[#444] bg-[#111] border border-[#222] px-2 py-1 rounded-md">
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-[#666] leading-relaxed flex-1">{item.desc}</p>
              <div className="mt-6 h-px bg-[#1a1a1a]" />
              <div className="mt-4 flex gap-2">
                <div className="h-2 w-2 rounded-full bg-[#1a1a1a] animate-pulse" />
                <div className="h-2 w-16 rounded-full bg-[#1a1a1a]" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
