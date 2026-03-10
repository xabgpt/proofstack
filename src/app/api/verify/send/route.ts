import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json();
    console.log("[verify/send] Received request for projectId:", projectId);

    const supabase = await createClient();

    // Get the project with joined user data
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*, users!inner(name, email)")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      console.error("[verify/send] Project lookup failed:", projectError?.message || "No project found");
      return NextResponse.json(
        { error: "Project not found", details: projectError?.message },
        { status: 404 }
      );
    }

    console.log("[verify/send] Project found:", {
      title: project.title,
      client_email: project.client_email,
      verification_token: project.verification_token,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL
      || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null)
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
      || "http://localhost:3000";
    const verifyUrl = `${appUrl}/verify/${project.verification_token}`;
    const freelancerName = (project as Record<string, unknown>).users
      ? ((project as Record<string, unknown>).users as { name: string }).name
      : "A freelancer";

    console.log("[verify/send] Freelancer name:", freelancerName);
    console.log("[verify/send] Verify URL:", verifyUrl);

    // Send email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("[verify/send] RESEND_API_KEY is not set!");
      return NextResponse.json({
        success: false,
        error: "Email service not configured",
        verifyUrl,
      }, { status: 500 });
    }

    console.log("[verify/send] RESEND_API_KEY present, length:", resendApiKey.length);
    console.log("[verify/send] Sending email to:", project.client_email);

    // Use onboarding@resend.dev unless you have a verified domain
    const fromAddress = "ProofStack <onboarding@resend.dev>";

    const emailPayload = {
      from: fromAddress,
      to: project.client_email,
      subject: `${freelancerName} wants you to verify their work`,
      html: getEmailTemplate({
        freelancerName,
        projectTitle: project.title,
        projectDescription: project.description,
        verifyUrl,
      }),
    };

    console.log("[verify/send] Email payload:", {
      from: emailPayload.from,
      to: emailPayload.to,
      subject: emailPayload.subject,
    });

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("[verify/send] Resend API error:", resendResponse.status, resendData);
      return NextResponse.json({
        success: false,
        error: "Failed to send email",
        resendError: resendData,
        verifyUrl,
      }, { status: 500 });
    }

    console.log("[verify/send] Email sent successfully:", resendData);
    return NextResponse.json({ success: true, verifyUrl, emailId: resendData.id });
  } catch (err) {
    console.error("[verify/send] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: String(err) },
      { status: 500 }
    );
  }
}

function getEmailTemplate({
  freelancerName,
  projectTitle,
  projectDescription,
  verifyUrl,
}: {
  freelancerName: string;
  projectTitle: string;
  projectDescription: string;
  verifyUrl: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
    <!-- Header -->
    <div style="background:#1B2A4A;padding:32px;text-align:center;">
      <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:700;">ProofStack</h1>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px;">
        <strong>${freelancerName}</strong> completed a project for you. Can you confirm this?
      </p>

      <!-- Project card -->
      <div style="background:#f9fafb;border-radius:12px;padding:24px;margin:0 0 24px;border:1px solid #e5e7eb;">
        <h2 style="color:#1B2A4A;font-size:18px;margin:0 0 8px;font-weight:700;">${projectTitle}</h2>
        <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0;">${projectDescription}</p>
      </div>

      <!-- Buttons -->
      <div style="text-align:center;">
        <a href="${verifyUrl}" style="display:inline-block;background:#10B981;color:#ffffff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:600;font-size:16px;margin:0 8px 12px;">
          Yes, confirm this work &#10003;
        </a>
        <br>
        <a href="${verifyUrl}" style="display:inline-block;background:#f3f4f6;color:#6b7280;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:600;font-size:14px;margin:0 8px;">
          This is incorrect &#10007;
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:24px 32px;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">
        You received this because a freelancer listed you as a client on ProofStack.
        <br>No account or login required.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
