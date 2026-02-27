"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

const STORAGE_KEY = "banking-cc-openai-api-key";

interface OpenAIKeyContextValue {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  hasKey: boolean;
}

const OpenAIKeyContext = createContext<OpenAIKeyContextValue | null>(null);

export function OpenAIKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setApiKeyState(stored);
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const setApiKey = useCallback((key: string | null) => {
    setApiKeyState(key);
    try {
      if (key) {
        localStorage.setItem(STORAGE_KEY, key);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  const value: OpenAIKeyContextValue = {
    apiKey: mounted ? apiKey : null,
    setApiKey,
    hasKey: apiKey != null && apiKey.trim().length > 0,
  };

  return (
    <OpenAIKeyContext.Provider value={value}>
      {children}
    </OpenAIKeyContext.Provider>
  );
}

export function useOpenAIKey() {
  const ctx = useContext(OpenAIKeyContext);
  if (!ctx) {
    throw new Error("useOpenAIKey must be used within OpenAIKeyProvider");
  }
  return ctx;
}
