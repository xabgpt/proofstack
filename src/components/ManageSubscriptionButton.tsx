"use client";

import { useState } from "react";
import { Settings } from "lucide-react";

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  async function handleManage() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleManage}
      disabled={loading}
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-navy-800 transition"
    >
      <Settings className="w-4 h-4" />
      {loading ? "Loading..." : "Manage Subscription"}
    </button>
  );
}
