"use client";

// Session context provider for Better Auth.
// Better Auth's useSession hook works without a provider,
// but this wrapper exists for future extensions (toasts, theme, etc.).
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
