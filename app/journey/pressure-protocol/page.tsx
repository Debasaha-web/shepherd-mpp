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

const BREATHING_OPTIONS = ["One deep breath", "Box breathing 4-4-4-4", "Three slow breaths", "Two in, one out"];

export default function PressureProtocolPage() {
  const { athlete, ready } = useAthleteGuard();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [pastMoment, setPastMoment] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [breathing, setBreathing] = useState("");
  const [mantra, setMantra] = useState("");
  const [anchor, setAnchor] = useState("");
  const [futureUse, setFutureUse] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  if (!ready || !athlete) return <Loading />;

  const protocolValid = Boolean(breathing && mantra.trim() && anchor.trim());

  async function goToReveal() {
    if (saved) {
      setStep(5);
      return;
    }
    setSaving(true);
    setSaveError("");
    const ok = await saveResponse(11, "pressure-protocol", {
      past_moment: pastMoment.trim(),
      analysis: analysis.trim(),
      breathing,
      mantra: mantra.trim(),
      anchor: anchor.trim(),
      future_use: futureUse.trim(),
    });
    setSaving(false);
    if (!ok) {
      setSaveError(SAVE_ERROR);
      return;
    }
    setSaved(true);
    setStep(5);
  }

  const notesText = `MY PRESSURE PROTOCOL\n\n1. BREATHE: ${breathing}\n2. SAY: "${mantra.trim()}"\n3. ANCHOR: ${anchor.trim()}\n\n— Shepherd Coach Network`;

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
        eyebrow="Protocol 11 · Pressure Protocol"
        step={step}
        total={TOTAL}
        backToJourney={step === 1}
        onBack={() => setStep((s) => Math.max(1, s - 1))}
      />

      {/* STEP 1 — Recall the moment */}
      {step === 1 && (
        <Section
          title="Recall the moment."
          hint="Describe one past high-pressure moment. What triggered it? How did it feel physically and mentally? How did you respond?"
        >
          <Label>The moment</Label>
          <Textarea
            value={pastMoment}
            onChange={setPastMoment}
            placeholder="It was the moment when…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={() => setStep(2)}
            disabled={!pastMoment.trim()}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 2 — Analyze it */}
      {step === 2 && (
        <Section title="Analyze it." hint="Reflect honestly on what happened and what you noticed about yourself.">
          <Label>Your analysis</Label>
          <Textarea
            value={analysis}
            onChange={setAnalysis}
            placeholder="Looking back, I noticed…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={() => setStep(3)}
            disabled={!analysis.trim()}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 3 — Design your protocol */}
      {step === 3 && (
        <Section title="Design your protocol." hint="Build the three pieces you'll use when pressure hits.">
          <div className="flex flex-col gap-5">
            <div>
              <Label>Breathing strategy</Label>
              <div className="flex flex-col gap-2.5">
                {BREATHING_OPTIONS.map((opt) => (
                  <Chip key={opt} label={opt} selected={breathing === opt} onClick={() => setBreathing(opt)} />
                ))}
              </div>
            </div>
            <div>
              <Label>Self-talk mantra</Label>
              <input
                className="input-ink w-full rounded-xl px-4 py-3.5 text-[15px]"
                placeholder="I'm built for this."
                value={mantra}
                onChange={(e) => setMantra(e.target.value)}
              />
            </div>
            <div>
              <Label>Focus anchor</Label>
              <input
                className="input-ink w-full rounded-xl px-4 py-3.5 text-[15px]"
                placeholder="The ball, your breath, the next rep…"
                value={anchor}
                onChange={(e) => setAnchor(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={() => setStep(4)}
            disabled={!protocolValid}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 4 — Use it */}
      {step === 4 && (
        <Section
          title="Use it."
          hint="Read your protocol aloud. How do you see yourself using it in a future pressure moment?"
        >
          <Label>Using it</Label>
          <Textarea
            value={futureUse}
            onChange={setFutureUse}
            placeholder="Next time pressure hits, I'll…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={goToReveal}
            disabled={!futureUse.trim() || saving}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            {saving ? "Saving…" : "Reveal my protocol →"}
          </button>
          {saveError && <SaveError message={saveError} />}
        </Section>
      )}

      {/* STEP 5 — Bold dramatic display */}
      {step === 5 && (
        <section className="pop-in mt-2 flex flex-col flex-1">
          <p className="eyebrow mb-4" style={{ textAlign: "center" }}>
            Your Pressure Protocol
          </p>
          <div className="mb-5" style={{ textAlign: "center" }}>
            <Scripture
              verse={SCRIPTURE["pressure-protocol"].verse}
              reference={SCRIPTURE["pressure-protocol"].reference}
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
            <Piece label="Breathe" text={breathing} />
            <Divider />
            <div className="flex flex-col items-center">
              <PieceLabel label="Say" />
              <p
                className="font-display"
                style={{ fontSize: 30, lineHeight: 1.05, color: "var(--gold)", marginTop: 8, textTransform: "uppercase" }}
              >
                &ldquo;{mantra.trim()}&rdquo;
              </p>
            </div>
            <Divider />
            <Piece label="Anchor" text={anchor.trim()} />
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

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`chip ${selected ? "selected" : ""} w-full px-4 py-3.5`} style={{ fontSize: 15 }}>
      {label}
    </button>
  );
}

function PieceLabel({ label }: { label: string }) {
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
      {label}
    </span>
  );
}

function Piece({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex flex-col items-center">
      <PieceLabel label={label} />
      <p
        className="font-display"
        style={{ fontSize: 24, lineHeight: 1.1, color: "var(--cream)", marginTop: 8, textTransform: "uppercase" }}
      >
        {text}
      </p>
    </div>
  );
}

function Divider() {
  return <div style={{ width: 30, height: 2, background: "var(--border)", margin: "20px 0" }} />;
}
