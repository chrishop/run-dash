import { getAgeGradeEntry } from '../data/ageGradeTable'
import type { Distance } from '../data/distances'

export interface AgeGradingResult {
  percentage: number
}

/**
 * Calculate age-grading percentage for a given distance, time, age, and gender.
 * Returns null if the distance has no age-grade data or age is outside the table range.
 *
 * Note: percentage can exceed 100 (faster than world standard) or be Infinity (timeSecs = 0).
 * Callers are responsible for guarding against these values before displaying them.
 */
export function getAgeGrading(
  distance: Distance,
  timeSecs: number,
  age: number,
  gender: 'm' | 'f',
): AgeGradingResult | null {
  if (!distance.ageGradeKey) return null

  const entry = getAgeGradeEntry(gender, distance.ageGradeKey)
  if (!entry) return null

  const ageFactor = entry.factors[String(Math.round(age))]
  if (ageFactor === undefined) return null

  // age-standard = world_record / age_factor
  // age-grading % = age-standard / athlete_time * 100
  const ageStandard = entry.worldRecordSecs / ageFactor
  const percentage = (ageStandard / timeSecs) * 100

  return { percentage }
}
