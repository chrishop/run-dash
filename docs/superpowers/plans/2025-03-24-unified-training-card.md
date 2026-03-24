# Unified Training Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Combine Estimated Race Times and Training Paces into a single card with a km/miles toggle that shows only the selected unit's pace columns.

**Architecture:** A new `UnifiedTrainingCard` component with 2x2 grid layout (race times + training paces on top, intervals spanning full width on bottom). Units toggle stored as URL parameter (`?units=km|mi`) with validation defaulting to `km`.

**Tech Stack:** React, TypeScript, Tailwind CSS, i18next, custom URL params hook

---

## File Structure

```
src/
├── components/
│   ├── UnifiedTrainingCard.tsx     (NEW - combined card with toggle)
│   ├── ResultsPanel.tsx            (MODIFY - use new component, add units to Results)
│   ├── RaceTimesTable.tsx          (DELETE)
│   └── TrainingPaces.tsx           (DELETE)
├── hooks/
│   └── useUrlParams.ts             (MODIFY - add units parameter)
├── data/
│   └── distances.ts                (MODIFY - remove 3km)
├── i18n/
│   ├── en.json                     (MODIFY - remove 3km, add units)
│   └── ko.json                     (MODIFY - remove 3km, add units)
└── App.tsx                         (MODIFY - pass units to results)
```

---

## Task 1: Add Units Parameter to URL Params Hook

**Files:**
- Modify: `src/hooks/useUrlParams.ts`

- [ ] **Step 1: Update UrlParams interface to include units**

Find the `UrlParams` interface (around line 3) and add `units` field:

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

- [ ] **Step 2: Update ParamKey type to include 'units'**

Find the `type ParamKey` declaration (around line 11) and add `'units'`:

```typescript
type ParamKey = 'd' | 't' | 'a' | 'g' | 'units' | 'lang'
```

- [ ] **Step 3: Add units validation in parseParams function**

Find the `parseParams` function (around line 22) and add units parsing/validation before the return statement:

```typescript
function parseParams(search: string): UrlParams {
  const params = new URLSearchParams(search)
  const ageStr = params.get('a')
  const gender = params.get('g')
  const lang = params.get('lang')
  const units = params.get('units')

  return {
    d: params.get('d'),
    t: params.get('t'),
    a: ageStr ? parseInt(ageStr, 10) : null,
    g: gender === 'm' || gender === 'f' ? gender : null,
    units: units === 'mi' ? 'mi' : 'km',  // NEW - defaults to 'km'
    lang: lang === 'ko' ? 'ko' : 'en',
  }
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npm run build`
Expected: Build succeeds with no type errors

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useUrlParams.ts
git commit -m "feat: add units parameter to URL params

