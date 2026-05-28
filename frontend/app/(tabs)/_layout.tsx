// Bottom tab navigation: Home, Duain, Takbeer, Qurbani, More.

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import { Colors } from "@/src/constants/theme";
import { useApp } from "@/src/contexts/AppContext";

export default function TabsLayout() {
  const { t } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.dark.secondary,
        tabBarInactiveTintColor: "#5C6A66",
        tabBarStyle: styles.bar,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: { paddingTop: 6 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home"),
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="home" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="duain"
        options={{
          title: t("duain"),
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="book" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="takbeer"
        options={{
          title: t("takbeer"),
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="moon" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="qurbani"
        options={{
          title: t("qurbani"),
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="ribbon" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: t("more"),
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="grid" color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({
  name,
  color,
  size,
  focused,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconFocused]}>
      <Ionicons name={name} color={color} size={size - 2} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: "#050A09",
    borderTopColor: Colors.dark.border,
    borderTopWidth: 1,
    height: 78,
    paddingBottom: 14,
    paddingTop: 6,
  },
  label: {
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
    marginTop: 2,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  iconFocused: {
    backgroundColor: "rgba(212, 175, 55, 0.12)",
  },
});
