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
        Head back to the gallery — the prompt panel is unlocked. Paste it into ChatGPT and you&apos;re most of the way there.
      </span>

      <div className="checkout-promise">
        <p className="checkout-promise-label">A small promise</p>
        <p>
          Most prompts land in one or two iterations. If yours doesn&apos;t, tap the support widget bottom-left and we&apos;ll refund this charge. No questions, no forms.
        </p>
      </div>

      {searchParams.session_id ? <code>{searchParams.session_id}</code> : null}
      <Link href="/">Back to the gallery</Link>
    </main>
  );
}
