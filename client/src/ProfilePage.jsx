import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { PackageIcon, StarIcon, TableIcon } from '@primer/octicons-react';
import { useApi } from './api.js';
import { DEFAULT_USERNAME, organizations as mockOrganizations } from './data/mock.js';
import Header from './components/Header.jsx';
import ProfileSidebar from './components/ProfileSidebar.jsx';
import PopularRepos from './components/PopularRepos.jsx';
import Contributions from './components/Contributions.jsx';
import ContributionActivity from './components/ContributionActivity.jsx';
import RepoList from './components/RepoList.jsx';
import Blankslate from './components/Blankslate.jsx';
import Footer from './components/Footer.jsx';

const TABS = ['overview', 'repositories', 'projects', 'packages', 'stars'];

export default function ProfilePage() {
  const { username = DEFAULT_USERNAME } = useParams();
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const tab = TABS.includes(requestedTab) ? requestedTab : 'overview';

  const user = useApi(`/users/${username}`);
  const repos = useApi(`/users/${username}/repos`);
  const orgs = useApi(`/users/${username}/orgs`);

  const isDefaultUser = username.toLowerCase() === DEFAULT_USERNAME;
  // The API only returns public org memberships; the mock list fills in for the default profile.
  const organizations = orgs.data?.length ? orgs.data : isDefaultUser ? mockOrganizations : [];

  useEffect(() => {
    document.title = user.data ? `${user.data.login} (${user.data.name || user.data.login})` : 'GitHub Profile';
  }, [user.data]);

  return (
    <div className="app">
      <Header user={user.data} username={username} activeTab={tab} isDefaultUser={isDefaultUser} />

      <main className="container">
        {user.error ? (
          <Blankslate
            title={user.error.status === 404 ? `No user named "${username}"` : 'Could not load this profile'}
            description={user.error.message}
          />
        ) : (
          <div className="layout">
            <ProfileSidebar
              user={user.data}
              loading={user.loading}
              organizations={organizations}
              isDefaultUser={isDefaultUser}
            />

            <div className="layout-main">
              {tab === 'overview' && (
                <>
                  <PopularRepos repos={repos.data} loading={repos.loading} error={repos.error} />
                  <Contributions
                    username={username}
                    createdAt={user.data?.created_at}
                    isDefaultUser={isDefaultUser}
                  >
                    {isDefaultUser && <ContributionActivity />}
                  </Contributions>
                </>
              )}
              {tab === 'repositories' && (
                <RepoList repos={repos.data} loading={repos.loading} error={repos.error} />
              )}
              {tab === 'projects' && (
                <Blankslate
                  icon={TableIcon}
                  title={`${username} doesn't have any public projects yet.`}
                />
              )}
              {tab === 'packages' && (
                <Blankslate
                  icon={PackageIcon}
                  title={`${username} doesn't have any published packages yet.`}
                />
              )}
              {tab === 'stars' && (
                <Blankslate icon={StarIcon} title={`${username} doesn't have any starred repositories yet.`} />
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
