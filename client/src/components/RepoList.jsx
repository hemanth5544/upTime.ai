import { useState } from 'react';
import { RepoForkedIcon, StarIcon } from '@primer/octicons-react';
import { Language } from './PopularRepos.jsx';
import Blankslate from './Blankslate.jsx';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export default function RepoList({ repos, loading, error }) {
  const [query, setQuery] = useState('');

  if (loading) {
    return (
      <div className="repo-list">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="repo-list-item">
            <div className="skeleton skeleton-line" style={{ width: '30%', height: 20 }} />
            <div className="skeleton skeleton-line" style={{ width: '70%' }} />
          </div>
        ))}
      </div>
    );
  }

  if (error) return <Blankslate title="Could not load repositories" description={error.message} />;

  const filtered = repos.filter((repo) => repo.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <section>
      <div className="repo-filter">
        <input
          className="input"
          type="search"
          placeholder="Find a repository…"
          aria-label="Find a repository"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <Blankslate title="No repositories matched your search." />
      ) : (
        <ul className="repo-list">
          {filtered.map((repo) => (
            <li key={repo.full_name} className="repo-list-item">
              <div className="repo-list-head">
                <a className="repo-name repo-name-lg" href={repo.html_url} target="_blank" rel="noreferrer">
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
              {repo.description && <p className="repo-description repo-description-lg">{repo.description}</p>}
              <div className="repo-meta repo-meta-row">
                <Language name={repo.language} />
                {repo.stargazers_count > 0 && (
                  <span>
                    <StarIcon size={16} /> {repo.stargazers_count}
                  </span>
                )}
                {repo.forks_count > 0 && (
                  <span>
                    <RepoForkedIcon size={16} /> {repo.forks_count}
                  </span>
                )}
                <span>Updated on {formatDate(repo.updated_at)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
