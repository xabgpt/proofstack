"use client";

import { useState } from "react";
import { Settings } from "lucide-react";

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleManage() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to open subscription portal");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Portal error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleManage}
        disabled={loading}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-navy-800 transition"
      >
        <Settings className="w-4 h-4" />
        {loading ? "Loading..." : "Manage Subscription"}
      </button>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
