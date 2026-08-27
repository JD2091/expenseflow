import { Outlet, useLocation } from 'react-router-dom';

import { pageMeta } from '../models/navigation';
import { ExpensesProvider } from '../hooks/useExpenses';
import { ToastProvider } from '../hooks/useToasts';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ToastRegion } from './ToastRegion';
import { StickySwitches } from './StickySwitches';

/**
 * The shell every screen renders inside: sidebar, topbar, content region.
 *
 * `ExpensesProvider` sits here — above the `Outlet` and below the router — so
 * one dataset is shared by all five screens and survives navigation. Submitting
 * on `/expenses/new` therefore moves the stat cards on `/` without a reload.
 *
 * `ToastProvider` sits OUTSIDE it: a toast has to outlive the navigation that
 * follows the action that raised it. Submit on `/expenses/new`, land on
 * `/expenses`, and "EXP-1007 submitted" is still on screen — which it would not
 * be if the toast state were owned by the page that pushed it.
 */
export function AppLayout() {
  const { pathname } = useLocation();
  const meta = pageMeta(pathname);

  return (
    <ToastProvider>
      {/* Keeps ?mock=1 / ?demo=fail on the URL across in-app navigation. */}
      <StickySwitches />
      <ExpensesProvider>
        <div className="app-shell">
          <Sidebar />
          <main className="main">
            <TopBar title={meta.title} eyebrow={meta.eyebrow} role={meta.persona} />
            <Outlet />
          </main>
        </div>
        <ToastRegion />
      </ExpensesProvider>
    </ToastProvider>
  );
}
