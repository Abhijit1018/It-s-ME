import { Redis } from "@upstash/redis";

const CACHE_TTL = 3600; // 1 hour in seconds

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) return null;
  if (!redis) {
    redis = new Redis({
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN,
    });
  }
  return redis;
}

async function cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const client = getRedis();

  if (client) {
    const cached = await client.get<T>(key);
    if (cached) return cached;
  }

  const data = await fetcher();

  if (client) {
    await client.set(key, data, { ex: CACHE_TTL });
  }

  return data;
}

const GITHUB_BASE = "https://api.github.com";

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "portfolio-app",
  };
  if (process.env.GITHUB_PAT) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_PAT}`;
  }
  return headers;
}

export interface RepoStats {
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  lastCommit: string;
  openIssues: number;
  url: string;
}

export async function getRepoStats(repo: string): Promise<RepoStats | null> {
  try {
    return await cachedFetch(`github:repo:${repo}`, async () => {
      const res = await fetch(`${GITHUB_BASE}/repos/${repo}`, {
        headers: githubHeaders(),
        next: { revalidate: CACHE_TTL },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return {
        name: data.name,
        fullName: data.full_name,
        description: data.description,
        stars: data.stargazers_count,
        forks: data.forks_count,
        language: data.language,
        lastCommit: data.pushed_at,
        openIssues: data.open_issues_count,
        url: data.html_url,
      } satisfies RepoStats;
    });
  } catch {
    return null;
  }
}

export interface PinnedRepo {
  name: string;
  description: string;
  stars: number;
  language: string;
  url: string;
  languageColor: string;
}

export async function getPinnedRepos(): Promise<PinnedRepo[]> {
  const username = process.env.GITHUB_USERNAME;
  if (!username) return [];

  try {
    return await cachedFetch(`github:pinned:${username}`, async () => {
      // GitHub GraphQL API for pinned repos
      const query = `
        query {
          user(login: "${username}") {
            pinnedItems(first: 6, types: REPOSITORY) {
              nodes {
                ... on Repository {
                  name
                  description
                  stargazerCount
                  primaryLanguage { name color }
                  url
                }
              }
            }
          }
        }
      `;

      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { ...githubHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        next: { revalidate: CACHE_TTL },
      });

      if (!res.ok) return [];
      const { data } = await res.json();

      return (data?.user?.pinnedItems?.nodes ?? []).map((repo: {
        name: string;
        description: string;
        stargazerCount: number;
        primaryLanguage?: { name: string; color: string };
        url: string;
      }) => ({
        name: repo.name,
        description: repo.description ?? "",
        stars: repo.stargazerCount,
        language: repo.primaryLanguage?.name ?? "Unknown",
        languageColor: repo.primaryLanguage?.color ?? "#8B8B8B",
        url: repo.url,
      })) as PinnedRepo[];
    });
  } catch {
    return [];
  }
}
