import { describe, it, expect } from 'vitest'
import { getAgeGrading } from '../ageGrading'
import { DISTANCES, getDistanceById } from '../../data/distances'
import type { Distance } from '../../data/distances'

const dist5k = getDistanceById('5k')!

// Mock distance with no ageGradeKey (1500m was removed from DISTANCES)
const distNoAgeGrade: Distance = {
  id: 'test',
  label: 'Test',
  vdotKey: '1500m',
  ageGradeKey: null,
  distanceKm: 1.5,
}

describe('getAgeGrading', () => {
  // Happy path
  it('returns a valid result for a typical 5K runner (25:00, age 30, male)', () => {
    const result = getAgeGrading(dist5k, 1500, 30, 'm')
    expect(result).not.toBeNull()
    expect(result!.percentage).toBeGreaterThan(40)
    expect(result!.percentage).toBeLessThan(80)
  })

  it('returns a higher percentage for an elite runner', () => {
    const result = getAgeGrading(dist5k, 780, 30, 'm') // ~13:00 5K
    expect(result).not.toBeNull()
    expect(result!.percentage).toBeGreaterThan(90)
  })

  it('returns a lower percentage for a slow runner', () => {
    const result = getAgeGrading(dist5k, 3600, 30, 'm') // 60:00 5K
    expect(result).not.toBeNull()
    expect(result!.percentage).toBeLessThan(30)
  })

  // Distance without age grade data
  it('returns null for distance with no ageGradeKey', () => {
    expect(getAgeGrading(distNoAgeGrade, 300, 30, 'm')).toBeNull()
  })

  // Age boundaries
  it('returns a result at age 5 (youngest in table)', () => {
    expect(getAgeGrading(dist5k, 1500, 5, 'm')).not.toBeNull()
  })

  it('returns a result at age 100 (oldest in table)', () => {
    expect(getAgeGrading(dist5k, 1500, 100, 'm')).not.toBeNull()
  })

  it('returns null for age outside table (101)', () => {
    expect(getAgeGrading(dist5k, 1500, 101, 'm')).toBeNull()
  })

  it('returns null for age outside table (4)', () => {
    expect(getAgeGrading(dist5k, 1500, 4, 'm')).toBeNull()
  })

  // Gender differences
  it('returns different percentages for male vs female at same time', () => {
    const male = getAgeGrading(dist5k, 1500, 30, 'm')
    const female = getAgeGrading(dist5k, 1500, 30, 'f')
    expect(male).not.toBeNull()
    expect(female).not.toBeNull()
    expect(female!.percentage).toBeGreaterThan(male!.percentage)
  })

  // Works for all distances that have ageGradeKey
  it.each(DISTANCES.filter((d) => d.ageGradeKey !== null))(
    'returns a valid result for $label',
    (distance) => {
      const result = getAgeGrading(distance, 1500, 30, 'm')
      expect(result).not.toBeNull()
      expect(result!.percentage).toBeGreaterThan(0)
    },
  )

  // Result shape — only percentage, no benchmarkKey/benchmarkColor
  it('returns only percentage in result', () => {
    const result = getAgeGrading(dist5k, 1500, 30, 'm')
    expect(result).not.toBeNull()
    expect(Object.keys(result!)).toEqual(['percentage'])
  })

  // === BUG DOCUMENTATION (pure calc behavior — guarded at App.tsx level) ===

  it('BUG: produces >100% for times faster than world record', () => {
    const result = getAgeGrading(dist5k, 720, 30, 'm')
    expect(result).not.toBeNull()
    expect(result!.percentage).toBeGreaterThan(100)
  })

  it('BUG: produces Infinity for time = 0', () => {
    const result = getAgeGrading(dist5k, 0, 30, 'm')
    expect(result).not.toBeNull()
    expect(result!.percentage).toBe(Infinity)
  })
})
