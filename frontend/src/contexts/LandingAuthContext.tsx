'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export type AuthMode = 'login' | 'register';

interface LandingAuthContextType {
  authMode: AuthMode | null;
  openAuth: (mode: AuthMode) => void;
  closeAuth: () => void;
  setAuthMode: (mode: AuthMode) => void;
}

const LandingAuthContext = createContext<LandingAuthContextType | undefined>(undefined);

export function LandingAuthProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [authMode, setAuthModeState] = useState<AuthMode | null>(null);

  useEffect(() => {
    const authParam = searchParams?.get('auth');
    if (authParam === 'login' || authParam === 'register') {
      setAuthModeState(authParam);
    }
  }, [searchParams]);

  const openAuth = (mode: AuthMode) => {
    setAuthModeState(mode);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('auth', mode);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const closeAuth = () => {
    setAuthModeState(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('auth');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const setAuthMode = (mode: AuthMode) => {
    setAuthModeState(mode);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('auth', mode);
      window.history.replaceState({}, '', url.toString());
    }
  };

  return (
    <LandingAuthContext.Provider
      value={{
        authMode,
        openAuth,
        closeAuth,
        setAuthMode,
      }}
    >
      {children}
    </LandingAuthContext.Provider>
  );
}

export function useLandingAuth() {
  const context = useContext(LandingAuthContext);
  if (!context) {
    // Return graceful fallback if used outside provider
    return {
      authMode: null,
      openAuth: () => {},
      closeAuth: () => {},
      setAuthMode: () => {},
    };
  }
  return context;
}
