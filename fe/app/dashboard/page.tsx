"use client";

import { useAuthStore } from "@/stores/auth";

export default function DashboardPage() {
  const handleLogout = () => {
    useAuthStore.getState().clearAuth();
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <button
        className="px-6 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
