import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="checkout-state shell">
      <p>Checkout closed</p>
      <h1>No charge was made.</h1>
      <span>Come back to the gallery when one is worth keeping.</span>
      <Link href="/">Back to the gallery</Link>
    </main>
  );
}
