# Shepherd MPP

**Shepherd Coach Network · Mental Performance Protocols.** Five guided,
athlete-facing protocols with a Scripture anchor on each and a faith dimension
in Protocol 1. Mobile-first (430px centered), navy + gold theme.

A faith-integrated Mental Performance Protocol app — five protocols deployed as
a standalone product (its own repo, Vercel project, and Supabase database).
Built with Next.js 14 (App Router, TypeScript), Tailwind, Supabase, and
`@react-pdf/renderer`.

## The five protocols

| # | Protocol | Route | Output | Scripture |
|---|----------|-------|--------|-----------|
| 1 | Aspirational Mission Statement | `/journey/mission` | Stored + PDF | Proverbs 16:3 |
| 2 | Mythical Press Release | `/journey/press-release` | Stored + PDF | Philippians 4:13 |
| 3 | Reset Protocol | `/journey/reset` | Copy to Notes | Isaiah 40:31 |
| 4 | Four Non-Negotiables | `/journey/non-negotiables` | Screenshot | Colossians 3:23 |
| 5 | Team Standards | `/journey/team-standards` | Screenshot | Proverbs 27:17 |

Landing (`/`) collects email + name (no passwords). The journey page
(`/journey`) lists all five with live completion status. Athlete session is kept
in `localStorage` (`shepherd_athlete` / `shepherd_completed`); responses persist
to Supabase.

**Protocol 1 faith dimension:** an optional toggle — *"I am also dedicating this
season to God"* — appends *"Above all, I play for God's glory."* to the mission
statement on screen and in the PDF.

## Local setup

```bash
npm install
cp .env.local.example .env.local   # fill in your Supabase keys
npm run dev                         # http://localhost:3000
```

**No Supabase yet?** The app still runs locally — the API routes use a
strictly dev-only fallback (returns a stable in-memory athlete and accepts
saves) so every flow is clickable before you wire the database. This fallback
**never activates in production**; once env vars are present it always uses
real Supabase.

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=https://eudlchetivtqemnhixgf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Supabase

1. Open the project `eudlchetivtqemnhixgf` at supabase.com.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor
   (Project → SQL → New query), one block at a time. It creates `athletes` and
   `mpp_responses` with RLS enabled and service-role-only policies.
3. Copy your keys into `.env.local`.

All reads/writes go through the server using the service-role key, so RLS has
no public policies (the anon key cannot touch athlete data directly).

## Deploy (Vercel)

1. Push to GitHub: `Debasaha-web/shepherd-mpp` (private).
2. Import the repo into Vercel (AEA Team account).
3. Add the four env vars above in Project → Settings → Environment Variables.
4. Deploy. The build runs `next build` with no extra config.

## Design system

Navy background (`#0a1322`), navy cards (`#0f1e30`), gold accent (`#c8a04a`,
hover `#b8902f`), cream text (`#e8e4da`), muted (`#8a9aaa`), green for the
completed state (`#5a9a4a`). Body font is the system UI stack; display headings
are Georgia serif italic. No Google Fonts.

## Copy rules

- Never use the word "AI" — say "interactive".
- Shepherd voice: "Our world is broken. Jesus cares. Be a Shepherd."
- Athlete-friendly, faith-integrated, motivating tone.

## Structure

```
app/
  page.tsx                       landing (WelcomeForm)
  journey/page.tsx               protocol selection
  journey/<slug>/page.tsx        each protocol flow (+ Scripture on reveal)
  api/athlete/route.ts           email+name upsert
  api/submit-response/route.ts   store one protocol's responses
components/                      Wordmark, WelcomeForm, StepHeader, StepUI, Scripture
lib/                            supabase, athlete (localStorage), storage,
                                protocols (registry + Scripture), pdf (Protocols 1 & 2)
supabase/schema.sql             run this manually
```
