"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepHeader from "@/components/StepHeader";
import Scripture from "@/components/Scripture";
import { SCRIPTURE } from "@/lib/protocols";
import { Loading, Section, Label, Textarea } from "@/components/StepUI";
import { useAthleteGuard } from "@/lib/useAthleteGuard";
import { saveResponse } from "@/lib/storage";

const TOTAL = 4;

const ACTION_SUGGESTIONS = [
  "Deep breath",
  "Say your mantra",
  "Sprint to the next play",
  "Clap it off",
  "Reset your feet",
  "Eyes up",
];

export default function ThreePlayResetPage() {
  const { athlete, ready } = useAthleteGuard();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [actions, setActions] = useState<string[]>(["", "", ""]);
  const [benefit, setBenefit] = useState("");
  const [visualization, setVisualization] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!ready || !athlete) return <Loading />;

  const trimmedActions = actions.map((a) => a.trim());
  const actionsValid = trimmedActions.every(Boolean);

  function setAction(i: number, value: string) {
    setActions((prev) => prev.map((a, idx) => (idx === i ? value : a)));
  }

  function fillSuggestion(text: string) {
    // Drop the suggestion into the first empty action slot.
    const target = actions.findIndex((a) => !a.trim());
    if (target !== -1) setAction(target, text);
  }

  async function goToReveal() {
    setStep(4);
    if (saved) return;
    setSaving(true);
    await saveResponse(12, "three-play-reset", {
      actions: trimmedActions as [string, string, string],
      benefit: benefit.trim(),
      visualization: visualization.trim(),
    });
    setSaving(false);
    setSaved(true);
  }

  const notesText = `MY 3-PLAY RESET\n\n1. ${trimmedActions[0]}\n2. ${trimmedActions[1]}\n3. ${trimmedActions[2]}\n\n— Shepherd Coach Network`;

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
        eyebrow="Protocol 12 · 3-Play Reset"
        step={step}
        total={TOTAL}
        backToJourney={step === 1}
        onBack={() => setStep((s) => Math.max(1, s - 1))}
      />

      {/* STEP 1 — List your three */}
      {step === 1 && (
        <Section
          title="List your three."
          hint="Three things you'll do mentally or physically after a mistake. Tap a suggestion or write your own."
        >
          <div className="flex flex-col gap-2.5">
            {actions.map((a, i) => (
              <input
                key={i}
                className="input-ink w-full rounded-xl px-4 py-3.5 text-[15px]"
                placeholder={`Action ${i + 1}`}
                value={a}
                onChange={(e) => setAction(i, e.target.value)}
              />
            ))}
          </div>

          <div className="mt-5">
            <Label>Suggestions</Label>
            <div className="flex flex-wrap gap-2">
              {ACTION_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => fillSuggestion(s)}
                  className="chip px-3.5 py-2"
                  style={{ fontSize: 13 }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!actionsValid}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 2 — Why it works */}
      {step === 2 && (
        <Section title="Why it works." hint="How do these reset actions help you recover faster?">
          <Label>Your reasoning</Label>
          <Textarea
            value={benefit}
            onChange={setBenefit}
            placeholder="When I run these three plays, I…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={() => setStep(3)}
            disabled={!benefit.trim()}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 3 — See it */}
      {step === 3 && (
        <Section
          title="See it."
          hint="Visualize yourself in a game mistake moment. What do you see and feel as you reset?"
        >
          <Label>Your visualization</Label>
          <Textarea
            value={visualization}
            onChange={setVisualization}
            placeholder="I picture myself after the mistake, and…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={goToReveal}
            disabled={!visualization.trim()}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Reveal my reset →
          </button>
        </Section>
      )}

      {/* STEP 4 — Bold dramatic display */}
      {step === 4 && (
        <section className="pop-in mt-2 flex flex-col flex-1">
          <p className="eyebrow mb-4" style={{ textAlign: "center" }}>
            Your 3-Play Reset
          </p>
          <div className="mb-5" style={{ textAlign: "center" }}>
            <Scripture
              verse={SCRIPTURE["three-play-reset"].verse}
              reference={SCRIPTURE["three-play-reset"].reference}
              align="center"
            />
          </div>

          <div
            className="card glow-anim flex flex-col items-center justify-center text-center"
            style={{
              padding: "44px 22px",
              background: "radial-gradient(circle at 50% 0%, #ffffff 0%, #f6f3ec 70%)",
            }}
          >
            <Big n={1} text={trimmedActions[0]} />
            <Divider />
            <Big n={2} text={trimmedActions[1]} />
            <Divider />
            <Big n={3} text={trimmedActions[2]} />
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

/* ---------- local UI ---------- */

function StepNum({ n }: { n: number }) {
  return (
    <span
      className="font-head"
      style={{
        fontSize: 10,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "var(--muted)",
        fontWeight: 700,
      }}
    >
      Step {n}
    </span>
  );
}

function Big({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex flex-col items-center">
      <StepNum n={n} />
      <p
        className="font-display"
        style={{ fontSize: 26, lineHeight: 1.1, color: "var(--cream)", marginTop: 8, textTransform: "uppercase" }}
      >
        {text}
      </p>
    </div>
  );
}

function Divider() {
  return <div style={{ width: 30, height: 2, background: "var(--border)", margin: "20px 0" }} />;
}
