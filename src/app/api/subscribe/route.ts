import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const { email } = (await request.json()) as { email?: string };
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !emailPattern.test(normalizedEmail)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  if (!process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
    return NextResponse.json(
      { error: "GOOGLE_SHEETS_WEBHOOK_URL is not set." },
      { status: 500 },
    );
  }

  const response = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: normalizedEmail,
      source: "navbar",
      createdAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: `Could not save email. Google webhook returned ${response.status}.` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
