// Reusable screen header with title, subtitle, and optional back button.

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors, Spacing, Typography } from "@/src/constants/theme";

interface Props {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  testIDPrefix?: string;
  rightSlot?: React.ReactNode;
}

export const ScreenHeader: React.FC<Props> = ({
  title,
  subtitle,
  showBack = true,
  testIDPrefix = "header",
  rightSlot,
}) => {
  const router = useRouter();

  return (
    <View style={styles.container} testID={`${testIDPrefix}-container`}>
      {showBack ? (
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          testID={`${testIDPrefix}-back`}
          hitSlop={8}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={Colors.dark.secondary}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.backBtn} />
      )}
      <View style={styles.titleWrap}>
        <Text
          style={styles.title}
          numberOfLines={1}
          testID={`${testIDPrefix}-title`}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.right}>{rightSlot}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.dark.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  title: {
    ...Typography.h2,
    color: Colors.dark.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.dark.secondary,
    textAlign: "center",
    marginTop: 2,
  },
  right: {
    width: 40,
    alignItems: "flex-end",
  },
});
