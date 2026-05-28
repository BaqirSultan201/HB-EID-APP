// "More" tab — navigation to Sunnah, Prayer Times, Qibla, Tasbeeh, Settings, About.

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/constants/theme";
import { useApp } from "@/src/contexts/AppContext";

interface Entry {
  id: string;
  labelKey:
    | "sunnah"
    | "prayer_times"
    | "qibla"
    | "tasbeeh"
    | "settings"
    | "about";
  icon: keyof typeof Ionicons.glyphMap;
  href: string;
}

const ENTRIES: Entry[] = [
  { id: "sunnah", labelKey: "sunnah", icon: "leaf", href: "/sunnah" },
  { id: "prayer-times", labelKey: "prayer_times", icon: "time", href: "/prayer-times" },
  { id: "qibla", labelKey: "qibla", icon: "compass", href: "/qibla" },
  { id: "tasbeeh", labelKey: "tasbeeh", icon: "ellipse", href: "/tasbeeh" },
  { id: "settings", labelKey: "settings", icon: "settings", href: "/settings" },
  { id: "about", labelKey: "about", icon: "information-circle", href: "/about" },
];

export default function MoreTab() {
  const { t } = useApp();
  const router = useRouter();
  return (
    <View style={styles.root} testID="more-tab">
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.titleArabic}>المزيد</Text>
          <Text style={styles.title}>{t("more")}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.list}>
          {ENTRIES.map((e) => (
            <TouchableOpacity
              key={e.id}
              style={styles.row}
              onPress={() => router.push(e.href as any)}
              testID={`more-${e.id}`}
              activeOpacity={0.85}
            >
              <View style={styles.iconWrap}>
                <Ionicons name={e.icon} size={20} color={Colors.dark.secondary} />
              </View>
              <Text style={styles.label}>{t(e.labelKey)}</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.dark.textSecondary} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dark.background },
  safe: { flex: 1 },
  header: { padding: Spacing.lg, paddingBottom: Spacing.md },
  titleArabic: {
    fontFamily: "Amiri_700Bold",
    fontSize: 32,
    color: Colors.dark.secondary,
    lineHeight: 44,
    textAlign: "right",
  },
  title: { ...Typography.h1, color: Colors.dark.textPrimary },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    ...Shadows.card,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(212,175,55,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  label: {
    ...Typography.h3,
    color: Colors.dark.textPrimary,
    flex: 1,
  },
});
