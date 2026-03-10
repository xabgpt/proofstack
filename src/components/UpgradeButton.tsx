"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function UpgradeButton({ compact = false }: { compact?: boolean }) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  }

  if (compact) {
    return (
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="inline-flex items-center gap-1.5 bg-navy-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy-700 transition disabled:opacity-50 flex-shrink-0"
      >
        <Sparkles className="w-3.5 h-3.5" />
        {loading ? "Loading..." : "Upgrade — $9/mo"}
      </button>
    );
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition disabled:opacity-50 flex-shrink-0"
    >
      <Sparkles className="w-4 h-4" />
      {loading ? "Loading..." : "Upgrade to Pro — $9/mo"}
    </button>
  );
}
