import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function GET(request: Request) {
  const stripe = getStripe();
  const sessionId = new URL(request.url).searchParams.get("session_id");

  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id." }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid" && session.status !== "complete") {
    return NextResponse.json({ error: "Checkout is not complete." }, { status: 402 });
  }

  return NextResponse.json({
    checkoutType: session.metadata?.checkoutType ?? null,
    creativeSlug: session.metadata?.creativeSlug ?? null,
    customerEmail: session.customer_details?.email ?? null,
  });
}
