// Design tokens for HB Eid ul Adha — derived from /app/design_guidelines.json.
// Dark mode is the primary color mode for this app.

export const Colors = {
  light: {
    background: "#F8F4EA", // warm cream
    surface: "#FFFFFF",
    surfaceAlt: "#F0EAD9",
    primary: "#04473C",
    primaryLight: "#0B7A66",
    secondary: "#D4AF37",
    accent: "#FFD700",
    textPrimary: "#0A0E0D",
    textSecondary: "#4A5568",
    textOnPrimary: "#F8F4EA",
    border: "#E2DDD0",
    success: "#10B981",
    error: "#EF4444",
  },
  dark: {
    background: "#080C0B",
    surface: "#121A18",
    surfaceAlt: "#1A2421",
    primary: "#065F50",
    primaryLight: "#088A75",
    secondary: "#D4AF37",
    accent: "#FFD700",
    textPrimary: "#F8F9FA",
    textSecondary: "#A0AEC0",
    textOnPrimary: "#F8F9FA",
    border: "#1E2A27",
    success: "#34D399",
    error: "#F87171",
  },
} as const;

export type ColorScheme = keyof typeof Colors;
export type ColorPalette = typeof Colors.dark;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
} as const;

export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
  },
  glowGold: {
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  glowPrimary: {
    shadowColor: "#065F50",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
} as const;

export const Fonts = {
  // Loaded via @expo-google-fonts. Family names match the package exports.
  arabic: "Amiri_400Regular",
  arabicBold: "Amiri_700Bold",
  english: "Poppins_400Regular",
  englishMedium: "Poppins_500Medium",
  englishSemi: "Poppins_600SemiBold",
  englishBold: "Poppins_700Bold",
  urdu: "Cairo_400Regular",
  urduMedium: "Cairo_600SemiBold",
  urduBold: "Cairo_700Bold",
} as const;

export const Typography = {
  h1Arabic: { fontFamily: Fonts.arabicBold, fontSize: 44, lineHeight: 64 },
  h2Arabic: { fontFamily: Fonts.arabicBold, fontSize: 32, lineHeight: 48 },
  bodyArabic: { fontFamily: Fonts.arabic, fontSize: 22, lineHeight: 40 },

  h1: { fontFamily: Fonts.englishBold, fontSize: 28, lineHeight: 36 },
  h2: { fontFamily: Fonts.englishSemi, fontSize: 22, lineHeight: 30 },
  h3: { fontFamily: Fonts.englishSemi, fontSize: 18, lineHeight: 26 },
  body: { fontFamily: Fonts.english, fontSize: 15, lineHeight: 22 },
  bodyMedium: { fontFamily: Fonts.englishMedium, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: Fonts.english, fontSize: 12, lineHeight: 16 },

  urduBody: { fontFamily: Fonts.urdu, fontSize: 17, lineHeight: 30 },
  urduTitle: { fontFamily: Fonts.urduBold, fontSize: 20, lineHeight: 32 },
} as const;
