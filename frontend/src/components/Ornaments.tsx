// Decorative crescent moon + star background ornament.
// Uses pure RN views (no SVG) to keep the bundle light.

import React from "react";
import { StyleSheet, View } from "react-native";

import { Colors } from "@/src/constants/theme";

interface Props {
  size?: number;
  color?: string;
  opacity?: number;
}

export const CrescentMoon: React.FC<Props> = ({
  size = 120,
  color = Colors.dark.secondary,
  opacity = 1,
}) => {
  const main = size;
  const cut = size * 0.85;
  return (
    <View style={{ width: main, height: main, opacity }}>
      <View
        style={{
          position: "absolute",
          width: main,
          height: main,
          borderRadius: main / 2,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: cut,
          height: cut,
          borderRadius: cut / 2,
          backgroundColor: Colors.dark.background,
          right: -size * 0.05,
          top: -size * 0.03,
        }}
      />
    </View>
  );
};

interface StarFieldProps {
  count?: number;
  color?: string;
}

// Deterministic star positions (no randomness across renders).
const STAR_SEEDS = [
  { x: 0.1, y: 0.08, s: 2 },
  { x: 0.25, y: 0.22, s: 3 },
  { x: 0.42, y: 0.05, s: 1.5 },
  { x: 0.6, y: 0.18, s: 2 },
  { x: 0.78, y: 0.1, s: 2.5 },
  { x: 0.9, y: 0.3, s: 1.5 },
  { x: 0.15, y: 0.45, s: 2 },
  { x: 0.35, y: 0.65, s: 1.5 },
  { x: 0.55, y: 0.55, s: 2 },
  { x: 0.7, y: 0.75, s: 2.5 },
  { x: 0.85, y: 0.6, s: 1.5 },
  { x: 0.05, y: 0.85, s: 2 },
  { x: 0.45, y: 0.9, s: 1.5 },
];

export const StarField: React.FC<StarFieldProps> = ({
  color = "#D4AF37",
}) => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {STAR_SEEDS.map((s, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            left: `${s.x * 100}%`,
            top: `${s.y * 100}%`,
            width: s.s * 2,
            height: s.s * 2,
            borderRadius: s.s,
            backgroundColor: color,
            opacity: 0.4,
          }}
        />
      ))}
    </View>
  );
};
