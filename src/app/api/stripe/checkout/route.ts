import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST() {
  try {
    // 1. Validate required env vars
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRO_PRICE_ID;

    console.log("[stripe/checkout] Env check:", {
      hasStripeKey: !!stripeKey,
      stripeKeyPrefix: stripeKey ? stripeKey.substring(0, 7) + "..." : "MISSING",
      hasPriceId: !!priceId,
      priceId: priceId || "MISSING",
    });

    if (!stripeKey) {
      return NextResponse.json(
        { error: "Stripe is not configured. STRIPE_SECRET_KEY is missing." },
        { status: 503 }
      );
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price is not configured. STRIPE_PRO_PRICE_ID is missing." },
        { status: 503 }
      );
    }

    // 2. Auth check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("[stripe/checkout] No authenticated user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[stripe/checkout] User authenticated:", user.id);

    // 3. Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("stripe_customer_id, email, name")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("[stripe/checkout] Profile query failed:", {
        message: profileError.message,
        code: profileError.code,
        details: profileError.details,
        hint: profileError.hint,
      });
      return NextResponse.json(
        { error: "Failed to fetch user profile", details: profileError.message },
        { status: 500 }
      );
    }

    console.log("[stripe/checkout] Profile loaded:", {
      hasCustomerId: !!profile?.stripe_customer_id,
      email: profile?.email || user.email,
    });

    // 4. Build return URL
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : null) ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
      "http://localhost:3000";

    // 5. Get or create Stripe customer
    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      console.log("[stripe/checkout] Creating new Stripe customer...");
      const customer = await getStripe().customers.create({
        email: profile?.email || user.email!,
        name: profile?.name || undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      console.log("[stripe/checkout] Created customer:", customerId);

      await supabase
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // 6. Create checkout session
    console.log("[stripe/checkout] Creating checkout session:", {
      customerId,
      priceId,
      successUrl: `${appUrl}/dashboard?upgraded=true`,
    });

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard?upgraded=true`,
      cancel_url: `${appUrl}/dashboard`,
      metadata: { supabase_user_id: user.id },
    });

    console.log("[stripe/checkout] Session created:", session.id);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Detailed error logging for Stripe errors
    if (err instanceof Stripe.errors.StripeError) {
      console.error("[stripe/checkout] Stripe API Error:", {
        type: err.type,
        code: err.code,
        message: err.message,
        statusCode: err.statusCode,
        requestId: err.requestId,
        param: err.param,
      });
      return NextResponse.json(
        {
          error: err.message,
          code: err.code,
          type: err.type,
        },
        { status: err.statusCode || 500 }
      );
    }

    // Generic error
    console.error("[stripe/checkout] Unexpected error:", {
      name: err instanceof Error ? err.name : "Unknown",
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to create checkout session",
        details: err instanceof Error ? err.stack : String(err),
      },
      { status: 500 }
    );
  }
}
