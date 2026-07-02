"use client";

// Shared building blocks for the guided protocol flows.

export function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <span style={{ color: "var(--muted)", fontSize: 14 }}>Loading…</span>
    </div>
  );
}

export function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="screen mt-2 flex flex-col flex-1">
      <h1
        className="font-head"
        style={{ fontSize: 23, fontWeight: 800, lineHeight: 1.2, color: "var(--cream)" }}
      >
        {title}
      </h1>
      {hint && (
        <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 10, lineHeight: 1.5 }}>{hint}</p>
      )}
      <div className="mt-7">{children}</div>
    </section>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="font-head"
      style={{
        fontSize: 11,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--muted)",
        display: "block",
        marginBottom: 7,
        fontWeight: 700,
      }}
    >
      {children}
    </label>
  );
}

export function Textarea({
  value,
  onChange,
  placeholder,
  minHeight = 140,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minHeight?: number;
}) {
  return (
    <textarea
      className="input-ink w-full rounded-xl px-4 py-3.5 text-[15px]"
      style={{ minHeight, resize: "none", lineHeight: 1.55 }}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoFocus
    />
  );
}

export function NextButton({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
    >
      {label || "Continue →"}
    </button>
  );
}
