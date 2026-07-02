"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepHeader from "@/components/StepHeader";
import Wordmark from "@/components/Wordmark";
import Scripture from "@/components/Scripture";
import { SCRIPTURE } from "@/lib/protocols";
import { Loading, Section, Label, Textarea, NextButton } from "@/components/StepUI";
import { useAthleteGuard } from "@/lib/useAthleteGuard";
import { saveResponse } from "@/lib/storage";
import { downloadPressReleasePdf, type PressReleaseData } from "@/lib/pdf";

const TOTAL = 6;

type Win = "state" | "conference" | "";

function winText(win: Win): string {
  return win === "state" ? "Wins the State Championship" : "Wins the Conference Championship";
}

// Assemble all inputs into a real-sounding 3-paragraph recap.
function buildPressRelease(d: {
  team: string;
  win: Win;
  turningPoint: string;
  differently: string;
}): { headline: string; dateline: string; paragraphs: string[] } {
  const team = d.team || "Our Team";
  const wt = winText(d.win).toLowerCase();
  const season = (() => {
    try {
      return `${new Date().getFullYear()} Season`;
    } catch {
      return "This Season";
    }
  })();

  const headline = `${team} ${winText(d.win)} — ${team} Makes History`;
  const dateline = season.toUpperCase();

  const p1 =
    `In a season that will be remembered for years, ${team} ${wt}. ` +
    `What began as a shared belief became reality, and ${team} now stands as champions.`;

  const p2 = d.turningPoint.trim()
    ? `The turning point defined everything. ${d.turningPoint.trim()}`
    : `The turning point defined everything, and from that moment on, this team never looked back.`;

  const p3 = d.differently.trim()
    ? `What set this group apart was clear all year. ${d.differently.trim()} It is the standard ${team} will carry forward.`
    : `What set this group apart was a standard they refused to lower — a standard ${team} will carry forward.`;

  return { headline, dateline, paragraphs: [p1, p2, p3] };
}

