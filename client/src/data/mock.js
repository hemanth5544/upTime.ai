// Mock data for the parts of the profile GitHub doesn't expose through its public REST API.

export const DEFAULT_USERNAME = 'hemanth5544';

export const tabCounts = {
  packages: 0,
  stars: 191,
};

// Extra left panel details the REST user endpoint doesn't return.
export const profileExtras = {
  email: null,
  linkedin: 'in/hemanthrachapalli',
  linkedinUrl: 'https://www.linkedin.com/in/hemanthrachapalli/',
};

const ACHIEVEMENTS_CDN = 'https://github.githubassets.com/images/modules/profile/achievements';

export const achievements = [
  { name: 'Pair Extraordinaire', image: `${ACHIEVEMENTS_CDN}/pair-extraordinaire-default.png` },
  { name: 'Pull Shark', image: `${ACHIEVEMENTS_CDN}/pull-shark-default.png`, tier: 'x2' },
  { name: 'Quickdraw', image: `${ACHIEVEMENTS_CDN}/quickdraw-default.png` },
  { name: 'YOLO', image: `${ACHIEVEMENTS_CDN}/yolo-default.png` },
];

// No public organization memberships.
export const organizations = [];

export const contributedOrgs = [];

export const activityOverview = {
  repositories: ['hemanth5544/ClipSync', 'rshdhere/better-uptime', 'hemanth5544/quicksync'],
  otherRepositories: 30,
  // Approximate percentages of each contribution type, drawn on the four axis chart.
  breakdown: { commits: 94, pullRequests: 5, issues: 1, codeReview: 0 },
};

// pullRequests is optional: months without any only show the commits row.
export const contributionActivity = [
  { month: 'August 2026', commits: { count: 2, repositories: 1 } },
  { month: 'July 2026', commits: { count: 19, repositories: 2 } },
  { month: 'June 2026', commits: { count: 27, repositories: 3 } },
  { month: 'May 2026', commits: { count: 24, repositories: 3 } },
  {
    month: 'April 2026',
    commits: { count: 33, repositories: 5 },
    pullRequests: {
      count: 2,
      repositories: [{ name: 'louislam/uptime-kuma', merged: 1 }],
    },
  },
];

export const languageColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  'Jupyter Notebook': '#DA5B0B',
  Dart: '#00B4AB',
  'C++': '#f34b7d',
  'C#': '#178600',
  C: '#555555',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#663399',
  Shell: '#89e051',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Vue: '#41b883',
};
