import { NextResponse } from "next/server";
import { submitLead } from "@/lib/lead-capture";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const { email } = (await request.json()) as { email?: string };
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !emailPattern.test(normalizedEmail)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  try {
    await submitLead({
      email: normalizedEmail,
      source: "newsletter",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save email." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
