import { getAgeGradeEntry } from '../data/ageGradeTable'
import type { Distance } from '../data/distances'

export interface AgeComparisonRow {
  age: number
  maleTimeSecs: number | null
  femaleTimeSecs: number | null
}

const COMPARISON_AGES = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90]

/**
 * For the user's age-grading percentage, compute the equivalent finishing time
 * at each age (20-90 in 5-year steps) for both genders.
 *
 * Formula (rearranged): targetTime = (worldRecordSecs * ageFactor) / (ageGradingPct / 100)
 */
export function getAgeComparisonTable(
  distance: Distance,
  ageGradingPct: number,
): AgeComparisonRow[] {
  if (!distance.ageGradeKey) return []

  const maleEntry = getAgeGradeEntry('m', distance.ageGradeKey)
  const femaleEntry = getAgeGradeEntry('f', distance.ageGradeKey)

  return COMPARISON_AGES.map((age) => {
    const ageStr = String(age)
    const pctFraction = ageGradingPct / 100

    let maleTimeSecs: number | null = null
    if (maleEntry) {
      const factor = maleEntry.factors[ageStr]
      if (factor !== undefined) {
        maleTimeSecs = (maleEntry.worldRecordSecs * factor) / pctFraction
      }
    }

    let femaleTimeSecs: number | null = null
    if (femaleEntry) {
      const factor = femaleEntry.factors[ageStr]
      if (factor !== undefined) {
        femaleTimeSecs = (femaleEntry.worldRecordSecs * factor) / pctFraction
      }
    }

    return { age, maleTimeSecs, femaleTimeSecs }
  })
}
