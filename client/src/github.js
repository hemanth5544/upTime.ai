const GITHUB_API = 'https://api.github.com';
const CONTRIBUTIONS_API = 'https://github-contributions-api.jogruber.de/v4';
const CACHE_TTL_MS = 15 * 60 * 1000;
const MAX_PARENT_LOOKUPS = 10;

const CACHE_PREFIX = 'gh-cache:';
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const pending = new Map();

function readCache(key) {
  try {
    const hit = JSON.parse(sessionStorage.getItem(CACHE_PREFIX + key));
    if (hit && hit.expires > Date.now()) return hit;
  } catch {
    // Storage can be blocked or hold a corrupt entry; treat both as a miss.
  }
  return null;
}

function writeCache(key, value) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ value, expires: Date.now() + CACHE_TTL_MS }));
  } catch {
    // Caching is best effort.
  }
}

// Small per-tab cache: the unauthenticated GitHub limit is only 60 req/hour.
// Requests already in flight are shared so the same resource is never fetched twice at once.
function cached(key, loader) {
  const hit = readCache(key);
  if (hit) return Promise.resolve(hit.value);
  if (pending.has(key)) return pending.get(key);

  const request = loader()
    .then((value) => {
      writeCache(key, value);
      return value;
    })
    .finally(() => pending.delete(key));
  pending.set(key, request);
  return request;
}

async function getJson(url, headers = {}) {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(10_000) });
  if (!res.ok) {
    const err = new Error(`Upstream responded ${res.status} for ${url}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

function github(path) {
  const headers = { Accept: 'application/vnd.github+json' };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  return getJson(`${GITHUB_API}${path}`, headers);
}

export function getUser(username) {
  return cached(`user:${username}`, () => github(`/users/${username}`));
}

export function getOrgs(username) {
  return cached(`orgs:${username}`, async () => {
    const orgs = await github(`/users/${username}/orgs`);
    return orgs.map((o) => ({
      login: o.login,
      avatar_url: o.avatar_url,
      html_url: `https://github.com/${o.login}`,
    }));
  });
}

export function getRepos(username) {
  return cached(`repos:${username}`, async () => {
    const repos = await github(`/users/${username}/repos?per_page=100&sort=updated`);

    // The list endpoint doesn't say where a fork came from, so look that up per repo.
    const forks = repos.filter((r) => r.fork).slice(0, MAX_PARENT_LOOKUPS);
    const details = await Promise.allSettled(forks.map((r) => github(`/repos/${r.full_name}`)));
    const parents = new Map();
    details.forEach((result, i) => {
      if (result.status === 'fulfilled' && result.value.parent) {
        parents.set(forks[i].full_name, {
          parent: result.value.parent.full_name,
          // Forks often report no language of their own; borrow the parent's.
          language: result.value.language || result.value.parent.language,
        });
      }
    });

    return repos.map((r) => ({
      name: r.name,
      full_name: r.full_name,
      html_url: r.html_url,
      description: r.description,
      language: r.language || parents.get(r.full_name)?.language || null,
      visibility: r.visibility,
      fork: r.fork,
      parent: parents.get(r.full_name)?.parent || null,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      updated_at: r.updated_at,
    }));
  });
}

// year is either 'last' (rolling 12 months) or a 4 digit calendar year.
export function getContributions(username, year) {
  return cached(`contributions:${username}:${year}`, async () => {
    const data = await getJson(`${CONTRIBUTIONS_API}/${username}?y=${year}`);
    const total = Object.values(data.total || {}).reduce((sum, n) => sum + n, 0);
    return { total, contributions: data.contributions || [] };
  });
}
