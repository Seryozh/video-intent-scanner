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

          <div className="mt-6 pt-5 border-t border-slate-800">
            <a
              href="/demo"
              className="flex items-center justify-center gap-2 w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch the guided demo instead
            </a>
            <p className="text-xs text-slate-600 text-center mt-2">
              No password needed. See a walkthrough with real data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
