"use client";

// Lightweight client-side athlete session, stored in localStorage.
// No passwords — email + name only (per brief).

export type Athlete = {
  id: string;
  email: string;
  full_name: string;
  team_name: string | null;
};

const KEY = "shepherd_athlete";

export function getAthlete(): Athlete | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Athlete) : null;
  } catch {
    return null;
  }
}

export function setAthlete(athlete: Athlete): void {
  localStorage.setItem(KEY, JSON.stringify(athlete));
}

export function clearAthlete(): void {
  localStorage.removeItem(KEY);
}

// ----- Completion tracking (mirrors Supabase, cached locally for instant UI) -----

const DONE_KEY = "shepherd_completed";

export function getCompleted(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DONE_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

export function markCompleted(protocolNumber: number): void {
  const done = new Set(getCompleted());
  done.add(protocolNumber);
  localStorage.setItem(DONE_KEY, JSON.stringify([...done].sort((a, b) => a - b)));
}

export function setCompleted(numbers: number[]): void {
  localStorage.setItem(DONE_KEY, JSON.stringify([...new Set(numbers)].sort((a, b) => a - b)));
}
