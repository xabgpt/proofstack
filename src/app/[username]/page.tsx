import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProofCard from "@/components/ProofCard";
import CopyLinkButton from "@/components/CopyLinkButton";
import { Shield, BadgeCheck, MapPin } from "lucide-react";
import Link from "next/link";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  // Fetch user by username
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (!user) {
    notFound();
  }

  // Fetch verified projects only
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .eq("verified", true)
    .order("date_completed", { ascending: false });

  // Increment view count
  try {
    await supabase.rpc("increment_view_count", { uid: user.id });
  } catch {
    // ignore errors
  }

  const verifiedCount = projects?.length || 0;
  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/${username}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header bar */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-navy-800" />
            <span className="text-lg font-bold text-navy-800">ProofStack</span>
          </Link>
          <CopyLinkButton url={profileUrl} />
        </div>
      </nav>

      {/* Profile header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-navy-800 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-white">
                {(user.name || "")
                  .split(" ")
                  .map((n: string) => n[0])
                  .filter(Boolean)
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "?"}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy-800">{user.name}</h1>
              {user.title && (
                <p className="text-gray-500 mt-0.5">{user.title}</p>
              )}
              {user.bio && (
                <p className="text-gray-400 text-sm mt-2 max-w-lg">
                  {user.bio}
                </p>
              )}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                  <BadgeCheck className="w-4 h-4" />
                  {verifiedCount} verified project{verifiedCount !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {verifiedCount === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">No verified projects yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects?.map((project) => (
              <ProofCard
                key={project.id}
                title={project.title}
                description={project.description}
                clientName={project.client_name}
                dateCompleted={project.date_completed}
                verified={project.verified}
                verifiedAt={project.verified_at}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-gray-400 text-xs">
        Verified by{" "}
        <Link href="/" className="text-navy-800 font-semibold hover:underline">
          ProofStack
        </Link>
      </div>
    </div>
  );
}
