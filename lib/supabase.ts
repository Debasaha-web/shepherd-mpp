import { createClient } from "@supabase/supabase-js";

// True only when real Supabase env vars are present.
export function hasSupabaseEnv(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// In production we ALWAYS require real Supabase. The dev fallback below may
// only be used locally so the full UX is clickable before env vars are wired.
export function devFallbackAllowed(): boolean {
  return process.env.NODE_ENV !== "production" && !hasSupabaseEnv();
}

// Deterministic UUID-shaped id from an email, so a local athlete is stable
// across reloads without a database. Dev-only.
export function devAthleteId(email: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < email.length; i++) {
    h ^= email.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const hex = (Math.abs(h) >>> 0).toString(16).padStart(8, "0");
  return `${hex}-0000-4000-8000-${hex}0000`;
}

// All clients are created inside functions — never at module level.
// This prevents Vercel's build step from evaluating env vars that don't
// exist at build time, which causes "Failed to collect page data" errors.

export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
