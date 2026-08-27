import { Link, useLocation } from 'react-router-dom';

import { NAV_ITEMS } from '../models/navigation';
import type { NavItem } from '../models/navigation';

/**
 * The nav shell.
 *
 * Two starter defects die here: the unused chart icon import (§4.8 — it fails
 * `noUnusedLocals`) and the second copy of the `View` union (§4.9 — the type now
 * lives only in `models/navigation.ts`).
 *
 * Items are grouped by persona because ExpenseFlow has three of them, and the
 * grouping is what makes "one app, three audiences" legible in one glance.
 */
const PERSONAS: readonly NavItem['persona'][] = ['Employee', 'Manager', 'Finance'];

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">E</div>
        <div>
          <div className="brand-name">ExpenseFlow</div>
          <div className="brand-subtitle">Coded Apps demo</div>
        </div>
      </div>

      <nav className="nav" aria-label="Main">
        {PERSONAS.map((persona) => (
          <div key={persona} className="nav-group">
            <div className="nav-group-label">{persona}</div>
            {NAV_ITEMS.filter((item) => item.persona === persona).map(
              ({ id, label, to, icon: Icon, matches }) => (
                <Link
                  key={id}
                  to={to}
                  className={`nav-item ${matches(pathname) ? 'active' : ''}`}
                  aria-current={matches(pathname) ? 'page' : undefined}
                >
                  <Icon size={18} aria-hidden />
                  <span className="truncate">{label}</span>
                </Link>
              ),
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="demo-label">LIVE DEMO</div>
        <p>Day 1: UI-first foundation</p>
        <p className="muted">Day 2: UiPath integration</p>
      </div>
    </aside>
  );
}
