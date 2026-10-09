import { useEffect, useState } from 'react';
import { getContributions, getOrgs, getRepos, getUser } from './github.js';
import { MOCK_USERNAME, mockContributions, mockOrgs, mockRepos, mockUser } from './data/fallback.js';

const USERNAME_RE = /^[a-z\d](?:[a-z\d-]{0,38})$/i;

function fail(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// Maps a path such as `/users/torvalds/repos` to its live loader and mock fallback.
function resolve(path) {
  const url = new URL(path, 'http://local');
  const [, username, resource] = url.pathname.match(/^\/users\/([^/]+)(?:\/(\w+))?$/) || [];
  if (!username || !USERNAME_RE.test(username)) throw fail('Invalid GitHub username', 400);

  const isMockUser = username.toLowerCase() === MOCK_USERNAME;
  switch (resource) {
    case undefined:
      return { load: () => getUser(username), mock: () => isMockUser && mockUser };
    case 'repos':
      return { load: () => getRepos(username), mock: () => isMockUser && mockRepos };
    case 'orgs':
      return { load: () => getOrgs(username), mock: () => isMockUser && mockOrgs };
    case 'contributions': {
      const year = url.searchParams.get('year') || 'last';
      if (year !== 'last' && !/^\d{4}$/.test(year)) {
        throw fail('year must be "last" or a 4 digit year', 400);
      }
      return { load: () => getContributions(username, year), mock: () => mockContributions(year) };
    }
    default:
      throw fail('Not found', 404);
  }
}

// Runs the live loader; if upstream fails (rate limit, network) falls back to mock data
// for the demo user. A 404 is passed through so unknown users are reported properly.
async function request(path) {
  const { load, mock } = resolve(path);
  try {
    return { source: 'api', data: await load() };
  } catch (err) {
    console.error(`[api] ${path}: ${err.message}`);
    if (err.status === 404) throw fail('User not found', 404);
    const fallback = mock();
    if (fallback) return { source: 'mock', data: fallback };
    throw fail('GitHub API is unavailable or rate limited', 502);
  }
}

// Loads `path` from GitHub. Returns { data, source, loading, error }, where source is
// 'api' or 'mock' (mock data is used when GitHub is unavailable).
export function useApi(path) {
  const [state, setState] = useState({ data: null, source: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    Promise.resolve()
      .then(() => request(path))
      .then((body) => {
        if (!cancelled) setState({ data: body.data, source: body.source, loading: false, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ data: null, source: null, loading: false, error });
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  return state;
}
