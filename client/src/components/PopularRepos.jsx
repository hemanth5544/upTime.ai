import { languageColors } from '../data/mock.js';

const MAX_POPULAR = 6;

export function Language({ name }) {
  if (!name) return null;
  return (
    <span className="repo-language">
      <span className="language-dot" style={{ backgroundColor: languageColors[name] || '#8b949e' }} />
      {name}
    </span>
  );
}

export default function PopularRepos({ repos, loading, error }) {
  // GitHub ranks "popular" by stars; ties keep the API order (most recently updated first).
  const popular = [...(repos || [])]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, MAX_POPULAR);

  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">Popular repositories</h2>
        <a className="link-small" href="#customize">
          Customize your pins
        </a>
      </div>

      {error && <p className="muted">Could not load repositories: {error.message}</p>}

      <ol className="pinned-grid">
        {loading &&
          Array.from({ length: MAX_POPULAR }, (_, i) => (
            <li key={i} className="pinned-card">
              <div className="skeleton skeleton-line" style={{ width: '50%' }} />
              <div className="skeleton skeleton-line" style={{ width: '90%' }} />
            </li>
          ))}

        {!loading &&
          popular.map((repo) => (
            <li key={repo.full_name} className="pinned-card">
              <div className="pinned-card-head">
                <a className="repo-name" href={repo.html_url} target="_blank" rel="noreferrer">
                  {repo.name}
                </a>
                <span className="label">{repo.visibility === 'private' ? 'Private' : 'Public'}</span>
              </div>
              {repo.fork && repo.parent && (
                <p className="repo-fork">
                  Forked from{' '}
                  <a href={`https://github.com/${repo.parent}`} target="_blank" rel="noreferrer">
                    {repo.parent}
                  </a>
                </p>
              )}
              <p className="repo-description">{repo.description}</p>
              <p className="repo-meta">
                <Language name={repo.language} />
              </p>
            </li>
          ))}
      </ol>

      {!loading && !error && popular.length === 0 && (
        <p className="muted">This user doesn't have any public repositories yet.</p>
      )}
    </section>
  );
}
