export default function Wordmark({ size = 18 }: { size?: number }) {
  const icon = size * 1.5;
  return (
    <div className="flex items-center gap-2.5" aria-label="Shepherd Coach Network">
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--gold)"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* small cross at top */}
        <line x1="12" y1="1.5" x2="12" y2="5" />
        <line x1="10.4" y1="3" x2="13.6" y2="3" />
        {/* heart outline, no fill */}
        <path d="M12 21.5c-.5-.4-7.5-6-9.2-9.2C1.4 9.6 2 6.6 4.6 5.7c1.9-.7 3.9.1 4.9 1.7l.5.8.5-.8c1-1.6 3-2.4 4.9-1.7 2.6.9 3.2 3.9 1.8 6.6C19.5 15.5 12.5 21.1 12 21.5z" />
        {/* dotted vertical center line */}
        <line x1="12" y1="8.5" x2="12" y2="17" strokeDasharray="1 2" strokeWidth={1.3} />
      </svg>

      <div className="flex flex-col" style={{ gap: size * 0.12 }}>
        <span
          className="wordmark"
          style={{
            fontSize: size,
            fontWeight: 800,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--gold)",
            lineHeight: 1,
          }}
        >
          Shepherd
        </span>
        <span
          className="font-head"
          style={{
            fontSize: size * 0.46,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--muted)",
            lineHeight: 1,
          }}
        >
          Coach Network
        </span>
      </div>
    </div>
  );
}
