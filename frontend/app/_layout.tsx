// Root layout: font loading, providers, status bar, prevent splash hide.

import {
  Amiri_400Regular,
  Amiri_700Bold,
} from "@expo-google-fonts/amiri";
import {
  Cairo_400Regular,
  Cairo_600SemiBold,
  Cairo_700Bold,
} from "@expo-google-fonts/cairo";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import { View } from "react-native";

import { Colors } from "@/src/constants/theme";
import { AppProvider } from "@/src/contexts/AppContext";
import { useIconFonts } from "@/src/hooks/use-icon-fonts";

// Keep the native splash visible from cold start until icon + content
// fonts register. Required because @expo/vector-icons' componentDidMount
// fallback fires Font.loadAsync against a broken vendor path if any
// <Icon> mounts before the family is registered.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [iconsLoaded, iconError] = useIconFonts();
  const [contentLoaded, contentError] = useFonts({
    Amiri_400Regular,
    Amiri_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Cairo_400Regular,
    Cairo_600SemiBold,
    Cairo_700Bold,
  });

  const ready = (iconsLoaded || iconError) && (contentLoaded || contentError);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <AppProvider>
      <View style={{ flex: 1, backgroundColor: Colors.dark.background }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.dark.background },
            animation: "fade",
          }}
        />
      </View>
    </AppProvider>
  );
}
