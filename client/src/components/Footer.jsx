import { MarkGithubIcon } from '@primer/octicons-react';

const LINKS = [
  'Terms',
  'Privacy',
  'Security',
  'Status',
  'Community',
  'Docs',
  'Contact',
  'Manage cookies',
  'Do not share my personal information',
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <MarkGithubIcon size={24} />
        <span>© {new Date().getFullYear()} GitHub, Inc.</span>
      </div>
      <ul className="footer-links">
        {LINKS.map((link) => (
          <li key={link}>
            <a href="https://github.com">{link}</a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
