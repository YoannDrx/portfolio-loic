"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type ConsentCategory = "essential" | "media" | "analytics";

interface ConsentState {
  essential: boolean;
  media: boolean;
  analytics: boolean;
  version: string;
  updatedAt: string;
}

type StoredConsent = ConsentState & { hasChoice?: boolean };

interface ConsentContextValue {
  state: ConsentState;
  hasChoice: boolean;
  isReady: boolean;
  isManagerOpen: boolean;
  openManager: () => void;
  closeManager: () => void;
  acceptAll: () => void;
  rejectAll: () => void;
  setCategory: (category: ConsentCategory, value: boolean) => void;
}

const STORAGE_KEY = "neo-consent-v2";
const CONSENT_VERSION = "2";

const defaultState: ConsentState = {
  essential: true,
  media: false,
  analytics: false,
  version: CONSENT_VERSION,
  updatedAt: new Date().toISOString(),
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export const ConsentProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ConsentState>(defaultState);
  const [isReady, setIsReady] = useState(false);
  const [hasChoice, setHasChoice] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout> | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredConsent;
        const hasValidChoice = parsed.version === CONSENT_VERSION && parsed.hasChoice;
        if (hasValidChoice) {
          setState({ ...parsed, essential: true });
          setHasChoice(true);
          setIsReady(true);
          return;
        }
      }
      // No previous choice or version mismatch => show manager after a brief delay
      showTimer = setTimeout(() => setIsManagerOpen(true), 2000);
    } catch {
      showTimer = setTimeout(() => setIsManagerOpen(true), 2000);
    } finally {
      setIsReady(true);
    }
    return () => {
      if (showTimer) clearTimeout(showTimer);
    };
  }, []);

  useEffect(() => {
    if (!isReady || !hasChoice) return;
    try {
      const payload: StoredConsent = {
        ...state,
        essential: true,
        version: CONSENT_VERSION,
        updatedAt: new Date().toISOString(),
        hasChoice: true,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Silent fail if storage unavailable
    }
  }, [state, isReady, hasChoice]);

  const openManager = useCallback(() => setIsManagerOpen(true), []);
  const closeManager = useCallback(() => setIsManagerOpen(false), []);

  const setCategory = useCallback((category: ConsentCategory, value: boolean) => {
    setState((prev) => ({
      ...prev,
      [category]: category === "essential" ? true : value,
    }));
    setHasChoice(true);
  }, []);

  const acceptAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      essential: true,
      media: true,
      analytics: true,
    }));
    setHasChoice(true);
    setIsManagerOpen(false);
  }, []);

  const rejectAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      essential: true,
      media: false,
      analytics: false,
    }));
    setHasChoice(true);
    setIsManagerOpen(false);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      state,
      hasChoice,
      isReady,
      isManagerOpen,
      openManager,
      closeManager,
      acceptAll,
      rejectAll,
      setCategory,
    }),
    [state, hasChoice, isReady, isManagerOpen, acceptAll, rejectAll, setCategory]
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
};

export const useConsent = () => {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return ctx;
};

export type { ConsentCategory, ConsentState };
