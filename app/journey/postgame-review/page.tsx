"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepHeader from "@/components/StepHeader";
import Scripture from "@/components/Scripture";
import { SCRIPTURE } from "@/lib/protocols";
import { Loading, Section, Label, Textarea } from "@/components/StepUI";
import { useAthleteGuard } from "@/lib/useAthleteGuard";
import { saveResponse } from "@/lib/storage";
import { downloadPostgameReviewPdf } from "@/lib/pdf";

const TOTAL = 6;

export default function PostgameReviewPage() {
  const { athlete, ready } = useAthleteGuard();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [performance, setPerformance] = useState("");
  const [wentWell, setWentWell] = useState("");
  const [learned, setLearned] = useState("");
  const [actionPlan, setActionPlan] = useState("");
  const [application, setApplication] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!ready || !athlete) return <Loading />;

  async function goToReveal() {
    setStep(6);
    if (saved) return;
    setSaving(true);
    await saveResponse(13, "postgame-review", {
      performance: performance.trim(),
      went_well: wentWell.trim(),
      learned: learned.trim(),
      action_plan: actionPlan.trim(),
      application: application.trim(),
    });
    setSaving(false);
    setSaved(true);
  }

  const notesText = `MY POST-GAME REVIEW\n\nPERFORMANCE:\n${performance.trim()}\n\nWENT WELL:\n${wentWell.trim()}\n\nLEARNED:\n${learned.trim()}\n\nNEXT TIME:\n${actionPlan.trim()}\n\n— Shepherd Coach Network`;

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
        eyebrow="Protocol 13 · Post-Game Review"
        step={step}
        total={TOTAL}
        backToJourney={step === 1}
        onBack={() => setStep((s) => Math.max(1, s - 1))}
      />

      {/* STEP 1 — Choose a performance */}
      {step === 1 && (
        <Section title="Choose a performance." hint="Pick one recent game or practice — win or lose. Which one?">
          <div
            className="mb-5"
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              background: "rgba(176,141,60,0.08)",
              border: "1px solid rgba(176,141,60,0.22)",
            }}
          >
            <p style={{ fontSize: 12.5, color: "var(--cream)", lineHeight: 1.5 }}>
              Best done a few hours after the game — once the emotion has settled.
            </p>
          </div>
          <Label>The performance</Label>
          <input
            className="input-ink w-full rounded-xl px-4 py-3.5 text-[16px]"
            placeholder="Last Friday's game vs. Central…"
            value={performance}
            onChange={(e) => setPerformance(e.target.value)}
            autoFocus
          />
          <button
            onClick={() => setStep(2)}
            disabled={!performance.trim()}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 2 — Celebrate progress */}
      {step === 2 && (
        <Section title="Celebrate progress." hint="What went well? The progress, the wins, the moments you're proud of.">
          <Label>What went well</Label>
          <Textarea
            value={wentWell}
            onChange={setWentWell}
            placeholder="I was proud of…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={() => setStep(3)}
            disabled={!wentWell.trim()}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 3 — Lessons learned */}
      {step === 3 && (
        <Section title="Lessons learned." hint="What did you learn? Be specific about patterns and takeaways.">
          <Label>What you learned</Label>
          <Textarea
            value={learned}
            onChange={setLearned}
            placeholder="I noticed a pattern where…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={() => setStep(4)}
            disabled={!learned.trim()}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 4 — Action plan */}
      {step === 4 && (
        <Section title="Action plan." hint="What will you do better next time? Make it clear and practical.">
          <Label>Your action plan</Label>
          <Textarea
            value={actionPlan}
            onChange={setActionPlan}
            placeholder="Next time I'll…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={() => setStep(5)}
            disabled={!actionPlan.trim()}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 5 — Apply it */}
      {step === 5 && (
        <Section
          title="Apply it."
          hint="After reading your answers aloud, how will you apply these lessons in your next performance?"
        >
          <Label>Applying it</Label>
          <Textarea
            value={application}
            onChange={setApplication}
            placeholder="I'll carry this forward by…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={goToReveal}
            disabled={!application.trim()}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Reveal my review →
          </button>
        </Section>
      )}

      {/* STEP 6 — Bold dramatic display */}
      {step === 6 && (
        <section className="pop-in mt-2 flex flex-col flex-1">
          <p className="eyebrow mb-4" style={{ textAlign: "center" }}>
            Your Post-Game Review
          </p>
          <div className="mb-5" style={{ textAlign: "center" }}>
            <Scripture
              verse={SCRIPTURE["postgame-review"].verse}
              reference={SCRIPTURE["postgame-review"].reference}
              align="center"
            />
          </div>

          <div
            className="card flex flex-col"
            style={{ padding: "8px 0", background: "radial-gradient(circle at 50% 0%, #ffffff 0%, #f6f3ec 75%)" }}
          >
            <ReviewBlock label="Performance" text={performance.trim()} highlight />
            <ReviewBlock label="Went Well" text={wentWell.trim()} />
            <ReviewBlock label="Learned" text={learned.trim()} />
            <ReviewBlock label="Next Time" text={actionPlan.trim()} last />
          </div>

          <p style={{ fontSize: 13.5, color: "var(--cream)", marginTop: 22, textAlign: "center", lineHeight: 1.5 }}>
            Download your review, or copy it to your Notes app.
          </p>
          <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4, textAlign: "center" }}>
            {saving ? "Saving…" : "Saved to your profile."}
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <button
              className="btn-gold w-full rounded-xl py-4 text-sm"
              onClick={() =>
                downloadPostgameReviewPdf({
                  athleteName: athlete.full_name,
                  performance: performance.trim(),
                  wentWell: wentWell.trim(),
                  learned: learned.trim(),
                  actionPlan: actionPlan.trim(),
                })
              }
            >
              ↓ Download PDF
            </button>
            <button className="btn-ghost w-full rounded-xl py-3.5 text-sm" onClick={copyToNotes}>
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

function ReviewBlock({ label, text, highlight, last }: { label: string; text: string; highlight?: boolean; last?: boolean }) {
  return (
    <div style={{ padding: "20px 22px", borderBottom: last ? "none" : "1px solid var(--border)" }}>
      <p
        className="font-head"
        style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700, marginBottom: 8 }}
      >
        {label}
      </p>
      <p
        className={highlight ? "font-display" : undefined}
        style={
          highlight
            ? { fontSize: 19, color: "var(--cream)", lineHeight: 1.25, fontWeight: 700, textTransform: "uppercase" }
            : { fontSize: 14, color: "var(--cream)", lineHeight: 1.45, fontWeight: 500 }
        }
      >
        {text}
      </p>
    </div>
  );
}
