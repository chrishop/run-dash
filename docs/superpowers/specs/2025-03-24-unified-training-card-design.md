# Unified Training Card with Unit Toggle

## Context

The app currently displays Estimated Race Times and Training Paces as separate cards, each showing both km and mile pace columns simultaneously. This creates visual clutter and wastes horizontal space. Users who prefer one unit system don't need to see the other.

## Goals

1. Combine three tables into a single, compact card
2. Add a km/miles toggle that persists via URL parameter
3. Show only the selected unit's pace columns
4. Remove the 3k distance option entirely
5. Maintain existing functionality and data accuracy

## Architecture

### New Component: `UnifiedTrainingCard`

A single component replacing `RaceTimesTable.tsx` and `TrainingPaces.tsx` with a 2x2 grid layout:

**Row 1:**
- Column 1: Estimated Race Times (4 rows × 2 columns)
- Column 2: Training Paces (6 rows × 2 columns)

**Row 2:**
- Interval Workout Times (full width, 6 rows × 3 columns)

### State Management

**URL Parameter Addition:**
```typescript
export interface UrlParams {
  d: string | null
  t: string | null
  a: number | null
  g: 'm' | 'f' | null
  units: 'km' | 'mi'  // NEW
  lang: 'en' | 'ko'
}
```

**Toggle Behavior:**
- Toggle buttons in card header
- Clicking updates `units` URL parameter
- Tables re-render to show only selected unit columns
- Shareable via URL (e.g., `?units=mi`)

**Default Value:**
- Default to `km` if parameter not present
- Read from URL params on page load

### Data Changes

**Remove 3k Distance:**

From `src/data/distances.ts`:
- Remove the 3km entry from DISTANCES array

From `src/i18n/en.json` and `src/i18n/ko.json`:
- Remove `"3km"` key from distances translations

**Note:** VDOT table uses `3000m` key which is separate from distance IDs, so no VDOT data changes needed.

### Column Display Logic

**When `units='km'`:**
- Race Times: Distance, Time, Pace/km
- Training Paces: Intensity, Pace/km
- Intervals: Distance, Interval, Repetition (times always in MM:SS format)

**When `units='mi'`:**
- Race Times: Distance, Time, Pace/mi
- Training Paces: Intensity, Pace/mi
- Intervals: Distance, Interval, Repetition (times always in MM:SS format)

### Visual Layout

```
┌────────────────────────────────────────────────────────────┐
│  TRAINING                                                  │
│                                            [km] [mi]       │
│                                                            │
│  ┌────────────────────────────┬──────────────────────────┐│
│  │ Estimated Race Times        │ Training Paces           ││
│  │ ┌──────────┬───────────────┐│ ┌─────────────┬────────┐││
│  │ │ Distance │ Time          ││ │ Intensity   │ Pace   │││
│  │ ├──────────┼───────────────┤│ ├─────────────┼────────┤││
│  │ │ 5K       │ 22:30         ││ │ Easy (slow) │ 5:30   │││
│  │ │ 10K      │ 46:45         ││ │ Easy (fast) │ 5:10   │││
│  │ │ Half     │ 1:44:30       ││ │ Marathon    │ 4:50   │││
│  │ │ Marathon │ 3:33:15       ││ │ Threshold   │ 4:30   │││
│  │ └──────────┴───────────────┘│ │ Interval    │ 4:15   │││
│  │                            │ │ Repetition  │ 4:00   │││
│  │                            │ └─────────────┴────────┘││
│  └────────────────────────────┴──────────────────────────┘│
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Interval Workout Times                                │ │
│  │ ┌────────────┬──────────────┬──────────────┐         │ │
│  │ │ Distance   │ Interval     │ Repetition   │         │ │
│  │ ├────────────┼──────────────┼──────────────┤         │ │
│  │ │ 1200m      │ 5:06         │ 4:48         │         │ │
│  │ │ 800m       │ 3:24         │ 3:12         │         │ │
│  │ │ 600m       │ 2:33         │ 2:24         │         │ │
│  │ │ 400m       │ 1:42         │ 1:36         │         │ │
│  │ │ 300m       │ 1:16         │ 1:12         │         │ │
│  │ │ 200m       │ 0:51         │ 0:48         │         │ │
│  │ └────────────┴──────────────┴──────────────┘         │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Styling

- Single background color throughout (yellow `bg-neo-yellow`)
- Consistent border styling
- Subtle dividers between table sections
- Responsive considerations: stack tables on mobile

### File Changes

**Create:**
- `src/components/UnifiedTrainingCard.tsx`

**Modify:**
- `src/hooks/useUrlParams.ts` - Add `units` parameter
- `src/data/distances.ts` - Remove 3km entry
- `src/i18n/en.json` - Remove 3km translation, add units labels
- `src/i18n/ko.json` - Remove 3km translation, add units labels
- `src/components/ResultsPanel.tsx` - Use new component
- `src/App.tsx` - Pass units through results

**Delete:**
- `src/components/RaceTimesTable.tsx`
- `src/components/TrainingPaces.tsx`

### Testing

1. Toggle switches between km and mi, URL updates correctly
2. Reloading page preserves unit selection
3. Sharing URL with units parameter works
4. Only selected unit columns are visible
5. 3k option not available in distance selector
6. All existing VDOT calculations remain accurate
7. Responsive layout stacks tables on mobile
