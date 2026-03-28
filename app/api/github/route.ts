import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const CACHE_KEY = "github:repos";
const CACHE_TTL = 60 * 60; // 1 hour

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

export async function GET() {
  const username = process.env.GITHUB_USERNAME;
  if (!username) {
    return NextResponse.json({ error: "GITHUB_USERNAME env var not set" }, { status: 500 });
  }

  // Try Upstash Redis cache first
  let redis: Redis | null = null;
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      const cached = await redis.get<Repo[]>(CACHE_KEY);
      if (cached) {
        return NextResponse.json({ repos: cached, cached: true });
      }
    } catch {
      // Redis unavailable — proceed without cache
      redis = null;
    }
  }

  // Fetch from GitHub API
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=20&type=public`,
    { headers, next: { revalidate: CACHE_TTL } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: `GitHub API error: ${res.status}` }, { status: 502 });
  }

  const raw: any[] = await res.json();
  const repos: Repo[] = raw
    .filter((r) => !r.fork)
    .map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      updatedAt: r.updated_at,
      topics: r.topics ?? [],
    }));

  // Store in Redis
  if (redis) {
    try {
      await redis.set(CACHE_KEY, repos, { ex: CACHE_TTL });
    } catch {
      // ignore cache write failures
    }
  }

  return NextResponse.json({ repos, cached: false });
}
