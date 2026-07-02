// Scripture anchor shown on each protocol's reveal/output screen.
// Gold left border, gold italic verse, muted reference.

export default function Scripture({
  verse,
  reference,
  align = "left",
}: {
  verse: string;
  reference: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className="scripture"
      style={align === "center" ? { textAlign: "center", display: "inline-block" } : undefined}
    >
      <p className="scripture-verse">&ldquo;{verse}&rdquo;</p>
      <p className="scripture-ref">— {reference}</p>
    </div>
  );
}
