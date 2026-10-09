import { useState } from 'react';
import { TriangleDownIcon } from '@primer/octicons-react';
import { useApi } from '../api.js';
import ContributionGraph, { LEVEL_COLORS } from './ContributionGraph.jsx';
import ActivityOverview from './ActivityOverview.jsx';

const CURRENT_YEAR = new Date().getFullYear();

export default function Contributions({ username, createdAt, isDefaultUser, children }) {
  // null means the default rolling "last year" view; a number is a calendar year.
  const [year, setYear] = useState(null);
  const { data, source, loading, error } = useApi(`/users/${username}/contributions?year=${year ?? 'last'}`);

  const firstYear = createdAt ? new Date(createdAt).getFullYear() : CURRENT_YEAR;
  const years = Array.from({ length: CURRENT_YEAR - firstYear + 1 }, (_, i) => CURRENT_YEAR - i);

  return (
    <section className="section contributions">
      <div className="contributions-main">
        <div className="section-head">
          <h2 className="section-title">
            {data ? (
              <>
                {data.total.toLocaleString()} contributions in {year ? year : 'the last year'}
              </>
            ) : (
              'Contributions'
            )}
          </h2>
          <button className="link-button muted">
            Contribution settings <TriangleDownIcon size={16} />
          </button>
        </div>

        <div className="box">
          <div className={`heatmap-wrapper${loading ? ' is-loading' : ''}`}>
            {error ? (
              <p className="muted heatmap-message">Could not load contributions: {error.message}</p>
            ) : (
              <div className="heatmap-scroll">
                <div className="heatmap-inner">
                  <ContributionGraph contributions={data?.contributions} />
                  <div className="heatmap-footer">
                    <a className="muted" href="https://docs.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile">
                      Learn how we count contributions
                    </a>
                    <div className="heatmap-legend">
                      <span>Less</span>
                      {LEVEL_COLORS.map((color) => (
                        <span key={color} className="legend-cell" style={{ backgroundColor: color }} />
                      ))}
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {source === 'mock' && (
              <p className="muted heatmap-message">Contributions API unavailable - showing sample data.</p>
            )}
          </div>

          {isDefaultUser && <ActivityOverview />}
        </div>

        {children}
      </div>

      <ul className="year-list" aria-label="Contribution year">
        {years.map((y) => (
          <li key={y}>
            <button
              className={`year-btn${(year ?? CURRENT_YEAR) === y ? ' year-btn-active' : ''}`}
              onClick={() => setYear(y)}
              aria-pressed={(year ?? CURRENT_YEAR) === y}
            >
              {y}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
