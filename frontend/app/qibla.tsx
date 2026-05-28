// Qibla finder — uses device magnetometer + Aladhan qibla bearing.

import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/constants/theme";
import { useApp } from "@/src/contexts/AppContext";
import { api } from "@/src/api/client";

type Status = "idle" | "loading" | "ready" | "denied" | "error";

export default function QiblaScreen() {
  const { t } = useApp();
  const [status, setStatus] = useState<Status>("idle");
  const [bearing, setBearing] = useState<number | null>(null); // Qibla bearing from True North
  const [error, setError] = useState<string | null>(null);
  const heading = useSharedValue(0); // device heading in degrees, 0 = north

  const setup = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      let lat: number;
      let lng: number;
      if (Platform.OS === "web") {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
            return;
          }
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 10000,
          });
        }).catch((err: GeolocationPositionError | Error) => {
          if ("code" in err && err.code === 1) {
            setStatus("denied");
            return null;
          }
          throw err;
        });
        if (!pos) return;
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } else {
        const Location = await import("expo-location");
        const { status: permStatus, canAskAgain } =
          await Location.requestForegroundPermissionsAsync();
        if (permStatus !== "granted") {
          setStatus("denied");
          if (!canAskAgain) setError(t("location_denied"));
          return;
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
        lat = loc.coords.latitude;
        lng = loc.coords.longitude;
      }
      const res = await api.qibla(lat, lng);
      setBearing(res.direction);
      if (Platform.OS !== "web") {
        const { Magnetometer } = await import("expo-sensors");
        Magnetometer.setUpdateInterval(150);
      }
      setStatus("ready");
    } catch (e) {
      console.error("qibla setup", e);
      setError(t("error_generic"));
      setStatus("error");
    }
  }, [t]);

  useEffect(() => {
    setup();
  }, [setup]);

  useEffect(() => {
    if (status !== "ready" || Platform.OS === "web") return;
    let sub: { remove: () => void } | null = null;
    (async () => {
      const { Magnetometer } = await import("expo-sensors");
      sub = Magnetometer.addListener((data) => {
        const { x, y } = data;
        let deg = Math.atan2(y, x) * (180 / Math.PI);
        if (deg < 0) deg += 360;
        heading.value = withTiming(deg, { duration: 120 });
      });
    })();
    return () => {
      if (sub) sub.remove();
    };
  }, [status, heading]);

  const arrowStyle = useAnimatedStyle(() => {
    // Rotate so qibla bearing relative to current heading points up.
    const target = (bearing ?? 0) - heading.value;
    return { transform: [{ rotate: `${target}deg` }] };
  });

  return (
    <View style={styles.root} testID="qibla-screen">
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScreenHeader title={t("qibla")} />
        {status === "loading" ? (
          <View style={styles.center}>
            <ActivityIndicator color={Colors.dark.secondary} size="large" />
            <Text style={styles.note}>{t("loading")}</Text>
          </View>
        ) : status === "denied" ? (
          <View style={styles.center}>
            <Ionicons name="compass-outline" size={48} color={Colors.dark.secondary} />
            <Text style={styles.note}>{t("enable_location")}</Text>
            <TouchableOpacity onPress={setup} style={styles.primaryBtn} testID="qibla-grant">
              <Text style={styles.primaryBtnText}>{t("grant_location")}</Text>
            </TouchableOpacity>
            {error ? (
              <TouchableOpacity onPress={() => Linking.openSettings()} style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>{t("open_settings")}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : status === "error" ? (
          <View style={styles.center}>
            <Ionicons name="alert-circle-outline" size={40} color={Colors.dark.error} />
            <Text style={styles.note}>{error}</Text>
            <TouchableOpacity onPress={setup} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>{t("loading")}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.center}>
            <Text style={styles.directionLabel}>{t("qibla_direction")}</Text>
            <Text style={styles.degrees} testID="qibla-degrees">
              {bearing != null ? `${bearing.toFixed(1)}°` : "—"}
            </Text>
            <View style={styles.compassWrap}>
              <View style={styles.compassRing}>
                <Text style={[styles.cardinal, { top: 6 }]}>N</Text>
                <Text style={[styles.cardinal, { bottom: 6 }]}>S</Text>
                <Text style={[styles.cardinal, { left: 12, top: "47%" }]}>W</Text>
                <Text style={[styles.cardinal, { right: 12, top: "47%" }]}>E</Text>
                <Animated.View style={[styles.arrow, arrowStyle]}>
                  <Ionicons name="navigate" size={56} color={Colors.dark.secondary} />
                </Animated.View>
              </View>
            </View>
            <Text style={styles.hint}>{t("point_north")}</Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dark.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: Spacing.lg },
  note: { ...Typography.body, color: Colors.dark.textSecondary, textAlign: "center", marginTop: Spacing.md },
  primaryBtn: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
  },
  primaryBtnText: { ...Typography.bodyMedium, color: Colors.dark.textPrimary },
  secondaryBtn: { marginTop: Spacing.sm, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  secondaryBtnText: { ...Typography.body, color: Colors.dark.secondary },
  directionLabel: {
    ...Typography.caption,
    color: Colors.dark.secondary,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  degrees: {
    fontFamily: "Amiri_700Bold",
    fontSize: 56,
    color: Colors.dark.textPrimary,
    marginVertical: Spacing.md,
  },
  compassWrap: { marginVertical: Spacing.lg },
  compassRing: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: Colors.dark.secondary,
    backgroundColor: "rgba(4,71,60,0.5)",
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.glowGold,
  },
  cardinal: {
    position: "absolute",
    fontFamily: "Poppins_700Bold",
    color: Colors.dark.textSecondary,
    fontSize: 14,
    width: 20,
    textAlign: "center",
  },
  arrow: { alignItems: "center", justifyContent: "center" },
  hint: { ...Typography.caption, color: Colors.dark.textSecondary, textAlign: "center", marginTop: Spacing.md },
});
