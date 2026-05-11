type LeadCaptureInput = {
  email: string;
  source: string;
  details?: Record<string, string | undefined>;
};

export async function submitLead({ email, source, details = {} }: LeadCaptureInput) {
  if (!process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
    throw new Error("GOOGLE_SHEETS_WEBHOOK_URL is not set.");
  }

  const response = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      source,
      createdAt: new Date().toISOString(),
      details: JSON.stringify(details),
    }),
  });

  if (!response.ok) {
    throw new Error(`Google webhook returned ${response.status}.`);
  }
}
