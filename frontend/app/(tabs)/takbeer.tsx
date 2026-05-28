// Takbeer tab — large Arabic display, tap-to-count circular button,
// and reset. Count persists across sessions via storage.

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/constants/theme";
import { useApp } from "@/src/contexts/AppContext";
import { api, Takbeer } from "@/src/api/client";
import { storage } from "@/src/utils/storage";

const STORAGE_KEY = "@hb_eid/takbeer_count";

export default function TakbeerTab() {
  const { t, locale } = useApp();
  const [data, setData] = useState<Takbeer | null>(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const scale = useSharedValue(1);
  const glow = useSharedValue(0.5);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [tk, savedCount] = await Promise.all([
          api.takbeer(),
          storage.getItem<number>(STORAGE_KEY, 0),
        ]);
        if (!alive) return;
        setData(tk);
        setCount(typeof savedCount === "number" ? savedCount : 0);
      } catch (e) {
        console.error("takbeer", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handleTap = () => {
    const next = count + 1;
    setCount(next);
    storage.setItem(STORAGE_KEY, next);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    scale.value = withSpring(0.92, { damping: 12 }, () => {
      scale.value = withSpring(1, { damping: 8 });
    });
    glow.value = withTiming(1, { duration: 180 }, () => {
      glow.value = withTiming(0.5, { duration: 600 });
    });
  };

  const handleReset = () => {
    setCount(0);
    storage.setItem(STORAGE_KEY, 0);
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: glow.value,
  }));

  if (loading || !data) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator color={Colors.dark.secondary} size="large" />
      </View>
    );
  }

  const translation = locale === "ur" ? data.urdu : data.english;

  return (
    <View style={styles.root} testID="takbeer-tab">
      <LinearGradient
        colors={["#000403", "#031A14", "#04473C"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.titleEn}>{data.title_en}</Text>
          <Text style={styles.subtitle}>{t("takbeer_subtitle")}</Text>
        </View>

        <View style={styles.arabicCard}>
          <Text style={styles.arabic} testID="takbeer-arabic">
            {data.arabic}
          </Text>
          <Text style={styles.transliteration}>{data.transliteration}</Text>
          <Text style={styles.translation}>{translation}</Text>
        </View>

        <View style={styles.counterArea}>
          <Pressable
            onPress={handleTap}
            testID="takbeer-counter-button"
            accessibilityLabel="Takbeer counter"
          >
            <Animated.View style={[styles.tapBtn, buttonStyle]}>
              <Text style={styles.tapCount} testID="takbeer-count">
                {count}
              </Text>
              <Text style={styles.tapHint}>{t("tap_to_count")}</Text>
            </Animated.View>
          </Pressable>

          <TouchableOpacity
            onPress={handleReset}
            style={styles.resetBtn}
            testID="takbeer-reset-button"
          >
            <Ionicons name="refresh" size={16} color={Colors.dark.textSecondary} />
            <Text style={styles.resetText}>{t("reset")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dark.background },
  safe: { flex: 1, paddingHorizontal: Spacing.lg },
  center: { alignItems: "center", justifyContent: "center" },
  header: {
    paddingVertical: Spacing.lg,
    alignItems: "center",
  },
  titleEn: {
    ...Typography.h2,
    color: Colors.dark.secondary,
    textAlign: "center",
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: Spacing.md,
  },
  arabicCard: {
    backgroundColor: "rgba(18, 26, 24, 0.7)",
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.25)",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  arabic: {
    fontFamily: "Amiri_700Bold",
    fontSize: 28,
    lineHeight: 56,
    color: Colors.dark.textPrimary,
    textAlign: "center",
    textShadowColor: "rgba(212,175,55,0.4)",
    textShadowRadius: 16,
  },
  transliteration: {
    ...Typography.body,
    color: Colors.dark.secondary,
    textAlign: "center",
    marginTop: Spacing.sm,
    fontStyle: "italic",
  },
  translation: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
  counterArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: Spacing.xl,
  },
  tapBtn: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(4,71,60,0.6)",
    borderWidth: 2,
    borderColor: Colors.dark.secondary,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.glowGold,
  },
  tapCount: {
    fontFamily: "Amiri_700Bold",
    fontSize: 72,
    color: Colors.dark.secondary,
    lineHeight: 80,
  },
  tapHint: {
    ...Typography.caption,
    color: Colors.dark.textSecondary,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 4,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  resetText: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
  },
});
