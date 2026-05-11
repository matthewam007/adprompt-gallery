import { NextResponse } from "next/server";
import { submitLead } from "@/lib/lead-capture";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    email?: string;
    company?: string;
    requestType?: string;
    note?: string;
    adUrl?: string;
  };

  const email = payload.email?.trim().toLowerCase();
  const company = payload.company?.trim();
  const note = payload.note?.trim();
  const adUrl = payload.adUrl?.trim();
  const requestType = payload.requestType?.trim() || "company_request";

  if (!email || !emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  if (!company && requestType === "company_request") {
    return NextResponse.json({ error: "Add a company name." }, { status: 400 });
  }

  try {
    await submitLead({
      email,
      source: requestType,
      details: {
        company,
        note,
        adUrl,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save request." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