export default function PressReleasePage() {
  const { athlete, ready } = useAthleteGuard();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [win, setWin] = useState<Win>("");
  const [team, setTeam] = useState("");
  const [athleteQuote, setAthleteQuote] = useState("");
  const [coachQuote, setCoachQuote] = useState("");
  const [turningPoint, setTurningPoint] = useState("");
  const [differently, setDifferently] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!ready || !athlete) return <Loading />;

  // Prefill team from their profile once
  const teamValue = team || athlete.team_name || "";

  const assembled = buildPressRelease({ team: teamValue, win, turningPoint, differently });

  const pdfData: PressReleaseData = {
    athleteName: athlete.full_name,
    teamName: teamValue || "Our Team",
    schoolName: teamValue || "Our School",
    headline: assembled.headline,
    dateline: assembled.dateline,
    paragraphs: assembled.paragraphs,
    athleteQuote: athleteQuote.trim(),
    coachQuote: coachQuote.trim(),
  };

  async function goToReveal() {
    setStep(6);
    if (saved) return;
    setSaving(true);
    await saveResponse(2, "press-release", {
      win_choice: win,
      team_name: teamValue,
      athlete_quote: athleteQuote.trim(),
      coach_quote: coachQuote.trim(),
      turning_point: turningPoint.trim(),
      what_we_did_differently: differently.trim(),
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <main className="screen flex flex-col min-h-screen pb-10">
      <StepHeader
        eyebrow="Protocol 2 · Press Release"
        step={step}
        total={TOTAL}
        backToJourney={step === 1}
        onBack={() => setStep((s) => Math.max(1, s - 1))}
      />

      {/* STEP 1 — Choose the win + team name */}
      {step === 1 && (
        <Section
          title="Choose the win."
          hint="Picture the headline you want to read at the end of the season. Which one is it?"
        >
          <div className="flex flex-col gap-3">
            <WinChip
              label="We Win State"
              sub="State Champions"
              selected={win === "state"}
              onClick={() => setWin("state")}
            />
            <WinChip
              label="We Win the Conference Championship"
              sub="Conference Champions"
              selected={win === "conference"}
              onClick={() => setWin("conference")}
            />
          </div>

          <div className="mt-6">
            <Label>Your team name (as it should appear in the headline)</Label>
            <input
              className="input-ink w-full rounded-xl px-4 py-3.5 text-[15px]"
              placeholder="e.g. Lincoln Varsity"
              value={teamValue}
              onChange={(e) => setTeam(e.target.value)}
            />
          </div>

          <NextButton disabled={!win || !teamValue.trim()} onClick={() => setStep(2)} />
        </Section>
      )}

      {/* STEP 2 — Athlete quote */}
      {step === 2 && (
        <Section
          title="Write your quote."
          hint="You just won. A reporter asks how it feels. What do you say?"
        >
          <Textarea
            value={athleteQuote}
            onChange={setAthleteQuote}
            placeholder="“We believed in this from day one…”"
          />
          <NextButton disabled={athleteQuote.trim().length < 8} onClick={() => setStep(3)} />
        </Section>
      )}

      {/* STEP 3 — Coach quote */}
      {step === 3 && (
        <Section
          title="Write your coach's quote."
          hint="What does your coach say about this team after the win?"
        >
          <Textarea
            value={coachQuote}
            onChange={setCoachQuote}
            placeholder="“This group earned everything…”"
          />
          <NextButton disabled={coachQuote.trim().length < 8} onClick={() => setStep(4)} />
        </Section>
      )}

      {/* STEP 4 — Turning point */}
      {step === 4 && (
        <Section
          title="Describe the turning point in the season."
          hint="2–3 sentences. The moment everything changed."
        >
          <Textarea value={turningPoint} onChange={setTurningPoint} placeholder="Down by ten at halftime, we…" />
          <NextButton disabled={turningPoint.trim().length < 10} onClick={() => setStep(5)} />
        </Section>
      )}

      {/* STEP 5 — What we did differently */}
      {step === 5 && (
        <Section
          title="What did your team do differently this year?"
          hint="2–3 sentences. What set this team apart from every other?"
        >
          <Textarea value={differently} onChange={setDifferently} placeholder="We held each other to a higher standard…" />
          <NextButton label="Build the press release →" disabled={differently.trim().length < 10} onClick={goToReveal} />
        </Section>
      )}

      {/* STEP 6 — Reveal + download */}
      {step === 6 && (
        <section className="pop-in mt-2 flex flex-col flex-1">
          <p className="eyebrow mb-3">Your Press Release</p>
          <div className="mb-5">
            <Scripture verse={SCRIPTURE["press-release"].verse} reference={SCRIPTURE["press-release"].reference} />
          </div>
          <PressReleaseView data={pdfData} />

          <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 14, textAlign: "center" }}>
            {saving ? "Saving…" : "Saved. Download it to your phone to keep."}
          </p>

          <div className="mt-3 flex flex-col gap-3">
            <button className="btn-gold w-full rounded-xl py-4 text-sm" onClick={() => downloadPressReleasePdf(pdfData)}>
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

/* ---------- local UI ---------- */

function WinChip({
  label,
  sub,
  selected,
  onClick,
}: {
  label: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className={`chip-xl ${selected ? "selected" : ""} w-full px-5 py-5`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-head" style={{ fontSize: 17, fontWeight: 800, color: "var(--cream)" }}>
            {label}
          </p>
          <p
            className="font-head"
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: selected ? "var(--gold)" : "var(--muted)",
              marginTop: 4,
              fontWeight: 700,
            }}
          >
            {sub}
          </p>
        </div>
        <span style={{ fontSize: 20, color: selected ? "var(--gold)" : "var(--muted)" }}>
          {selected ? "●" : "○"}
        </span>
      </div>
    </button>
  );
}

function PressReleaseView({ data }: { data: PressReleaseData }) {
  return (
    <article className="card p-6" style={{ background: "linear-gradient(180deg, #ffffff 0%, #f6f3ec 100%)" }}>
      <p className="eyebrow" style={{ fontSize: 9.5 }}>
        Shepherd Coach Network · For Immediate Release
      </p>
      <h2 className="font-display" style={{ fontSize: 22, lineHeight: 1.15, color: "var(--cream)", marginTop: 12 }}>
        {data.headline}
      </h2>
      <p
        className="font-head"
        style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--gold)", marginTop: 12 }}
      >
        {data.dateline}
      </p>
      <div style={{ height: 1, background: "var(--border)", margin: "14px 0" }} />

      <p style={paraStyle}>{data.paragraphs[0]}</p>

      {data.athleteQuote && <PullQuote quote={data.athleteQuote} attr={data.athleteName} />}

      <p style={paraStyle}>{data.paragraphs[1]}</p>

      {data.coachQuote && <PullQuote quote={data.coachQuote} attr={`Head Coach, ${data.teamName}`} />}

      <p style={paraStyle}>{data.paragraphs[2]}</p>

      <p style={{ textAlign: "center", color: "var(--muted)", letterSpacing: "0.3em", marginTop: 16, fontSize: 12 }}>
        # # #
      </p>

      <div className="mt-5">
        <Wordmark size={60} />
      </div>
    </article>
  );
}

const paraStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  color: "var(--cream)",
  marginBottom: 12,
};

function PullQuote({ quote, attr }: { quote: string; attr: string }) {
  return (
    <div style={{ borderLeft: "3px solid var(--gold)", paddingLeft: 14, margin: "14px 0" }}>
      <p style={{ fontSize: 15, fontStyle: "italic", lineHeight: 1.5, color: "var(--cream)" }}>
        “{quote}”
      </p>
      <p
        className="font-head"
        style={{
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginTop: 7,
          fontWeight: 700,
        }}
      >
        — {attr}
      </p>
    </div>
  );
}
