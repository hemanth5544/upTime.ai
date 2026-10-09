// Fallback data shown for the demo user when the upstream APIs are unreachable or rate limited,
// so the UI still renders something sensible.

export const MOCK_USERNAME = 'hemanth5544';

export const mockUser = {
  login: 'hemanth5544',
  name: 'Hemanth Rachapalli',
  avatar_url: 'https://avatars.githubusercontent.com/u/92920794?v=4',
  html_url: 'https://github.com/hemanth5544',
  bio: 'Software Engineer',
  company: null,
  location: 'Chandigarh',
  email: null,
  blog: 'hemanthr.xyz',
  twitter_username: 'hemanthrdev',
  followers: 5,
  following: 9,
  public_repos: 73,
  created_at: '2021-10-21T10:03:24Z',
};

const repo = (name, description, language, stargazers_count, updated_at) => ({
  name,
  full_name: `hemanth5544/${name}`,
  html_url: `https://github.com/hemanth5544/${name}`,
  description,
  language,
  visibility: 'public',
  fork: false,
  parent: null,
  stargazers_count,
  forks_count: 0,
  updated_at,
});

export const mockRepos = [
  repo('ClipSync', 'Never lose what you copy. Sync your clipboard across Windows, macOS, and Linux instantly. Secure, fast, and beautifully simple.', 'TypeScript', 2, '2026-02-06T11:26:38Z'),
  repo('MediaSync', 'MediaSync - Go live in a click. Stream, connect, and share instantly.', 'TypeScript', 2, '2025-10-04T11:21:41Z'),
  repo('ishowspeed', 'will show more than speed', 'TypeScript', 1, '2026-04-08T05:55:15Z'),
  repo('DSA-JAVA', null, 'Java', 1, '2025-12-09T12:30:10Z'),
  repo('SteeleyeAssesment', 'SteeleyeAssesment', 'Jupyter Notebook', 1, '2025-12-09T12:30:08Z'),
  repo('goxpress', 'REST API Implementing Layered Architecture easy to understand for switching node to go ecosystem', 'Go', 0, '2025-12-15T09:40:39Z'),
];

export const mockOrgs = [];

// Deterministic pseudo-random calendar so the mock graph is stable between requests.
export function mockContributions(year) {
  const end = year === 'last' ? new Date() : new Date(Date.UTC(Number(year), 11, 31));
  const start =
    year === 'last'
      ? new Date(Date.UTC(end.getUTCFullYear() - 1, end.getUTCMonth(), end.getUTCDate() + 1))
      : new Date(Date.UTC(Number(year), 0, 1));

  let seed = 42 + (year === 'last' ? 0 : Number(year));
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const contributions = [];
  let total = 0;
  for (const d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const weekend = d.getUTCDay() === 0 || d.getUTCDay() === 6;
    const r = random();
    const count = r < (weekend ? 0.8 : 0.25) ? 0 : Math.floor(random() * random() * 24) + 1;
    const level = count === 0 ? 0 : count < 4 ? 1 : count < 9 ? 2 : count < 15 ? 3 : 4;
    total += count;
    contributions.push({ date: d.toISOString().slice(0, 10), count, level });
  }
  return { total, contributions };
}
