import { Link } from 'react-router-dom';
import {
  BookIcon,
  CopilotIcon,
  GitPullRequestIcon,
  InboxIcon,
  IssueOpenedIcon,
  MarkGithubIcon,
  PackageIcon,
  PlusIcon,
  RepoIcon,
  SearchIcon,
  StarIcon,
  TableIcon,
  ThreeBarsIcon,
  TriangleDownIcon,
} from '@primer/octicons-react';
import { tabCounts } from '../data/mock.js';

export default function Header({ user, username, activeTab, isDefaultUser }) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookIcon },
    { id: 'repositories', label: 'Repositories', icon: RepoIcon, count: user?.public_repos },
    { id: 'projects', label: 'Projects', icon: TableIcon },
    { id: 'packages', label: 'Packages', icon: PackageIcon, count: isDefaultUser ? tabCounts.packages : undefined },
    { id: 'stars', label: 'Stars', icon: StarIcon, count: isDefaultUser ? tabCounts.stars : undefined },
  ];

  return (
    <header className="header">
      <div className="header-bar">
        <div className="header-left">
          <button className="header-btn" aria-label="Open navigation menu">
            <ThreeBarsIcon size={16} />
          </button>
          <a className="header-logo" href="https://github.com" aria-label="GitHub homepage">
            <MarkGithubIcon size={32} />
          </a>
          <Link className="header-username" to={`/${username}`}>
            {user?.login || username}
          </Link>
        </div>

        <div className="header-right">
          <button className="header-search" aria-label="Search">
            <SearchIcon size={16} />
            <span className="header-search-text">
              Type <kbd>/</kbd> to search
            </span>
          </button>
          <div className="header-btn-group hide-sm">
            <button className="header-btn" aria-label="Copilot">
              <CopilotIcon size={16} />
            </button>
            <button className="header-btn header-btn-narrow" aria-label="Open Copilot menu">
              <TriangleDownIcon size={16} />
            </button>
          </div>
          <span className="header-divider hide-sm" />
          <button className="header-btn hide-sm" aria-label="Create new">
            <PlusIcon size={16} />
            <TriangleDownIcon size={16} />
          </button>
          <button className="header-btn hide-sm" aria-label="Issues">
            <IssueOpenedIcon size={16} />
          </button>
          <button className="header-btn hide-sm" aria-label="Pull requests">
            <GitPullRequestIcon size={16} />
          </button>
          <button className="header-btn header-btn-notify" aria-label="Notifications">
            <InboxIcon size={16} />
          </button>
          {user ? (
            <img className="header-avatar" src={user.avatar_url} alt={`@${user.login}`} />
          ) : (
            <span className="header-avatar skeleton" />
          )}
        </div>
      </div>

      <nav className="tabs" aria-label="User profile">
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <Link
            key={id}
            // Overview is the default tab, so it keeps a clean URL like GitHub does.
            to={id === 'overview' ? `/${username}` : `/${username}?tab=${id}`}
            className={`tab${activeTab === id ? ' tab-active' : ''}`}
            aria-current={activeTab === id ? 'page' : undefined}
          >
            <Icon size={16} className="tab-icon" />
            <span>{label}</span>
            {count > 0 && <span className="counter">{count}</span>}
          </Link>
        ))}
      </nav>
    </header>
  );
}
