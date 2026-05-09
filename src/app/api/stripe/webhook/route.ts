import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 500 });
  }

  const body = await request.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const checkoutType = session.metadata?.checkoutType;
    const creativeSlug = session.metadata?.creativeSlug;
    const customerEmail = session.customer_details?.email;

    // TODO: Store this in a purchase ledger once auth or email-based restore is added.
    console.log("Stripe checkout completed", {
      checkoutType,
      creativeSlug,
      customerEmail,
      sessionId: session.id,
    });
  }

  return NextResponse.json({ received: true });
}
