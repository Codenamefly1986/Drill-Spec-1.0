import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useMemo, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

import { fonts, makeStyles, useTheme } from "@/src/theme";

type Unit = "in" | "mm";

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
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  headerTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 22,
    letterSpacing: 3,
    color: colors.onSurface,
    flex: 1,
  },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 20 },
  unitRow: {
    flexDirection: "row",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    gap: 4,
  },
  unitBtn: {
    flex: 1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
  },
  unitBtnActive: { backgroundColor: colors.brandPrimary },
  unitBtnText: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
    letterSpacing: 3,
    color: colors.muted,
  },
  unitBtnTextActive: { color: colors.onBrandPrimary },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.muted,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: 14,
  },
  inputWrapFocus: { borderColor: colors.brandPrimary },
  input: {
    flex: 1,
    fontFamily: fonts.monoBold,
    fontSize: 22,
    color: colors.onSurface,
    paddingVertical: 14,
  },
  unitSuffix: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.muted,
    letterSpacing: 1,
  },
  resultBlock: {
    marginTop: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.brandPrimary,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 4,
  },
  resultLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.muted,
  },
  resultValue: {
    fontFamily: fonts.monoBold,
    fontSize: 42,
    color: colors.onSurfaceSecondary,
    marginTop: 8,
    letterSpacing: 1,
  },
  resultUnit: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.brandPrimary,
    marginTop: 4,
    letterSpacing: 2,
  },
  formula: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.muted,
    marginTop: 12,
    lineHeight: 16,
  },
  errorText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.error,
    marginTop: 8,
  },
  cta: {
    height: 56,
    backgroundColor: colors.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  ctaPressed: { backgroundColor: colors.brandSecondary },
  ctaText: {
    fontFamily: fonts.displayBold,
    fontSize: 20,
    letterSpacing: 4,
    color: colors.onBrandPrimary,
  },
}));

export default function Calculator() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [unit, setUnit] = useState<Unit>("in");
  const [diameter, setDiameter] = useState("");
  const [angle, setAngle] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleUnit = (u: Unit) => {
    Haptics.selectionAsync().catch(() => {});
    setUnit(u);
    setResult(null);
  };

  const calculate = () => {
    Keyboard.dismiss();
    setError(null);
    const d = parseFloat(diameter);
    const a = parseFloat(angle);
    if (isNaN(d) || d <= 0) {
      setError("Enter a valid drill diameter.");
      setResult(null);
      return;
    }
    if (isNaN(a) || a <= 0 || a >= 180) {
      setError("Angle must be between 0 and 180 degrees.");
      setResult(null);
      return;
    }
    // Drill Tip Length = (Diameter / 2) / tan(Angle / 2)
    const tipLen = (d / 2) / Math.tan((a / 2) * (Math.PI / 180));
    setResult(tipLen);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  const resultDisplay = useMemo(() => {
    if (result === null) return "—";
    return unit === "in" ? result.toFixed(4) : result.toFixed(3);
  }, [result, unit]);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable
          testID="back-btn"
          style={styles.backBtn}
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
          accessibilityLabel="Back"
        >
          <MaterialDesignIcons name="arrow-left" size={24} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>TIP CALCULATOR</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={12}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.unitRow} testID="unit-toggle">
            <Pressable
              testID="unit-in"
              style={[styles.unitBtn, unit === "in" && styles.unitBtnActive]}
              onPress={() => toggleUnit("in")}
            >
              <Text style={[styles.unitBtnText, unit === "in" && styles.unitBtnTextActive]}>INCHES</Text>
            </Pressable>
            <Pressable
              testID="unit-mm"
              style={[styles.unitBtn, unit === "mm" && styles.unitBtnActive]}
              onPress={() => toggleUnit("mm")}
            >
              <Text style={[styles.unitBtnText, unit === "mm" && styles.unitBtnTextActive]}>MM</Text>
            </Pressable>
          </View>

          <View>
            <Text style={styles.label}>DRILL DIAMETER</Text>
            <View style={styles.inputWrap}>
              <TextInput
                testID="input-diameter"
                style={styles.input}
                value={diameter}
                onChangeText={setDiameter}
                placeholder=""
                placeholderTextColor={colors.muted}
                keyboardType="decimal-pad"
                inputMode="decimal"
              />
              <Text style={styles.unitSuffix}>{unit === "in" ? "IN" : "MM"}</Text>
            </View>
          </View>

          <View>
            <Text style={styles.label}>INCLUDED TIP ANGLE</Text>
            <View style={styles.inputWrap}>
              <TextInput
                testID="input-angle"
                style={styles.input}
                value={angle}
                onChangeText={setAngle}
                placeholder=""
                placeholderTextColor={colors.muted}
                keyboardType="decimal-pad"
                inputMode="decimal"
              />
              <Text style={styles.unitSuffix}>DEG</Text>
            </View>
          </View>

          {error && <Text style={styles.errorText} testID="calc-error">{error}</Text>}

          <View style={styles.resultBlock} testID="calc-result">
            <Text style={styles.resultLabel}>DRILL TIP LENGTH</Text>
            <Text style={styles.resultValue} testID="calc-result-value">{resultDisplay}</Text>
            <Text style={styles.resultUnit}>{unit === "in" ? "INCHES" : "MILLIMETERS"}</Text>
            <Text style={styles.formula}>
              L = (D / 2) / tan(A / 2){"\n"}
              D = diameter · A = included tip angle
            </Text>
          </View>
        </ScrollView>

        <Pressable
          testID="calculate-btn"
          onPress={calculate}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed, { marginBottom: insets.bottom + 12 }]}
        >
          <Text style={styles.ctaText}>CALCULATE</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
}
