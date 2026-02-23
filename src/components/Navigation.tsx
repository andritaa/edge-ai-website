"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Settings, Shield, LogOut } from "lucide-react";

interface NavigationProps {
  variant?: "default" | "minimal";
}

export default function Navigation({ variant = "default" }: NavigationProps) {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if user is admin (simple check for now)
  const isAdmin = session?.user && (
    session.user.email?.includes("stephen") ||
    session.user.email?.includes("admin") ||
    session.user.id === "1"
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 h-[60px] flex items-center justify-between bg-black/80 backdrop-blur-xl border-b border-white/5">
      <Link href="/" className="font-semibold text-base tracking-tight">
        Edge AI
      </Link>

      <div className="flex items-center gap-4">
        {/* Public navigation */}
        {!session && variant === "default" && (
          <>
            <Link href="#products" className="text-sm text-[#888] hover:text-white transition-colors hidden sm:block">
              Products
            </Link>
            <Link href="#about" className="text-sm text-[#888] hover:text-white transition-colors hidden sm:block">
              About
            </Link>
            <Link href="/architecture" className="text-sm text-[#888] hover:text-white transition-colors hidden sm:block">
              Architecture
            </Link>
            <Link href="/login" className="text-sm text-[#888] hover:text-white transition-colors hidden sm:block">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-[#FF6B35] hover:bg-[#e55a24] text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get started
            </Link>
          </>
        )}

        {/* Authenticated navigation */}
        {session && (
          <>
            {/* Admin indicator */}
            {isAdmin && (
              <span className="text-xs text-[#FF6B35] uppercase tracking-[0.1em] hidden sm:block">
                ADMIN
              </span>
            )}

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm text-[#666] hover:text-white transition-colors"
              >
                <span className="hidden sm:block">{session.user.email}</span>
                <div className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#111] border border-[#1a1a1a] rounded-lg overflow-hidden shadow-xl">
                  <div className="px-4 py-3 border-b border-[#1a1a1a]">
                    <p className="text-sm font-medium truncate">{session.user.name || "User"}</p>
                    <p className="text-xs text-[#666] truncate">{session.user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/products"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-[#ccc] hover:bg-[#1a1a1a] hover:text-white transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Products
                    </Link>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-[#ccc] hover:bg-[#1a1a1a] hover:text-white transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>

                    {/* Admin link */}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-[#FF6B35] hover:bg-[#1a1a1a] hover:text-[#FF6B35]/80 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Shield className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}
                  </div>

                  <div className="py-1 border-t border-[#1a1a1a]">
                    <Link
                      href="/api/auth/sign-out"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-[#888] hover:bg-[#1a1a1a] hover:text-white transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}