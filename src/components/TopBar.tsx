import { CURRENT_USER } from '../lib/constants';
import { initials } from '../lib/format';

interface TopBarProps {
  /** The current screen's name. The starter hardcoded "My expenses" on all of them. */
  title: string;
  eyebrow: string;
  /** The persona whose screen this is — Employee, Manager or Finance. */
  role: string;
}

export function TopBar({ title, eyebrow, role }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="topbar-heading">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="truncate" title={title}>
          {title}
        </h1>
      </div>
      <div className="profile">
        <div className="avatar">{initials(CURRENT_USER)}</div>
        <div>
          <div className="profile-name truncate">{CURRENT_USER}</div>
          <div className="profile-role">{role}</div>
        </div>
      </div>
    </header>
  );
}
