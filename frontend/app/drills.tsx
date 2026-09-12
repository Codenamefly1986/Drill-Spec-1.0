import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

import drillsData from "@/src/data/drills.json";
import { fonts, makeStyles, useTheme } from "@/src/theme";

type Drill = {
  type: "Fractional" | "Wire" | "Letter" | "Metric";
  label: string;
  diameter_in: number;
  diameter_mm: number;
  screwMachine?: LengthData;
  jobber?: LengthData;
  taper?: LengthData;
};

type LengthData = { overall_in: number; flute_in: number; shank_in: number };

const ALL_DRILLS = drillsData as Drill[];

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
    width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 4,
  },
  headerTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 22,
    letterSpacing: 3,
    color: colors.onSurface,
    flex: 1,
  },
  headerCount: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 1,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.onSurface,
  },
  searchModeRow: {
    flexDirection: "row",
    marginHorizontal: 12,
    marginBottom: 10,
    gap: 6,
  },
  searchModeBtn: {
    flex: 1,
    height: 32,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  searchModeBtnActive: {
    borderColor: colors.brandPrimary,
    backgroundColor: colors.brandTertiary,
  },
  searchModeText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.muted,
  },
  searchModeTextActive: {
    color: colors.brandPrimary,
  },
  filterRow: {
    paddingHorizontal: 12,
    paddingBottom: 4,
    flexDirection: "row",
    gap: 6,
  },
  filterRowFull: {
    paddingHorizontal: 12,
    paddingBottom: 6,
  },
  chip: {
    flexShrink: 0,
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  chipFull: {
    width: "100%",
    flexShrink: 1,
  },
  chipInRow: {
    flex: 1,
    paddingHorizontal: 4,
  },
  chipActive: {
    borderColor: colors.brandPrimary,
    backgroundColor: colors.brandTertiary,
  },
  chipText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.muted,
  },
  chipTextActive: {
    color: colors.brandPrimary,
  },
  tableHead: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceTertiary,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  th: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.onSurfaceTertiary,
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    alignItems: "center",
  },
  rowPressed: { backgroundColor: colors.surfaceTertiary },
  cell: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.onSurface,
  },
  cellRight: { textAlign: "right" },
  cellMuted: { color: colors.muted },
  colFrac: { flex: 1 },
  colWL: { flex: 1 },
  colMet: { flex: 1 },
  colDecIn: { flex: 1.5 },
  colDecMm: { flex: 1.5 },
  empty: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.muted,
    letterSpacing: 1,
  },
}));

const FILTERS: { key: "ALL" | "Fractional" | "Wire" | "Letter" | "Metric"; label: string }[] = [
  { key: "ALL", label: "ALL" },
  { key: "Fractional", label: "FRAC" },
  { key: "Wire", label: "WIRE" },
  { key: "Letter", label: "LETTER" },
  { key: "Metric", label: "MM" },
];

type SearchMode = "in" | "mm";

export default function DrillsList() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("ALL");
  const [searchMode, setSearchMode] = useState<SearchMode>("in");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_DRILLS.filter((d) => {
      if (filter !== "ALL" && d.type !== filter) return false;
      if (!q) return true;
      if (searchMode === "in") {
        return d.diameter_in.toFixed(4).includes(q);
      }
      return d.diameter_mm.toFixed(3).includes(q);
    });
  }, [query, filter, searchMode]);

  const renderRow = ({ item, index }: { item: Drill; index: number }) => {
    const isFrac = item.type === "Fractional";
    const isWL = item.type === "Wire" || item.type === "Letter";
    const isMet = item.type === "Metric";
    const key = `${item.type}:${item.label}`;
    return (
      <Pressable
        testID={`drill-row-${index}`}
        onPress={() => {
          Haptics.selectionAsync().catch(() => {});
          router.push({ pathname: "/drill/[key]", params: { key } } as any);
        }}
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      >
        <Text style={[styles.cell, styles.colFrac, !isFrac && styles.cellMuted]}>
          {isFrac ? item.label : "·"}
        </Text>
        <Text style={[styles.cell, styles.colWL, !isWL && styles.cellMuted]}>
          {isWL ? item.label : "·"}
        </Text>
        <Text style={[styles.cell, styles.colMet, !isMet && styles.cellMuted]}>
          {isMet ? item.label : "·"}
        </Text>
        <Text style={[styles.cell, styles.colDecIn, styles.cellRight]}>
          {item.diameter_in.toFixed(4)}
        </Text>
        <Text style={[styles.cell, styles.colDecMm, styles.cellRight]}>
          {item.diameter_mm.toFixed(3)}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable testID="back-btn" style={styles.backBtn} onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}>
          <MaterialDesignIcons name="arrow-left" size={24} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>DRILLS</Text>
        <Text style={styles.headerCount} testID="drills-count">{filtered.length}</Text>
      </View>

      <View style={styles.searchWrap}>
        <MaterialDesignIcons name="magnify" size={18} color={colors.muted} />
        <TextInput
          testID="drills-search"
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder={`Search decimal ${searchMode === "in" ? "inch" : "mm"}...`}
          placeholderTextColor={colors.muted}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <Pressable testID="clear-search-btn" onPress={() => setQuery("")}>
            <MaterialDesignIcons name="close-circle" size={18} color={colors.muted} />
          </Pressable>
        )}
      </View>

      <View style={styles.searchModeRow} testID="search-mode-row">
        <Pressable
          testID="search-mode-in"
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            setSearchMode("in");
          }}
          style={[styles.searchModeBtn, searchMode === "in" && styles.searchModeBtnActive]}
        >
          <Text style={[styles.searchModeText, searchMode === "in" && styles.searchModeTextActive]}>
            DECIMAL INCH
          </Text>
        </Pressable>
        <Pressable
          testID="search-mode-mm"
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            setSearchMode("mm");
          }}
          style={[styles.searchModeBtn, searchMode === "mm" && styles.searchModeBtnActive]}
        >
          <Text style={[styles.searchModeText, searchMode === "mm" && styles.searchModeTextActive]}>
            DECIMAL MM
          </Text>
        </Pressable>
      </View>

      <View style={styles.filterRowFull}>
        <Pressable
          testID="filter-ALL"
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            setFilter("ALL");
          }}
          style={[styles.chip, styles.chipFull, filter === "ALL" && styles.chipActive]}
        >
          <Text style={[styles.chipText, filter === "ALL" && styles.chipTextActive]}>ALL</Text>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.filter((f) => f.key !== "ALL").map((f) => {
          const active = filter === f.key;
          return (
            <Pressable
              key={f.key}
              testID={`filter-${f.key}`}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setFilter(f.key);
              }}
              style={[styles.chip, styles.chipInRow, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.tableHead}>
        <Text style={[styles.th, styles.colFrac]}>FRAC</Text>
        <Text style={[styles.th, styles.colWL]}>W/L</Text>
        <Text style={[styles.th, styles.colMet]}>METRIC</Text>
        <Text style={[styles.th, styles.colDecIn, styles.cellRight]}>DEC IN</Text>
        <Text style={[styles.th, styles.colDecMm, styles.cellRight]}>DEC MM</Text>
      </View>

      <FlatList
        testID="drills-list"
        data={filtered}
        keyExtractor={(item) => `${item.type}:${item.label}`}
        renderItem={renderRow}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>NO MATCHES</Text>
          </View>
        }
        initialNumToRender={40}
        windowSize={11}
        removeClippedSubviews
      />
    </View>
  );
}
