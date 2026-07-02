"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAthlete, setCompleted } from "@/lib/athlete";

export default function WelcomeForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !fullName.trim()) {
      setError("Please enter your email and name.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/athlete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          full_name: fullName.trim(),
          team_name: teamName.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setAthlete(data.athlete);
      setCompleted(data.completed || []);
      router.push("/journey");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Email">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="input-ink w-full rounded-xl px-4 py-3.5 text-[15px]"
        />
      </Field>

      <Field label="First Name">
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your name"
          required
          className="input-ink w-full rounded-xl px-4 py-3.5 text-[15px]"
        />
      </Field>

      <Field label="Team or School (optional)">
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="e.g. Lincoln High Varsity"
          className="input-ink w-full rounded-xl px-4 py-3.5 text-[15px]"
        />
      </Field>

      {error && (
        <p
          style={{
            fontSize: 13,
            color: "#c84a4a",
            background: "rgba(200,74,74,0.10)",
            padding: "10px 14px",
            borderRadius: 10,
          }}
        >
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-gold w-full rounded-xl py-4 text-sm mt-1">
        {loading ? "Loading…" : "Start the Protocols →"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="font-head"
        style={{
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--muted)",
          display: "block",
          marginBottom: 7,
          fontWeight: 700,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
