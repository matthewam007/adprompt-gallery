import { NextResponse } from "next/server";
import { creatives } from "@/data/creatives";
import { getStripe } from "@/lib/stripe";

type CheckoutRequest = {
  type?: "single" | "membership";
  creativeSlug?: string;
};

export async function POST(request: Request) {
  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  const singlePriceId = process.env.STRIPE_SINGLE_PROMPT_PRICE_ID;
  const membershipPriceId = process.env.STRIPE_MEMBERSHIP_PRICE_ID;
  const appUrl = getAppUrl(request);
  const payload = (await request.json()) as CheckoutRequest;
  const checkoutType = payload.type;

  if (checkoutType !== "single" && checkoutType !== "membership") {
    return NextResponse.json({ error: "Invalid checkout type." }, { status: 400 });
  }

  const priceId = checkoutType === "single" ? singlePriceId : membershipPriceId;

  if (!priceId) {
    return NextResponse.json({ error: "Stripe price is not configured." }, { status: 500 });
  }

  const creative = payload.creativeSlug
    ? creatives.find((item) => item.slug === payload.creativeSlug)
    : null;

  if (checkoutType === "single" && !creative) {
    return NextResponse.json({ error: "Choose a prompt to unlock first." }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: checkoutType === "single" ? "payment" : "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    customer_creation: checkoutType === "single" ? "always" : undefined,
    metadata: {
      checkoutType,
      creativeSlug: creative?.slug ?? "",
      creativeTitle: creative?.title ?? "",
    },
    subscription_data:
      checkoutType === "membership"
        ? {
            metadata: {
              checkoutType,
            },
          }
        : undefined,
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout/cancel`,
  });

  if (!session.url) {
    return NextResponse.json({ error: "Could not create checkout session." }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}

function getAppUrl(request: Request) {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}
