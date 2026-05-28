// Home screen — premium landing with Eid countdown, daily hadith,
// quick access grid, and today's featured Sunnah.

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CrescentMoon, StarField } from "@/src/components/Ornaments";
import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/constants/theme";
import { useApp } from "@/src/contexts/AppContext";
import { api, DailyHadith, EidInfo, SunnahItem } from "@/src/api/client";
import { pickTranslation } from "@/src/i18n";

interface QuickItem {
  id: string;
  labelKey:
    | "sunnah"
    | "qurbani"
    | "takbeer"
    | "duain"
    | "prayer_times"
    | "qibla"
    | "tasbeeh";
  icon: keyof typeof Ionicons.glyphMap;
  href: string;
  tone: "primary" | "gold";
}

const QUICK_ITEMS: QuickItem[] = [
  { id: "sunnah", labelKey: "sunnah", icon: "leaf", href: "/sunnah", tone: "primary" },
  { id: "qurbani", labelKey: "qurbani", icon: "ribbon", href: "/(tabs)/qurbani", tone: "gold" },
  { id: "takbeer", labelKey: "takbeer", icon: "moon", href: "/(tabs)/takbeer", tone: "gold" },
  { id: "duain", labelKey: "duain", icon: "book", href: "/(tabs)/duain", tone: "primary" },
  { id: "prayer", labelKey: "prayer_times", icon: "time", href: "/prayer-times", tone: "primary" },
  { id: "qibla", labelKey: "qibla", icon: "compass", href: "/qibla", tone: "gold" },
  { id: "tasbeeh", labelKey: "tasbeeh", icon: "ellipse", href: "/tasbeeh", tone: "primary" },
];

