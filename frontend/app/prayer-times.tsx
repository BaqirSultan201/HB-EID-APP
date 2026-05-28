// Prayer Times — fetches device location, calls our Aladhan proxy.

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

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { Colors, Radius, Shadows, Spacing, Typography } from "@/src/constants/theme";
import { useApp } from "@/src/contexts/AppContext";
import { api, PrayerTimings } from "@/src/api/client";

type Status = "idle" | "loading" | "ready" | "denied" | "error";

const PRAYERS: { key: keyof PrayerTimings["timings"]; icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap }[] = [
  { key: "Fajr", icon: "cloudy-night" },
  { key: "Sunrise", icon: "sunny" },
  { key: "Dhuhr", icon: "sunny" },
  { key: "Asr", icon: "partly-sunny" },
  { key: "Maghrib", icon: "moon" },
  { key: "Isha", icon: "star" },
];

export default function PrayerTimesScreen() {
  const { t } = useApp();
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<PrayerTimings | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      let lat: number;
      let lng: number;
      if (Platform.OS === "web") {
        // Browser geolocation
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
        // Native via expo-location (lazy-loaded so web SSR doesn't crash)
        const Location = await import("expo-location");
        const { status: permStatus, canAskAgain } =
          await Location.requestForegroundPermissionsAsync();
        if (permStatus !== "granted") {
          setStatus("denied");
          if (!canAskAgain) setError(t("location_denied"));
          return;
        }
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });
        lat = loc.coords.latitude;
        lng = loc.coords.longitude;
      }
      const res = await api.prayerTimes(lat, lng);
      setData(res);
      setStatus("ready");
    } catch (e) {
      console.error("prayer times", e);
      setError(t("error_generic"));
      setStatus("error");
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.root} testID="prayer-times-screen">
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScreenHeader title={t("prayer_times")} />

        {status === "loading" ? (
          <View style={styles.center}>
            <ActivityIndicator color={Colors.dark.secondary} size="large" />
            <Text style={styles.note}>{t("loading")}</Text>
          </View>
        ) : status === "denied" ? (
          <View style={styles.center}>
            <Ionicons name="location-outline" size={48} color={Colors.dark.secondary} />
            <Text style={styles.note}>{t("enable_location")}</Text>
            <TouchableOpacity onPress={load} style={styles.primaryBtn} testID="prayer-grant-location">
              <Text style={styles.primaryBtnText}>{t("grant_location")}</Text>
            </TouchableOpacity>
            {error ? (
              <TouchableOpacity
                onPress={() => Linking.openSettings()}
                style={styles.secondaryBtn}
                testID="prayer-open-settings"
              >
                <Text style={styles.secondaryBtnText}>{t("open_settings")}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : status === "error" ? (
          <View style={styles.center}>
            <Ionicons name="alert-circle-outline" size={40} color={Colors.dark.error} />
            <Text style={styles.note}>{error}</Text>
            <TouchableOpacity onPress={load} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>{t("loading")}</Text>
            </TouchableOpacity>
          </View>
        ) : data ? (
          <View style={styles.content}>
            <View style={styles.hijriCard}>
              <Text style={styles.hijriLabel}>{t("today")}</Text>
              <Text style={styles.hijriDate}>
                {data.hijri.day} {data.hijri.month} {data.hijri.year}
              </Text>
              <Text style={styles.tz}>{data.timezone}</Text>
            </View>
            {PRAYERS.map((p) => (
              <View key={p.key} style={styles.row} testID={`prayer-${p.key}`}>
                <View style={styles.iconWrap}>
                  <Ionicons name={p.icon} size={20} color={Colors.dark.secondary} />
                </View>
                <Text style={styles.prayerName}>{p.key}</Text>
                <Text style={styles.prayerTime}>{data.timings[p.key]}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dark.background },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  note: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginTop: Spacing.md,
  },
  primaryBtn: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
  },
  primaryBtnText: {
    ...Typography.bodyMedium,
    color: Colors.dark.textPrimary,
  },
  secondaryBtn: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  secondaryBtnText: { ...Typography.body, color: Colors.dark.secondary },
  content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  hijriCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.25)",
    alignItems: "center",
    ...Shadows.card,
  },
  hijriLabel: {
    ...Typography.caption,
    color: Colors.dark.secondary,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  hijriDate: {
    fontFamily: "Amiri_700Bold",
    fontSize: 28,
    color: Colors.dark.textPrimary,
    marginTop: 6,
  },
  tz: {
    ...Typography.caption,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
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
  prayerName: {
    ...Typography.h3,
    color: Colors.dark.textPrimary,
    flex: 1,
  },
  prayerTime: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: Colors.dark.secondary,
  },
});
