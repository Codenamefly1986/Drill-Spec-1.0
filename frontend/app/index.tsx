import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

import { fonts, makeStyles, useTheme } from "@/src/theme";

const useStyles = makeStyles((colors) => ({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  brand: {
    fontFamily: fonts.displayBold,
    fontSize: 32,
    letterSpacing: 4,
    color: colors.onSurface,
  },
  brandAccent: {
    color: colors.brandPrimary,
  },
  gearBtn: {
    width: 44,
    height: 44,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  tagline: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.muted,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  cardsWrap: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.brandPrimary,
    borderRadius: 4,
    padding: 20,
    justifyContent: "space-between",
  },
  cardPressed: {
    backgroundColor: colors.surfaceTertiary,
  },
  cardIndex: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.brandPrimary,
    letterSpacing: 2,
  },
  cardTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 40,
    letterSpacing: 1,
    color: colors.onSurfaceSecondary,
    marginTop: 8,
    lineHeight: 42,
  },
  cardSub: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.muted,
    marginTop: 8,
    lineHeight: 18,
  },
  cardArrowRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  cardCta: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.brandPrimary,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  footerText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 1,
  },
}));

export default function Home() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const go = (path: string) => {
    Haptics.selectionAsync().catch(() => {});
    router.push(path as any);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}>
      <View style={styles.header}>
        <Text style={styles.brand} testID="app-brand">
          DRILL <Text style={styles.brandAccent}>SPEC</Text>
        </Text>
        <Pressable
          testID="settings-gear-btn"
          style={styles.gearBtn}
          onPress={() => go("/settings")}
          accessibilityLabel="Open settings"
        >
          <MaterialDesignIcons name="cog-outline" size={22} color={colors.onSurface} />
        </Pressable>
      </View>

      <View style={styles.cardsWrap}>
        <Pressable
          testID="home-calculator-card"
          onPress={() => go("/calculator")}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          <View>
            <Text style={styles.cardTitle}>DRILL TIP{"\n"}CALCULATOR</Text>
          </View>
          <View style={styles.cardArrowRow}>
            <Text style={styles.cardCta}>OPEN</Text>
            <MaterialDesignIcons name="arrow-right" size={22} color={colors.brandPrimary} />
          </View>
        </Pressable>

        <Pressable
          testID="home-drills-card"
          onPress={() => go("/drills")}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          <View>
            <Text style={styles.cardTitle}>DRILLS</Text>
          </View>
          <View style={styles.cardArrowRow}>
            <Text style={styles.cardCta}>BROWSE</Text>
            <MaterialDesignIcons name="arrow-right" size={22} color={colors.brandPrimary} />
          </View>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>ASME B94.11M · DIN 1897 · DIN 338 · DIN 340</Text>
      </View>
    </View>
  );
}
