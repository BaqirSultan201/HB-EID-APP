// Qurbani Guide tab — segmented tabs for Rules / Animal / Method / Duas.

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/constants/theme";
import { useApp } from "@/src/contexts/AppContext";
import { api, QurbaniGuide as QurbaniGuideData } from "@/src/api/client";

type TabKey = "rules" | "animal" | "method" | "duas";

export default function QurbaniTab() {
  const { t, locale } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("rules");
  const [data, setData] = useState<QurbaniGuideData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    api
      .qurbani()
      .then((d) => alive && setData(d))
      .catch((e) => console.error("qurbani", e))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const items = useMemo(() => {
    if (!data) return [];
    if (tab === "rules") return data.rules;
    if (tab === "animal") return data.animal_conditions;
    if (tab === "method") return data.method;
    return [];
  }, [tab, data]);

  return (
    <View style={styles.root} testID="qurbani-tab">
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.titleArabic}>الأضحية</Text>
          <Text style={styles.title}>{t("qurbani")}</Text>
          <Text style={styles.subtitle}>{t("qurbani_intro")}</Text>
        </View>

        <View style={styles.tabsRow}>
          <TabPill k="rules" cur={tab} setTab={setTab} label={t("rules")} />
          <TabPill k="animal" cur={tab} setTab={setTab} label={t("animal")} />
          <TabPill k="method" cur={tab} setTab={setTab} label={t("method")} />
          <TabPill k="duas" cur={tab} setTab={setTab} label={t("duas")} />
        </View>

        {loading ? (
          <ActivityIndicator color={Colors.dark.secondary} size="large" style={{ marginTop: 40 }} />
        ) : (
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            {tab === "duas" ? (
              <TouchableOpacity
                style={styles.duaShortcut}
                onPress={() => router.push("/duain/qurbani")}
                testID="qurbani-go-duas"
              >
                <Ionicons name="book" size={22} color={Colors.dark.secondary} />
                <View style={{ flex: 1, marginLeft: Spacing.md }}>
                  <Text style={styles.duaShortcutTitle}>{t("duas")}</Text>
                  <Text style={styles.duaShortcutSub}>
                    {locale === "ur" ? "قربانی کی دعا دیکھیں" : "View Qurbani dua collection"}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.dark.textSecondary} />
              </TouchableOpacity>
            ) : (
              items.map((it, idx) => (
                <View key={idx} style={styles.card}>
                  {"step" in it ? (
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepNumber}>{it.step}</Text>
                    </View>
                  ) : null}
                  <Text style={styles.cardTitle}>
                    {locale === "ur" ? it.title_ur : it.title_en}
                  </Text>
                  <Text style={styles.cardBody}>
                    {locale === "ur" ? it.body_ur : it.body_en}
                  </Text>
                </View>
              ))
            )}
            <View style={{ height: Spacing.xxl }} />
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

function TabPill({
  k,
  cur,
  setTab,
  label,
}: {
  k: TabKey;
  cur: TabKey;
  setTab: (t: TabKey) => void;
  label: string;
}) {
  const active = cur === k;
  return (
    <TouchableOpacity
      onPress={() => setTab(k)}
      style={[styles.pill, active && styles.pillActive]}
      testID={`qurbani-tab-${k}`}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dark.background },
  safe: { flex: 1 },
  header: { padding: Spacing.lg, paddingBottom: Spacing.sm },
  titleArabic: {
    fontFamily: "Amiri_700Bold",
    fontSize: 32,
    color: Colors.dark.secondary,
    lineHeight: 44,
    textAlign: "right",
  },
  title: { ...Typography.h1, color: Colors.dark.textPrimary },
  subtitle: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    gap: 8,
  },
  pill: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: "center",
  },
  pillActive: {
    backgroundColor: "rgba(212,175,55,0.14)",
    borderColor: Colors.dark.secondary,
  },
  pillText: {
    ...Typography.caption,
    fontFamily: "Poppins_500Medium",
    color: Colors.dark.textSecondary,
  },
  pillTextActive: { color: Colors.dark.secondary },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    ...Shadows.card,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(212,175,55,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  stepNumber: {
    fontFamily: "Poppins_700Bold",
    color: Colors.dark.secondary,
    fontSize: 16,
  },
  cardTitle: {
    ...Typography.h3,
    color: Colors.dark.textPrimary,
    marginBottom: Spacing.sm,
  },
  cardBody: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
  },
  duaShortcut: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.surface,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.25)",
  },
  duaShortcutTitle: { ...Typography.h3, color: Colors.dark.textPrimary },
  duaShortcutSub: { ...Typography.caption, color: Colors.dark.textSecondary, marginTop: 2 },
});
