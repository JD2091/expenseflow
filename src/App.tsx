import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { getAppBase } from '@uipath/uipath-typescript';

import { AuthProvider } from './hooks/useAuth';
import { UiPathRuntime } from './services/uipath/runtime';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppLayout } from './components/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ExpenseListPage } from './pages/ExpenseListPage';
import { NewExpensePage } from './pages/NewExpensePage';
import { ExpenseDetailPage } from './pages/ExpenseDetailPage';
import { ApprovalPage } from './pages/ApprovalPage';
import { FinancePage } from './pages/FinancePage';
import { NotFoundPage } from './pages/NotFoundPage';

/**
 * Five screens, one shell.
 *
 * `/expenses/new` is declared BEFORE `/expenses/:code` so "new" is never read
 * as an expense code.
 */
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: 'expenses', element: <ExpenseListPage /> },
        { path: 'expenses/new', element: <NewExpensePage /> },
        { path: 'expenses/:code', element: <ExpenseDetailPage /> },
        { path: 'approvals', element: <ApprovalPage /> },
        { path: 'finance', element: <FinancePage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  {
    /**
     * Critical Rule 10. A deployed Coded App is mounted at a non-root prefix,
     * so a router with a hardcoded `/` basename 404s the moment it ships —
     * even though it worked perfectly on localhost. `getAppBase()` reads the
     * `uipath:app-base` meta tag the platform injects and returns `'/'`
     * locally, so it is safe unconditionally.
     */
    basename: getAppBase(),
  },
);

/**
 * `AuthProvider` owns the OAuth handshake and the `UiPath` instance.
 * `UiPathRuntime` turns that instance into the SDK services the Day-2 service
 * layer calls, signs the user in, and warms the entity schema plus both
 * choice-set maps before the first screen renders — so `mappers.ts` can
 * translate a choice `numberId` synchronously inside a query loop.
 *
 * In mock mode (`?mock=1`) the runtime renders straight through and the app
 * behaves exactly as it did on Day 1.
 *
 * `ErrorBoundary` is the OUTERMOST wrapper. Every UiPath call below it is
 * already translated into a sentence, and every screen has its own error state
 * — but none of that catches a component that throws while RENDERING, and
 * React's response to one of those is to unmount the entire tree. A blank
 * white page with no way back is the one failure a live demo cannot survive.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UiPathRuntime>
          <RouterProvider router={router} />
        </UiPathRuntime>
      </AuthProvider>
    </ErrorBoundary>
  );
}
