"use client";

// PDF generation for Protocols 1 & 2.
//
// We dynamically import @react-pdf/renderer *inside* the handlers and build
// the document tree with React.createElement (no JSX). This keeps the heavy
// renderer out of the SSR/RSC render path entirely — it only loads in the
// browser when the athlete taps "Download", which is the most reliable setup.
//
// Fonts: we use the built-in Helvetica family so generation never depends on a
// network font fetch. The brand identity comes through the cream background,
// gold accent, and Shepherd wordmark.

const INK = "#f6f3ec";    // page background (cream)
const INK2 = "#ffffff";   // panels
const LIME = "#b08d3c";   // gold accent
const CREAM = "#2b2b2b";  // primary text (charcoal)
const MIST = "#4a4a4a";   // secondary text (slate)
const BLUE = "#b08d3c";   // gold

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give mobile Safari a beat before revoking
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function slugFilename(name: string, suffix: string) {
  const base = (name || "athlete").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${base || "athlete"}-${suffix}.pdf`;
}

// ---------------------------------------------------------------------------
// Protocol 1 — Aspirational Mission Statement
// ---------------------------------------------------------------------------
export type MissionData = {
  athleteName: string;
  dedicateTo: string; // "Name — relationship"
  paragraph1: string;
  paragraph2: string;
  dedicateToGod?: boolean;
};

export async function downloadMissionPdf(d: MissionData) {
  const [{ pdf, Document, Page, Text, View, StyleSheet }, ReactMod] = await Promise.all([
    import("@react-pdf/renderer"),
    import("react"),
  ]);
  const React = ReactMod.default;
  const h = React.createElement;

  const s = StyleSheet.create({
    page: { backgroundColor: INK, paddingTop: 64, paddingBottom: 56, paddingHorizontal: 56, fontFamily: "Helvetica" },
    eyebrow: { fontFamily: "Helvetica-Bold", fontSize: 10, letterSpacing: 3, color: LIME, textTransform: "uppercase" },
    athlete: { fontFamily: "Helvetica-Bold", fontSize: 13, color: CREAM, marginTop: 6, letterSpacing: 1 },
    rule: { height: 2, width: 54, backgroundColor: LIME, marginTop: 22, marginBottom: 34 },
    label: { fontFamily: "Helvetica", fontSize: 12, color: MIST, marginBottom: 10, letterSpacing: 1 },
    dedicate: { fontFamily: "Helvetica-Bold", fontSize: 30, color: CREAM, lineHeight: 1.15 },
    dedicateName: { color: LIME },
    para: { fontFamily: "Helvetica", fontSize: 13, color: CREAM, lineHeight: 1.7, marginTop: 22 },
    faith: { fontFamily: "Helvetica-Oblique", fontSize: 14, color: LIME, lineHeight: 1.5, marginTop: 22 },
    footer: { position: "absolute", bottom: 44, left: 56, right: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    footerLine: { position: "absolute", bottom: 86, left: 56, right: 56, height: 1, backgroundColor: "#e0d9cc" },
    wordmark: { fontFamily: "Helvetica-Bold", fontSize: 15, color: CREAM, letterSpacing: 1 },
    wordmarkSub: { fontFamily: "Helvetica", fontSize: 8, color: MIST, letterSpacing: 2, textTransform: "uppercase" },
    season: { fontFamily: "Helvetica", fontSize: 9, color: MIST, letterSpacing: 2, textTransform: "uppercase" },
  });

  const doc = h(
    Document,
    null,
    h(
      Page,
      { size: "A4", style: s.page },
      h(Text, { style: s.eyebrow }, "Aspirational Mission Statement"),
      h(Text, { style: s.athlete }, d.athleteName.toUpperCase()),
      h(View, { style: s.rule }),
      h(Text, { style: s.label }, "I dedicate this season to"),
      h(Text, { style: s.dedicate }, h(Text, { style: s.dedicateName }, d.dedicateTo), "."),
      d.paragraph1 ? h(Text, { style: s.para }, d.paragraph1) : null,
      d.paragraph2 ? h(Text, { style: s.para }, d.paragraph2) : null,
      d.dedicateToGod ? h(Text, { style: s.faith }, "Above all, I play for God’s glory.") : null,
      h(View, { style: s.footerLine }),
      h(
        View,
        { style: s.footer },
        h(
          View,
          null,
          h(Text, { style: s.wordmark }, "SHEPHERD"),
          h(Text, { style: s.wordmarkSub }, "Shepherd Coach Network")
        ),
        h(Text, { style: s.season }, "Shepherd Mental Edge Protocols")
      )
    )
  );

  const blob = await pdf(doc).toBlob();
  triggerDownload(blob, slugFilename(d.athleteName, "mission-statement"));
}

// ---------------------------------------------------------------------------
// Protocol 2 — Mythical Press Release
// ---------------------------------------------------------------------------
export type PressReleaseData = {
  athleteName: string;
  teamName: string;
  schoolName: string;
  headline: string;
  dateline: string;
  paragraphs: string[];
  athleteQuote: string;
  coachQuote: string;
};

export async function downloadPressReleasePdf(d: PressReleaseData) {
  const [{ pdf, Document, Page, Text, View, StyleSheet }, ReactMod] = await Promise.all([
    import("@react-pdf/renderer"),
    import("react"),
  ]);
  const React = ReactMod.default;
  const h = React.createElement;

  const s = StyleSheet.create({
    page: { backgroundColor: INK, paddingTop: 56, paddingBottom: 56, paddingHorizontal: 52, fontFamily: "Helvetica" },
    kicker: { fontFamily: "Helvetica-Bold", fontSize: 9, letterSpacing: 3, color: LIME, textTransform: "uppercase" },
    forImmediate: { fontFamily: "Helvetica", fontSize: 8, letterSpacing: 2, color: MIST, textTransform: "uppercase", marginTop: 4 },
    headline: { fontFamily: "Helvetica-Bold", fontSize: 25, color: CREAM, lineHeight: 1.12, marginTop: 18 },
    dateline: { fontFamily: "Helvetica-Bold", fontSize: 11, color: BLUE, marginTop: 16, letterSpacing: 1 },
    rule: { height: 1, backgroundColor: "#e0d9cc", marginTop: 16, marginBottom: 18 },
    para: { fontFamily: "Helvetica", fontSize: 11.5, color: CREAM, lineHeight: 1.65, marginBottom: 13 },
    quoteBox: { borderLeftWidth: 3, borderLeftColor: LIME, paddingLeft: 14, paddingVertical: 4, marginVertical: 10 },
    quoteText: { fontFamily: "Helvetica-Oblique", fontSize: 13, color: CREAM, lineHeight: 1.5 },
    quoteAttr: { fontFamily: "Helvetica-Bold", fontSize: 9, color: MIST, marginTop: 7, letterSpacing: 1, textTransform: "uppercase" },
    footerLine: { position: "absolute", bottom: 84, left: 52, right: 52, height: 1, backgroundColor: "#e0d9cc" },
    footer: { position: "absolute", bottom: 44, left: 52, right: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    wordmark: { fontFamily: "Helvetica-Bold", fontSize: 15, color: CREAM, letterSpacing: 1 },
    wordmarkSub: { fontFamily: "Helvetica", fontSize: 8, color: MIST, letterSpacing: 2, textTransform: "uppercase" },
    end: { fontFamily: "Helvetica", fontSize: 9, color: MIST, letterSpacing: 2 },
  });

  const children: any[] = [
    h(Text, { style: s.kicker }, "Shepherd Coach Network"),
    h(Text, { style: s.forImmediate }, "For Immediate Release"),
    h(Text, { style: s.headline }, d.headline),
    h(Text, { style: s.dateline }, d.dateline),
    h(View, { style: s.rule }),
  ];

  // Body paragraph 1
  if (d.paragraphs[0]) children.push(h(Text, { style: s.para, key: "p0" }, d.paragraphs[0]));

  // Athlete quote pull-out
  if (d.athleteQuote) {
    children.push(
      h(
        View,
        { style: s.quoteBox, key: "aq" },
        h(Text, { style: s.quoteText }, `“${d.athleteQuote}”`),
        h(Text, { style: s.quoteAttr }, `— ${d.athleteName}`)
      )
    );
  }

  // Body paragraph 2
  if (d.paragraphs[1]) children.push(h(Text, { style: s.para, key: "p1" }, d.paragraphs[1]));

  // Coach quote pull-out
  if (d.coachQuote) {
    children.push(
      h(
        View,
        { style: s.quoteBox, key: "cq" },
        h(Text, { style: s.quoteText }, `“${d.coachQuote}”`),
        h(Text, { style: s.quoteAttr }, `— Head Coach, ${d.teamName}`)
      )
    );
  }

  // Body paragraph 3
  if (d.paragraphs[2]) children.push(h(Text, { style: s.para, key: "p2" }, d.paragraphs[2]));

  children.push(h(Text, { style: s.end, key: "end" }, "# # #"));
  children.push(h(View, { style: s.footerLine, key: "fl" }));
  children.push(
    h(
      View,
      { style: s.footer, key: "ft" },
      h(View, null, h(Text, { style: s.wordmark }, "SHEPHERD"), h(Text, { style: s.wordmarkSub }, "Shepherd Coach Network")),
      h(Text, { style: s.wordmarkSub }, "Faith · Performance")
    )
  );

  const doc = h(Document, null, h(Page, { size: "A4", style: s.page }, ...children));
  const blob = await pdf(doc).toBlob();
  triggerDownload(blob, slugFilename(d.athleteName, "press-release"));
}

// ---------------------------------------------------------------------------
// Protocol 10 — Pre-Practice & Game Routine
// ---------------------------------------------------------------------------
export type PregameRoutineData = {
  athleteName: string;
  objective: string;
  mentalPrep: string;
  physicalPrep: string;
  emotionalCues: string;
};

export async function downloadPregameRoutinePdf(d: PregameRoutineData) {
  const [{ pdf, Document, Page, Text, View, StyleSheet }, ReactMod] = await Promise.all([
    import("@react-pdf/renderer"),
    import("react"),
  ]);
  const React = ReactMod.default;
  const h = React.createElement;

  const s = StyleSheet.create({
    page: { backgroundColor: INK, paddingTop: 64, paddingBottom: 56, paddingHorizontal: 56, fontFamily: "Helvetica" },
    eyebrow: { fontFamily: "Helvetica-Bold", fontSize: 10, letterSpacing: 3, color: LIME, textTransform: "uppercase" },
    athlete: { fontFamily: "Helvetica-Bold", fontSize: 13, color: CREAM, marginTop: 6, letterSpacing: 1 },
    rule: { height: 2, width: 54, backgroundColor: LIME, marginTop: 22, marginBottom: 30 },
    objLabel: { fontFamily: "Helvetica", fontSize: 12, color: MIST, marginBottom: 10, letterSpacing: 1 },
    objective: { fontFamily: "Helvetica-Bold", fontSize: 26, color: CREAM, lineHeight: 1.2 },
    block: { marginTop: 26 },
    blockLabel: { fontFamily: "Helvetica-Bold", fontSize: 10, letterSpacing: 2, color: LIME, textTransform: "uppercase", marginBottom: 8 },
    body: { fontFamily: "Helvetica", fontSize: 13, color: CREAM, lineHeight: 1.65 },
    footerLine: { position: "absolute", bottom: 86, left: 56, right: 56, height: 1, backgroundColor: "#e0d9cc" },
    footer: { position: "absolute", bottom: 44, left: 56, right: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    wordmark: { fontFamily: "Helvetica-Bold", fontSize: 15, color: CREAM, letterSpacing: 1 },
    wordmarkSub: { fontFamily: "Helvetica", fontSize: 8, color: MIST, letterSpacing: 2, textTransform: "uppercase" },
    season: { fontFamily: "Helvetica", fontSize: 9, color: MIST, letterSpacing: 2, textTransform: "uppercase" },
  });

  const block = (label: string, text: string) =>
    text
      ? h(View, { style: s.block }, h(Text, { style: s.blockLabel }, label), h(Text, { style: s.body }, text))
      : null;

  const doc = h(
    Document,
    null,
    h(
      Page,
      { size: "A4", style: s.page },
      h(Text, { style: s.eyebrow }, "Pre-Practice & Game Routine"),
      h(Text, { style: s.athlete }, d.athleteName.toUpperCase()),
      h(View, { style: s.rule }),
      h(Text, { style: s.objLabel }, "My objective"),
      h(Text, { style: s.objective }, d.objective),
      block("Mental Prep", d.mentalPrep),
      block("Physical Prep", d.physicalPrep),
      block("Emotional Cues", d.emotionalCues),
      h(View, { style: s.footerLine }),
      h(
        View,
        { style: s.footer },
        h(
          View,
          null,
          h(Text, { style: s.wordmark }, "SHEPHERD"),
          h(Text, { style: s.wordmarkSub }, "Shepherd Coach Network")
        ),
        h(Text, { style: s.season }, "Shepherd Mental Edge Protocols")
      )
    )
  );

  const blob = await pdf(doc).toBlob();
  triggerDownload(blob, slugFilename(d.athleteName, "pregame-routine"));
}

// ---------------------------------------------------------------------------
// Protocol 13 — Post Game Review System
// ---------------------------------------------------------------------------
export type PostgameReviewData = {
  athleteName: string;
  performance: string;
  wentWell: string;
  learned: string;
  actionPlan: string;
};

export async function downloadPostgameReviewPdf(d: PostgameReviewData) {
  const [{ pdf, Document, Page, Text, View, StyleSheet }, ReactMod] = await Promise.all([
    import("@react-pdf/renderer"),
    import("react"),
  ]);
  const React = ReactMod.default;
  const h = React.createElement;

  const s = StyleSheet.create({
    page: { backgroundColor: INK, paddingTop: 64, paddingBottom: 56, paddingHorizontal: 56, fontFamily: "Helvetica" },
    eyebrow: { fontFamily: "Helvetica-Bold", fontSize: 10, letterSpacing: 3, color: LIME, textTransform: "uppercase" },
    athlete: { fontFamily: "Helvetica-Bold", fontSize: 13, color: CREAM, marginTop: 6, letterSpacing: 1 },
    rule: { height: 2, width: 54, backgroundColor: LIME, marginTop: 22, marginBottom: 30 },
    perfLabel: { fontFamily: "Helvetica", fontSize: 12, color: MIST, marginBottom: 10, letterSpacing: 1 },
    performance: { fontFamily: "Helvetica-Bold", fontSize: 26, color: CREAM, lineHeight: 1.2 },
    block: { marginTop: 26 },
    blockLabel: { fontFamily: "Helvetica-Bold", fontSize: 10, letterSpacing: 2, color: LIME, textTransform: "uppercase", marginBottom: 8 },
    body: { fontFamily: "Helvetica", fontSize: 13, color: CREAM, lineHeight: 1.65 },
    footerLine: { position: "absolute", bottom: 86, left: 56, right: 56, height: 1, backgroundColor: "#e0d9cc" },
    footer: { position: "absolute", bottom: 44, left: 56, right: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    wordmark: { fontFamily: "Helvetica-Bold", fontSize: 15, color: CREAM, letterSpacing: 1 },
    wordmarkSub: { fontFamily: "Helvetica", fontSize: 8, color: MIST, letterSpacing: 2, textTransform: "uppercase" },
    season: { fontFamily: "Helvetica", fontSize: 9, color: MIST, letterSpacing: 2, textTransform: "uppercase" },
  });

  const block = (label: string, text: string) =>
    text
      ? h(View, { style: s.block }, h(Text, { style: s.blockLabel }, label), h(Text, { style: s.body }, text))
      : null;

  const doc = h(
    Document,
    null,
    h(
      Page,
      { size: "A4", style: s.page },
      h(Text, { style: s.eyebrow }, "Post Game Review System"),
      h(Text, { style: s.athlete }, d.athleteName.toUpperCase()),
      h(View, { style: s.rule }),
      h(Text, { style: s.perfLabel }, "The performance"),
      h(Text, { style: s.performance }, d.performance),
      block("Went Well", d.wentWell),
      block("Learned", d.learned),
      block("Next Time", d.actionPlan),
      h(View, { style: s.footerLine }),
      h(
        View,
        { style: s.footer },
        h(
          View,
          null,
          h(Text, { style: s.wordmark }, "SHEPHERD"),
          h(Text, { style: s.wordmarkSub }, "Shepherd Coach Network")
        ),
        h(Text, { style: s.season }, "Shepherd Mental Edge Protocols")
      )
    )
  );

  const blob = await pdf(doc).toBlob();
  triggerDownload(blob, slugFilename(d.athleteName, "postgame-review"));
}

// ---------------------------------------------------------------------------
// Protocol 7 — The Accountability Map
//
// Variable length: 3–5 people, each with a support paragraph, then a promise
// and a check-in. Content can flow onto a second page, so each person's block
// is kept from splitting (wrap: false) and the footer is `fixed` to repeat on
// every page rather than absolute-positioned once (as in Protocols 1/2/10/13).
// ---------------------------------------------------------------------------
export type AccountabilityMapData = {
  athleteName: string;
  people: { name: string; support: string }[];
  promise: string;
  checkin: string;
};

export async function downloadAccountabilityMapPdf(d: AccountabilityMapData) {
  const [{ pdf, Document, Page, Text, View, StyleSheet }, ReactMod] = await Promise.all([
    import("@react-pdf/renderer"),
    import("react"),
  ]);
  const React = ReactMod.default;
  const h = React.createElement;

  const s = StyleSheet.create({
    // Extra paddingBottom reserves room for the fixed footer on every page.
    page: { backgroundColor: INK, paddingTop: 64, paddingBottom: 100, paddingHorizontal: 56, fontFamily: "Helvetica" },
    eyebrow: { fontFamily: "Helvetica-Bold", fontSize: 10, letterSpacing: 3, color: LIME, textTransform: "uppercase" },
    athlete: { fontFamily: "Helvetica-Bold", fontSize: 13, color: CREAM, marginTop: 6, letterSpacing: 1 },
    rule: { height: 2, width: 54, backgroundColor: LIME, marginTop: 22, marginBottom: 30 },
    sectionLabel: { fontFamily: "Helvetica", fontSize: 12, color: MIST, marginBottom: 4, letterSpacing: 1 },
    person: { marginTop: 22 },
    personName: { fontFamily: "Helvetica-Bold", fontSize: 15, color: CREAM, letterSpacing: 0.5, marginBottom: 6 },
    body: { fontFamily: "Helvetica", fontSize: 13, color: CREAM, lineHeight: 1.65 },
    promiseWrap: { marginTop: 34 },
    promiseLabel: { fontFamily: "Helvetica-Bold", fontSize: 10, letterSpacing: 2, color: LIME, textTransform: "uppercase", marginBottom: 10, textAlign: "center" },
    promise: { fontFamily: "Helvetica-Bold", fontSize: 22, color: LIME, lineHeight: 1.3, textAlign: "center" },
    block: { marginTop: 30 },
    blockLabel: { fontFamily: "Helvetica-Bold", fontSize: 10, letterSpacing: 2, color: LIME, textTransform: "uppercase", marginBottom: 8 },
    footerLine: { position: "absolute", bottom: 86, left: 56, right: 56, height: 1, backgroundColor: "#e0d9cc" },
    footer: { position: "absolute", bottom: 44, left: 56, right: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    wordmark: { fontFamily: "Helvetica-Bold", fontSize: 15, color: CREAM, letterSpacing: 1 },
    wordmarkSub: { fontFamily: "Helvetica", fontSize: 8, color: MIST, letterSpacing: 2, textTransform: "uppercase" },
    season: { fontFamily: "Helvetica", fontSize: 9, color: MIST, letterSpacing: 2, textTransform: "uppercase" },
  });

  const children: any[] = [
    h(Text, { style: s.eyebrow, key: "eyebrow" }, "The Accountability Map"),
    h(Text, { style: s.athlete, key: "athlete" }, d.athleteName.toUpperCase()),
    h(View, { style: s.rule, key: "rule" }),
    h(Text, { style: s.sectionLabel, key: "circle-label" }, "My circle"),
  ];

  // One block per person — kept whole across page breaks.
  d.people.forEach((p, i) => {
    children.push(
      h(
        View,
        { style: s.person, wrap: false, key: `person-${i}` },
        h(Text, { style: s.personName }, p.name),
        p.support ? h(Text, { style: s.body }, p.support) : null
      )
    );
  });

  if (d.promise) {
    children.push(
      h(
        View,
        { style: s.promiseWrap, wrap: false, key: "promise" },
        h(Text, { style: s.promiseLabel }, "My promise"),
        h(Text, { style: s.promise }, `“${d.promise}”`)
      )
    );
  }

  if (d.checkin) {
    children.push(
      h(
        View,
        { style: s.block, wrap: false, key: "checkin" },
        h(Text, { style: s.blockLabel }, "My Check-In"),
        h(Text, { style: s.body }, d.checkin)
      )
    );
  }

  children.push(h(View, { style: s.footerLine, fixed: true, key: "footer-line" }));
  children.push(
    h(
      View,
      { style: s.footer, fixed: true, key: "footer" },
      h(
        View,
        null,
        h(Text, { style: s.wordmark }, "SHEPHERD"),
        h(Text, { style: s.wordmarkSub }, "Shepherd Coach Network")
      ),
      h(Text, { style: s.season }, "Shepherd Mental Edge Protocols")
    )
  );

  const doc = h(Document, null, h(Page, { size: "A4", style: s.page }, ...children));
  const blob = await pdf(doc).toBlob();
  triggerDownload(blob, slugFilename(d.athleteName, "accountability-map"));
}
