// Dua category detail screen.

import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/constants/theme";
import { useApp } from "@/src/contexts/AppContext";
import { api, Dua } from "@/src/api/client";
import { storage } from "@/src/utils/storage";

const FAV_KEY = "@hb_eid/dua_favorites";

export default function DuaCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { t, locale } = useApp();
  const [duas, setDuas] = useState<Dua[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!category) return;
    let alive = true;
    (async () => {
      try {
        const [res, cats, favs] = await Promise.all([
          api.duasByCategory(category),
          api.duaCategories(),
          storage.getItem<string[]>(FAV_KEY, []),
        ]);
        if (!alive) return;
        setDuas(res.duas);
        setFavorites(favs ?? []);
        const cat = cats.categories.find((c) => c.id === category);
        if (cat) setTitle(locale === "ur" ? cat.name_ur : cat.name_en);
      } catch (e) {
        console.error("duas", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [category, locale]);

  const toggleFav = useCallback(
    async (id: string) => {
      const next = favorites.includes(id)
        ? favorites.filter((f) => f !== id)
        : [...favorites, id];
      setFavorites(next);
      await storage.setItem(FAV_KEY, next);
    },
    [favorites],
  );

  const shareDua = useCallback(async (d: Dua) => {
    const message = `${d.arabic}\n\n${d.transliteration}\n\n${d.english}\n\n— ${d.reference}\n\nShared via HB Eid ul Adha`;
    try {
      if (Platform.OS === "web") {
        await Share.share({ message });
      } else if (await Sharing.isAvailableAsync()) {
        await Share.share({ message });
      } else {
        await Share.share({ message });
      }
    } catch (e) {
      console.error("share", e);
    }
  }, []);

  return (
    <View style={styles.root} testID="dua-category-screen">
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScreenHeader title={title || t("duain")} />
        {loading ? (
          <ActivityIndicator color={Colors.dark.secondary} size="large" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={duas}
            keyExtractor={(i) => i.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const isFav = favorites.includes(item.id);
              const itemTitle = locale === "ur" ? item.title_ur : item.title_en;
              const translation = locale === "ur" ? item.urdu : item.english;
              return (
                <View style={styles.card} testID={`dua-${item.id}`}>
                  <Text style={styles.cardTitle}>{itemTitle}</Text>
                  <Text style={styles.arabic}>{item.arabic}</Text>
                  <Text style={styles.translit}>{item.transliteration}</Text>
                  <Text style={styles.translation}>{translation}</Text>
                  <View style={styles.refRow}>
                    <Ionicons name="bookmark-outline" size={12} color={Colors.dark.secondary} />
                    <Text style={styles.ref}>{item.reference}</Text>
                  </View>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => toggleFav(item.id)}
                      testID={`dua-fav-${item.id}`}
                    >
                      <Ionicons
                        name={isFav ? "heart" : "heart-outline"}
                        size={18}
                        color={isFav ? Colors.dark.secondary : Colors.dark.textSecondary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => shareDua(item)}
                      testID={`dua-share-${item.id}`}
                    >
                      <Ionicons name="share-social-outline" size={18} color={Colors.dark.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.empty}>{t("no_data")}</Text>
            }
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
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    ...Shadows.card,
  },
  cardTitle: {
    ...Typography.h3,
    color: Colors.dark.secondary,
    marginBottom: Spacing.sm,
  },
  arabic: {
    fontFamily: "Amiri_700Bold",
    fontSize: 24,
    lineHeight: 44,
    color: Colors.dark.textPrimary,
    textAlign: "right",
    marginBottom: Spacing.sm,
  },
  translit: {
    ...Typography.body,
    color: Colors.dark.secondary,
    fontStyle: "italic",
    marginBottom: Spacing.sm,
  },
  translation: {
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
  actions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  empty: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginTop: 40,
  },
});
