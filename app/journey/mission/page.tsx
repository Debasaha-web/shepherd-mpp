"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepHeader from "@/components/StepHeader";
import Wordmark from "@/components/Wordmark";
import Scripture from "@/components/Scripture";
import { useAthleteGuard } from "@/lib/useAthleteGuard";
import { saveResponse } from "@/lib/storage";
import { downloadMissionPdf } from "@/lib/pdf";
import { SCRIPTURE } from "@/lib/protocols";

const TOTAL = 4;

export default function MissionPage() {
  const { athlete, ready } = useAthleteGuard();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [para1, setPara1] = useState("");
  const [para2, setPara2] = useState("");
  const [dedicateToGod, setDedicateToGod] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!ready || !athlete) {
    return <Loading />;
  }

  const dedicateTo = relationship.trim() ? `${name.trim()} (${relationship.trim()})` : name.trim();

  async function goToReveal() {
    setStep(4);
    if (saved) return;
    setSaving(true);
    await saveResponse(1, "mission", {
      dedicate_to_name: name.trim(),
      dedicate_to_relationship: relationship.trim(),
      dedicate_to_god: dedicateToGod,
      paragraph_1: para1.trim(),
      paragraph_2: para2.trim(),
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <main className="screen flex flex-col min-h-screen pb-10">
      <StepHeader
        eyebrow="Protocol 1 · Mission"
        step={step}
        total={TOTAL}
        backToJourney={step === 1}
        onBack={() => setStep((s) => Math.max(1, s - 1))}
      />

      {/* STEP 1 — Who */}
      {step === 1 && (
        <Section
          title="Who are you dedicating this season to?"
          hint="A teammate, a grandparent, a coach, a friend, someone who didn't make the team — anyone who drives you."
        >
          <Label>Their name</Label>
          <input
            className="input-ink w-full rounded-xl px-4 py-3.5 text-[15px]"
            placeholder="e.g. Grandpa Joe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <div style={{ height: 16 }} />
          <Label>Their relationship to you</Label>
          <input
            className="input-ink w-full rounded-xl px-4 py-3.5 text-[15px]"
            placeholder="e.g. my grandfather"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setDedicateToGod((v) => !v)}
            className={`chip ${dedicateToGod ? "selected" : ""} w-full flex items-center gap-3 px-4 py-3.5 mt-4`}
            style={{ fontSize: 14.5 }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                flexShrink: 0,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: dedicateToGod ? "var(--gold)" : "transparent",
                border: `1.5px solid ${dedicateToGod ? "var(--gold)" : "var(--border)"}`,
                color: "#0a1322",
                fontSize: 14,
              }}
            >
              {dedicateToGod ? "✓" : ""}
            </span>
            I am also dedicating this season to God
          </button>

          <NextButton disabled={!name.trim()} onClick={() => setStep(2)} />
        </Section>
      )}

      {/* STEP 2 — Paragraph 1 */}
      {step === 2 && (
        <Section
          title={`What does ${name.trim() || "this person"} mean to you?`}
          hint="One short paragraph. Speak from the heart — this is your why."
        >
          <Textarea value={para1} onChange={setPara1} placeholder="They have always..." />
          <NextButton disabled={para1.trim().length < 10} onClick={() => setStep(3)} />
        </Section>
      )}

      {/* STEP 3 — Paragraph 2 */}
      {step === 3 && (
        <Section
          title="Why will you work hard in their honor next season?"
          hint="One more paragraph. What will you do, and what will it mean to them?"
        >
          <Textarea value={para2} onChange={setPara2} placeholder="Next season I will..." />
          <NextButton label="Reveal my statement →" disabled={para2.trim().length < 10} onClick={goToReveal} />
        </Section>
      )}

      {/* STEP 4 — Reveal + download */}
      {step === 4 && (
        <section className="pop-in mt-2 flex flex-col flex-1">
          <p className="eyebrow mb-3">Your Mission Statement</p>
          <div className="mb-5">
            <Scripture verse={SCRIPTURE.mission.verse} reference={SCRIPTURE.mission.reference} />
          </div>

          <div
            className="card p-6"
            style={{ background: "linear-gradient(180deg, #0f1e30 0%, #0a1322 100%)" }}
          >
            <p style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
              {athlete.full_name}
            </p>
            <p className="font-display" style={{ fontSize: 23, lineHeight: 1.2, color: "var(--cream)" }}>
              I dedicate this season to{" "}
              <span style={{ color: "var(--gold)" }}>{name.trim()}</span>.
            </p>
            {relationship.trim() && (
              <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 6 }}>{relationship.trim()}</p>
            )}
            <div style={{ height: 1, background: "var(--border)", margin: "18px 0" }} />
            <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--cream)" }}>{para1.trim()}</p>
            <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--cream)", marginTop: 14 }}>{para2.trim()}</p>
            {dedicateToGod && (
              <p
                className="font-display"
                style={{ fontSize: 15.5, lineHeight: 1.5, color: "var(--gold)", marginTop: 16 }}
              >
                Above all, I play for God&rsquo;s glory.
              </p>
            )}
            <div className="mt-6">
              <Wordmark size={15} />
            </div>
          </div>

          <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 14, textAlign: "center" }}>
            {saving ? "Saving…" : "Saved. Download your PDF to keep it forever."}
          </p>

          <div className="mt-3 flex flex-col gap-3">
            <button
              className="btn-gold w-full rounded-xl py-4 text-sm"
              onClick={() =>
                downloadMissionPdf({
                  athleteName: athlete.full_name,
                  dedicateTo,
                  paragraph1: para1.trim(),
                  paragraph2: para2.trim(),
                  dedicateToGod,
                })
              }
            >
              ↓ Download PDF
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

/* ---------- small local UI helpers ---------- */

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <span style={{ color: "var(--muted)", fontSize: 14 }}>Loading…</span>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="screen mt-2 flex flex-col flex-1">
      <h1 className="font-head" style={{ fontSize: 23, fontWeight: 800, lineHeight: 1.2, color: "var(--cream)" }}>
        {title}
      </h1>
      {hint && <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 10, lineHeight: 1.5 }}>{hint}</p>}
      <div className="mt-7">{children}</div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="font-head"
      style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 7, fontWeight: 700 }}
    >
      {children}
    </label>
  );
}

function Textarea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <textarea
      className="input-ink w-full rounded-xl px-4 py-3.5 text-[15px]"
      style={{ minHeight: 150, resize: "none", lineHeight: 1.55 }}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoFocus
    />
  );
}

function NextButton({ onClick, disabled, label }: { onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <button onClick={onClick} disabled={disabled} className="btn-gold w-full rounded-xl py-4 text-sm mt-7">
      {label || "Continue →"}
    </button>
  );
}
