"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
      onClick={() => void signOut()}
    >
      Sign Out
    </button>
  );
}
