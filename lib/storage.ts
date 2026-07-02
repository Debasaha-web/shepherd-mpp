"use client";

import { getAthlete, markCompleted } from "./athlete";

// Persist a protocol's responses to Supabase via the API route, then
// cache completion locally so the journey page updates instantly.
export async function saveResponse(
  protocolNumber: number,
  protocolSlug: string,
  responses: Record<string, unknown>
): Promise<{ ok: boolean; error?: string }> {
  const athlete = getAthlete();
  if (!athlete) return { ok: false, error: "No athlete session" };

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
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error || "Save failed" };

    markCompleted(protocolNumber);
    return { ok: true };
  } catch {
    // Still mark locally so the athlete isn't blocked offline.
    markCompleted(protocolNumber);
    return { ok: false, error: "Network error — saved on this device only" };
  }
}
