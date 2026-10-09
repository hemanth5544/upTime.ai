# GitHub Profile Page - UptimeAI UI Assignment

A responsive clone of the GitHub profile page, built with **React** (Vite). It runs entirely in the browser and
talks to the GitHub API directly, so there is no backend to run.

## Run it

Requires Node 20+.

```bash
npm install
npm run dev
```

App: http://localhost:5173

Production style: `npm run build`, then serve `client/dist` from any static host (`npm run preview` to try it
locally). The host must fall back to `index.html` for unknown paths so profile URLs like `/torvalds` work.

Any profile can be opened by username, e.g. `/torvalds`. The default is `/hemanth5544`.

## What is live and what is mocked

| Part | Source |
| --- | --- |
| Left panel (avatar, name, bio, followers, company, location, blog, X handle) | GitHub REST `GET /users/{username}` |
| Contribution heat map, including the year switcher | Contributions API, drawn with ECharts |
| Popular repositories and the Repositories tab | GitHub REST `GET /users/{username}/repos` (+ fork parent lookup) |
| Organizations | GitHub REST `GET /users/{username}/orgs`, mock when membership is private |
| Email, LinkedIn, achievements, activity overview, contribution activity, Packages/Stars counts | Mock (`client/src/data/mock.js`) |

GitHub has no public REST endpoint for the contribution calendar (the official one is GraphQL and needs a token),
so the app uses the open `github-contributions-api.jogruber.de` service, which returns the same data.

Responses are cached in `sessionStorage` for 15 minutes (the unauthenticated limit is 60 requests/hour), and the
demo profile falls back to mock data if GitHub is unreachable.

## GitHub token (optional)

A token raises the limit to 5000 requests/hour. Copy `client/.env.example` to `client/.env.local`, set
`VITE_GITHUB_TOKEN`, and restart `npm run dev`.

Vite inlines this value into the JavaScript bundle, so anyone who can open the built site can read it. Use a
fine-grained token limited to read-only access to public repositories, and leave it unset for public deployments.

## Structure

```
client/src
  ProfilePage.jsx   Page layout and tab switching (?tab=repositories)
  api.js            useApi hook, validation, mock fallback
  github.js         GitHub + contributions API clients with caching
  components/       Header, ProfileSidebar, PopularRepos, Contributions,
                    ContributionGraph (ECharts), ActivityOverview, ...
  data/mock.js      Mock content GitHub doesn't expose
  data/fallback.js  Fallback data for when GitHub is unavailable
  styles.css        All styling (plain CSS)
```
# upTime.ai
