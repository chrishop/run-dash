# Input Validation & Edge Case Fixes

**Date:** 2026-03-26
**Status:** Approved

## Problem

Several user inputs produce broken or nonsensical UI output:

| Input | Current output | Why it's bad |
|-------|---------------|--------------|
| Time = 0:00 | "Infinity%" age grading | Division by zero |
| Time faster than world record (e.g. 5K in 12:00) | ">100%" age grading with "World Class" badge | Misleading — no indication input is unrealistic |
| Very fast time for any distance | "Faster than 100.0% of runners" | Logically impossible |
| `?a=abc` in URL | NaN age, silent failure | No age card shown, no explanation |
| Time outside VDOT table range | Results shown with no indication they're clamped | User doesn't know results are boundary estimates |

Additionally, 1500m and 1 Mile are being **removed** from the app. They lack percentile data and 1500m has no age grading either — removing them simplifies the app to the four distances runners most care about: 5K, 10K, Half Marathon, Marathon.

## Architecture Decision

**Guard at App.tsx, keep calc functions pure.**

Calculation functions (`getAgeGrading`, `getAgeComparisonTable`, etc.) return correct mathematical results regardless of plausibility — including Infinity and values > 100%. This is intentional: they are pure functions.

All plausibility checks live in `App.tsx`'s `useMemo`. A `warnings` array is added to the results object. Components consume warnings and render appropriate messages.

The NaN age bug is fixed at `useUrlParams.ts` since it is a parsing concern.
The percentile 100% cap is fixed in `FinishingTimePercentileCard.tsx` since it is a display concern.

## What Changes

### 1. `src/data/distances.ts`
Remove the `1500m` and `1mi` entries from the `DISTANCES` array. After this change, supported distances are: **5K, 10K, Half Marathon, Marathon**. All four have both age grading data and percentile data, so no "not available" edge cases remain.

URLs with `?d=1500m` or `?d=1mi` will return `undefined` from `getDistanceById`, causing `results` to be `null` — the existing empty-state prompt renders, which is correct.

### 2. `src/hooks/useUrlParams.ts`
Fix NaN age: `parseInt("abc")` currently produces `NaN` which passes through. Change to: `const parsed = ageStr ? parseInt(ageStr, 10) : null; a: parsed !== null && isNaN(parsed) ? null : parsed`.

Export `parseParams` as a named export so tests can import and exercise it directly, rather than maintaining an inline copy that diverges from the real implementation.

Note: `parseTime("abc")` already returns `null` correctly, so time parsing has no equivalent bug.

### 3. `src/calc/vdot.ts`
Add a pure helper:
```typescript
export function isTimeOutOfVdotRange(
  distanceKey: string,
  timeSecs: number
): 'tooSlow' | 'tooFast' | null
```
Compares `timeSecs` against the VDOT 30 (slowest) and VDOT 85 (fastest) boundary times for the given distance. Returns `'tooFast'` for `timeSecs = 0` (it is faster than the fastest table entry). Returns `null` if in range.

### 3.5 `src/types.ts` (new file)
Define and export the `Warning` type here so it can be shared between `App.tsx` (which produces warnings) and `ResultsPanel.tsx` (which consumes them) without duplication:

```typescript
export type Warning =
  | { type: 'vdotOutOfRange'; direction: 'tooSlow' | 'tooFast' }
  | { type: 'ageGradingSuppressed' }
```

Note: `zeroTime` is NOT a warning type — zero time causes `useMemo` to return `null` entirely, so no warnings array is needed.

### 4. `src/App.tsx`
Import `Warning` from `src/types.ts`. Extend the `useMemo` result object to include `warnings: Warning[]`.

Guards added (in order):

1. **Zero time**: if `timeSecs === 0`, return `null` entirely from `useMemo`. `ResultsPanel` receives `null` and shows the empty-state prompt — same as when no input is provided. Zero time is treated as no input.

2. **VDOT out of range**: call `isTimeOutOfVdotRange(distance.vdotKey, timeSecs)`; if not null, push `{ type: 'vdotOutOfRange', direction }`. VDOT, race times, and training paces still render (they are valid clamped results). The warning tells the user results are boundary estimates.

