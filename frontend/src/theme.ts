// Drill Spec theme system with 4 presets: dark (orange industrial), carbon,
// light, blue. User picks via Settings; choice persisted in AsyncStorage.
//
// Consumers use `useTheme()` to read active colors or `makeStyles((colors) => ...)`
// to build memoized StyleSheets. Never write color literals inside components.

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createElement } from "react";
import { StyleSheet } from "react-native";

import { storage } from "@/src/utils/storage";

export type ThemeId = "dark" | "carbon" | "light" | "blue";

const dark = {
  surface: "#121212",
  onSurface: "#E0E0E0",
  surfaceSecondary: "#1E1E1E",
  onSurfaceSecondary: "#F5F5F5",
  surfaceTertiary: "#2C2C2C",
  onSurfaceTertiary: "#FFFFFF",
  surfaceInverse: "#E0E0E0",
  onSurfaceInverse: "#121212",
  brand: "#FF5722",
  onBrand: "#FFFFFF",
  brandPrimary: "#FF5722",
  onBrandPrimary: "#FFFFFF",
  brandSecondary: "#E64A19",
  onBrandSecondary: "#FFFFFF",
  brandTertiary: "#3E2723",
  onBrandTertiary: "#FF5722",
  success: "#2E7D32",
  onSuccess: "#FFFFFF",
  warning: "#F57F17",
  onWarning: "#121212",
  error: "#C62828",
  onError: "#FFFFFF",
  info: "#0277BD",
  onInfo: "#FFFFFF",
  border: "#333333",
  borderStrong: "#555555",
  divider: "#2A2A2A",
  muted: "#9E9E9E",
};

export type ThemeColors = typeof dark;

const carbon: ThemeColors = {
  ...dark,
  surface: "#0A0A0A",
  surfaceSecondary: "#151515",
  surfaceTertiary: "#242424",
  onSurface: "#E5E7EB",
  onSurfaceSecondary: "#F3F4F6",
  onSurfaceTertiary: "#FFFFFF",
  brand: "#00E5FF",
  brandPrimary: "#00E5FF",
  onBrandPrimary: "#001A1F",
  brandSecondary: "#00B8D4",
  onBrandSecondary: "#001A1F",
  brandTertiary: "#0A2A30",
  onBrandTertiary: "#00E5FF",
  onBrand: "#001A1F",
  border: "#2A2A2A",
  borderStrong: "#4A4A4A",
  divider: "#1E1E1E",
  muted: "#8B8B8B",
};

const light: ThemeColors = {
  surface: "#F5F5F5",
  onSurface: "#111111",
  surfaceSecondary: "#FFFFFF",
  onSurfaceSecondary: "#111111",
  surfaceTertiary: "#EAEAEA",
  onSurfaceTertiary: "#1A1A1A",
  surfaceInverse: "#111111",
  onSurfaceInverse: "#F5F5F5",
  brand: "#D32F2F",
  onBrand: "#FFFFFF",
  brandPrimary: "#D32F2F",
  onBrandPrimary: "#FFFFFF",
  brandSecondary: "#B71C1C",
  onBrandSecondary: "#FFFFFF",
  brandTertiary: "#FFEBEE",
  onBrandTertiary: "#D32F2F",
  success: "#2E7D32",
  onSuccess: "#FFFFFF",
  warning: "#EF6C00",
  onWarning: "#FFFFFF",
  error: "#C62828",
  onError: "#FFFFFF",
  info: "#0277BD",
  onInfo: "#FFFFFF",
  border: "#D4D4D4",
  borderStrong: "#A3A3A3",
  divider: "#E0E0E0",
  muted: "#616161",
};

const blue: ThemeColors = {
  surface: "#0A1128",
  onSurface: "#E2E8F0",
  surfaceSecondary: "#16203D",
  onSurfaceSecondary: "#F1F5F9",
  surfaceTertiary: "#1E2A4A",
  onSurfaceTertiary: "#FFFFFF",
  surfaceInverse: "#E2E8F0",
  onSurfaceInverse: "#0A1128",
  brand: "#00B4D8",
  onBrand: "#001018",
  brandPrimary: "#00B4D8",
  onBrandPrimary: "#001018",
  brandSecondary: "#0096B7",
  onBrandSecondary: "#FFFFFF",
  brandTertiary: "#0A2A3C",
  onBrandTertiary: "#00B4D8",
  success: "#22C55E",
  onSuccess: "#00190A",
  warning: "#F59E0B",
  onWarning: "#1A0F00",
  error: "#EF4444",
  onError: "#FFFFFF",
  info: "#3B82F6",
  onInfo: "#FFFFFF",
  border: "#243053",
  borderStrong: "#3A4A75",
  divider: "#1B2540",
  muted: "#8FA1C0",
};

export const themePresets: Record<ThemeId, { name: string; description: string; colors: ThemeColors; sample: string }> = {
  dark: { name: "Orange Industrial", description: "Obsidian + Safety Orange", colors: dark, sample: "#FF5722" },
  carbon: { name: "Carbon", description: "Monochrome + Electric Cyan", colors: carbon, sample: "#00E5FF" },
  light: { name: "Engineering", description: "White paper + Industrial Red", colors: light, sample: "#D32F2F" },
  blue: { name: "Blueprint", description: "Navy + Cyan", colors: blue, sample: "#00B4D8" },
};

export const themes: Record<ThemeId, ThemeColors> = {
  dark: dark,
  carbon,
  light,
  blue,
};

const STORAGE_KEY = "drillspec.theme";
const DEFAULT_THEME: ThemeId = "dark";

type Ctx = {
  themeId: ThemeId;
  colors: ThemeColors;
  setThemeId: (id: ThemeId) => void;
};

const ThemeContext = createContext<Ctx>({
  themeId: DEFAULT_THEME,
  colors: themes[DEFAULT_THEME],
  setThemeId: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setTheme] = useState<ThemeId>(DEFAULT_THEME);

  useEffect(() => {
    (async () => {
      const saved = await storage.getItem<string>(STORAGE_KEY, DEFAULT_THEME);
      if (saved && saved in themes) {
        setTheme(saved as ThemeId);
      }
    })();
  }, []);

  const setThemeId = (id: ThemeId) => {
    setTheme(id);
    storage.setItem(STORAGE_KEY, id);
  };

  const value = useMemo<Ctx>(
    () => ({ themeId, colors: themes[themeId], setThemeId }),
    [themeId],
  );

  return createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme(): { colors: ThemeColors; themeId: ThemeId; setThemeId: (id: ThemeId) => void } {
  return useContext(ThemeContext);
}

// Themed StyleSheet: builds sheet from the active scheme's colors and
// memoizes it until the scheme changes.
export function makeStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  factory: (colors: ThemeColors) => T & StyleSheet.NamedStyles<any>,
): () => T {
  return function useStyles(): T {
    const { colors } = useTheme();
    return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
  };
}

// Type fonts
export const fonts = {
  display: "BarlowCondensed",
  displayBold: "BarlowCondensed-Bold",
  mono: "IBMPlexMono",
  monoBold: "IBMPlexMono-Bold",
};
