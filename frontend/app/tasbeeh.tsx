// Digital Tasbeeh counter. Persists count + target across sessions.

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/constants/theme";
import { useApp } from "@/src/contexts/AppContext";
import { storage } from "@/src/utils/storage";

const COUNT_KEY = "@hb_eid/tasbeeh_count";
const TARGET_KEY = "@hb_eid/tasbeeh_target";

export default function TasbeehScreen() {
  const { t } = useApp();
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [targetInput, setTargetInput] = useState("33");
  const scale = useSharedValue(1);

  useEffect(() => {
    (async () => {
      const [c, tg] = await Promise.all([
        storage.getItem<number>(COUNT_KEY, 0),
        storage.getItem<number>(TARGET_KEY, 33),
      ]);
      setCount(typeof c === "number" ? c : 0);
      const tn = typeof tg === "number" ? tg : 33;
      setTarget(tn);
      setTargetInput(String(tn));
    })();
  }, []);

  const handleTap = () => {
    const next = count + 1;
    setCount(next);
    storage.setItem(COUNT_KEY, next);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      if (next === target) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
    }
    scale.value = withSpring(0.94, { damping: 12 }, () => {
      scale.value = withSpring(1, { damping: 8 });
    });
  };

  const handleReset = () => {
    setCount(0);
    storage.setItem(COUNT_KEY, 0);
  };

  const applyTarget = () => {
    const n = parseInt(targetInput, 10);
    if (!isNaN(n) && n > 0) {
      setTarget(n);
      storage.setItem(TARGET_KEY, n);
    } else {
      setTargetInput(String(target));
    }
  };

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const progress = target > 0 ? Math.min(1, count / target) : 0;

  return (
    <View style={styles.root} testID="tasbeeh-screen">
      <LinearGradient
        colors={["#000403", "#031A14", "#04473C"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScreenHeader title={t("tasbeeh")} />
        <View style={styles.content}>
          <View style={styles.targetRow}>
            <Text style={styles.targetLabel}>{t("target")}</Text>
            <TextInput
              style={styles.targetInput}
              value={targetInput}
              onChangeText={setTargetInput}
              onBlur={applyTarget}
              keyboardType="number-pad"
              testID="tasbeeh-target-input"
              placeholder={t("enter_target")}
              placeholderTextColor={Colors.dark.textSecondary}
              returnKeyType="done"
              onSubmitEditing={applyTarget}
            />
          </View>

          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>

          <View style={styles.counterArea}>
            <Pressable onPress={handleTap} testID="tasbeeh-tap-button">
              <Animated.View style={[styles.tapBtn, btnStyle]}>
                <Text style={styles.countText} testID="tasbeeh-count">
                  {count}
                </Text>
                <Text style={styles.tapHint}>/ {target}</Text>
              </Animated.View>
            </Pressable>
            <TouchableOpacity onPress={handleReset} style={styles.resetBtn} testID="tasbeeh-reset">
              <Ionicons name="refresh" size={16} color={Colors.dark.textSecondary} />
              <Text style={styles.resetText}>{t("reset")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dark.background },
  content: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  targetRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(18, 26, 24, 0.6)",
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: Spacing.md,
  },
  targetLabel: {
    ...Typography.bodyMedium,
    color: Colors.dark.secondary,
    marginRight: Spacing.md,
  },
  targetInput: {
    flex: 1,
    color: Colors.dark.textPrimary,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    paddingVertical: 4,
  },
  progressBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    marginBottom: Spacing.lg,
  },
  progressFill: {
    height: 6,
    backgroundColor: Colors.dark.secondary,
  },
  counterArea: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: Spacing.xxl },
  tapBtn: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(4,71,60,0.6)",
    borderWidth: 2,
    borderColor: Colors.dark.secondary,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.glowGold,
  },
  countText: {
    fontFamily: "Amiri_700Bold",
    fontSize: 84,
    color: Colors.dark.secondary,
    lineHeight: 92,
  },
  tapHint: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
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
  resetText: { ...Typography.body, color: Colors.dark.textSecondary },
});
