import { RepoIcon } from '@primer/octicons-react';
import { activityOverview, contributedOrgs } from '../data/mock.js';

const SIZE = 240;
const CENTER = SIZE / 2;
const AXIS = 76; // length of each arm of the cross
const GREEN = '#40c463';
const DARK_GREEN = '#216e39';

// Four axis chart: commits left, code review up, issues right, pull requests down.
function BreakdownChart({ breakdown }) {
  const { commits, pullRequests, issues, codeReview } = breakdown;
  const scale = (percent) => (percent / 100) * AXIS;

  const points = [
    [CENTER - scale(commits), CENTER],
    [CENTER, CENTER - scale(codeReview)],
    [CENTER + scale(issues), CENTER],
    [CENTER, CENTER + scale(pullRequests)],
  ];

  const label = (percent, text, x, y, anchor) => (
    <text x={x} y={y} textAnchor={anchor} className="breakdown-label">
      {percent > 0 && (
        <tspan x={x} dy="-0.6em">
          {percent}%
        </tspan>
      )}
      <tspan x={x} dy={percent > 0 ? '1.2em' : '0.35em'}>
        {text}
      </tspan>
    </text>
  );

  return (
    <svg className="breakdown-chart" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Activity breakdown">
      <polygon points={points.map((p) => p.join(',')).join(' ')} fill={GREEN} fillOpacity="0.6" stroke={GREEN} />
      <line x1={CENTER - AXIS} y1={CENTER} x2={CENTER + AXIS} y2={CENTER} stroke={DARK_GREEN} strokeWidth="2" />
      <line x1={CENTER} y1={CENTER - AXIS} x2={CENTER} y2={CENTER + AXIS} stroke={DARK_GREEN} strokeWidth="2" />
      {points.map(([x, y], i) =>
        x === CENTER && y === CENTER ? null : (
          <circle key={i} cx={x} cy={y} r="3" fill="#fff" stroke={DARK_GREEN} strokeWidth="2" />
        ),
      )}
      {label(codeReview, 'Code review', CENTER, CENTER - AXIS - 12, 'middle')}
      {label(issues, 'Issues', CENTER + AXIS + 8, CENTER, 'start')}
      {label(pullRequests, 'Pull requests', CENTER, CENTER + AXIS + 22, 'middle')}
      {label(commits, 'Commits', CENTER - AXIS - 8, CENTER, 'end')}
    </svg>
  );
}

export default function ActivityOverview() {
  const { repositories, otherRepositories, breakdown } = activityOverview;

  return (
    <div className="activity-overview">
      {contributedOrgs.length > 0 && (
        <div className="org-filters">
          {contributedOrgs.map((org) => (
            <button key={org.login} className="org-filter">
              <img src={org.avatar_url} alt="" width="20" height="20" />@{org.login}
            </button>
          ))}
        </div>
      )}

      <div className="activity-overview-body">
        <div className="activity-overview-text">
          <h3 className="activity-overview-title">Activity overview</h3>
          <div className="activity-overview-repos">
            <RepoIcon size={16} />
            <p>
              Contributed to{' '}
              {repositories.map((name, i) => (
                <span key={name}>
                  <a className="repo-link" href={`https://github.com/${name}`}>
                    {name}
                  </a>
                  {i < repositories.length - 1 && ', '}
                </span>
              ))}{' '}
              <span className="nowrap">and {otherRepositories} other repositories</span>
            </p>
          </div>
        </div>
        <div className="activity-overview-chart">
          <BreakdownChart breakdown={breakdown} />
        </div>
      </div>
    </div>
  );
}
