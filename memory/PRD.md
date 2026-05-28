# HB Eid ul Adha — Product Requirements

## Vision
A premium Islamic mobile companion for Eid ul Adha. Authentic Sunnahs, complete Qurbani guidance, Takbeer-e-Tashreeq counter, categorized Duas, prayer times and Qibla — all in a reverent, beautiful dark-emerald + gold UI.

## Scope (MVP — current build)
- **Splash**: Crescent-moon animation, "HB Eid ul Adha" title, tagline, "Powered by HB".
- **Home**: Salaam greeting, Eid countdown hero card (auto next-Eid date), Quick Access grid (Sunnah, Qurbani, Takbeer, Duain, Prayer Times, Qibla, Tasbeeh), today's featured Sunnah, Hadith of the Day.
- **Sunnah**: 9 authentic Eid sunnahs with Arabic text + Urdu + English translation + Hadith reference. Expandable cards.
- **Qurbani Guide**: 4 tabs — Rules, Animal Conditions, Sunnah Method (6 steps), shortcut to Qurbani Duas.
- **Takbeer**: Takbeer-e-Tashreeq in large Arabic + transliteration + translation, tap-to-count circular gold button with haptics, persistent count, reset.
- **Duain**: 6 categories (Eid, Qurbani, Morning Azkar, Evening Azkar, Eating, Traveling). Per-dua favorite + share. Persistent favorites.
- **Prayer Times**: Device location → Aladhan API proxy → Fajr/Sunrise/Dhuhr/Asr/Maghrib/Isha + Hijri date. Web geolocation supported.
- **Qibla**: Device location + Aladhan Qibla bearing + magnetometer (native) → rotating gold arrow compass.
- **Tasbeeh**: Editable target, persistent count, progress bar, haptics on completion.
- **Settings**: Language picker (English / Urdu / Arabic), share app, about.
- **Languages**: English, Urdu, Arabic — strings, content title selection, RTL-aware text rendering.

## Architecture
- **Frontend**: Expo SDK 54 + expo-router (file-based routes), bottom tab navigation, react-native-reanimated for animations, AsyncStorage for prefs/counters/favorites.
- **Backend**: FastAPI (`/api/*`) serving curated Islamic content + proxying Aladhan APIs. Content is static (no DB persistence yet).
- **Integrations**: Aladhan public REST API (no key needed) for prayer times and Qibla bearing.

## Design tokens
Dark emerald (#04473C / #065F50) + gold (#D4AF37) + cream (#F8F4EA). Amiri for Arabic, Cairo for Urdu, Poppins for English. Soft gold glow on sacred CTAs (Takbeer / Tasbeeh button).

## Business value
- Single trusted source for Eid ul Adha worship details — authentic and beautifully rendered.
- Shareable duas drive organic distribution.
- Future: subscriptions for premium audio recitations, exclusive lectures, themes.

## Out of scope (next iterations)
- Islamic Videos library, Kids corner, Push notifications, Audio recitations, Authentication (currently guest-only), Premium subscription tier, Backend admin panel.

## Key endpoints
- `GET /api/content/sunnah` — list of Eid sunnahs
- `GET /api/content/qurbani` — Qurbani guide bundles
- `GET /api/content/takbeer` — Takbeer-e-Tashreeq
- `GET /api/content/duas/categories` — dua category list
- `GET /api/content/duas?category=<id>` — duas by category
- `GET /api/content/daily-hadith` — rotating daily hadith
- `GET /api/content/eid-info` — next Eid date + days left
- `GET /api/prayer-times?lat=&lng=` — Aladhan proxy
- `GET /api/qibla?lat=&lng=` — Aladhan Qibla bearing proxy
