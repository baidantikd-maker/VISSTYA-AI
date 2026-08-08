import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  DEFAULT_LANGUAGE_CODE,
  getLanguage,
  languages,
  translate,
  type Language,
} from "@/locales";

interface LanguageContextType {
  language: Language;
  code: string;
  setCode: (code: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  tr: (key: string) => string;
}

const STORAGE_KEY = "visstya-language";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState<string>(() => {
    if (typeof window === "undefined") return DEFAULT_LANGUAGE_CODE;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && languages.some(l => l.code === stored) ? stored : DEFAULT_LANGUAGE_CODE;
  });

  useEffect(() => {
    const language = getLanguage(code);
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.dir;
    localStorage.setItem(STORAGE_KEY, code);
  }, [code]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) =>
      translate(getLanguage(code).translations, key, params),
    [code],
  );

  const tr = useCallback(
    (key: string) => getLanguage(code).translations.reportData[key] ?? key,
    [code],
  );

  const changeCode = useCallback((next: string) => setCode(next), []);

  return (
    <LanguageContext.Provider
      value={{ language: getLanguage(code), code, setCode: changeCode, t, tr }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
