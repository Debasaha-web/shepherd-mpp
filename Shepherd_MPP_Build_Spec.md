# Shepherd MPP — Build Spec: 8 New Protocols

**Repo:** `~/shepherd-mpp` · **Deploys to:** shepherd-mpp.vercel.app
**Scope:** Add 8 protocols (6–13) to the existing 5. Do not modify protocols 1–5.
**Source:** Matt Binkerd email, Jul 14 2026 + Mental Edge MindSprint forms

---

## ⚠️ Before you start

1. **Repo ownership** — `shepherd-mpp` still points at `Debasaha-web` (DB's personal GitHub), not `aea-institute`. Build and commit locally; confirm the transfer before pushing.
2. **Scripture anchors** — all 8 need a verse. Matt owns these. Build with placeholders; drop in verses when he supplies them.
3. **Numbering** — existing protocols keep their current numbers. `saveResponse()` uses the protocol number as its key, so renumbering would orphan saved athlete data. New protocols append as 6–13.

---

## Registry additions

Add to the `PROTOCOLS` array in `lib/protocols.ts`, after protocol 5.

```ts
{
  number: 6,
  slug: "what-i-need-what-i-give",
  route: "/journey/what-i-need-what-i-give",
  title: "What I Need, What I Give",
  subtitle: "The exchange you make with your team.",
  output: "Screenshot to keep",
  accent: "cream",
},
{
  number: 7,
  slug: "accountability-map",
  route: "/journey/accountability-map",
  title: "The Accountability Map",
  subtitle: "The circle that keeps you honest.",
  output: "Screenshot to keep",
  accent: "lime",
},
{
  number: 8,
  slug: "scouting-report",
  route: "/journey/scouting-report",
  title: "Opponent Scouting Report",
  subtitle: "What you want your rival to say about you.",
  output: "Screenshot to keep",
  accent: "blue",
},
{
  number: 9,
  slug: "grit-mantra",
  route: "/journey/grit-mantra",
  title: "Grit Mantra Creation",
  subtitle: "Seven words that fuel the fight.",
  output: "Save to Notes",
  accent: "orange",
},
{
  number: 10,
  slug: "pregame-routine",
  route: "/journey/pregame-routine",
  title: "Pre-Practice & Game Routine",
  subtitle: "Win the warmup. Own the game.",
  output: "Save to Notes",
  accent: "violet",
},
{
  number: 11,
  slug: "pressure-protocol",
  route: "/journey/pressure-protocol",
  title: "Pressure Moment Protocol",
  subtitle: "Your calm before the storm.",
  output: "Save to Notes",
  accent: "orange",
},
{
  number: 12,
  slug: "three-play-reset",
  route: "/journey/three-play-reset",
  title: "The 3-Play Reset Strategy",
  subtitle: "Three moves that get you to the next play.",
  output: "Save to Notes",
  accent: "orange",
},
{
  number: 13,
  slug: "postgame-review",
  route: "/journey/postgame-review",
  title: "Post Game Review System",
  subtitle: "Break down the game. Lock in the lesson.",
  output: "Save to Notes",
  accent: "blue",
},
```

## Scripture placeholders

Add to the `SCRIPTURE` record in `lib/protocols.ts`. **Verses TBD — Matt Binkerd to supply.**

```ts
"what-i-need-what-i-give": { verse: "[TBD]", reference: "[TBD]" },
"accountability-map": { verse: "[TBD]", reference: "[TBD]" },
"scouting-report": { verse: "[TBD]", reference: "[TBD]" },
"grit-mantra": { verse: "[TBD]", reference: "[TBD]" },
"pregame-routine": { verse: "[TBD]", reference: "[TBD]" },
"pressure-protocol": { verse: "[TBD]", reference: "[TBD]" },
"three-play-reset": { verse: "[TBD]", reference: "[TBD]" },
"postgame-review": { verse: "[TBD]", reference: "[TBD]" },
```

---

## Build conventions — follow `app/journey/reset/page.tsx` exactly

Every new page must match the existing pattern:

- `"use client"` at top
- `useAthleteGuard()` → `if (!ready || !athlete) return <Loading />;`
- `const TOTAL = <number of steps including reveal>`
- `useState(1)` for step, one state var per input
- `<StepHeader eyebrow="Protocol N · Short Name" step={step} total={TOTAL} backToJourney={step === 1} onBack={...} />`
- Each input step wrapped in `<Section title="..." hint="...">`
- Continue button: `className="btn-gold w-full rounded-xl py-4 text-sm mt-7"`, `disabled` until valid
- Final step calls `saveResponse(<number>, "<slug>", {...})` with the guard: `if (saved) return;`
- Reveal step: `<Scripture verse={SCRIPTURE.<slug>.verse} reference={SCRIPTURE.<slug>.reference} align="center" />`
- "Save to Notes" outputs get a `notesText` template + `copyToNotes()` with clipboard write and 2200ms copied state
- Close with `btn-ghost` "Back to Protocols" → `router.push("/journey")`

**Copy rules (from README — non-negotiable):**
- Never use the word "AI" — say "interactive"
- Shepherd voice: athlete-friendly, faith-integrated, motivating

**Textarea guidance:** where a step asks for paragraphs, use soft guidance of 100–300 characters, not 300–500. (Matt: too lengthy for teenagers.)

---

## Protocol 6 — What I Need, What I Give

**Slug:** `what-i-need-what-i-give` · **TOTAL = 5** (4 input + reveal)

| Step | Title | Hint | Input |
|---|---|---|---|
| 1 | What you need. | Three things you need from your team to perform at your best. | 3 short text inputs. Chip suggestions: Encouragement, Accountability, Trust, Honesty, Energy, Patience |
| 2 | What you give. | Three things you'll give your team no matter what. | 3 short text inputs. Chip suggestions: Energy, Honesty, Consistency, Effort, Support, Leadership |
| 3 | Your commitment. | One or two sentences declaring you'll be both a strong receiver and a generous giver. | Textarea |
| 4 | How it feels. | Describe what it feels like to live this exchange with your teammates. | Textarea |
| 5 | Reveal | — | Two-column card: NEED / GIVE, commitment statement below, Scripture above |

**saveResponse payload:** `{ needs: [string, string, string], gives: [string, string, string], commitment: string, feeling: string }`

---

## Protocol 7 — The Accountability Map

**Slug:** `accountability-map` · **TOTAL = 5**

| Step | Title | Hint | Input |
|---|---|---|---|
| 1 | Name your circle. | List 3–5 people — coaches, teammates, family, mentors — who keep you accountable. | 5 text inputs, first 3 required |
| 2 | How they hold you. | For each person, 2–3 sentences on how they support your goals and challenge you to grow. | One textarea per named person, rendered dynamically from step 1 |
| 3 | Your promise. | A short personal promise committing to accountability. | Textarea. Example shown: "I promise to show up fully and lean on my circle for strength and growth." |
| 4 | Your check-in. | How will you check in with your accountability partners regularly? | Textarea |
| 5 | Reveal | — | Named circle displayed as a list with each person's role, promise statement in display type below |

**saveResponse payload:** `{ people: string[], support: Record<string, string>, promise: string, checkin: string }`

---

## Protocol 8 — Opponent Scouting Report (on YOU)

**Slug:** `scouting-report` · **TOTAL = 5**

| Step | Title | Hint | Input |
|---|---|---|---|
| 1 | Define the report. | If your biggest rival scouted you, what would you WANT them to say about your mindset and leadership? | Textarea |
| 2 | List your traits. | 2–3 traits you want rivals to notice. | 3 short text inputs. Chip suggestions: Never quits, Leads by example, Unshakable focus, Relentless, Composed under pressure, Always prepared |
| 3 | Make it real. | 1–2 habits or actions this season that make the scouting report true. | Textarea |
| 4 | Visualize it. | Picture your rival confirming these traits. How does that feel? | Textarea |
| 5 | Reveal | — | Styled as an actual scouting report card — traits as bold display type, header "SCOUTING REPORT: [athlete first name]" |

**saveResponse payload:** `{ want_said: string, traits: [string, string, string], habits: string, visualization: string }`

---

## Protocol 9 — Grit Mantra Creation

**Slug:** `grit-mantra` · **TOTAL = 5**

| Step | Title | Hint | Input |
|---|---|---|---|
| 1 | Reflect on a challenge. | Think of a time you pushed through adversity. Describe it briefly. | Textarea |
| 2 | Write your mantra. | Seven words or fewer. Short. Sharp. Yours. | Text input with live word count. Validation: 1–7 words. Example shown: "I don't quit when it's hard." |
| 3 | Add meaning. | What does this mantra mean to you, and how does it fuel your perseverance? | Textarea |
| 4 | Say it out loud. | Say your mantra out loud five times. How did it feel? | Textarea |
| 5 | Reveal | — | Mantra in large gold display type, uppercase, same treatment as reset mantra. Copy-for-Notes button. |

**saveResponse payload:** `{ challenge: string, mantra: string, meaning: string, spoken: string }`

**Note:** mirrors the existing Reset Protocol's mantra validation pattern — reuse that word-count logic, adjusted from 3 to 7 words.

---

## Protocol 10 — Pre-Practice & Game Routine

**Slug:** `pregame-routine` · **TOTAL = 6** (5 input + reveal)

| Step | Title | Hint | Input |
|---|---|---|---|
| 1 | Your objective. | One clear, controllable objective for your next practice or game. | Text input. Example: "I will focus on quick footwork today." |
| 2 | Your approach. | How will you work on it? Be specific — which drills, which moments. | Textarea |
| 3 | Your timeline. | Your routine from wake-up to game time. | Three labelled textareas: Mental prep (visualization, self-talk) · Physical prep (nutrition, warm-up, stretches) · Emotional cues (music, rituals, huddles) |
| 4 | Why it works. | How does this routine keep you focused and ready? | Textarea |
| 5 | Walk it through. | Close your eyes and mentally walk your routine. What did it feel like? | Textarea |
| 6 | Reveal | — | Timeline rendered as a vertical sequence — objective at top, three prep blocks in order |

**saveResponse payload:** `{ objective: string, approach: string, mental_prep: string, physical_prep: string, emotional_cues: string, reflection: string, visualization: string }`

---

## Protocol 11 — Pressure Moment Protocol

**Slug:** `pressure-protocol` · **TOTAL = 5**

| Step | Title | Hint | Input |
|---|---|---|---|
| 1 | Recall the moment. | Describe one past high-pressure moment. What triggered it? How did it feel physically and mentally? How did you respond? | Textarea |
| 2 | Analyze it. | Reflect honestly on what happened and what you noticed about yourself. | Textarea |
| 3 | Design your protocol. | Build the three pieces you'll use when pressure hits. | Three inputs: Breathing strategy (chips: One deep breath, Box breathing 4-4-4-4, Three slow breaths, Two in one out) · Self-talk mantra (text) · Focus anchor (text — e.g. the ball, your breath, the next rep) |
| 4 | Use it. | Read your protocol aloud. How do you see yourself using it in a future pressure moment? | Textarea |
| 5 | Reveal | — | Three-part card like the Reset reveal — Breathing / Mantra / Anchor stacked with dividers |

**saveResponse payload:** `{ past_moment: string, analysis: string, breathing: string, mantra: string, anchor: string, future_use: string }`

---

## Protocol 12 — The 3-Play Reset Strategy

**Slug:** `three-play-reset` · **TOTAL = 4** (3 input + reveal)

| Step | Title | Hint | Input |
|---|---|---|---|
| 1 | List your three. | Three things you'll do mentally or physically after a mistake. | 3 text inputs. Chip suggestions: Deep breath, Say your mantra, Sprint to the next play, Clap it off, Reset your feet, Eyes up |
| 2 | Why it works. | How do these reset actions help you recover faster? | Textarea |
| 3 | See it. | Visualize yourself in a game mistake moment. What do you see and feel as you reset? | Textarea |
| 4 | Reveal | — | Three actions numbered 1-2-3 in display type. Copy-for-Notes. |

**saveResponse payload:** `{ actions: [string, string, string], benefit: string, visualization: string }`

**⚠️ Naming note for Matt:** This sits alongside Protocol 3 (Reset Protocol). Protocol 3 *builds* a structured reset (physical + breath + mantra); Protocol 12 is open-ended reflection and reinforcement. Confirm with Matt that both are wanted and the distinction is clear to athletes — consider surfacing them adjacent in the journey list.

---

## Protocol 13 — Post Game Review System

**Slug:** `postgame-review` · **TOTAL = 6** (5 input + reveal)

| Step | Title | Hint | Input |
|---|---|---|---|
| 1 | Choose a performance. | Pick one recent game or practice — win or lose. Which one? | Text input |
| 2 | Celebrate progress. | What went well? The progress, the wins, the moments you're proud of. | Textarea |
| 3 | Lessons learned. | What did you learn? Be specific about patterns and takeaways. | Textarea |
| 4 | Action plan. | What will you do better next time? Make it clear and practical. | Textarea |
| 5 | Apply it. | After reading your answers aloud, how will you apply these lessons in your next performance? | Textarea |
| 6 | Reveal | — | Four-block review card: Performance / Went Well / Learned / Next Time |

**saveResponse payload:** `{ performance: string, went_well: string, learned: string, action_plan: string, application: string }`

**Note:** AEA's canonical version specifies athletes complete this ~4 hours after competition, so the emotional charge settles. Consider a line on the intro step: "Best done a few hours after the game — once the emotion has settled."

---

## Build order

1. `lib/protocols.ts` — registry entries + Scripture placeholders. Verify `/journey` list renders all 13.
2. **Protocol 12** (`three-play-reset`) first — simplest, 3 steps, closest to the existing reset pattern. Build it end to end, test save + reveal, confirm it appears correctly.
3. Then 6, 7, 8, 9 (4-step protocols).
4. Then 10, 11, 13 (5-step protocols).
5. Full pass: walk all 13 as a test athlete, confirm every save writes and every reveal renders.

Build one, test it, then scale — don't build all eight before testing the first.

---

## Definition of done

- [ ] All 13 protocols appear on `/journey` with correct titles, subtitles, and completion states
- [ ] Each new protocol saves to Supabase under its own number + slug
- [ ] Each reveal screen renders its Scripture block (placeholder until Matt supplies verses)
- [ ] "Save to Notes" protocols copy correctly to clipboard
- [ ] Word "AI" appears nowhere in any new copy
- [ ] Character guidance reads 100–300, not 300–500
- [ ] Tested end to end on mobile viewport (max 430px centered)

---

## Open questions

| # | Question | Owner |
|---|---|---|
| 1 | Scripture verses for all 8 new protocols | Matt |
| 2 | Reset Protocol (3) vs. 3-Play Reset (12) — confirm both wanted, and how to distinguish them for athletes | Matt |
| 3 | Sport-Specific Performance Protocols — inside Shepherd MPP, or a Shepherd re-skin of the Rehearsal Room as its own product? | Eric |
| 4 | Do any new protocols need PDF output? Currently only Protocols 1 & 2 generate PDFs. | Matt / Eric |
| 5 | `shepherd-mpp` repo transfer from `Debasaha-web` to `aea-institute` | DB / Eric |
