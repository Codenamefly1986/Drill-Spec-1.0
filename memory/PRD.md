# Drill Spec — Product Requirements

## Purpose
A machinist reference mobile app (Expo / React Native). Offline-first, no backend
required for the primary flows. Provides:

1. **Drill Tip Calculator** — computes the axial length of the drill point from
   diameter + included tip angle: `L = (D/2) / tan(A/2)` (angle in degrees).
   Unit toggle: inches (default) or mm. Result shown in selected unit.
2. **Drill Sizes Database** — 436 sizes across Fractional, Wire, Letter, and
   Metric standards. Sorted smallest-to-largest by diameter. Displayed as a
   5-column table: Frac · W/L · Metric · Dec (in, 4 dp) · Dec (mm, 3 dp).
   Persistent search bar + filter chips (All / Frac / Wire / Letter / Metric).
3. **Drill Detail** — for the selected size, shows the length designations that
   exist for it (Screw Machine · Jobber · Taper) with Overall / Flute / Shank
   lengths per designation. Standards displayed per row:
   - Fractional / Wire / Letter → ASME B94.11M
   - Metric → DIN 1897 (Screw Machine), DIN 338 (Jobber), DIN 340 (Taper)
4. **Settings (gear icon on home)** — pick one of 4 color themes:
   - Orange Industrial (default, dark + safety orange)
   - Carbon (near-black + electric cyan)
   - Engineering (light paper + industrial red)
   - Blueprint (navy + cyan)
   Theme persisted via AsyncStorage.

## Tech
- Expo Router file-based routing: `/`, `/calculator`, `/drills`, `/drill/[key]`,
  `/settings`.
- Static data bundled at `frontend/src/data/drills.json` (built from the user's
  supplied Excel workbook).
- Custom fonts: Barlow Condensed (headings), IBM Plex Mono (all numeric data)
  loaded via `expo-font`.
- Icons: `@react-native-vector-icons/material-design-icons`.
- No backend endpoints used (existing `/api/status` scaffolding left untouched).

## Notes
- All numeric alignment is preserved via IBM Plex Mono in the drill table.
- The 5-column table fits standard mobile widths without horizontal scroll
  (flex: 1 / 1 / 1 / 1.5 / 1.5).
- Theme switching is instant across every screen; persisted between launches.