export default function Home() {
  const { t, locale, isRtl } = useApp();
  const router = useRouter();
  const [eid, setEid] = useState<EidInfo | null>(null);
  const [hadith, setHadith] = useState<DailyHadith | null>(null);
  const [featured, setFeatured] = useState<SunnahItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [e, h, s] = await Promise.all([
          api.eidInfo(),
          api.dailyHadith(),
          api.sunnah(),
        ]);
        if (!alive) return;
        setEid(e);
        setHadith(h);
        // Pick today's sunnah deterministically by day of year.
        const items = s.items;
        const today = new Date();
        const start = new Date(today.getFullYear(), 0, 0);
        const diff = today.getTime() - start.getTime();
        const dayOfYear = Math.floor(diff / 86400000);
        setFeatured(items[dayOfYear % items.length]);
      } catch (err) {
        console.error("home load", err);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <View style={styles.root} testID="home-screen">
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Greeting */}
          <View style={styles.greetingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.salaam} testID="home-salaam">
                السلام عليكم
              </Text>
              <Text style={styles.appName}>{t("app_name")}</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              style={styles.langChip}
              testID="home-settings-button"
            >
              <Ionicons name="language" size={16} color={Colors.dark.secondary} />
              <Text style={styles.langChipText}>{locale.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>

          {/* Eid Countdown hero */}
          <View style={styles.heroCard} testID="home-eid-countdown">
            <LinearGradient
              colors={["#04473C", "#021A14"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <StarField />
            <View style={styles.heroMoon}>
              <CrescentMoon size={80} opacity={0.85} />
            </View>
            <Text style={styles.heroLabel}>{t("eid_countdown")}</Text>
            {loading ? (
              <ActivityIndicator color={Colors.dark.secondary} style={{ marginVertical: 8 }} />
            ) : (
              <Text style={styles.heroNumber} testID="home-days-left">
                {eid?.days_left ?? "—"}
              </Text>
            )}
            <Text style={styles.heroDays}>{t("days")}</Text>
            {eid?.next_eid_date ? (
              <Text style={styles.heroDate}>
                {new Date(eid.next_eid_date).toDateString()}
              </Text>
            ) : null}
          </View>

          {/* Quick Access Grid */}
          <Text style={styles.sectionTitle}>{t("quick_access")}</Text>
          <View style={styles.grid}>
            {QUICK_ITEMS.map((q) => (
              <Link href={q.href as any} key={q.id} asChild>
                <TouchableOpacity
                  style={styles.gridItem}
                  testID={`home-quick-${q.id}`}
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.gridIconWrap,
                      q.tone === "gold" ? styles.gridIconGold : styles.gridIconPrimary,
                    ]}
                  >
                    <Ionicons
                      name={q.icon}
                      size={22}
                      color={q.tone === "gold" ? Colors.dark.secondary : Colors.dark.primaryLight}
                    />
                  </View>
                  <Text style={styles.gridLabel} numberOfLines={1}>
                    {t(q.labelKey)}
                  </Text>
                </TouchableOpacity>
              </Link>
            ))}
          </View>

          {/* Featured Sunnah card */}
          {featured ? (
            <TouchableOpacity
              style={styles.sunnahCard}
              onPress={() => router.push("/sunnah")}
              testID="home-featured-sunnah"
              activeOpacity={0.9}
            >
              <View style={styles.sunnahHeaderRow}>
                <View style={styles.sunnahBadge}>
                  <Ionicons name="sparkles" size={12} color={Colors.dark.secondary} />
                  <Text style={styles.sunnahBadgeText}>{t("today")} · {t("sunnah")}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.dark.textSecondary} />
              </View>
              <Text style={[styles.sunnahArabic, isRtl && { textAlign: "right" }]}>
                {featured.arabic}
              </Text>
              <Text style={[styles.sunnahTranslation, isRtl && { textAlign: "right" }]}>
                {pickTranslation(locale, featured)}
              </Text>
              <Text style={styles.sunnahRef}>— {featured.reference}</Text>
            </TouchableOpacity>
          ) : null}

          {/* Daily Hadith */}
          {hadith ? (
            <View style={styles.hadithCard} testID="home-daily-hadith">
              <View style={styles.hadithHeaderRow}>
                <Ionicons name="book-outline" size={16} color={Colors.dark.secondary} />
                <Text style={styles.hadithLabel}>{t("daily_hadith")}</Text>
              </View>
              <Text style={[styles.hadithArabic, isRtl && { textAlign: "right" }]}>
                {hadith.arabic}
              </Text>
              <Text style={[styles.hadithBody, isRtl && { textAlign: "right" }]}>
                {pickTranslation(locale, hadith)}
              </Text>
              <Text style={styles.hadithRef}>— {hadith.reference}</Text>
            </View>
          ) : null}
          <View style={{ height: Spacing.xl }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dark.background },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl, paddingTop: Spacing.sm },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  salaam: {
    fontFamily: "Amiri_700Bold",
    fontSize: 28,
    color: Colors.dark.secondary,
    lineHeight: 36,
  },
  appName: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  langChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 6,
  },
  langChipText: {
    ...Typography.caption,
    color: Colors.dark.secondary,
    fontFamily: "Poppins_600SemiBold",
  },
  heroCard: {
    borderRadius: Radius.lg,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    overflow: "hidden",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.25)",
    marginBottom: Spacing.lg,
    minHeight: 240,
    justifyContent: "center",
    ...Shadows.glowPrimary,
  },
  heroMoon: {
    position: "absolute",
    top: 16,
    right: 16,
    opacity: 0.9,
  },
  heroLabel: {
    ...Typography.caption,
    color: "#E8C766",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: Spacing.sm,
  },
  heroNumber: {
    fontFamily: "Amiri_700Bold",
    fontSize: 84,
    color: Colors.dark.secondary,
    lineHeight: 92,
    textShadowColor: "rgba(212,175,55,0.6)",
    textShadowRadius: 20,
  },
  heroDays: {
    ...Typography.h3,
    color: Colors.dark.textPrimary,
    marginTop: -4,
  },
  heroDate: {
    ...Typography.caption,
    color: Colors.dark.textSecondary,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.dark.textPrimary,
    marginBottom: Spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  gridItem: {
    width: "31%",
    backgroundColor: Colors.dark.surface,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: "center",
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  gridIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  gridIconPrimary: { backgroundColor: "rgba(6,95,80,0.18)" },
  gridIconGold: { backgroundColor: "rgba(212,175,55,0.14)" },
  gridLabel: {
    ...Typography.caption,
    color: Colors.dark.textPrimary,
    fontFamily: "Poppins_500Medium",
    textAlign: "center",
  },
  sunnahCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.25)",
    ...Shadows.card,
  },
  sunnahHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sunnahBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(212,175,55,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 4,
  },
  sunnahBadgeText: {
    ...Typography.caption,
    color: Colors.dark.secondary,
    fontFamily: "Poppins_500Medium",
  },
  sunnahArabic: {
    fontFamily: "Amiri_700Bold",
    fontSize: 22,
    lineHeight: 40,
    color: Colors.dark.textPrimary,
    textAlign: "right",
    marginBottom: Spacing.sm,
  },
  sunnahTranslation: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
  },
  sunnahRef: {
    ...Typography.caption,
    color: Colors.dark.secondary,
    marginTop: Spacing.sm,
    fontStyle: "italic",
  },
  hadithCard: {
    backgroundColor: Colors.dark.surfaceAlt,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  hadithHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: Spacing.md,
  },
  hadithLabel: {
    ...Typography.bodyMedium,
    color: Colors.dark.secondary,
  },
  hadithArabic: {
    fontFamily: "Amiri_400Regular",
    fontSize: 20,
    lineHeight: 36,
    color: Colors.dark.textPrimary,
    textAlign: "right",
    marginBottom: Spacing.sm,
  },
  hadithBody: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
  },
  hadithRef: {
    ...Typography.caption,
    color: Colors.dark.secondary,
    marginTop: Spacing.sm,
    fontStyle: "italic",
  },
});
