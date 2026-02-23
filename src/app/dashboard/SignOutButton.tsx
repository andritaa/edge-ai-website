"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-[#666] hover:text-white transition-colors cursor-pointer"
    >
      Sign out
    </button>
  );
}
