// About screen.

import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CrescentMoon } from "@/src/components/Ornaments";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/constants/theme";
import { useApp } from "@/src/contexts/AppContext";

export default function AboutScreen() {
  const { t } = useApp();
  return (
    <View style={styles.root} testID="about-screen">
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScreenHeader title={t("about")} />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <View style={{ alignItems: "center", marginBottom: Spacing.md }}>
              <CrescentMoon size={80} />
            </View>
            <Text style={styles.title}>{t("app_name")}</Text>
            <Text style={styles.tagline}>{t("tagline")}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.body}>{t("about_body")}</Text>
          </View>
          <Text style={styles.footer}>{t("powered_by")}</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dark.background },
  content: { padding: Spacing.lg, alignItems: "center" },
  hero: { alignItems: "center", marginBottom: Spacing.xl },
  title: {
    ...Typography.h1,
    color: Colors.dark.secondary,
    textAlign: "center",
  },
  tagline: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    ...Shadows.card,
    width: "100%",
  },
  body: {
    ...Typography.body,
    color: Colors.dark.textPrimary,
    lineHeight: 24,
  },
  footer: {
    ...Typography.caption,
    color: Colors.dark.textSecondary,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: Spacing.xl,
  },
});
