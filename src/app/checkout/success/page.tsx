import Link from "next/link";
import { CheckoutSuccessTracker } from "@/components/CheckoutSuccessTracker";

type CheckoutSuccessPageProps = {
  searchParams: {
    session_id?: string;
  };
};

export default function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  return (
    <main className="checkout-state shell">
      <CheckoutSuccessTracker sessionId={searchParams.session_id} />
      <p>Payment received</p>
      <h1>The prompt is yours.</h1>
      <span>
        Stripe confirmed the checkout. Access is saved in this browser, and the webhook is ready for
        the purchase ledger when we add accounts.
      </span>
      {searchParams.session_id ? <code>{searchParams.session_id}</code> : null}
      <Link href="/">Back to the gallery</Link>
    </main>
  );
}
