"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAthlete, type Athlete } from "./athlete";

// Redirect to landing if there's no athlete session on this device.
export function useAthleteGuard(): { athlete: Athlete | null; ready: boolean } {
  const router = useRouter();
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const a = getAthlete();
    if (!a) {
      router.replace("/");
      return;
    }
    setAthlete(a);
    setReady(true);
  }, [router]);

  return { athlete, ready };
}
