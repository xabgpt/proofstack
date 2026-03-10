import Link from "next/link";
import { Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <Shield className="w-12 h-12 text-navy-800 mb-4" />
      <h1 className="text-2xl font-bold text-navy-800 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-6">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="bg-navy-800 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-navy-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
