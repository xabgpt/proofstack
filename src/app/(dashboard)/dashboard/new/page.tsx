"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import UpgradeButton from "@/components/UpgradeButton";

const FREE_PROOF_CARD_LIMIT = 5;

export default function NewProjectPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [dateCompleted, setDateCompleted] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [atLimit, setAtLimit] = useState(false);
  const [checkingLimit, setCheckingLimit] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkLimit() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("users")
        .select("subscription_status")
        .eq("id", user.id)
        .single();

      if (profile?.subscription_status === "pro") {
        setCheckingLimit(false);
        return;
      }

      const { data: projects } = await supabase
        .from("projects")
        .select("id, verified")
        .eq("user_id", user.id)
        .eq("verified", true);

      if (projects && projects.length >= FREE_PROOF_CARD_LIMIT) {
        setAtLimit(true);
      }
      setCheckingLimit(false);
    }
    checkLimit();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in.");
        return;
      }

      // Double-check limit server-side
      const { data: profile } = await supabase
        .from("users")
        .select("subscription_status")
        .eq("id", user.id)
        .single();

      if (profile?.subscription_status !== "pro") {
        const { data: verified } = await supabase
          .from("projects")
          .select("id")
          .eq("user_id", user.id)
          .eq("verified", true);

        if (verified && verified.length >= FREE_PROOF_CARD_LIMIT) {
          setError("You've reached the free plan limit of 5 verified proof cards. Upgrade to Pro for unlimited.");
          setAtLimit(true);
          return;
        }
      }

      const { data: project, error: insertError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          title,
          description,
          client_name: clientName,
          client_email: clientEmail,
          date_completed: dateCompleted,
        })
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        return;
      }

      // Send verification email via API
      await fetch("/api/verify/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id }),
      });

      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy-800 transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {checkingLimit ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : atLimit ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy-800 mb-2">
            Free plan limit reached
          </h2>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            You&apos;ve used all {FREE_PROOF_CARD_LIMIT} verified proof cards on the free plan.
            Upgrade to Pro for unlimited proof cards.
          </p>
          <UpgradeButton />
        </div>
      ) : (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-navy-800 mb-1">Add New Project</h1>
        <p className="text-gray-500 text-sm mb-6">
          Fill in the details and we&apos;ll send your client a verification request.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent text-sm"
              placeholder="e.g., E-Commerce Platform Redesign"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What I Did
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent text-sm resize-none"
              placeholder="Describe your work in 2-3 sentences..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent text-sm"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Email
              </label>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent text-sm"
                placeholder="client@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Completed
            </label>
            <input
              type="date"
              required
              value={dateCompleted}
              onChange={(e) => setDateCompleted(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent text-sm"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-500 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-600 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Request Verification"}
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
      )}
    </div>
  );
}
