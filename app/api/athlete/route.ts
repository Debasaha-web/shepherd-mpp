export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

// Upsert an athlete by email. Returns the athlete row (with id) so the
// client can stash it in localStorage. No passwords — email + name only.
export async function POST(req: NextRequest) {
  try {
    const { email, full_name, team_name } = await req.json();

    if (!email?.trim() || !full_name?.trim()) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const { createServiceClient, devFallbackAllowed, devAthleteId } = await import("@/lib/supabase");

    // Local dev without Supabase: return a stable in-memory athlete so the
    // full flow is testable. Never runs in production.
    if (devFallbackAllowed()) {
      return NextResponse.json({
        athlete: {
          id: devAthleteId(cleanEmail),
          email: cleanEmail,
          full_name: full_name.trim(),
          team_name: team_name?.trim() || null,
        },
        completed: [],
      });
    }

    const supabase = createServiceClient();

    // Find existing athlete by email
    const { data: existing } = await supabase
      .from("athletes")
      .select("*")
      .eq("email", cleanEmail)
      .maybeSingle();

    let athlete = existing;

    if (athlete) {
      // Update name/team in case it changed
      const { data: updated, error: updErr } = await supabase
        .from("athletes")
        .update({ full_name: full_name.trim(), team_name: team_name?.trim() || null })
        .eq("id", athlete.id)
        .select("*")
        .single();
      if (updErr) throw updErr;
      athlete = updated;
    } else {
      const { data: created, error: insErr } = await supabase
        .from("athletes")
        .insert({
          email: cleanEmail,
          full_name: full_name.trim(),
          team_name: team_name?.trim() || null,
        })
        .select("*")
        .single();
      if (insErr) throw insErr;
      athlete = created;
    }

    // Which protocols has this athlete already completed?
    const { data: rows } = await supabase
      .from("mpp_responses")
      .select("protocol_number")
      .eq("athlete_id", athlete.id);

    const completed = [...new Set((rows || []).map((r) => r.protocol_number))].sort(
      (a, b) => a - b
    );

    return NextResponse.json({ athlete, completed });
  } catch (err) {
    console.error("Athlete upsert error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
