// Settings: language switcher + share + about navigation.

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/constants/theme";
import { useApp } from "@/src/contexts/AppContext";
import { LOCALES, Locale } from "@/src/i18n";

export default function SettingsScreen() {
  const { t, locale, setLocale } = useApp();
  const router = useRouter();

  const share = async () => {
    try {
      await Share.share({
        message:
          "Discover authentic Sunnah, Qurbani guide, daily duas and prayer times with HB Eid ul Adha. Get the app now!",
      });
    } catch {
      /* ignore */
    }
  };

  return (
    <View style={styles.root} testID="settings-screen">
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScreenHeader title={t("settings")} />
        <View style={styles.content}>
          <Text style={styles.sectionLabel}>{t("select_language")}</Text>
          <View style={styles.card}>
            {LOCALES.map((l, idx) => {
              const active = locale === l.code;
              return (
                <TouchableOpacity
                  key={l.code}
                  style={[styles.row, idx < LOCALES.length - 1 && styles.rowDivider]}
                  onPress={() => setLocale(l.code as Locale)}
                  testID={`lang-${l.code}`}
                >
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active ? <View style={styles.radioDot} /> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>{l.native}</Text>
                    <Text style={styles.sub}>{l.label}</Text>
                  </View>
                  {active ? (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.dark.secondary} />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>{t("more")}</Text>
          <View style={styles.card}>
            <TouchableOpacity style={[styles.row, styles.rowDivider]} onPress={share} testID="share-app">
              <Ionicons name="share-social-outline" size={20} color={Colors.dark.secondary} style={{ marginRight: Spacing.md }} />
              <Text style={styles.label}>{t("share_app")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.row}
              onPress={() => router.push("/about")}
              testID="about-link"
            >
              <Ionicons name="information-circle-outline" size={20} color={Colors.dark.secondary} style={{ marginRight: Spacing.md }} />
              <Text style={styles.label}>{t("about")}</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.dark.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dark.background },
  content: { padding: Spacing.lg },
  sectionLabel: {
    ...Typography.caption,
    color: Colors.dark.secondary,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    ...Shadows.card,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: Colors.dark.border },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.dark.textSecondary,
    marginRight: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: Colors.dark.secondary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.dark.secondary,
  },
  label: { ...Typography.h3, color: Colors.dark.textPrimary, flex: 1 },
  sub: { ...Typography.caption, color: Colors.dark.textSecondary, marginTop: 2 },
});
