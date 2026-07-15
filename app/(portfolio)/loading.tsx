export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center" aria-busy="true" aria-live="polite">
      <div
        className="w-8 h-8 rounded-full animate-spin"
        style={{
          border: "2px solid var(--border-subtle)",
          borderTopColor: "var(--accent-sage)",
        }}
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
