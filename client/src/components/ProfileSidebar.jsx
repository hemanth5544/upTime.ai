import { LinkIcon, LocationIcon, MailIcon, OrganizationIcon, PeopleIcon } from '@primer/octicons-react';
import { achievements, profileExtras } from '../data/mock.js';

function LinkedInIcon() {
  return (
    <svg className="octicon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M13.6 1H2.4C1.6 1 1 1.6 1 2.4v11.2c0 .8.6 1.4 1.4 1.4h11.2c.8 0 1.4-.6 1.4-1.4V2.4c0-.8-.6-1.4-1.4-1.4ZM5.2 12.9H3.1V6.3h2.1v6.6ZM4.1 5.4a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm8.8 7.5h-2.1V9.7c0-.8 0-1.8-1.1-1.8s-1.2.8-1.2 1.7v3.3H6.4V6.3h2v.9c.3-.5 1-1.1 2-1.1 2.1 0 2.5 1.4 2.5 3.2v3.6Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="octicon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Renders the bio one line per paragraph, with @mentions emphasised like GitHub does.
function Bio({ text }) {
  const lines = text.split(/[\r\n]+/).filter(Boolean);
  return (
    <div className="profile-bio">
      {lines.map((line, i) => (
        <div key={i}>
          {line.split(/(@[\w-]+)/).map((part, j) =>
            part.startsWith('@') ? (
              <a key={j} className="mention" href={`https://github.com/${part.slice(1)}`}>
                {part}
              </a>
            ) : (
              part
            ),
          )}
        </div>
      ))}
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <aside className="sidebar" aria-busy="true">
      <div className="profile-head">
        <div className="profile-avatar skeleton" />
        <div className="profile-names">
          <div className="skeleton skeleton-line" style={{ width: '70%', height: 24 }} />
          <div className="skeleton skeleton-line" style={{ width: '40%', height: 18 }} />
        </div>
      </div>
      <div className="skeleton skeleton-line" style={{ width: '100%' }} />
      <div className="skeleton skeleton-line" style={{ width: '85%' }} />
      <div className="skeleton skeleton-line" style={{ width: '60%' }} />
    </aside>
  );
}

export default function ProfileSidebar({ user, loading, organizations, isDefaultUser }) {
  if (loading || !user) return <SidebarSkeleton />;

  const email = user.email || (isDefaultUser ? profileExtras.email : null);
  const blogUrl = user.blog && (/^https?:\/\//.test(user.blog) ? user.blog : `https://${user.blog}`);

  return (
    <aside className="sidebar">
      <div className="profile-head">
        <img className="profile-avatar" src={user.avatar_url} alt={`${user.name || user.login}'s avatar`} />
        <div className="profile-names">
          <h1 className="profile-name">{user.name}</h1>
          <div className="profile-login">{user.login}</div>
        </div>
      </div>

      {user.bio && <Bio text={user.bio} />}

      <button className="btn btn-block">Edit profile</button>

      <div className="profile-follow">
        <PeopleIcon size={16} />
        <a href={`${user.html_url}?tab=followers`}>
          <strong>{user.followers}</strong> followers
        </a>
        <span>·</span>
        <a href={`${user.html_url}?tab=following`}>
          <strong>{user.following}</strong> following
        </a>
      </div>

      <ul className="profile-details">
        {user.company && (
          <li>
            <OrganizationIcon size={16} />
            <span>{user.company}</span>
          </li>
        )}
        {user.location && (
          <li>
            <LocationIcon size={16} />
            <span>{user.location}</span>
          </li>
        )}
        {email && (
          <li>
            <MailIcon size={16} />
            <a href={`mailto:${email}`}>{email}</a>
          </li>
        )}
        {blogUrl && (
          <li>
            <LinkIcon size={16} />
            <a href={blogUrl} target="_blank" rel="noreferrer">
              {user.blog}
            </a>
          </li>
        )}
        {isDefaultUser && profileExtras.linkedinUrl && (
          <li>
            <LinkedInIcon />
            <a href={profileExtras.linkedinUrl} target="_blank" rel="noreferrer">
              {profileExtras.linkedin}
            </a>
          </li>
        )}
        {user.twitter_username && (
          <li>
            <XIcon />
            <a href={`https://x.com/${user.twitter_username}`} target="_blank" rel="noreferrer">
              @{user.twitter_username}
            </a>
          </li>
        )}
      </ul>

      {isDefaultUser && (
        <section className="sidebar-section">
          <h2 className="sidebar-heading">Achievements</h2>
          <div className="achievements">
            {achievements.map((a) => (
              <span key={a.name} className="achievement" title={a.name}>
                <img src={a.image} alt={`Achievement: ${a.name}`} width="64" height="64" />
                {a.tier && <span className="achievement-tier">{a.tier}</span>}
              </span>
            ))}
          </div>
        </section>
      )}

      {organizations.length > 0 && (
        <section className="sidebar-section">
          <h2 className="sidebar-heading">Organizations</h2>
          <div className="orgs">
            {organizations.map((org) => (
              <a key={org.login} href={org.html_url} title={org.login} target="_blank" rel="noreferrer">
                <img className="org-avatar" src={org.avatar_url} alt={`@${org.login}`} width="32" height="32" />
              </a>
            ))}
          </div>
        </section>
      )}
    </aside>
  );
}
