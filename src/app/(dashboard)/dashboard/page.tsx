import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProofCard from "@/components/ProofCard";
import {
  Plus,
  ExternalLink,
  FolderOpen,
  Crown,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import CopyLinkButton from "@/components/CopyLinkButton";
import UpgradeButton from "@/components/UpgradeButton";
import ManageSubscriptionButton from "@/components/ManageSubscriptionButton";
import { FREE_PROOF_CARD_LIMIT } from "@/lib/stripe";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const verifiedCount = projects?.filter((p) => p.verified).length || 0;
  const pendingCount = projects?.filter((p) => !p.verified).length || 0;
  const totalProjects = projects?.length || 0;
  const isPro = profile?.subscription_status === "pro";
  const atLimit = !isPro && verifiedCount >= FREE_PROOF_CARD_LIMIT;
  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/${profile?.username || ""}`;
  const justUpgraded = params.upgraded === "true";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Upgrade success banner */}
      {justUpgraded && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-emerald-800 font-semibold text-sm">
              Welcome to ProofStack Pro!
            </p>
            <p className="text-emerald-600 text-sm">
              You now have unlimited proof cards, custom username, and profile analytics.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-navy-800">
                Welcome back, {profile?.name?.split(" ")[0] || "there"}
              </h1>
              {isPro && (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  <Crown className="w-3 h-3" />
                  PRO
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Manage your verified portfolio
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <CopyLinkButton url={profileUrl} />
          <Link
            href={`/${profile?.username}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-navy-800 transition border border-gray-200 px-4 py-2 rounded-lg"
          >
            <ExternalLink className="w-4 h-4" />
            View Profile
          </Link>
          {!atLimit && (
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-2 bg-navy-800 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-navy-700 transition"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Total Projects</div>
          <div className="text-2xl font-bold text-navy-800">{totalProjects}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Verified</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">
              {verifiedCount}
            </span>
            {!isPro && (
              <span className="text-xs text-gray-400">
                / {FREE_PROOF_CARD_LIMIT} free
              </span>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Pending</div>
          <div className="text-2xl font-bold text-amber-500">{pendingCount}</div>
        </div>
      </div>

      {/* Free tier limit banner */}
      {atLimit && (
        <div className="mb-8 bg-gradient-to-r from-navy-800 to-navy-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-lg">
                You&apos;ve reached the free plan limit
              </h3>
              <p className="text-gray-300 text-sm mt-1">
                Upgrade to Pro for unlimited proof cards, custom username, and
                profile analytics.
              </p>
            </div>
          </div>
          <UpgradeButton />
        </div>
      )}

      {/* Subscription management for Pro users */}
      {isPro && (
        <div className="mb-8 flex justify-end">
          <ManageSubscriptionButton />
        </div>
      )}

      {/* Upgrade banner for free users (not at limit) */}
      {!isPro && !atLimit && totalProjects > 0 && (
        <div className="mb-8 bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-amber-500" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-navy-800">Upgrade to Pro</span>
              {" "}for unlimited proof cards and profile analytics.
              <span className="text-gray-400"> {verifiedCount}/{FREE_PROOF_CARD_LIMIT} free cards used.</span>
            </p>
          </div>
          <UpgradeButton compact />
        </div>
      )}

      {/* Projects list */}
      {!projects || projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-navy-800 mb-2">
            You have no projects yet
          </h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Add your first one to start building your verified reputation.
          </p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 bg-navy-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add Your First Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProofCard
              key={project.id}
              title={project.title}
              description={project.description}
              clientName={project.client_name}
              dateCompleted={project.date_completed}
              verified={project.verified}
              verifiedAt={project.verified_at}
              showPending
            />
          ))}
        </div>
      )}
    </div>
  );
}
