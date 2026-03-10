import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supabase = await createClient();

    const { data: project, error } = await supabase
      .from("projects")
      .select("title, description, verified, token_expires_at, users!inner(name)")
      .eq("verification_token", token)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    if (project.verified) {
      return NextResponse.json(
        { error: "already_verified" },
        { status: 400 }
      );
    }

    if (new Date(project.token_expires_at) < new Date()) {
      return NextResponse.json({ error: "expired" }, { status: 410 });
    }

    return NextResponse.json({
      title: project.title,
      description: project.description,
      freelancer_name: (project.users as unknown as { name: string }).name,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const { confirmed } = await request.json();
    const supabase = await createClient();

    if (confirmed) {
      const { error } = await supabase
        .from("projects")
        .update({
          verified: true,
          verified_at: new Date().toISOString(),
        })
        .eq("verification_token", token)
        .eq("verified", false);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
