// Sunnah list — accordion-style cards. Each card shows Arabic + chosen
// translation + Hadith reference and can expand to show all three.

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/constants/theme";
import { useApp } from "@/src/contexts/AppContext";
import { api, SunnahItem } from "@/src/api/client";

export default function SunnahScreen() {
  const { t, locale } = useApp();
  const [items, setItems] = useState<SunnahItem[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    api
      .sunnah()
      .then((r) => alive && setItems(r.items))
      .catch((e) => console.error("sunnah", e))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <View style={styles.root} testID="sunnah-screen">
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScreenHeader title={t("sunnah_eid")} subtitle={t("eid_sunnah_intro")} />
        {loading ? (
          <ActivityIndicator color={Colors.dark.secondary} size="large" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(i) => i.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const isOpen = expanded === item.id;
              const titleLocal =
                locale === "ur"
                  ? item.title_ur
                  : locale === "ar"
                  ? item.title_ar
                  : item.title_en;
              return (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => setExpanded(isOpen ? null : item.id)}
                  testID={`sunnah-item-${item.id}`}
                  activeOpacity={0.85}
                >
                  <View style={styles.cardHead}>
                    <View style={styles.iconWrap}>
                      <Ionicons
                        name={item.icon as keyof typeof Ionicons.glyphMap}
                        size={20}
                        color={Colors.dark.secondary}
                      />
                    </View>
                    <Text style={styles.title}>{titleLocal}</Text>
                    <Ionicons
                      name={isOpen ? "chevron-up" : "chevron-down"}
                      size={18}
                      color={Colors.dark.textSecondary}
                    />
                  </View>
                  <Text style={styles.arabic}>{item.arabic}</Text>

                  {isOpen ? (
                    <View style={styles.body}>
                      <View style={styles.translationBlock}>
                        <Text style={styles.translationLabel}>{t("translation_urdu")}</Text>
                        <Text style={styles.urduText}>{item.urdu}</Text>
                      </View>
                      <View style={styles.translationBlock}>
                        <Text style={styles.translationLabel}>{t("translation_english")}</Text>
                        <Text style={styles.englishText}>{item.english}</Text>
                      </View>
                    </View>
                  ) : null}

                  <View style={styles.refRow}>
                    <Ionicons name="bookmark-outline" size={12} color={Colors.dark.secondary} />
                    <Text style={styles.ref}>{item.reference}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dark.background },
  list: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    ...Shadows.card,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(212,175,55,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  title: {
    ...Typography.h3,
    color: Colors.dark.textPrimary,
    flex: 1,
  },
  arabic: {
    fontFamily: "Amiri_400Regular",
    fontSize: 22,
    lineHeight: 40,
    color: Colors.dark.textPrimary,
    textAlign: "right",
  },
  body: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  translationBlock: { marginBottom: Spacing.md },
  translationLabel: {
    ...Typography.caption,
    color: Colors.dark.secondary,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  urduText: {
    fontFamily: "Cairo_400Regular",
    fontSize: 17,
    lineHeight: 30,
    color: Colors.dark.textPrimary,
    textAlign: "right",
  },
  englishText: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
  },
  refRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: Spacing.sm,
  },
  ref: {
    ...Typography.caption,
    color: Colors.dark.secondary,
    fontStyle: "italic",
  },
});
