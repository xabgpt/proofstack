import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Use service-role client for webhook (no user session)
function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[stripe/webhook] Signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        console.log("[stripe/webhook] checkout.session.completed:", {
          userId,
          subscriptionId,
          customerId: session.customer,
        });

        if (userId) {
          await supabase
            .from("users")
            .update({
              subscription_status: "pro",
              stripe_subscription_id: subscriptionId,
              stripe_customer_id:
                typeof session.customer === "string"
                  ? session.customer
                  : session.customer?.id,
            })
            .eq("id", userId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        const status = subscription.status;
        const newPlan = status === "active" ? "pro" : "free";

        console.log("[stripe/webhook] subscription.updated:", {
          customerId,
          status,
          newPlan,
        });

        await supabase
          .from("users")
          .update({ subscription_status: newPlan })
          .eq("stripe_customer_id", customerId);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        console.log("[stripe/webhook] subscription.deleted:", { customerId });

        await supabase
          .from("users")
          .update({
            subscription_status: "free",
            stripe_subscription_id: null,
          })
          .eq("stripe_customer_id", customerId);
        break;
      }

      default:
        console.log("[stripe/webhook] Unhandled event type:", event.type);
    }
  } catch (err) {
    console.error("[stripe/webhook] Error processing event:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
