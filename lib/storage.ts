"use client";

import { getAthlete, markCompleted } from "./athlete";

// Shown on any protocol step when saveResponse() fails.
export const SAVE_ERROR =
  "Something went wrong — your response was not saved. Please try again.";

// Persist a protocol's responses to Supabase via the API route, then
// cache completion locally so the journey page updates instantly.
// Returns true only when the save actually succeeded. On any failure it
// returns false WITHOUT marking the protocol complete, so callers can keep
// the athlete on the current step and show an error instead of a false
// "Saved" message.
export async function saveResponse(
  protocolNumber: number,
  protocolSlug: string,
  responses: Record<string, unknown>
): Promise<boolean> {
  const athlete = getAthlete();
  if (!athlete) return false;

  try {
    const res = await fetch("/api/submit-response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        athlete_id: athlete.id,
        protocol_number: protocolNumber,
        protocol_slug: protocolSlug,
        responses,
      }),
    });
    if (!res.ok) return false;

    markCompleted(protocolNumber);
    return true;
  } catch {
    return false;
  }
}
