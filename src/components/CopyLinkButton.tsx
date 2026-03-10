"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-navy-800 transition border border-gray-200 px-4 py-2 rounded-lg"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-500" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copy Link
        </>
      )}
    </button>
  );
}
