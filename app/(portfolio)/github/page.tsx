import type { Metadata } from "next";
import { GitHubFeed } from "@/components/sections/GitHubFeed";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "GitHub",
  description: "Open source projects and repositories.",
};

export default function GitHubPage() {
  return (
    <>
      <section className="pt-40 pb-32" aria-label="GitHub repositories">
        <div className="container-editorial">
          <div className="mb-16">
            <p className="section-number mb-3">Open Source</p>
            <h1 className="font-serif mb-4" style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}>
              GitHub
            </h1>
            <p style={{ color: "var(--text-secondary)", maxWidth: "55ch" }}>
              Public repositories — updated automatically from GitHub.
            </p>
          </div>

          <GitHubFeed />
        </div>
      </section>
      <Footer />
    </>
  );
}
