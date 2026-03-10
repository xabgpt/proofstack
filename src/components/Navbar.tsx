"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";

export default function Navbar({
  user,
}: {
  user?: { name: string; username: string } | null;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-navy-800" />
            <span className="text-xl font-bold text-navy-800">ProofStack</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-600 hover:text-navy-800 transition"
                >
                  Dashboard
                </Link>
                <Link
                  href={`/${user.username}`}
                  className="text-sm font-medium text-gray-600 hover:text-navy-800 transition"
                >
                  Public Profile
                </Link>
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="text-sm font-medium text-gray-600 hover:text-navy-800 transition"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-navy-800 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-navy-800 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-navy-700 transition"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Dashboard
                </Link>
                <Link
                  href={`/${user.username}`}
                  className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Public Profile
                </Link>
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="block px-3 py-2 text-sm font-medium text-white bg-navy-800 hover:bg-navy-700 rounded-lg text-center"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
