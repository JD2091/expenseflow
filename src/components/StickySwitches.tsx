import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * The query params that are SWITCHES, not navigation state.
 *
 * All three are documented in the README and all three are typed into the
 * address bar live, on stage.
 */
const STICKY = ['mock', 'demo', 'simulateError'] as const;

/**
 * Carry the app's URL switches across in-app navigation.
 *
 *   >>> FOUND IN A HEADLESS WALK-THROUGH, NOT BY READING THE CODE. <<<
 *
 * React Router's `<Link to="/expenses/new">` navigates to exactly that path. The
 * query string is not navigation state as far as the router is concerned, so it
 * is dropped — silently, on the first click, on every link in the sidebar.
 *
 * Which quietly breaks both of the switches this workshop depends on:
 *
 *   `?demo=fail`  is re-read from the URL on every submit, deliberately, so a
 *                 presenter can arm and disarm it without a reload. One click
 *                 on "New Expense" and it is gone — so the rehearsed failure
 *                 fires from the dashboard and not from the form, which is the
 *                 one place the script actually uses it.
 *
 *   `?mock=1`     survives longer, because `USE_MOCK` is read once at module
 *                 load. But it is no longer IN the URL, so the first hard
 *                 refresh — which the Day-2 script explicitly calls for — drops
 *                 the app back onto a tenant that was unreachable enough to
 *                 need the fallback in the first place. The fallback un-applies
 *                 itself at the worst possible moment, and the address bar
 *                 stopped saying so several clicks ago.
 *
 * So: remember any switch that has ever appeared, and put it back whenever a
 * navigation drops it. A URL that carries the switch explicitly always wins —
 * which keeps the "delete it from the address bar and press Enter" instruction
 * working, because that is a full page load and this component's memory dies
 * with the page.
 *
 * Renders nothing. It is a behaviour, not a UI.
 */
export function StickySwitches() {
  const location = useLocation();
  const navigate = useNavigate();

  // A ref, not state: writing it must not re-render, and it must NOT survive a
  // page load — a reload is how a presenter turns a switch off.
  const remembered = useRef(new Map<string, string>());

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let changed = false;

    for (const key of STICKY) {
      const value = params.get(key);

      if (value !== null) {
        // Present in the URL: the URL is the truth, always.
        remembered.current.set(key, value);
        continue;
      }

      const previous = remembered.current.get(key);
      if (previous !== undefined) {
        params.set(key, previous);
        changed = true;
      }
    }

    if (!changed) return;

    // `replace`, so re-adding a switch does not add a history entry and the
    // browser Back button still does what the audience expects.
    void navigate({ pathname: location.pathname, search: `?${params.toString()}` }, { replace: true });
  }, [location.pathname, location.search, navigate]);

  return null;
}
