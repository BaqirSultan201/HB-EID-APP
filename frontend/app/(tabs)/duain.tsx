// Duain tab — categories list. Tapping opens dua list for the category.

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/constants/theme";
import { useApp } from "@/src/contexts/AppContext";
import { api, DuaCategory } from "@/src/api/client";

export default function DuainTab() {
  const { t, locale } = useApp();
  const router = useRouter();
  const [categories, setCategories] = useState<DuaCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    api
      .duaCategories()
      .then((r) => alive && setCategories(r.categories))
      .catch((e) => console.error("dua cats", e))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <View style={styles.root} testID="duain-tab">
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.titleArabic}>الأدعية</Text>
          <Text style={styles.title}>{t("duain")}</Text>
          <Text style={styles.subtitle}>{t("select_category")}</Text>
        </View>
        {loading ? (
          <ActivityIndicator color={Colors.dark.secondary} size="large" />
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(i) => i.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/duain/${item.id}`)}
                testID={`dua-category-${item.id}`}
                activeOpacity={0.85}
              >
                <View style={styles.iconWrap}>
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={22}
                    color={Colors.dark.secondary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>
                    {locale === "ur" ? item.name_ur : item.name_en}
                  </Text>
                  <Text style={styles.cardSub}>
                    {locale === "ur" ? item.name_en : item.name_ur}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.dark.textSecondary} />
              </TouchableOpacity>
            )}
          />
        )}
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
    fontSize: 36,
    color: Colors.dark.secondary,
    lineHeight: 48,
    textAlign: "right",
  },
  title: {
    ...Typography.h1,
    color: Colors.dark.textPrimary,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    ...Shadows.card,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(212,175,55,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  cardTitle: {
    ...Typography.h3,
    color: Colors.dark.textPrimary,
  },
  cardSub: {
    ...Typography.caption,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
});
