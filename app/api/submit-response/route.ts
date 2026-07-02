export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

// Store a single protocol's responses. One row per attempt.
export async function POST(req: NextRequest) {
  try {
    const { athlete_id, protocol_number, protocol_slug, responses } = await req.json();

    if (!athlete_id || !protocol_number || !protocol_slug || !responses) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { createServiceClient, devFallbackAllowed } = await import("@/lib/supabase");

    // Local dev without Supabase: accept and no-op so flows complete. The
    // client also caches completion locally. Never runs in production.
    if (devFallbackAllowed()) {
      return NextResponse.json({ success: true, dev: true });
    }

    const supabase = createServiceClient();

    // Verify the athlete exists
    const { data: athlete, error: athleteErr } = await supabase
      .from("athletes")
      .select("id")
      .eq("id", athlete_id)
      .single();

    if (athleteErr || !athlete) {
      return NextResponse.json({ error: "Athlete not found" }, { status: 404 });
    }

    const { error: insertErr } = await supabase.from("mpp_responses").insert({
      athlete_id,
      protocol_number,
      protocol_slug,
      responses,
    });

    if (insertErr) throw insertErr;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit response error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