- Add units field to UrlParams interface (km|mi)
- Add 'units' to ParamKey type
- Add validation in parseParams with default to 'km'
```

---

## Task 2: Remove 3km from Distances

**Files:**
- Modify: `src/data/distances.ts`

- [ ] **Step 1: Remove 3km entry from DISTANCES array**

Find the line starting with `{ id: '3km'` (around line 12) and delete the entire entry:

```typescript
  { id: '3km', label: '3K', vdotKey: '3000m', ageGradeKey: null, distanceKm: 3.0 },  // DELETE THIS LINE
```

After removal, DISTANCES should have 6 entries (1500m, 1mi, 5k, 10k, hm, mar).

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/data/distances.ts
git commit -m "refactor: remove 3km distance option

- Remove 3km from DISTANCES array
- 6 distances remain: 1500m, 1mi, 5k, 10k, half marathon, marathon
```

---

## Task 3: Update i18n Files (English)

**Files:**
- Modify: `src/i18n/en.json`

- [ ] **Step 1: Remove 3km from distances**

Find the `"distances"` object and remove the `"3km"` key (around line 18):

```json
"distances": {
  "1500m": "1500m",
  "1mi": "1 Mile",
  "5k": "5K",
  "10k": "10K",
  "hm": "Half Marathon",
  "mar": "Marathon"
}
```

- [ ] **Step 2: Add units translation keys**

Add the following to the JSON file (after `"results"` section is fine):

```json
"units": {
  "title": "Units",
  "km": "km",
  "mi": "mi"
}
```

- [ ] **Step 3: Verify JSON is valid**

Run: `npm run build`
Expected: Build succeeds (JSON is parsed)

- [ ] **Step 4: Commit**

```bash
git add src/i18n/en.json
git commit -m "i18n: remove 3km and add units translations (en)

- Remove 3km from distances
- Add units.title, units.km, units.mi translation keys
```

---

## Task 4: Update i18n Files (Korean)

**Files:**
- Modify: `src/i18n/ko.json`

- [ ] **Step 1: Read the Korean file to understand the structure**

Run: `cat src/i18n/ko.json`

Look for the distances section and the structure.

- [ ] **Step 2: Remove 3km from distances**

Find the `"distances"` object and remove the `"3km"` key. The Korean structure should mirror English after removal:

```json
"distances": {
  "1500m": "1500m",
  "1mi": "1마일",
  "5k": "5K",
  "10k": "10K",
  "hm": "하프 마라톤",
  "mar": "마라톤"
}
```

- [ ] **Step 3: Add units translation keys in Korean**

Add the following (use appropriate Korean translations):

```json
"units": {
  "title": "단위",
  "km": "km",
  "mi": "마일"
}
```

- [ ] **Step 4: Verify JSON is valid**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/i18n/ko.json
git commit -m "i18n: remove 3km and add units translations (ko)

- Remove 3km from distances
- Add units.title, units.km, units.mi in Korean
```

---

## Task 4.5: Verify Utility Functions Exist

**Files:**
- Read: `src/calc/timeUtils.ts`

- [ ] **Step 1: Verify formatTime and formatPace are exported**

Run: `grep -E "export (function|const).*(formatTime|formatPace)" src/calc/timeUtils.ts`
Expected: Should see both functions exported

- [ ] **Step 2: If functions don't exist, note it for implementation**

(These functions should exist based on current codebase - if not, we'll need to add them)

---

## Task 5: Create UnifiedTrainingCard Component

**Files:**
- Create: `src/components/UnifiedTrainingCard.tsx`

- [ ] **Step 1: Create the component file with imports and interfaces**

```typescript
import { useTranslation } from 'react-i18next'
import type { RaceTimeEntry } from '../calc/raceTimes'
import type { TrainingPaceResult } from '../calc/trainingPaces'
import { formatTime, formatPace } from '../calc/timeUtils'

interface UnifiedTrainingCardProps {
  raceTimes: RaceTimeEntry[]
  trainingPaces: TrainingPaceResult
  currentDistanceId: string
  units: 'km' | 'mi'
  onUnitsChange: (units: 'km' | 'mi') => void
}

export function UnifiedTrainingCard({
  raceTimes,
  trainingPaces,
  currentDistanceId,
  units,
  onUnitsChange,
}: UnifiedTrainingCardProps) {
  const { t } = useTranslation()
  const { paces, intervals } = trainingPaces

  // Component will be completed in next steps
  return <div>Training Card</div>
}
```

- [ ] **Step 2: Build the component structure with toggle and grid layout**

Replace the return statement with:

```typescript
  return (
    <div className="bg-neo-yellow border-3 border-neo-dark rounded-xl p-6 shadow-[6px_6px_0px_0px_#1A1A2E]">
      {/* Header with title and toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-neo-dark uppercase">{t('units.title')}</h2>
        <div className="flex">
          <button
            type="button"
            onClick={() => onUnitsChange('km')}
            className={`px-3 py-1 text-sm font-bold uppercase border-3 border-neo-dark rounded-l-md transition-all ${
              units === 'km'
                ? 'bg-neo-dark text-neo-yellow'
                : 'bg-white text-neo-dark hover:bg-neo-dark/10'
            }`}
          >
            {t('units.km')}
          </button>
          <button
            type="button"
            onClick={() => onUnitsChange('mi')}
            className={`px-3 py-1 text-sm font-bold uppercase border-3 border-l-0 border-neo-dark rounded-r-md transition-all ${
              units === 'mi'
                ? 'bg-neo-dark text-neo-yellow'
                : 'bg-white text-neo-dark hover:bg-neo-dark/10'
            }`}
          >
            {t('units.mi')}
          </button>
        </div>
      </div>

      {/* 2x2 Grid for top tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Estimated Race Times */}
        <div>
          <h3 className="text-md font-black text-neo-dark uppercase mb-2">
            {t('raceTimes.title')}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-3 border-neo-dark">
                  <th className="text-left py-2 px-2 font-black text-neo-dark uppercase">
                    {t('raceTimes.distance')}
                  </th>
                  <th className="text-right py-2 px-2 font-black text-neo-dark uppercase">
                    {t('raceTimes.time')}
                  </th>
                  <th className="text-right py-2 px-2 font-black text-neo-dark uppercase">
                    {t(units === 'km' ? 'raceTimes.paceKm' : 'raceTimes.paceMi')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {raceTimes.map((rt) => {
                  const isCurrentDistance = rt.distance.id === currentDistanceId
                  return (
                    <tr
                      key={rt.distance.id}
                      className={`border-b-2 border-neo-dark/20 ${
                        isCurrentDistance ? 'bg-neo-green/30 font-black' : 'font-bold'
                      }`}
                    >
                      <td className="py-2 px-2">{t(`distances.${rt.distance.id}`)}</td>
                      <td className="text-right py-2 px-2 font-mono">{formatTime(rt.timeSecs)}</td>
                      <td className="text-right py-2 px-2 font-mono">
                        {formatPace(units === 'km' ? rt.pacePerKmSecs : rt.pacePerMileSecs)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Training Paces */}
        <div>
          <h3 className="text-md font-black text-neo-dark uppercase mb-2">
            {t('trainingPaces.title')}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-3 border-neo-dark">
                  <th className="text-left py-2 px-2 font-black text-neo-dark uppercase">
                    {t('trainingPaces.intensity')}
                  </th>
                  <th className="text-right py-2 px-2 font-black text-neo-dark uppercase">
                    {t(units === 'km' ? 'trainingPaces.paceKm' : 'trainingPaces.paceMi')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paces.map((p) => (
                  <tr key={p.labelKey} className="border-b-2 border-neo-dark/20 font-bold">
                    <td className="py-2 px-2">{t(p.labelKey)}</td>
                    <td className="text-right py-2 px-2 font-mono">
                      {formatPace(units === 'km' ? p.secPerKm : p.secPerMi)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Interval Workouts - full width */}
      <div>
        <h3 className="text-md font-black text-neo-dark uppercase mb-2">
          {t('trainingPaces.intervalTitle')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-3 border-neo-dark">
                <th className="text-left py-2 px-2 font-black text-neo-dark uppercase">
                  {t('trainingPaces.distance')}
                </th>
                <th className="text-right py-2 px-2 font-black text-neo-dark uppercase">
                  {t('trainingPaces.interval')}
                </th>
                <th className="text-right py-2 px-2 font-black text-neo-dark uppercase">
                  {t('trainingPaces.repetition')}
                </th>
              </tr>
            </thead>
            <tbody>
              {intervals.map((w) => (
                <tr key={w.distanceM} className="border-b-2 border-neo-dark/20 font-bold">
                  <td className="py-2 px-2">{w.label}</td>
                  <td className="text-right py-2 px-2 font-mono">
                    {formatTime(w.intervalTimeSecs)}
                  </td>
                  <td className="text-right py-2 px-2 font-mono">{formatTime(w.repTimeSecs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npm run build`
Expected: Build succeeds with the new component

- [ ] **Step 4: Commit**

```bash
git add src/components/UnifiedTrainingCard.tsx
git commit -m "feat: add UnifiedTrainingCard component

- Combine race times and training paces into single card
- Add km/mi toggle with URL parameter support
- 2x2 grid layout: race times + training paces on top row
- Interval workouts span full width on bottom row
- Show only selected unit columns
- Mobile responsive with stacked tables
```

---

## Task 6: Update Results Interface and ResultsPanel

**Files:**
- Modify: `src/components/ResultsPanel.tsx`

- [ ] **Step 1: Add units to Results interface**

Find the `Results` interface (around line 14) and add `units` field:

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

- [ ] **Step 2: Remove old imports**

Remove the imports for the old components (around lines 7-8):

```typescript
import { VdotScore } from './VdotScore'
import { RaceTimesTable } from './RaceTimesTable'  // DELETE
import { TrainingPaces } from './TrainingPaces'    // DELETE
import { AgeComparisonCard } from './AgeComparisonCard'
import { FinishingTimePercentileCard } from './FinishingTimePercentileCard'
```

Should become:

```typescript
import { VdotScore } from './VdotScore'
import { UnifiedTrainingCard } from './UnifiedTrainingCard'  // NEW
import { AgeComparisonCard } from './AgeComparisonCard'
import { FinishingTimePercentileCard } from './FinishingTimePercentileCard'
```

- [ ] **Step 3: Remove old type imports**

Remove the old type imports (around line 4-5):

```typescript
import type { RaceTimeEntry } from '../calc/raceTimes'      // DELETE
import type { TrainingPaceResult } from '../calc/trainingPaces'  // DELETE
```

- [ ] **Step 4: Update setParams type to include units**

Add the `setParams` callback prop to the component signature. Find the function declaration:

```typescript
export function ResultsPanel({ results }: ResultsPanelProps) {
```

Add a new prop for setParams:

```typescript
interface ResultsPanelProps {
  results: Results | null
  onUnitsChange: (units: 'km' | 'mi') => void  // NEW
}

export function ResultsPanel({ results, onUnitsChange }: ResultsPanelProps) {
```

- [ ] **Step 5: Replace old component rendering with new UnifiedTrainingCard**

Find where RaceTimesTable and TrainingPaces are rendered (around lines 48-54) and replace with UnifiedTrainingCard:

```typescript
      {raceTimes && raceTimes.length > 0 && trainingPaces && trainingPaces.paces.length > 0 && (
        <UnifiedTrainingCard
          raceTimes={raceTimes}
          trainingPaces={trainingPaces}
          currentDistanceId={distance.id}
          units={results.units}
          onUnitsChange={onUnitsChange}
        />
      )}
```

- [ ] **Step 6: Verify TypeScript compiles**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 7: Commit**

```bash
git add src/components/ResultsPanel.tsx
git commit -m "refactor: use UnifiedTrainingCard in ResultsPanel

- Add units to Results interface
- Replace RaceTimesTable and TrainingPaces with UnifiedTrainingCard
- Add onUnitsChange prop to handle toggle
- Remove old component imports
```

---

## Task 7: Update App.tsx to Pass Units

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Remove old component imports**

Find the imports section and remove:

```typescript
import { RaceTimesTable } from './components/RaceTimesTable'
import { TrainingPaces } from './components/TrainingPaces'
```

- [ ] **Step 2: Add units to results object**

Find the `return` statement in the `useMemo` hook (around line 44) and add `units: params.units`:

```typescript
    return {
      distance,
      timeSecs,
      vdot,
      raceTimes,
      trainingPaces,
      ageComparison,
      userAge: params.a,
      gender: params.g,
      units: params.units,  // NEW
    }
```

- [ ] **Step 2.5: Update useMemo dependency array**

Find the `useMemo` dependency array (around line 54) and add `params.units`:

```typescript
  }, [params.d, params.t, params.a, params.g, params.units])
```

- [ ] **Step 3: Create units change handler**

Add a handler function before the return statement of the App component (around line 56):

```typescript
  const handleUnitsChange = (units: 'km' | 'mi') => {
    setParams({ units })
  }
```

- [ ] **Step 4: Pass onUnitsChange to ResultsPanel**

Find the `<ResultsPanel />` component (around line 90) and add the prop:

```typescript
        <ResultsPanel results={results} onUnitsChange={handleUnitsChange} />
```

- [ ] **Step 5: Verify TypeScript compiles and app runs**

Run: `npm run build`
Expected: Build succeeds

Run: `npm run dev`
Expected: Dev server starts without errors

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire up units toggle in App

- Pass units from URL params to results
- Add handleUnitsChange callback
- Pass onUnitsChange to ResultsPanel
- Remove old component imports
```

---

## Task 8: Delete Old Components

**Files:**
- Delete: `src/components/RaceTimesTable.tsx`
- Delete: `src/components/TrainingPaces.tsx`

- [ ] **Step 1: Delete old component files**

```bash
rm src/components/RaceTimesTable.tsx
rm src/components/TrainingPaces.tsx
```

- [ ] **Step 2: Verify build still works**

Run: `npm run build`
Expected: Build succeeds (no references to deleted files remain)

- [ ] **Step 3: Commit**

```bash
git add src/components/RaceTimesTable.tsx src/components/TrainingPaces.tsx
git commit -m "refactor: remove obsolete components

- Delete RaceTimesTable.tsx (replaced by UnifiedTrainingCard)
- Delete TrainingPaces.tsx (replaced by UnifiedTrainingCard)
```

---

## Task 8.5: Add Backward Compatibility for 3km URLs

**Files:**
- Modify: `src/hooks/useUrlParams.ts`

- [ ] **Step 1: Add migration for legacy 3km URLs**

In the `parseParams` function, after parsing `d`, add a migration:

```typescript
function parseParams(search: string): UrlParams {
  const params = new URLSearchParams(search)
  const ageStr = params.get('a')
  const gender = params.get('g')
  const lang = params.get('lang')
  const units = params.get('units')
  let d = params.get('d')

  // Migrate legacy 3km URLs to 5km
  if (d === '3km') {
    d = '5k'
    // Update URL to reflect the migration
    const newUrl = new URLSearchParams(search)
    newUrl.set('d', '5k')
    window.history.replaceState(null '', `?${newUrl.toString()}`)
  }

  return {
    d,
    t: params.get('t'),
    a: ageStr ? parseInt(ageStr, 10) : null,
    g: gender === 'm' || gender === 'f' ? gender : null,
    units: units === 'mi' ? 'mi' : 'km',
    lang: lang === 'ko' ? 'ko' : 'en',
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useUrlParams.ts
git commit -m "feat: migrate legacy 3km URLs to 5km

- Auto-redirect ?d=3km to ?d=5k
- Update URL in place to avoid broken bookmarks
"
```

---

## Task 9: Manual Testing

**Files:**
- None (manual verification)

- [ ] **Step 1: Test units toggle switches columns**

1. Open app in browser
2. Enter a distance and time
3. Click "km" button - should see Pace/km column only
4. Click "mi" button - should see Pace/mi column only
5. URL should update to `?units=km` or `?units=mi`

- [ ] **Step 2: Test URL parameter persistence**

1. Visit `http://localhost:5173/?d=5k&t=20:00&units=mi`
2. Should load with "mi" selected and showing mile columns
3. Reload page - selection should persist

- [ ] **Step 3: Test invalid units defaults to km**

1. Visit `http://localhost:5173/?d=5k&t=20:00&units=invalid`
2. Should default to "km" selected

- [ ] **Step 4: Test 3km is removed from selector**

1. Click distance dropdown
2. "3K" should NOT be in the list

- [ ] **Step 5: Test mobile responsive layout**

1. Open browser DevTools
2. Toggle mobile view (< 768px)
3. Tables should stack vertically
4. Each table should be full width
5. No horizontal scroll

- [ ] **Step 6: Test all VDOT calculations still work**

1. Enter various distances and times
2. Verify VDOT score is calculated
3. Verify race times are predicted
4. Verify training paces are shown

- [ ] **Step 7: Test backward compatibility with 3km URLs**

1. Visit `http://localhost:5173/?d=3km&t=12:00`
2. URL should auto-redirect to `?d=5k&t=12:00`
3. App should load with 5k distance selected
4. No errors or crashes

---

## Task 10: Final Cleanup and Verification

**Files:**
- Multiple

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Clean build with no errors or warnings

- [ ] **Step 2: Check for unused imports and React hooks dependencies**

Run: `npx tsc --noEmit`
Expected: No type errors

Run: `npm run lint` (if ESLint is configured) OR verify no console warnings about React Hooks dependencies
Expected: No React Hooks exhaustive-deps warnings

- [ ] **Step 3: Final commit if needed**

If any cleanup was needed:

```bash
git add .
git commit -m "chore: final cleanup after UnifiedTrainingCard implementation"
```

---

## Summary

This plan creates a unified training card that:
1. Combines race times, training paces, and intervals into one card
2. Adds a km/mi toggle that persists via URL parameter
3. Shows only the selected unit's pace columns
4. Removes the 3km distance option entirely
5. Maintains all existing VDOT calculation functionality
6. Works responsively on mobile devices

Total estimated tasks: 10
Total estimated steps: ~60
