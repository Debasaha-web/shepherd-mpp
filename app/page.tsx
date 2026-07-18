"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Wordmark from "@/components/Wordmark";
import WelcomeForm from "@/components/WelcomeForm";
import { getAthlete } from "@/lib/athlete";

export default function LandingPage() {
  const router = useRouter();

  // If already signed in on this device, skip straight to the journey.
  useEffect(() => {
    if (getAthlete()) router.replace("/journey");
  }, [router]);

  return (
    <main className="screen flex flex-col min-h-screen pb-12">
      <header className="pt-8">
        <Wordmark />
      </header>

      <section className="mt-14">
        <p className="eyebrow mb-4">The Mental Performance Protocol</p>
        <h1
          className="font-display"
          style={{ fontSize: 40, lineHeight: 1.02, color: "var(--cream)" }}
        >
          MENTAL
          <br />
          PERFORMANCE
          <br />
          <span style={{ color: "var(--gold)" }}>PROTOCOLS</span>
        </h1>
        <p
          style={{
            marginTop: 18,
            fontSize: 16,
            lineHeight: 1.5,
            color: "var(--muted)",
            maxWidth: 340,
          }}
        >
          13 exercises that separate good athletes from great ones.
        </p>
      </section>

      <section className="card mt-10 p-6">
        <p
          className="font-head"
          style={{ fontSize: 13, fontWeight: 700, color: "var(--cream)", marginBottom: 16 }}
        >
          Enter your details to begin.
        </p>
        <WelcomeForm />
      </section>

      <p
        style={{
          marginTop: "auto",
          paddingTop: 28,
          fontSize: 12,
          color: "var(--muted)",
          textAlign: "center",
        }}
      >
        Your progress saves automatically after each protocol.
      </p>
    </main>
  );
}
