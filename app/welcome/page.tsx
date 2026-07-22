"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/StepUI";
import { useAthleteGuard } from "@/lib/useAthleteGuard";

// Standalone orientation — NOT a protocol. No save, no saveResponse, no
// Supabase write. Guarded client-side via useAthleteGuard (same pattern as
// every protocol page): no athlete on this device → bounce to the landing.
//
// Body copy is reproduced verbatim from david-factor.md (repo root), beginning
// at the source's second line ("Introduction"); the source's first line is the
// title, rendered as HEADING below. Do not reword, condense, or re-punctuate.
// The four "* " lines are the source's bulleted list.
const HEADING = "The David vs Goliath Shepherd Mental Edge Factor!";

const BODY: string[] = [
  "Introduction",
  "Long before the story of David and Goliath, there is an even more important narrative unfolding in the life of David- the story of David in the wilderness.",
  "Years before David ever stepped into the spotlight, he was faithful in obscurity, training his mind, body, and spirit for the battles he would later face. While tending his father's sheep, far from the crowd and far from recognition, David was doing the unseen work. Fighting lions and bears that no one witnessed (1 Samuel 17:34-36). Developing unseen habits, disciplines, and a mindset that would later separate him from everyone else in that valley. His preparation was quiet, unglamorous, but deeply intentional.",
  "And when the moment came, he was ready.",
  "In the heat of battle, the army of Israel looked at the size of the opposition and panicked under pressure. David looked at the same giant and stepped forward. The difference wasn't size, strength, or skill. It was a mindset. Despite the paralyzing pressure of the opponent in front of him, David stayed laser focused on the size of “his God”. That focus gave him a deep, inner confidence and composure to face “his giant” and come out victorious on the other side.",
  "He didn't show up with armor or a sword.  His weapon was a stone. Small. Simple. But in the hands of someone who had done the unseen work, it was enough to give him the edge.",
  "That is The DAVID Factor.",
  "The David Factor-the spiritual and mental edge-isn't built in the spotlight. It's built in the small, daily behaviors that most athletes overlook.  Small habits. Small mindset shifts. Small, intentional choices made consistently over time. That's what separates the athlete who crumbles under pressure from the one who rises to meet it.",
  "As a coach, you see it every day: pressure, distractions, mistakes, setbacks, and emotions are part of the game. The athletes who perform consistently aren't the ones who avoid these challenges. They're the ones who learn how to handle them. And that starts with coaching.",
  "Mental Performance isn't about creating perfect athletes or eliminating nerves. It's about teaching the small, practical skills that help athletes reset faster, stay focused, build confidence, and respond better when things don't go their way. Just like strength, speed, or technique, mental skills improve with practice. Confidence can be trained. Focus can be trained. Responses to pressure and mistakes can be trained when coaches intentionally teach them.",
  "As Shepherd Coaches, we believe the mental game goes far deeper than performance. Scripture is filled with principles of mindset, perseverance, self-talk, courage, joy, and self-control. These are the very qualities that defined David and the very qualities that define mentally strong athletes today.",
  "When you commit to teaching these skills, you will help your athletes learn how to:",
  "* Compete with confidence, composure, and consistency",
  "* Handle pressure and mistakes more effectively",
  "* Bounce back when things get hard",
  "* Play with greater freedom and enjoyment",
  "The best part? These skills don't just impact performance. They carry over into school, relationships, and life. And for the Christian athlete, every skill points back to the One who made them, equipped them, and called them to compete.",
  "Wherever you are in your coaching journey, God has placed you at this school for a reason. To care for the flock He has entrusted to you.",
  "It's time to help your athletes unlock their spiritual growth and their mental edge.",
  "It's time to face their giants.",
  "It's time to develop the DAVID Factor!",
];

type Block = { type: "p"; text: string } | { type: "ul"; items: string[] };

export default function WelcomePage() {
  const { athlete, ready } = useAthleteGuard();
  const router = useRouter();

  if (!ready || !athlete) return <Loading />;

  const label = BODY[0]; // "Introduction"

  // Group the remaining lines into paragraphs and one bulleted list, so the
  // source's "* " lines render as a real <ul> exactly where they appear.
  const blocks: Block[] = [];
  for (const line of BODY.slice(1)) {
    if (line.startsWith("* ")) {
      const item = line.slice(2);
      const last = blocks[blocks.length - 1];
      if (last && last.type === "ul") last.items.push(item);
      else blocks.push({ type: "ul", items: [item] });
    } else {
      blocks.push({ type: "p", text: line });
    }
  }

  return (
    <main className="screen flex flex-col min-h-screen pb-12">
      {/* Back to the protocol list — this is a sub-page reached from /journey */}
      <div className="pt-7 pb-2 flex items-center justify-between">
        <button
          onClick={() => router.push("/journey")}
          className="font-head"
          style={{
            background: "none",
            border: "none",
            color: "var(--muted)",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.04em",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
        <span className="eyebrow">Start Here</span>
      </div>

      <section className="mt-6">
        <p className="eyebrow mb-3">{label}</p>
        <h1
          className="font-display"
          style={{ fontSize: 29, lineHeight: 1.12, color: "var(--cream)" }}
        >
          {HEADING}
        </h1>
      </section>

      <section className="mt-6 flex flex-col gap-4">
        {blocks.map((b, i) =>
          b.type === "p" ? (
            <p key={i} style={{ fontSize: 15, lineHeight: 1.65, color: "var(--muted)" }}>
              {b.text}
            </p>
          ) : (
            <ul
              key={i}
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 11,
                margin: "2px 0",
              }}
            >
              {b.items.map((item, j) => (
                <li key={j} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span
                    aria-hidden="true"
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "var(--gold)",
                      flexShrink: 0,
                      marginTop: 8,
                    }}
                  />
                  <span style={{ fontSize: 15, lineHeight: 1.5, color: "var(--cream)" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          )
        )}
      </section>

      <div className="mt-10">
        <Link href="/journey" style={{ textDecoration: "none" }}>
          <button className="btn-gold w-full rounded-xl py-4 text-sm">
            Start the Protocols →
          </button>
        </Link>
      </div>
    </main>
  );
}
