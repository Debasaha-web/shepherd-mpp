// Inline error shown on a protocol step when saving the response fails.
export default function SaveError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      style={{
        marginTop: 14,
        fontSize: 13.5,
        lineHeight: 1.45,
        color: "var(--red)",
        background: "rgba(200,74,74,0.10)",
        border: "1px solid rgba(200,74,74,0.30)",
        padding: "11px 14px",
        borderRadius: 10,
      }}
    >
      {message}
    </p>
  );
}
