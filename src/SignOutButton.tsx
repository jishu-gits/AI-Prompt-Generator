"use client";
import { useAuth } from "./contexts/AuthContext";

export function SignOutButton() {
  const { user, signOut } = useAuth();

  if (!user) {
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
