"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const BUILDING_TYPES = [
  { value: "home", label: "Home" },
  { value: "office", label: "Office" },
  { value: "restaurant", label: "Restaurant" },
  { value: "hospital", label: "Hospital" },
  { value: "factory", label: "Factory" },
  { value: "other", label: "Other" },
] as const;

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buildingType, setBuildingType] = useState("other");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: authError } = await (authClient.signUp.email as any)({
        name,
        email,
        password,
        buildingType,
        callbackURL: "/dashboard",
      });
      if (authError) {
        setError(authError.message || "Failed to create account.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link
        href="/"
        className="mb-10 text-sm font-semibold tracking-tight text-white/60 hover:text-white transition-colors"
      >
        ← Edge AI
      </Link>

      <div className="w-full max-w-[420px]">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-[28px] font-medium tracking-[-0.02em] mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Create your account
          </h1>
          <p className="text-sm text-[#666]">Join Edge AI — run AI on your hardware</p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleSignup}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 bg-[#111] border border-[#222] hover:border-[#333] text-white text-sm font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mb-5"
        >
          {googleLoading ? (
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-[#666] rounded-full animate-pulse" />
              <span className="w-1.5 h-1.5 bg-[#666] rounded-full animate-pulse [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-[#666] rounded-full animate-pulse [animation-delay:300ms]" />
            </span>
          ) : (
            <>
              <GoogleIcon />
              Continue with Google
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex-1 h-px bg-[#1a1a1a]" />
          <span className="text-xs text-[#444]">or</span>
          <div className="flex-1 h-px bg-[#1a1a1a]" />
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#666] font-medium">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              required
              className="bg-[#0a0a0a] border border-[#1a1a1a] focus:border-[#333] rounded-lg px-4 py-3 text-sm text-white placeholder:text-[#444] outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#666] font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-[#0a0a0a] border border-[#1a1a1a] focus:border-[#333] rounded-lg px-4 py-3 text-sm text-white placeholder:text-[#444] outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#666] font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              minLength={8}
              className="bg-[#0a0a0a] border border-[#1a1a1a] focus:border-[#333] rounded-lg px-4 py-3 text-sm text-white placeholder:text-[#444] outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#666] font-medium">Building type</label>
            <div className="relative">
              <select
                value={buildingType}
                onChange={(e) => setBuildingType(e.target.value)}
                className="w-full appearance-none bg-[#0a0a0a] border border-[#1a1a1a] focus:border-[#333] rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors cursor-pointer pr-10"
              >
                {BUILDING_TYPES.map((bt) => (
                  <option key={bt.value} value={bt.value} className="bg-[#111]">
                    {bt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="text-[#444]"
                >
                  <path
                    d="M2 4l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <p className="text-[11px] text-[#444]">
              Helps us tailor AI capabilities for your environment
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-[#FF6B35] hover:bg-[#e55a24] text-white text-sm font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-1"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-[11px] text-[#444] text-center mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>

        {/* Login link */}
        <p className="text-sm text-[#555] text-center mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:text-[#FF6B35] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
