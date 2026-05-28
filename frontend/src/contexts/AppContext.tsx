// Global app context: locale + theme + tasbeeh helpers.
// Locale persists to AsyncStorage via @/src/utils/storage.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Colors, ColorPalette } from "@/src/constants/theme";
import { Locale, isRtlLocale, t as translate, TKey } from "@/src/i18n";
import { storage } from "@/src/utils/storage";

const STORAGE_KEY_LOCALE = "@hb_eid/locale";

interface AppContextValue {
  locale: Locale;
  setLocale: (l: Locale) => Promise<void>;
  isRtl: boolean;
  colors: ColorPalette;
  t: (key: TKey) => string;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    (async () => {
      const saved = await storage.getItem<string>(STORAGE_KEY_LOCALE, "en");
      if (saved === "en" || saved === "ur" || saved === "ar") {
        setLocaleState(saved);
      }
    })();
  }, []);

  const setLocale = useCallback(async (l: Locale) => {
    setLocaleState(l);
    await storage.setItem(STORAGE_KEY_LOCALE, l);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      locale,
      setLocale,
      isRtl: isRtlLocale(locale),
      colors: Colors.dark, // app is dark-first
      t: (key: TKey) => translate(locale, key),
    }),
    [locale, setLocale],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
