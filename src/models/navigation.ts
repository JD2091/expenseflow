/* ============================================================================
 * ExpenseFlow — navigation model
 * ----------------------------------------------------------------------------
 * The `View` union lives HERE and nowhere else. The Day-1 starter declared it
 * twice (App.tsx and Sidebar.tsx) and they drifted the moment a screen was
 * added — STATE.md §4.9. One declaration, imported by everyone.
 * ========================================================================== */

import { ChartPie, CirclePlus, FileText, Inbox, LayoutDashboard } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type View = 'dashboard' | 'expenses' | 'new' | 'approvals' | 'finance';

export interface NavItem {
  id: View;
  label: string;
  to: string;
  icon: LucideIcon;
  /** Which persona owns the screen — rendered as a group heading. */
  persona: 'Employee' | 'Manager' | 'Finance';
  /**
   * Whether a given pathname should light this item up. Explicit predicates
   * beat `NavLink end`: `/expenses/new` must highlight "New Expense" only,
   * while `/expenses/EXP-1007` must highlight "My Expenses".
   */
  matches: (pathname: string) => boolean;
}

export const NAV_ITEMS: readonly NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    to: '/',
    icon: LayoutDashboard,
    persona: 'Employee',
    matches: (pathname) => pathname === '/',
  },
  {
    id: 'expenses',
    label: 'My Expenses',
    to: '/expenses',
    icon: FileText,
    persona: 'Employee',
    matches: (pathname) => pathname.startsWith('/expenses') && pathname !== '/expenses/new',
  },
  {
    id: 'new',
    label: 'New Expense',
    to: '/expenses/new',
    icon: CirclePlus,
    persona: 'Employee',
    matches: (pathname) => pathname === '/expenses/new',
  },
  {
    id: 'approvals',
    label: 'Approvals',
    to: '/approvals',
    icon: Inbox,
    persona: 'Manager',
    matches: (pathname) => pathname.startsWith('/approvals'),
  },
  {
    id: 'finance',
    label: 'Finance',
    to: '/finance',
    icon: ChartPie,
    persona: 'Finance',
    matches: (pathname) => pathname.startsWith('/finance'),
  },
];

export interface PageMeta {
  eyebrow: string;
  title: string;
  /** Which hat the viewer is wearing on this screen — shown under their name. */
  persona: NavItem['persona'];
}

/**
 * The TopBar's title comes from here rather than from a prop threaded through
 * every page — the Day-1 starter hardcoded "My expenses" on all three screens
 * (STATE.md §4, TopBar row).
 */
export function pageMeta(pathname: string): PageMeta {
  const employee = { eyebrow: 'EXPENSE MANAGEMENT', persona: 'Employee' } as const;
  if (pathname === '/') return { ...employee, title: 'Dashboard' };
  if (pathname === '/expenses') return { ...employee, title: 'My expenses' };
  if (pathname === '/expenses/new') return { ...employee, title: 'New expense' };
  if (pathname.startsWith('/expenses/')) return { ...employee, title: 'Expense detail' };
  if (pathname.startsWith('/approvals')) {
    return { eyebrow: 'MANAGER', title: 'Manager approval', persona: 'Manager' };
  }
  if (pathname.startsWith('/finance')) {
    return { eyebrow: 'FINANCE', title: 'Finance overview', persona: 'Finance' };
  }
  return { ...employee, eyebrow: 'EXPENSEFLOW', title: 'Page not found' };
}
