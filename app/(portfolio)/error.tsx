"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center">
      <div className="container-editorial py-32">
        <p className="section-number mb-4">Error</p>
        <h1
          className="font-serif mb-6"
          style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)", maxWidth: "20ch" }}
        >
          Something broke.
        </h1>
        <p className="leading-relaxed mb-10 max-w-md" style={{ color: "var(--text-secondary)" }}>
          An unexpected error occurred loading this page. It's been logged — try again or head back home.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="text-sm px-4 py-2 rounded-full transition-colors"
            style={{ background: "var(--accent-sage)", color: "#F7F4EF" }}
          >
            Try again →
          </button>
          <Link
            href="/"
            className="text-sm px-4 py-2 rounded-full"
            style={{ border: "1px solid var(--accent-sage)", color: "var(--accent-sage)" }}
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
