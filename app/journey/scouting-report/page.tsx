"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepHeader from "@/components/StepHeader";
import Scripture from "@/components/Scripture";
import { SCRIPTURE } from "@/lib/protocols";
import { Loading, Section, Label, Textarea } from "@/components/StepUI";
import { useAthleteGuard } from "@/lib/useAthleteGuard";
import { saveResponse, SAVE_ERROR } from "@/lib/storage";
import SaveError from "@/components/SaveError";

const TOTAL = 5;

const TRAIT_SUGGESTIONS = [
  "Never quits",
  "Leads by example",
  "Unshakable focus",
  "Relentless",
  "Composed under pressure",
  "Always prepared",
];

export default function ScoutingReportPage() {
  const { athlete, ready } = useAthleteGuard();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [wantSaid, setWantSaid] = useState("");
  const [traits, setTraits] = useState<string[]>(["", "", ""]);
  const [habits, setHabits] = useState("");
  const [visualization, setVisualization] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  if (!ready || !athlete) return <Loading />;

  const firstName = athlete.full_name.trim().split(/\s+/)[0];
  const trimmedTraits = traits.map((t) => t.trim());
  const filledTraits = trimmedTraits.filter(Boolean);
  // 2–3 traits: first two required, third optional.
  const traitsValid = Boolean(trimmedTraits[0] && trimmedTraits[1]);

  function setTrait(i: number, value: string) {
    setTraits((prev) => prev.map((t, idx) => (idx === i ? value : t)));
  }
  function fillTrait(text: string) {
    const target = traits.findIndex((t) => !t.trim());
    if (target !== -1) setTrait(target, text);
  }

  async function goToReveal() {
    if (saved) {
      setStep(5);
      return;
    }
    setSaving(true);
    setSaveError("");
    const ok = await saveResponse(8, "scouting-report", {
      want_said: wantSaid.trim(),
      traits: trimmedTraits as [string, string, string],
      habits: habits.trim(),
      visualization: visualization.trim(),
    });
    setSaving(false);
    if (!ok) {
      setSaveError(SAVE_ERROR);
      return;
    }
    setSaved(true);
    setStep(5);
  }

  const notesText = `SCOUTING REPORT: ${firstName.toUpperCase()}\n\nKEY TRAITS:\n${filledTraits.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nTHE WARNING:\n${wantSaid.trim()}\n\n— Shepherd Coach Network`;

  async function copyToNotes() {
    try {
      await navigator.clipboard.writeText(notesText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="screen flex flex-col min-h-screen pb-10">
      <StepHeader
        eyebrow="Protocol 8 · Scouting Report"
        step={step}
        total={TOTAL}
        backToJourney={step === 1}
        onBack={() => setStep((s) => Math.max(1, s - 1))}
      />

      {/* STEP 1 — Define the report */}
      {step === 1 && (
        <Section
          title="Define the report."
          hint="If your biggest rival scouted you, what would you WANT them to say about your mindset and leadership?"
        >
          <Label>What they'd say</Label>
          <Textarea
            value={wantSaid}
            onChange={setWantSaid}
            placeholder="They'd warn their team that I…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={() => setStep(2)}
            disabled={!wantSaid.trim()}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 2 — List your traits */}
      {step === 2 && (
        <Section
          title="List your traits."
          hint="2–3 traits you want rivals to notice. Tap a suggestion or write your own."
        >
          <div className="flex flex-col gap-2.5">
            {traits.map((t, i) => (
              <input
                key={i}
                className="input-ink w-full rounded-xl px-4 py-3.5 text-[15px]"
                placeholder={i < 2 ? `Trait ${i + 1}` : `Trait ${i + 1} (optional)`}
                value={t}
                onChange={(e) => setTrait(i, e.target.value)}
              />
            ))}
          </div>

          <div className="mt-5">
            <Label>Suggestions</Label>
            <div className="flex flex-wrap gap-2">
              {TRAIT_SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => fillTrait(s)} className="chip px-3.5 py-2" style={{ fontSize: 13 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(3)}
            disabled={!traitsValid}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 3 — Make it real */}
      {step === 3 && (
        <Section title="Make it real." hint="1–2 habits or actions this season that make the scouting report true.">
          <Label>Your habits</Label>
          <Textarea
            value={habits}
            onChange={setHabits}
            placeholder="This season I'll prove it by…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={() => setStep(4)}
            disabled={!habits.trim()}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 4 — Visualize it */}
      {step === 4 && (
        <Section title="Visualize it." hint="Picture your rival confirming these traits. How does that feel?">
          <Label>Your visualization</Label>
          <Textarea
            value={visualization}
            onChange={setVisualization}
            placeholder="I picture them saying it, and I feel…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={goToReveal}
            disabled={!visualization.trim() || saving}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            {saving ? "Saving…" : "Reveal my report →"}
          </button>
          {saveError && <SaveError message={saveError} />}
        </Section>
      )}

      {/* STEP 5 — Scouting report card + screenshot prompt */}
      {step === 5 && (
        <section className="pop-in mt-2 flex flex-col flex-1">
          <div className="mb-5" style={{ textAlign: "center" }}>
            <Scripture
              verse={SCRIPTURE["scouting-report"].verse}
              reference={SCRIPTURE["scouting-report"].reference}
              align="center"
            />
          </div>

          <div
            className="card flex flex-col"
            style={{ padding: "0", background: "radial-gradient(circle at 50% 0%, #ffffff 0%, #f6f3ec 75%)" }}
          >
            <div style={{ padding: "20px 22px", borderBottom: "2px solid var(--gold)" }}>
              <p
                className="font-head"
                style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}
              >
                Scouting Report
              </p>
              <p
                className="font-display"
                style={{ fontSize: 26, color: "var(--cream)", lineHeight: 1.1, fontWeight: 700, textTransform: "uppercase", marginTop: 4 }}
              >
                {firstName}
              </p>
            </div>

            <div style={{ padding: "22px 22px", borderBottom: "1px solid var(--border)" }}>
              <p
                className="font-head"
                style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700, marginBottom: 12 }}
              >
                Key Traits
              </p>
              <div className="flex flex-col gap-2.5">
                {filledTraits.map((t, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="font-display" style={{ fontSize: 22, color: "var(--gold)", lineHeight: 1 }}>
                      {i + 1}
                    </span>
                    <span
                      className="font-display"
                      style={{ fontSize: 20, color: "var(--cream)", lineHeight: 1.15, fontWeight: 700, textTransform: "uppercase" }}
                    >
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "22px 22px" }}>
              <p
                className="font-head"
                style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700, marginBottom: 8 }}
              >
                The Warning
              </p>
              <p style={{ fontSize: 14.5, color: "var(--cream)", lineHeight: 1.5, fontWeight: 500 }}>
                {wantSaid.trim()}
              </p>
            </div>
          </div>

          <p style={{ fontSize: 13.5, color: "var(--cream)", marginTop: 22, textAlign: "center", lineHeight: 1.5 }}>
            Copy this, or screenshot it to keep on your phone.
          </p>
          <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4, textAlign: "center" }}>
            {saving ? "Saving…" : "Saved to your profile."}
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <button className="btn-gold w-full rounded-xl py-4 text-sm" onClick={copyToNotes}>
              {copied ? "✓ Copied — paste into Notes" : "⧉ Copy for Notes"}
            </button>
            <button className="btn-ghost w-full rounded-xl py-3.5 text-sm" onClick={() => router.push("/journey")}>
              Back to Protocols
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
