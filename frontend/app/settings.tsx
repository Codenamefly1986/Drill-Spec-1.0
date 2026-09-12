import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

import { fonts, makeStyles, themePresets, useTheme, type ThemeId } from "@/src/theme";

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 4 },
  headerTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 22,
    letterSpacing: 3,
    color: colors.onSurface,
    flex: 1,
  },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12 },
  intro: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.muted,
    letterSpacing: 1,
    marginBottom: 4,
    lineHeight: 18,
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 4,
    padding: 14,
    gap: 14,
  },
  themeRowActive: {
    borderColor: colors.brandPrimary,
    borderLeftWidth: 4,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  themeMeta: { flex: 1 },
  themeName: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    letterSpacing: 2,
    color: colors.onSurfaceSecondary,
  },
  themeDesc: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
    letterSpacing: 1,
  },
  section: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
    letterSpacing: 3,
    color: colors.onSurface,
    marginTop: 20,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  infoLabel: { fontFamily: fonts.mono, fontSize: 12, color: colors.muted, letterSpacing: 1 },
  infoValue: { fontFamily: fonts.monoBold, fontSize: 12, color: colors.onSurface },
}));

export default function Settings() {
  const styles = useStyles();
  const { colors, themeId, setThemeId } = useTheme();
  const insets = useSafeAreaInsets();

  const pick = (id: ThemeId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setThemeId(id);
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable testID="back-btn" style={styles.backBtn} onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}>
          <MaterialDesignIcons name="arrow-left" size={24} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>SETTINGS</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
      >
        <Text style={styles.intro}>COLOR THEME — choose your workshop palette.</Text>

        {(Object.keys(themePresets) as ThemeId[]).map((id) => {
          const p = themePresets[id];
          const active = themeId === id;
          return (
            <Pressable
              key={id}
              testID={`theme-${id}`}
              onPress={() => pick(id)}
              style={[styles.themeRow, active && styles.themeRowActive]}
            >
              <View style={[styles.swatch, { backgroundColor: p.sample }]} />
              <View style={styles.themeMeta}>
                <Text style={styles.themeName}>{p.name.toUpperCase()}</Text>
                <Text style={styles.themeDesc}>{p.description}</Text>
              </View>
              {active && (
                <MaterialDesignIcons name="check-circle" size={22} color={colors.brandPrimary} />
              )}
            </Pressable>
          );
        })}

        <Text style={styles.section}>ABOUT</Text>
        <View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>APP</Text>
            <Text style={styles.infoValue}>DRILL SPEC</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>VERSION</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>FRAC / WIRE / LTR STD</Text>
            <Text style={styles.infoValue}>ASME B94.11M</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>METRIC STD</Text>
            <Text style={styles.infoValue}>DIN 1897 / 338 / 340</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