3. **Invalid age grading**: after calling `getAgeGrading`, if result is not null and `percentage > 100`, push `{ type: 'ageGradingSuppressed' }`, set ageGrading and ageComparison to null. A defensive `!isFinite(percentage)` check is also included as a fallback in case the zero-time guard is ever reordered — but in normal flow this path is unreachable since zero time is caught first.

**Out-of-table age values** (`?a=0`, `?a=200`): `getAgeGrading` already returns `null` for ages outside the 5–100 table range. This silent null is acceptable — no warning is added for this case.

### 5. `src/components/ResultsPanel.tsx`
- Accept `warnings` on the `Results` type.
- Render an inline `WarningBanner` above the cards when warnings are present. This is a small enough component to define inline in this file.

### 6. `src/components/FinishingTimePercentileCard.tsx`
- **Cap at 99.9%**: clamp `overallPct` and `genderPct` to `Math.min(value, 99.9)` to prevent displaying "faster than 100.0% of runners". No message needed — 99.9% is accurate enough.
- Remove `DISTANCE_ID_MAP` entries for `1500m` and `1mi` (or leave them — they will simply never be reached after removing those distances).

### 7. i18n: `src/i18n/en.json` + `ko.json`
New translation keys:
- `warnings.vdotTooSlow` — "Your time is outside the supported range. Results are shown for VDOT 30 (the slowest supported value)."
- `warnings.vdotTooFast` — "Your time is outside the supported range. Results are shown for VDOT 85 (the fastest supported value)."
- `warnings.ageGradingSuppressed` — "Your time appears to be faster than the age-graded world standard. Age grading results are not shown."

Korean translations use the same structure. Note: Korean translations should be verified by a native speaker — machine-translated Korean is provided as a best effort.

## Tests

### Tests that change:
- `useUrlParams.test.ts`: `'BUG: non-numeric age produces NaN'` → rename to `'returns null for non-numeric age'`, expect `null` not `NaN`
- `src/utils/__tests__/percentile.test.ts` — the existing BUG test for 100% percentile stays as-is (it documents raw CDF math). A new test is added in `FinishingTimePercentileCard.test.tsx` asserting the displayed value is capped at 99.9.

### Tests that stay unchanged (pure calc behavior):
- `ageGrading.test.ts` — Infinity and >100% tests remain; they document correct raw math.
- `ageComparison.test.ts` — Infinity/division-by-zero tests remain.

### New tests:
- `vdot.test.ts` — `isTimeOutOfVdotRange`: in-range returns null; too slow returns `'tooSlow'`; too fast returns `'tooFast'`; `timeSecs = 0` returns `'tooFast'`
- `ResultsPanel.test.tsx` — zero time renders `zeroTime` warning and no VDOT/training cards; out-of-range time renders `vdotOutOfRange` warning but still shows VDOT card; >100% age grading renders `ageGradingSuppressed` warning and hides age comparison
- `FinishingTimePercentileCard.test.tsx` — percentile display capped at 99.9 for extreme fast input

### Tests to remove / update:
- `ageGrading.test.ts`: `dist1500m` and `dist1mi` are retrieved via `getDistanceById('1500m')!` and `getDistanceById('1mi')!`. After removal these return `undefined` and the `!` assertion silently crashes tests. Replace with explicit mock objects typed as `Distance` literals (e.g. `{ id: '1500m', label: '1500m', vdotKey: '1500m', ageGradeKey: null, distanceKm: 1.5 }`), and drop the `!` assertions.
- `ResultsPanel.test.tsx`: contains tests calling `getDistanceById('1500m')!` and `getDistanceById('1mi')!` — same fix: replace with mock `Distance` objects or remove the test cases if they only exist to test 1500m/1mi-specific behavior.
- `vdot.test.ts`: the `it.each(['1500m', '1_mile', ...])` test uses VDOT table keys (not distance IDs), and those keys still exist in the underlying table after distance removal — these tests can stay as-is.
- `useUrlParams.test.ts`: update to import `parseParams` from `../../hooks/useUrlParams` rather than using the inline copy. Rename the BUG test to `'returns null for non-numeric age'` and flip the expectation to `null`.

## Out of Scope
- `formatTime` negative input: no realistic code path produces negative seconds.
- Out-of-table age values (`?a=0`, `?a=200`): silent null is acceptable.
- Extreme-but-valid ages (5, 100): already work correctly.
