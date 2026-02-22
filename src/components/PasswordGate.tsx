'use client';

import { useState, useEffect, useRef } from 'react';

const CORRECT_PASSWORD = 'futureclinic2026';
const SESSION_KEY = 'vis_authenticated';

interface PasswordGateProps {
  children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check URL param first
    const params = new URLSearchParams(window.location.search);
    const keyParam = params.get('key');
    if (keyParam === CORRECT_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      // Clean URL without reload
      const url = new URL(window.location.href);
      url.searchParams.delete('key');
      window.history.replaceState({}, '', url.pathname);
      setIsAuthenticated(true);
      return;
    }

    // Check sessionStorage
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setIsAuthenticated(true);
    } else {
      setError(true);
      setShake(true);
      setPassword('');
      setTimeout(() => setShake(false), 500);
      inputRef.current?.focus();
    }
  };

  // Still loading auth state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-slate-700 border-t-slate-400 rounded-full" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen">
      {/* Blurred background — render children behind */}
      <div className="filter blur-[8px] pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>

      {/* Modal overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-2">Video Intent Scanner</h2>
            <p className="text-sm text-slate-400">
              This tool makes live API calls to YouTube and OpenRouter. To avoid burning through API credits, access requires a password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter password"
                autoFocus
                className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all ${
                  error ? 'border-rose-500' : 'border-slate-700'
                } ${shake ? 'animate-shake' : ''}`}
              />
              {error && (
                <p className="mt-2 text-xs text-rose-400">Incorrect password</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Enter
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-xs text-slate-500">
              Don&apos;t have the password?{' '}
              <a
                href="/demo"
                className="text-emerald-400 hover:text-emerald-300 transition-colors underline"
              >
                See the guided demo instead
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
