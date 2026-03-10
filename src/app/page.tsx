import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Shield,
  BadgeCheck,
  Send,
  Globe,
  ArrowRight,
  Check,
  Star,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Platform-independent reputation
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Your work, verified.
              <br />
              <span className="text-emerald-400">Your reputation, portable.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl">
              Stop relying on platforms to prove what you&apos;ve done. ProofStack lets
              clients verify your work in one click — giving you a credibility
              record you own forever.
            </p>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
            >
              Start Free — No Credit Card
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4">
              How ProofStack Works
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Three simple steps to build your verified portfolio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Shield,
                title: "Log Your Work",
                desc: "Add completed projects with details about what you did, for whom, and when.",
              },
              {
                step: "02",
                icon: Send,
                title: "Request Verification",
                desc: "Your client gets a clean email to verify the work with one click. No signup needed.",
              },
              {
                step: "03",
                icon: Globe,
                title: "Share Your Profile",
                desc: "Your verified proof cards appear on your public profile. Share it anywhere.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <div className="text-5xl font-extrabold text-gray-100 mb-4">
                  {item.step}
                </div>
                <div className="w-12 h-12 bg-navy-800 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-navy-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof Card Preview */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4">
                Beautiful Proof Cards
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-6">
                Each verified project becomes a clean, professional proof card.
                Show clients and prospects that your work is backed by real
                verification.
              </p>
              <ul className="space-y-3">
                {[
                  "Client-verified with one-click confirmation",
                  "Clean certificate-style design",
                  "Public and shareable on your profile",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-600">
                    <BadgeCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Client Verified
                </div>
                <h3 className="text-lg font-bold text-navy-800 mb-2">
                  E-Commerce Platform Redesign
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  Redesigned the complete shopping experience including product
                  pages, checkout flow, and mobile optimization. Increased
                  conversion rate by 34%.
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Client: Sarah Chen, TechFlow Inc.</span>
                  <span>Jan 2025</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white border border-gray-200 rounded-xl p-6 shadow-lg opacity-60 -z-10 transform rotate-2">
                <div className="h-4 w-48 bg-gray-100 rounded mb-2" />
                <div className="h-3 w-64 bg-gray-50 rounded mb-1" />
                <div className="h-3 w-56 bg-gray-50 rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-500 text-lg">
              Start free. Upgrade when you need more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free tier */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-navy-800 mb-1">Free</h3>
              <div className="text-4xl font-extrabold text-navy-800 mb-1">
                $0
                <span className="text-base font-normal text-gray-400">
                  /month
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-6">
                Perfect for getting started
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Up to 5 verified proof cards",
                  "Basic public profile",
                  "Client verification emails",
                  "Shareable profile link",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <Check className="w-4 h-4 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center py-3 rounded-xl border-2 border-navy-800 text-navy-800 font-semibold hover:bg-navy-800 hover:text-white transition"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro tier */}
            <div className="bg-navy-800 rounded-2xl p-8 border border-navy-700 shadow-lg relative">
              <div className="absolute -top-3 right-6 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" />
                Popular
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Pro</h3>
              <div className="text-4xl font-extrabold text-white mb-1">
                $5
                <span className="text-base font-normal text-gray-400">
                  /month
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                For serious freelancers
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited proof cards",
                  "Custom username",
                  "Profile analytics (who viewed)",
                  "Priority email support",
                  "Everything in Free",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
              >
                Start Pro Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-navy-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to own your reputation?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of freelancers building verified portfolios that
            clients trust.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
          >
            Start Free — No Credit Card
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
