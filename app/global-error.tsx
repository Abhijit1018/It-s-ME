"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#F7F4EF", color: "#1A1A18" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1.5rem", padding: "2rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Something broke.</h1>
          <p style={{ maxWidth: "32ch", opacity: 0.7 }}>
            The site hit an unexpected error. Try reloading.
          </p>
          <button
            onClick={() => reset()}
            style={{ padding: "0.5rem 1.25rem", borderRadius: "9999px", background: "#7B9E87", color: "#F7F4EF", border: "none", cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
