"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Shield, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function VerifyPage() {
  const params = useParams();
  const token = params.token as string;
  const [status, setStatus] = useState<"loading" | "confirm" | "verified" | "declined" | "error" | "expired">("loading");
  const [project, setProject] = useState<{
    title: string;
    description: string;
    freelancer_name: string;
  } | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/verify/${token}`);
        const data = await res.json();

        if (!res.ok) {
          setStatus(data.error === "expired" ? "expired" : "error");
          return;
        }

        setProject(data);
        setStatus("confirm");
      } catch {
        setStatus("error");
      }
    }

    fetchProject();
  }, [token]);

  async function handleVerify(confirmed: boolean) {
    try {
      const res = await fetch(`/api/verify/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmed }),
      });

      if (res.ok) {
        setStatus(confirmed ? "verified" : "declined");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Shield className="w-8 h-8 text-navy-800" />
            <span className="text-2xl font-bold text-navy-800">ProofStack</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {status === "loading" && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-navy-800 animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading verification details...</p>
            </div>
          )}

          {status === "confirm" && project && (
            <div>
              <h2 className="text-xl font-bold text-navy-800 mb-2 text-center">
                Work Verification Request
              </h2>
              <p className="text-gray-500 text-sm text-center mb-6">
                <span className="font-semibold text-navy-800">
                  {project.freelancer_name}
                </span>{" "}
                completed a project for you. Can you confirm this?
              </p>

              <div className="bg-gray-50 rounded-xl p-5 mb-6">
                <h3 className="font-semibold text-navy-800 mb-1">
                  {project.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleVerify(true)}
                  className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Yes, confirm
                </button>
                <button
                  onClick={() => handleVerify(false)}
                  className="flex items-center justify-center gap-2 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  <XCircle className="w-5 h-5" />
                  Incorrect
                </button>
              </div>
            </div>
          )}

          {status === "verified" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-navy-800 mb-2">
                Work Verified!
              </h2>
              <p className="text-gray-500 text-sm">
                Thank you for confirming this work. The project now has a verified
                badge on the freelancer&apos;s profile.
              </p>
            </div>
          )}

          {status === "declined" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-navy-800 mb-2">
                Verification Declined
              </h2>
              <p className="text-gray-500 text-sm">
                You&apos;ve indicated this work description is incorrect. The
                freelancer has been notified.
              </p>
            </div>
          )}

          {status === "expired" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold text-navy-800 mb-2">
                Link Expired
              </h2>
              <p className="text-gray-500 text-sm">
                This verification link has expired. Please ask the freelancer to
                send a new request.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-navy-800 mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-500 text-sm">
                We couldn&apos;t process this verification. The link may be invalid or
                already used.
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by{" "}
          <Link href="/" className="text-navy-800 font-semibold hover:underline">
            ProofStack
          </Link>
        </p>
      </div>
    </div>
  );
}
