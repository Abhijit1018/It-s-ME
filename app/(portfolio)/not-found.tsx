import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center">
      <div className="container-editorial py-32">
        <p className="section-number mb-4">404</p>
        <h1
          className="font-serif mb-6"
          style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)", maxWidth: "20ch" }}
        >
          Nothing here.
        </h1>
        <p className="leading-relaxed mb-10 max-w-md" style={{ color: "var(--text-secondary)" }}>
          This page doesn't exist, moved, or never did. Try the work, or head back home.
        </p>
        <div className="flex gap-4">
          <Link
            href="/"
            className="text-sm px-4 py-2 rounded-full transition-colors"
            style={{ background: "var(--accent-sage)", color: "#F7F4EF" }}
          >
            Back home →
          </Link>
          <Link
            href="/work"
            className="text-sm px-4 py-2 rounded-full"
            style={{ border: "1px solid var(--accent-sage)", color: "var(--accent-sage)" }}
          >
            See work
          </Link>
        </div>
      </div>
    </div>
  );
}
