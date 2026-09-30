import { JSX, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children, child }: { children: JSX.Element, child?: string }) {
  const [status, setStatus] = useState<
    'checking' | 'authenticated' | 'unauthenticated' | 'unauthorized'
  >('checking');

  useEffect(() => {
    let cancelled = false;

    async function checkUser() {
      try {
        const response = await fetch('http://localhost:3000/auth/me', {
          credentials: 'include',
        });

        const data = await response.json()
        console.log("Data response", data)

        if (!cancelled) {
          if (response.ok) {
            if (child && data.role !== child) {
              setStatus('unauthorized')
            } else {
              setStatus('authenticated')
            }
          } else {
            setStatus('unauthenticated');
          }
        }

      } catch {
        if (!cancelled) {
          setStatus('unauthenticated');
        }
      }
    }

    checkUser();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'checking') {
    return <p>Checking session…</p>;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/" replace />;
  }

  if (status === 'unauthorized') {
    return <div>403 UNAUTHORIZED! STAFF ONLY</div>
  }

  return children;
}