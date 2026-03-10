import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Stripe checkout placeholder
// To enable: npm install stripe, add STRIPE_SECRET_KEY & STRIPE_PRICE_ID_PRO to env
export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Placeholder: In production, create a Stripe Checkout Session
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'subscription',
    //   customer_email: user.email,
    //   line_items: [{ price: process.env.STRIPE_PRICE_ID_PRO, quantity: 1 }],
    //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    //   metadata: { user_id: user.id },
    // });
    // return NextResponse.json({ url: session.url });

    return NextResponse.json({
      message: "Stripe integration placeholder. Configure STRIPE_SECRET_KEY to enable.",
      url: "/dashboard?upgraded=true",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
