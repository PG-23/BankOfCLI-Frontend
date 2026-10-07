// TEMPORARY — stands in for the login page until feature/auth-pages is merged.
// Logs in as the first mock user (src/mocks/users.json) through the real auth flow,
// then redirects to /deposit. Delete this file and its route in App.tsx when the real LoginPage lands.

import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router';
import type { ApiError } from '../models';
import { Spinner } from '../components/ui';
import { useAuth } from '../hooks/useAuth';

const MOCK_LOGIN = { identifier: 'asmith1234', password: 'password1' };

export function DevAutoLogin() {
  const { user, login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false); // StrictMode runs effects twice in dev — only log in once

  useEffect(() => {
    if (user || started.current) return;
    started.current = true;
    login(MOCK_LOGIN).catch((err: Partial<ApiError>) => setError(err.message ?? 'Auto-login failed.'));
  }, [user, login]);

  if (user) return <Navigate to="/deposit" replace />;

  return (
    <main className="flex min-h-screen items-center justify-center gap-sm p-md text-text-muted">
      {error ? (
        <p role="alert" className="text-error">{error}</p>
      ) : (
        <>
          <Spinner /> Signing in as the test user…
        </>
      )}
    </main>
  );
}
