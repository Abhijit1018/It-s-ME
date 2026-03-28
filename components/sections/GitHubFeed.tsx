"use client";

import { useEffect, useState } from "react";

type Repo = {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  topics: string[];
};

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  "C#": "#178600",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Go: "#00ADD8",
  Rust: "#dea584",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function GitHubFeed() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setRepos(data.repos ?? []);
      })
      .catch(() => setError("Failed to load repositories"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg p-5 animate-pulse"
            style={{ background: "var(--bg-secondary)", height: "120px" }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm" style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
        {error}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {repos.map((repo) => (
        <a
          key={repo.name}
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-lg p-5 transition-colors duration-200"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent-sage)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className="font-medium text-sm group-hover:text-[var(--accent-sage)] transition-colors duration-200"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
            >
              {repo.name}
            </h3>
            <span className="text-xs flex-shrink-0" style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
              {timeAgo(repo.updatedAt)}
            </span>
          </div>

          {repo.description && (
            <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
              {repo.description}
            </p>
          )}

          {repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {repo.topics.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    color: "var(--accent-sage)",
                    border: "1px solid var(--accent-sage)",
                    fontFamily: "var(--font-mono)",
                    opacity: 0.7,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            {repo.language && (
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: LANGUAGE_COLORS[repo.language] ?? "var(--text-tertiary)" }}
                />
                {repo.language}
              </span>
            )}
            {repo.stars > 0 && (
              <span className="text-xs" style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                ★ {repo.stars}
              </span>
            )}
            {repo.forks > 0 && (
              <span className="text-xs" style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                ⑂ {repo.forks}
              </span>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
