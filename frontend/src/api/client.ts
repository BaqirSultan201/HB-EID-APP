// Thin fetch wrapper around the FastAPI backend.
// All routes are mounted under `/api` per ingress rules.

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!BASE_URL) {
  // Surface misconfig early in dev — never silently fall back.
   
  console.warn("[api] EXPO_PUBLIC_BACKEND_URL is not set");
}

async function request<T>(path: string): Promise<T> {
  const url = `${BASE_URL}/api${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${path}`);
  }
  return (await res.json()) as T;
}

// ---------- Types ----------

export interface SunnahItem {
  id: string;
  title_en: string;
  title_ur: string;
  title_ar: string;
  arabic: string;
  urdu: string;
  english: string;
  reference: string;
  icon: string;
}

export interface QurbaniRule {
  title_en: string;
  title_ur: string;
  body_en: string;
  body_ur: string;
}

export interface QurbaniMethodStep extends QurbaniRule {
  step: number;
}

export interface QurbaniGuide {
  rules: QurbaniRule[];
  animal_conditions: QurbaniRule[];
  method: QurbaniMethodStep[];
}

export interface Takbeer {
  title_en: string;
  title_ur: string;
  arabic: string;
  transliteration: string;
  urdu: string;
  english: string;
  reference: string;
}

export interface DuaCategory {
  id: string;
  name_en: string;
  name_ur: string;
  icon: string;
}

export interface Dua {
  id: string;
  title_en: string;
  title_ur: string;
  arabic: string;
  transliteration: string;
  english: string;
  urdu: string;
  reference: string;
  category?: string;
}

export interface DailyHadith {
  arabic: string;
  english: string;
  urdu: string;
  reference: string;
}

export interface EidInfo {
  next_eid_date: string | null;
  days_left: number | null;
  name: string;
  tagline: string;
}

export interface PrayerTimings {
  timings: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
  };
  timezone: string;
  hijri: {
    date: string;
    day: string;
    month: string;
    year: string;
  };
}

// ---------- Endpoints ----------

export const api = {
  sunnah: () => request<{ items: SunnahItem[] }>("/content/sunnah"),
  qurbani: () => request<QurbaniGuide>("/content/qurbani"),
  takbeer: () => request<Takbeer>("/content/takbeer"),
  duaCategories: () =>
    request<{ categories: DuaCategory[] }>("/content/duas/categories"),
  duasByCategory: (categoryId: string) =>
    request<{ category: string; duas: Dua[] }>(
      `/content/duas?category=${encodeURIComponent(categoryId)}`,
    ),
  dailyHadith: () => request<DailyHadith>("/content/daily-hadith"),
  eidInfo: () => request<EidInfo>("/content/eid-info"),
  prayerTimes: (lat: number, lng: number) =>
    request<PrayerTimings>(
      `/prayer-times?lat=${lat}&lng=${lng}`,
    ),
  qibla: (lat: number, lng: number) =>
    request<{ direction: number; lat: number; lng: number }>(
      `/qibla?lat=${lat}&lng=${lng}`,
    ),
};
