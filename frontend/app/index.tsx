// Splash screen: crescent moon fade-in, app title, tagline, "Powered by HB".
// Auto-redirects to the tab layout after the intro animation.

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { CrescentMoon, StarField } from "@/src/components/Ornaments";
import { Colors, Fonts, Spacing, Typography } from "@/src/constants/theme";
import { useApp } from "@/src/contexts/AppContext";

export default function SplashIndex() {
  const router = useRouter();
  const { t } = useApp();

  const moonOpacity = useSharedValue(0);
  const moonScale = useSharedValue(0.6);
  const titleOpacity = useSharedValue(0);
  const titleTranslate = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);
  const footerOpacity = useSharedValue(0);

  useEffect(() => {
    moonOpacity.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
    moonScale.value = withTiming(1, { duration: 1100, easing: Easing.out(Easing.cubic) });
    titleOpacity.value = withDelay(600, withTiming(1, { duration: 700 }));
    titleTranslate.value = withDelay(600, withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) }));
    taglineOpacity.value = withDelay(1100, withTiming(1, { duration: 600 }));
    footerOpacity.value = withDelay(1500, withTiming(0.8, { duration: 600 }));

    const tmr = setTimeout(() => {
      router.replace("/(tabs)");
    }, 2600);
    return () => clearTimeout(tmr);
  }, [router, moonOpacity, moonScale, titleOpacity, titleTranslate, taglineOpacity, footerOpacity]);

  const moonStyle = useAnimatedStyle(() => ({
    opacity: moonOpacity.value,
    transform: [{ scale: moonScale.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslate.value }],
  }));
  const taglineStyle = useAnimatedStyle(() => ({ opacity: taglineOpacity.value }));
  const footerStyle = useAnimatedStyle(() => ({ opacity: footerOpacity.value }));

  return (
    <View style={styles.container} testID="splash-screen">
      <LinearGradient
        colors={["#000403", "#031A14", "#04473C"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <StarField />
      <View style={styles.center}>
        <Animated.View style={[styles.moonWrap, moonStyle]}>
          <CrescentMoon size={140} color={Colors.dark.secondary} />
        </Animated.View>
        <Animated.View style={titleStyle}>
          <Text style={styles.arabicTitle} testID="splash-arabic-title">
            عيد الأضحى
          </Text>
          <Text style={styles.title} testID="splash-title">
            HB Eid ul Adha
          </Text>
        </Animated.View>
        <Animated.View style={taglineStyle}>
          <Text style={styles.tagline}>{t("tagline")}</Text>
        </Animated.View>
      </View>
      <Animated.View style={[styles.footer, footerStyle]}>
        <View style={styles.divider} />
        <Text style={styles.poweredBy} testID="splash-powered-by">
          {t("powered_by")}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  moonWrap: {
    marginBottom: Spacing.xl,
    shadowColor: Colors.dark.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 12,
  },
  arabicTitle: {
    ...Typography.h1Arabic,
    color: Colors.dark.secondary,
    textAlign: "center",
    fontFamily: Fonts.arabicBold,
  },
  title: {
    ...Typography.h1,
    color: Colors.dark.textPrimary,
    textAlign: "center",
    marginTop: Spacing.xs,
    letterSpacing: 0.5,
  },
  tagline: {
    ...Typography.bodyMedium,
    color: "#E8C766",
    textAlign: "center",
    marginTop: Spacing.md,
    letterSpacing: 0.3,
  },
  footer: {
    position: "absolute",
    bottom: Spacing.xxl,
    alignItems: "center",
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: Colors.dark.secondary,
    marginBottom: Spacing.sm,
    opacity: 0.6,
  },
  poweredBy: {
    ...Typography.caption,
    color: Colors.dark.textSecondary,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});
