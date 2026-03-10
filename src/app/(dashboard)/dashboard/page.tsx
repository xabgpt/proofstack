import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProofCard from "@/components/ProofCard";
import {
  Plus,
  ExternalLink,
  Copy,
  FolderOpen,
} from "lucide-react";
import CopyLinkButton from "@/components/CopyLinkButton";

export default async function DashboardPage() {
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
  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/${profile?.username || ""}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">
            Welcome back, {profile?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your verified portfolio
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CopyLinkButton url={profileUrl} />
          <Link
            href={`/${profile?.username}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-navy-800 transition border border-gray-200 px-4 py-2 rounded-lg"
          >
            <ExternalLink className="w-4 h-4" />
            View Profile
          </Link>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 bg-navy-800 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-navy-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Total Projects</div>
          <div className="text-2xl font-bold text-navy-800">
            {projects?.length || 0}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Verified</div>
          <div className="text-2xl font-bold text-emerald-600">
            {verifiedCount}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Pending</div>
          <div className="text-2xl font-bold text-amber-500">
            {pendingCount}
          </div>
        </div>
      </div>

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
