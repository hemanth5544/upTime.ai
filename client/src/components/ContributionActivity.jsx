import { useState } from 'react';
import { GitPullRequestIcon, RepoPushIcon, UnfoldIcon } from '@primer/octicons-react';
import { contributionActivity } from '../data/mock.js';

const plural = (n, word) => `${n} ${n === 1 ? word : word.replace(/y$/, 'ie') + 's'}`;

function MonthActivity({ activity }) {
  const { month, commits, pullRequests } = activity;
  const [monthName, year] = month.split(' ');

  return (
    <div className="timeline-month">
      <h3 className="timeline-heading">
        <span>
          {monthName} <span className="muted">{year}</span>
        </span>
      </h3>

      <div className="timeline-item">
        <span className="timeline-badge">
          <RepoPushIcon size={16} />
        </span>
        <div className="timeline-body">
          <div className="timeline-row">
            <span className="timeline-title">
              Created {plural(commits.count, 'commit')} in {plural(commits.repositories, 'repository')}
            </span>
            <button className="icon-button" aria-label="Expand">
              <UnfoldIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {pullRequests && (
        <div className="timeline-item">
          <span className="timeline-badge">
            <GitPullRequestIcon size={16} />
          </span>
          <div className="timeline-body">
            <div className="timeline-row">
              <span className="timeline-title">
                Opened {plural(pullRequests.count, 'pull request')} in{' '}
                {plural(pullRequests.repositories.length, 'repository')}
              </span>
              <button className="icon-button" aria-label="Expand">
                <UnfoldIcon size={16} />
              </button>
            </div>
            <ul className="timeline-list">
              {pullRequests.repositories.map((repo) => (
                <li key={repo.name} className="timeline-row">
                  <a className="timeline-repo" href={`https://github.com/${repo.name}`}>
                    {repo.name}
                  </a>
                  <span className="timeline-states">
                    {repo.merged > 0 && (
                      <span className="state">
                        <span className="state-count state-merged">{repo.merged}</span> merged
                      </span>
                    )}
                    {repo.open > 0 && (
                      <span className="state">
                        <span className="state-count state-open">{repo.open}</span> open
                      </span>
                    )}
                    <UnfoldIcon size={16} className="muted" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContributionActivity() {
  const [visibleMonths, setVisibleMonths] = useState(1);
  const hasMore = visibleMonths < contributionActivity.length;

  return (
    <section className="section activity">
      <h2 className="section-title">Contribution activity</h2>

      {contributionActivity.slice(0, visibleMonths).map((activity) => (
        <MonthActivity key={activity.month} activity={activity} />
      ))}

      {hasMore && (
        <button className="btn btn-block btn-outline" onClick={() => setVisibleMonths((n) => n + 1)}>
          Show more activity
        </button>
      )}

      <p className="activity-note muted">
        Seeing something unexpected? Take a look at the{' '}
        <a href="https://docs.github.com/categories/setting-up-and-managing-your-github-profile">
          GitHub profile guide
        </a>
        .
      </p>
    </section>
  );
}
