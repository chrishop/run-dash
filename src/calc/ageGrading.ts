import { getAgeGradeEntry } from '../data/ageGradeTable'
import type { Distance } from '../data/distances'

export interface AgeGradingResult {
  percentage: number
  benchmarkKey: string
  benchmarkColor: string
}

const BENCHMARKS: { min: number; key: string; color: string }[] = [
  { min: 90, key: 'ageGrading.worldClass', color: 'text-purple-700' },
  { min: 80, key: 'ageGrading.nationalClass', color: 'text-blue-700' },
  { min: 70, key: 'ageGrading.regionalClass', color: 'text-green-700' },
  { min: 60, key: 'ageGrading.localClass', color: 'text-yellow-700' },
  { min: 0, key: 'ageGrading.recreational', color: 'text-gray-600' },
]

function getBenchmark(pct: number): { key: string; color: string } {
  for (const b of BENCHMARKS) {
    if (pct >= b.min) return { key: b.key, color: b.color }
  }
  return { key: 'ageGrading.recreational', color: 'text-gray-600' }
}

/**
 * Calculate age-grading percentage for a given distance, time, age, and gender.
 * Returns null if the distance has no age-grade data.
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
  const { key, color } = getBenchmark(percentage)

  return {
    percentage,
    benchmarkKey: key,
    benchmarkColor: color,
  }
}
