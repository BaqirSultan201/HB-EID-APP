// Lightweight i18n for HB Eid ul Adha.
// Supports English (en), Urdu (ur), Arabic (ar).
// Urdu/Arabic are right-to-left for the title strings; UI direction is
// kept LTR for navigation simplicity, but text alignment switches per locale.

export type Locale = "en" | "ur" | "ar";

export const LOCALES: { code: Locale; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "ur", label: "Urdu", native: "اردو" },
  { code: "ar", label: "Arabic", native: "العربية" },
];

const STRINGS = {
  en: {
    app_name: "HB Eid ul Adha",
    tagline: "Authentic Sunnah & Qurbani Guide",
    powered_by: "Powered by HB",
    home: "Home",
    duain: "Duain",
    takbeer: "Takbeer",
    qurbani: "Qurbani",
    more: "More",
    sunnah: "Sunnah",
    prayer_times: "Prayer Times",
    qibla: "Qibla",
    tasbeeh: "Tasbeeh",
    settings: "Settings",
    eid_countdown: "Eid ul Adha in",
    days: "days",
    today: "Today",
    daily_hadith: "Hadith of the Day",
    quick_access: "Quick Access",
    reference: "Reference",
    rules: "Rules",
    animal: "Animal",
    method: "Method",
    duas: "Duas",
    count: "Count",
    reset: "Reset",
    target: "Target",
    language: "Language",
    about: "About",
    share_app: "Share App",
    about_body:
      "HB Eid ul Adha is a premium Islamic companion dedicated to the authentic Sunnah of the two Eids, the rules and adab of Qurbani, daily azkar, and prayer times — built with reverence by HB.",
    select_language: "Select Language",
    enable_location: "Enable location to see prayer times and Qibla direction.",
    grant_location: "Grant Location",
    location_denied:
      "Location permission denied. Open Settings to enable it manually.",
    open_settings: "Open Settings",
    loading: "Loading…",
    error_generic: "Something went wrong. Please try again.",
    tap_to_count: "Tap to count",
    next_prayer: "Next prayer",
    qibla_direction: "Qibla Direction",
    point_north: "Hold flat and point device north to calibrate.",
    sunnah_eid: "Sunnahs of Eid",
    eid_sunnah_intro: "Authentic Sunnahs of the Prophet ﷺ for the day of Eid.",
    select_category: "Select a Category",
    take_action: "Take Action",
    transliteration: "Transliteration",
    translation_urdu: "Urdu Translation",
    translation_english: "English Translation",
    qurbani_intro:
      "Complete guide to the rules, animal conditions, Sunnah method and duas of Qurbani.",
    takbeer_subtitle: "Recited after every fard prayer from 9 Dhul-Hijjah Fajr to 13 Dhul-Hijjah Asr.",
    enter_target: "Enter target count",
    no_data: "No data available",
  },
  ur: {
    app_name: "ایچ بی عید الاضحیٰ",
    tagline: "اصل سنت اور قربانی کی رہنمائی",
    powered_by: "بزرعہ ایچ بی",
    home: "ہوم",
    duain: "دعائیں",
    takbeer: "تکبیر",
    qurbani: "قربانی",
    more: "مزید",
    sunnah: "سنت",
    prayer_times: "نماز کے اوقات",
    qibla: "قبلہ",
    tasbeeh: "تسبیح",
    settings: "ترتیبات",
    eid_countdown: "عید الاضحیٰ میں باقی",
    days: "دن",
    today: "آج",
    daily_hadith: "حدیث آج کی",
    quick_access: "اہم خصوصیات",
    reference: "حوالہ",
    rules: "احکام",
    animal: "جانور",
    method: "طریقہ",
    duas: "دعائیں",
    count: "تعداد",
    reset: "ری سیٹ",
    target: "ہدف",
    language: "زبان",
    about: "تعارف",
    share_app: "ایپ شیئر کریں",
    about_body:
      "ایچ بی عید الاضحیٰ ایک پریمیم اسلامی ساتھی ہے جو عیدین کی اصل سنتوں، قربانی کے احکام و آداب، روزانہ اذکار اور نماز کے اوقات کا مکمل رہنما ہے — ایچ بی کی جانب سے۔",
    select_language: "زبان منتخب کریں",
    enable_location: "نماز کے اوقات اور قبلہ کی سمت کے لیے لوکیشن اجازت دیں۔",
    grant_location: "اجازت دیں",
    location_denied:
      "لوکیشن کی اجازت نہیں دی گئی۔ سیٹنگز کھول کر اجازت دیں۔",
    open_settings: "سیٹنگز کھولیں",
    loading: "لوڈ ہو رہا ہے…",
    error_generic: "کوئی مسئلہ ہوا، دوبارہ کوشش کریں۔",
    tap_to_count: "گنتی کے لیے دبائیں",
    next_prayer: "اگلی نماز",
    qibla_direction: "قبلہ کی سمت",
    point_north: "موبائل سیدھا رکھیں اور شمال کی طرف کرکے کیلیبریٹ کریں۔",
    sunnah_eid: "عید کی سنتیں",
    eid_sunnah_intro: "نبی کریم ﷺ کی عید کے دن کی اصل سنتیں۔",
    select_category: "کیٹیگری منتخب کریں",
    take_action: "عمل کریں",
    transliteration: "ترجمہ آواز",
    translation_urdu: "اردو ترجمہ",
    translation_english: "انگریزی ترجمہ",
    qurbani_intro:
      "قربانی کے احکام، جانور کی شرائط، سنت طریقہ اور دعاؤں کی مکمل رہنمائی۔",
    takbeer_subtitle: "9 ذو الحجہ کی فجر سے 13 ذو الحجہ کی عصر تک ہر فرض نماز کے بعد۔",
    enter_target: "ہدف تعداد درج کریں",
    no_data: "کوئی ڈیٹا دستیاب نہیں",
  },
  ar: {
    app_name: "إتش بي عيد الأضحى",
    tagline: "دليل السنة والأضحية الموثّق",
    powered_by: "مقدَّم من HB",
    home: "الرئيسية",
    duain: "الأدعية",
    takbeer: "التكبير",
    qurbani: "الأضحية",
    more: "المزيد",
    sunnah: "السنة",
    prayer_times: "أوقات الصلاة",
    qibla: "القبلة",
    tasbeeh: "التسبيح",
    settings: "الإعدادات",
    eid_countdown: "عيد الأضحى بعد",
    days: "أيام",
    today: "اليوم",
    daily_hadith: "حديث اليوم",
    quick_access: "الوصول السريع",
    reference: "المرجع",
    rules: "الأحكام",
    animal: "الحيوان",
    method: "الطريقة",
    duas: "الأدعية",
    count: "العدد",
    reset: "إعادة",
    target: "الهدف",
    language: "اللغة",
    about: "حول",
    share_app: "مشاركة التطبيق",
    about_body:
      "إتش بي عيد الأضحى دليل إسلامي راقٍ يجمع سنن العيد الصحيحة، أحكام وآداب الأضحية، أذكار اليوم وأوقات الصلاة — بفخر من HB.",
    select_language: "اختر اللغة",
    enable_location: "فعِّل الموقع لمعرفة أوقات الصلاة واتجاه القبلة.",
    grant_location: "السماح بالموقع",
    location_denied: "تم رفض إذن الموقع. افتح الإعدادات للسماح يدوياً.",
    open_settings: "فتح الإعدادات",
    loading: "جاري التحميل…",
    error_generic: "حدث خطأ. الرجاء المحاولة مرة أخرى.",
    tap_to_count: "اضغط للعدّ",
    next_prayer: "الصلاة التالية",
    qibla_direction: "اتجاه القبلة",
    point_north: "ضع الهاتف مستوياً ووجِّهه شمالاً للمعايرة.",
    sunnah_eid: "سنن العيد",
    eid_sunnah_intro: "سنن النبي ﷺ الثابتة في يوم العيد.",
    select_category: "اختر فئة",
    take_action: "ابدأ",
    transliteration: "النطق",
    translation_urdu: "ترجمة أردية",
    translation_english: "ترجمة إنجليزية",
    qurbani_intro:
      "دليل شامل لأحكام الأضحية، شروط الحيوان، الطريقة المسنونة والأدعية.",
    takbeer_subtitle: "يقال بعد كل فريضة من فجر 9 ذي الحجة إلى عصر 13 ذي الحجة.",
    enter_target: "أدخل الهدف",
    no_data: "لا توجد بيانات",
  },
} as const;

export type TKey = keyof (typeof STRINGS)["en"];

export function t(locale: Locale, key: TKey): string {
  return STRINGS[locale][key] ?? STRINGS.en[key] ?? key;
}

export function isRtlLocale(locale: Locale): boolean {
  return locale === "ar" || locale === "ur";
}

/**
 * Pick the locale-appropriate body translation for a content item that
 * already carries `arabic`, `urdu`, `english` fields. Falls back gracefully.
 */
export function pickTranslation(
  locale: Locale,
  item: { arabic?: string; urdu?: string; english?: string },
): string {
  if (locale === "ar") return item.arabic ?? item.english ?? item.urdu ?? "";
  if (locale === "ur") return item.urdu ?? item.english ?? "";
  return item.english ?? item.urdu ?? "";
}
