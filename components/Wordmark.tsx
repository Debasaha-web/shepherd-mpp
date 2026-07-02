// Shepherd Coach Network emblem: an open heart with a cross at its top,
// "Christ at the Center" inside, a dotted center line, and the wordmark below.
// `size` ≈ heart width in px.
export default function Wordmark({ size = 84 }: { size?: number }) {
  return (
    <div
      className="inline-flex flex-col items-center"
      style={{ gap: size * 0.07 }}
      aria-label="Shepherd Coach Network"
    >
      <svg
        width={size}
        height={size * 0.9}
        viewBox="0 0 100 90"
        fill="none"
        stroke="var(--shepherd-gold)"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* thin cross at top center */}
        <line x1="50" y1="2" x2="50" y2="22" />
        <line x1="42" y1="9" x2="58" y2="9" />

        {/* open heart outline, no fill */}
        <path d="M50 28 C44 15 31 9 21 13 C7 18 4 32 10 45 C16 58 32 70 50 84 C68 70 84 58 90 45 C96 32 93 18 79 13 C69 9 56 15 50 28 Z" />

        {/* dotted vertical center line, split around the inner text */}
        <line x1="50" y1="26" x2="50" y2="42" strokeWidth={2} strokeDasharray="0.1 4.5" />
        <line x1="50" y1="55" x2="50" y2="72" strokeWidth={2} strokeDasharray="0.1 4.5" />

        {/* "Christ at the Center" inside the heart */}
        <text
          x="50"
          y="50.5"
          textAnchor="middle"
          stroke="none"
          fill="var(--shepherd-scripture)"
          style={{ fontFamily: "var(--font-source), Georgia, serif", fontStyle: "italic", fontSize: "8px" }}
        >
          Christ at the Center
        </text>
      </svg>

      <div className="flex flex-col items-center" style={{ gap: size * 0.02 }}>
        <span
          className="wordmark"
          style={{
            fontFamily: "var(--font-oswald), system-ui, sans-serif",
            fontSize: size * 0.23,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--shepherd-gold)",
            lineHeight: 1,
          }}
        >
          Shepherd
        </span>
        <span
          style={{
            fontFamily: "var(--font-oswald), system-ui, sans-serif",
            fontSize: size * 0.115,
            fontWeight: 500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--shepherd-slate)",
            lineHeight: 1,
          }}
        >
          Coach Network
        </span>
      </div>
    </div>
  );
}
