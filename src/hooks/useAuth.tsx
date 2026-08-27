import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { UiPath } from '@uipath/uipath-typescript/core';

import { describeError } from '../services/uipath/errors';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  sdk: UiPath;
  login: () => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // `new UiPath()` reads clientId/orgName/tenantName/baseUrl/scope/redirectUri
  // from <meta name="uipath:*"> tags. The uipathCodedApps() Vite plugin
  // injects them locally from uipath.json; the platform injects them in prod.
  const [sdk] = useState<UiPath>(() => new UiPath());
  const didInit = useRef(false);

  useEffect(() => {
    // Guard against React Strict Mode's double-invocation in dev.
    // OAuth authorization codes are single-use — calling completeOAuth()
    // twice would fail the second time with "Authentication failed".
    if (didInit.current) return;
    didInit.current = true;

    const initializeAuth = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (sdk.isInOAuthCallback()) {
          await sdk.completeOAuth();
          // Strip the OAuth params so a refresh doesn't try to re-consume the
          // (now-invalid) code — but ONLY those. Replacing the whole search
          // string would also delete `?mock=1` and `?demo=fail`, which are the
          // two switches the run-of-show depends on, and they would vanish at
          // the one moment nobody would think to look for them.
          const params = new URLSearchParams(window.location.search);
          for (const key of ['code', 'state', 'session_state', 'iss']) params.delete(key);
          const query = params.toString();
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname + (query === '' ? '' : `?${query}`),
          );
        }
        setIsAuthenticated(sdk.isAuthenticated());
      } catch (err) {
        // Translated, like every other failure in the app: `<UiPathRuntime>`
        // renders this string straight onto the sign-in splash.
        setError(describeError(err, 'sign you in to UiPath').message);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, [sdk]);

  const login = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await sdk.initialize();
    } catch (err) {
      setError(describeError(err, 'sign you in to UiPath').message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    sdk.logout();
    setIsAuthenticated(false);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, sdk, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
