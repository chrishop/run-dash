import { getAgeGradeEntry } from '../data/ageGradeTable'
import type { Distance } from '../data/distances'

export interface AgeGradingResult {
  percentage: number
  benchmark: string
  benchmarkColor: string
}

const BENCHMARKS: { min: number; label: string; color: string }[] = [
  { min: 90, label: 'World Class', color: 'text-purple-700' },
  { min: 80, label: 'National Class', color: 'text-blue-700' },
  { min: 70, label: 'Regional Class', color: 'text-green-700' },
  { min: 60, label: 'Local Class', color: 'text-yellow-700' },
  { min: 0, label: 'Recreational', color: 'text-gray-600' },
]

function getBenchmark(pct: number): { label: string; color: string } {
  for (const b of BENCHMARKS) {
    if (pct >= b.min) return { label: b.label, color: b.color }
  }
  return { label: 'Recreational', color: 'text-gray-600' }
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

  // age-grading % = (world_record * age_factor) / athlete_time * 100
  const percentage = ((entry.worldRecordSecs * ageFactor) / timeSecs) * 100
  const { label, color } = getBenchmark(percentage)

  return {
    percentage,
    benchmark: label,
    benchmarkColor: color,
  }
}
