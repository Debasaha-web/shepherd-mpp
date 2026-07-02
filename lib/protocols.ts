export type Protocol = {
  number: number;
  slug: string;
  route: string;
  title: string;
  subtitle: string;
  output: string;
  accent: "lime" | "orange" | "blue" | "violet" | "cream";
};

export const PROTOCOLS: Protocol[] = [
  {
    number: 1,
    slug: "mission",
    route: "/journey/mission",
    title: "Aspirational Mission Statement",
    subtitle: "Dedicate this season to someone who matters.",
    output: "Downloadable PDF",
    accent: "lime",
  },
  {
    number: 2,
    slug: "press-release",
    route: "/journey/press-release",
    title: "Mythical Press Release",
    subtitle: "Write the championship recap before it happens.",
    output: "Downloadable PDF",
    accent: "blue",
  },
  {
    number: 3,
    slug: "reset",
    route: "/journey/reset",
    title: "Reset Protocol",
    subtitle: "Your 3-step bounce-back after a mistake.",
    output: "Save to Notes",
    accent: "orange",
  },
  {
    number: 4,
    slug: "non-negotiables",
    route: "/journey/non-negotiables",
    title: "Four Non-Negotiables",
    subtitle: "The standards you never break.",
    output: "Screenshot to Photos",
    accent: "violet",
  },
  {
    number: 5,
    slug: "team-standards",
    route: "/journey/team-standards",
    title: "Team Standards",
    subtitle: "What your team always exemplifies.",
    output: "Screenshot to keep",
    accent: "cream",
  },
];

export function getProtocol(slug: string): Protocol | undefined {
  return PROTOCOLS.find((p) => p.slug === slug);
}

export const ACCENT_HEX: Record<Protocol["accent"], string> = {
  lime: "#c8a04a",
  orange: "#c8a04a",
  blue: "#c8a04a",
  violet: "#c8a04a",
  cream: "#c8a04a",
};

// Completed / success state — used for the "done" badge + check on the journey list.
export const COMPLETE_HEX = "#5a9a4a";

// Scripture anchor shown on each protocol's reveal/output screen, keyed by slug.
export const SCRIPTURE: Record<string, { verse: string; reference: string }> = {
  mission: {
    verse: "Commit to the Lord whatever you do, and he will establish your plans.",
    reference: "Proverbs 16:3",
  },
  "press-release": {
    verse: "I can do all things through Christ who strengthens me.",
    reference: "Philippians 4:13",
  },
  reset: {
    verse: "But those who hope in the Lord will renew their strength.",
    reference: "Isaiah 40:31",
  },
  "non-negotiables": {
    verse: "Whatever you do, work at it with all your heart, as working for the Lord.",
    reference: "Colossians 3:23",
  },
  "team-standards": {
    verse: "As iron sharpens iron, so one person sharpens another.",
    reference: "Proverbs 27:17",
  },
};
