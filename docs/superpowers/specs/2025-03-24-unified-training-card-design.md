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
- Column 1: Estimated Race Times (6 rows × 2 columns) - all remaining distances
- Column 2: Training Paces (6 rows × 2 columns)

**Row 2:**
- Interval Workout Times (full width, 6 rows × 3 columns)

### State Management

**URL Parameter Addition:**

Update `src/hooks/useUrlParams.ts`:
```typescript
export interface UrlParams {
  d: string | null
  t: string | null
  a: number | null
  g: 'm' | 'f' | null
  units: 'km' | 'mi'  // NEW
  lang: 'en' | 'ko'
}

type ParamKey = 'd' | 't' | 'a' | 'g' | 'units' | 'lang'  // Add 'units'
```

**Parameter Validation (in `parseParams` function):**
```typescript
const units = params.get('units')
return {
  // ... existing params
  units: units === 'mi' ? 'mi' : 'km',  // Default to 'km' if invalid
}
```

**Results Interface Update:**

Update `src/components/ResultsPanel.tsx`:
```typescript
export interface Results {
  distance: Distance
  timeSecs: number
  vdot: number | null
  raceTimes: RaceTimeEntry[] | null
  trainingPaces: TrainingPaceResult | null
  ageComparison: AgeComparisonRow[] | null
  userAge: number | null
  gender: 'm' | 'f' | null
  units: 'km' | 'mi'  // NEW
}
```

**Toggle Behavior:**
- Toggle buttons in card header (similar to language toggle in App.tsx)
- Clicking updates `units` URL parameter
- Tables re-render to show only selected unit columns
- Shareable via URL (e.g., `?units=mi`)
- Invalid values default to `km`

### Data Changes

**Remove 3k Distance:**

From `src/data/distances.ts`:
- Remove the 3km entry from DISTANCES array

From `src/i18n/en.json` and `src/i18n/ko.json`:
- Remove `"3km"` key from distances translations

**Note:** VDOT table uses `3000m` key which is separate from distance IDs, so no VDOT data changes needed.

### Column Display Logic

Column headers use existing i18n keys: `raceTimes.paceKm` ("Pace /km") and `raceTimes.paceMi` ("Pace /mi")

**When `units='km'`:**
- Race Times: Distance, Time, Pace /km
- Training Paces: Intensity, Pace /km
- Intervals: Distance, Interval, Repetition (times always in MM:SS format)

**When `units='mi'`:**
- Race Times: Distance, Time, Pace /mi
- Training Paces: Intensity, Pace /mi
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
- Toggle buttons styled similar to language toggle in App.tsx

**Mobile Responsive (Tailwind):**
- Desktop (default): 2-column grid for top row, full-width intervals
- Mobile (`< md` breakpoint): Stack tables vertically using `grid-cols-1`
- Each table takes full width on mobile
- No horizontal scroll on mobile

### File Changes

**Create:**
- `src/components/UnifiedTrainingCard.tsx`

**Modify:**
- `src/hooks/useUrlParams.ts` - Add `units` to `ParamKey` type and `parseParams` validation
- `src/data/distances.ts` - Remove 3km entry
- `src/i18n/en.json` - Remove 3km translation, add units toggle labels
- `src/i18n/ko.json` - Remove 3km translation, add units toggle labels
- `src/components/ResultsPanel.tsx` - Use new component, add `units` to Results interface
- `src/App.tsx` - Pass `units` from URL params to results object

**i18n Additions:**
```json
"units": {
  "title": "Units",
  "km": "km",
  "mi": "mi"
}
```

**Delete:**
- `src/components/RaceTimesTable.tsx`
- `src/components/TrainingPaces.tsx`

### Testing

1. Toggle switches between km and mi, URL updates correctly
2. Reloading page preserves unit selection
3. Sharing URL with units parameter works
4. Invalid units parameter (e.g., `?units=invalid`) defaults to `km`
5. Only selected unit columns are visible
6. 3k option not available in distance selector
7. All existing VDOT calculations remain accurate
8. Responsive layout stacks tables on mobile
9. URLs with 3k distance (`?d=3km`) handle gracefully (default to first available distance or show prompt)
