"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepHeader from "@/components/StepHeader";
import Wordmark from "@/components/Wordmark";
import Scripture from "@/components/Scripture";
import SaveError from "@/components/SaveError";
import { SCRIPTURE } from "@/lib/protocols";
import { Loading } from "@/components/StepUI";
import { useAthleteGuard } from "@/lib/useAthleteGuard";
import { saveResponse, SAVE_ERROR } from "@/lib/storage";

const TOTAL = 2;

type Category = { key: string; label: string; options: string[] };

const CATEGORIES: Category[] = [
  {
    key: "how_we_compete",
    label: "How We Compete",
    options: [
      "We play hard every minute, no matter the score",
      "We compete with class — no taunting, no excuses",
      "We set the standard for effort in our league",
      "We never give up a play, ever",
      "We make the other team earn everything",
    ],
  },
  {
    key: "how_we_treat_each_other",
    label: "How We Treat Each Other",
    options: [
      "We hold each other accountable with respect",
      "We celebrate each other's wins like they're our own",
      "We never talk negatively about a teammate",
      "We communicate clearly and with encouragement",
      "We have each other's backs on and off the field",
    ],
  },
  {
    key: "what_we_stand_for",
    label: "What We Stand For",
    options: [
      "We represent our school with pride at all times",
      "We are known for our toughness and resilience",
      "We set the example for younger athletes watching us",
      "We leave this program better than we found it",
      "We are defined by how we respond to adversity",
    ],
  },
];

export default function TeamStandardsPage() {
  const { athlete, ready } = useAthleteGuard();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  if (!ready || !athlete) return <Loading />;

  const allPicked = CATEGORIES.every((c) => picks[c.key]);
  const chosen = CATEGORIES.map((c) => ({ category: c.label, standard: picks[c.key] }));

  async function goToReveal() {
    if (saved) {
      setStep(2);
      return;
    }
    setSaving(true);
    setSaveError("");
    const ok = await saveResponse(5, "team-standards", {
      team_name: athlete!.team_name || null,
      team_standards: chosen,
    });
    setSaving(false);
    if (!ok) {
      setSaveError(SAVE_ERROR);
      return;
    }
    setSaved(true);
    setStep(2);
  }

  return (
    <main className="screen flex flex-col min-h-screen pb-10">
      <StepHeader
        eyebrow="Protocol 5 · Team Standards"
        step={step}
        total={TOTAL}
        backToJourney={step === 1}
        onBack={() => setStep(1)}
      />

      {/* STEP 1 — Pick three */}
      {step === 1 && (
        <section className="screen mt-2 flex flex-col flex-1">
          <h1 className="font-display" style={{ fontSize: 25, fontWeight: 700, lineHeight: 1.2, color: "var(--cream)" }}>
            Your Team Standards.
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 10, lineHeight: 1.5 }}>
            Three standards your team will always exemplify this season. Pick one from each.
          </p>

          <div className="mt-7 flex flex-col gap-5">
            {CATEGORIES.map((c, i) => (
              <div key={c.key}>
                <label
                  className="font-head flex items-center gap-2"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: picks[c.key] ? "var(--cream)" : "var(--muted)",
                    marginBottom: 8,
                    fontWeight: 700,
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 5,
                      background: picks[c.key] ? "var(--gold)" : "var(--navy-card)",
                      color: picks[c.key] ? "#ffffff" : "var(--muted)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                    }}
                  >
                    {i + 1}
                  </span>
                  {c.label}
                </label>
                <select
                  className="select-ink w-full rounded-xl px-4 py-3.5 text-[15px]"
                  value={picks[c.key] || ""}
                  onChange={(e) => setPicks((p) => ({ ...p, [c.key]: e.target.value }))}
                >
                  <option value="" disabled>
                    Choose this standard…
                  </option>
                  {c.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button
            onClick={goToReveal}
            disabled={!allPicked || saving}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-8"
          >
            {saving ? "Saving…" : "Set our standards →"}
          </button>
          {saveError && <SaveError message={saveError} />}
        </section>
      )}

      {/* STEP 2 — Bold dramatic display + screenshot prompt */}
      {step === 2 && (
        <section className="pop-in mt-2 flex flex-col flex-1">
          <p className="eyebrow mb-3" style={{ textAlign: "center" }}>
            {athlete.team_name ? athlete.team_name : "Our Team"}
          </p>
          <h2
            className="font-display"
            style={{ fontSize: 25, textAlign: "center", color: "var(--cream)", marginBottom: 20, lineHeight: 1.1 }}
          >
            OUR TEAM STANDARDS
            <br />
            THIS SEASON
          </h2>
          <div className="mb-5" style={{ textAlign: "center" }}>
            <Scripture verse={SCRIPTURE["team-standards"].verse} reference={SCRIPTURE["team-standards"].reference} align="center" />
          </div>

          <div
            className="card flex flex-col"
            style={{ padding: "8px 0", background: "radial-gradient(circle at 50% 0%, #ffffff 0%, #f6f3ec 75%)" }}
          >
            {chosen.map((row, i) => (
              <div key={i} style={{ padding: "22px 22px", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                <div className="flex items-center gap-3 mb-2.5">
                  <span
                    className="font-display"
                    style={{ fontSize: 34, color: "var(--gold)", lineHeight: 1 }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="font-head"
                    style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}
                  >
                    {row.category}
                  </span>
                </div>
                <p
                  className="font-display"
                  style={{ fontSize: 19, color: "var(--cream)", lineHeight: 1.3, fontWeight: 700 }}
                >
                  {row.standard}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <Wordmark size={56} />
          </div>

          <p style={{ fontSize: 13.5, color: "var(--cream)", marginTop: 20, textAlign: "center", lineHeight: 1.5 }}>
            Screenshot this and keep it with your team.
          </p>
          <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4, textAlign: "center" }}>
            {saving ? "Saving…" : "Saved to your profile."}
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <button className="btn-ghost w-full rounded-xl py-3.5 text-sm" onClick={() => router.push("/journey")}>
              Back to Protocols
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
