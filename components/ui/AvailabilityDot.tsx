"use client";

export function AvailabilityDot({ available = true }: { available?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        {available && (
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ background: "var(--accent-sage)" }}
          />
        )}
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ background: available ? "var(--accent-sage)" : "var(--text-tertiary)" }}
        />
      </span>
      <span
        className="text-xs tracking-wide"
        style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
      >
        {available ? "Open to work" : "Not available"}
      </span>
    </div>
  );
}
