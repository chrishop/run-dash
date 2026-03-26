import { describe, it, expect } from 'vitest'
import { getAgeComparisonTable } from '../ageComparison'
import { getDistanceById } from '../../data/distances'
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

describe('getAgeComparisonTable', () => {
  // Happy path
  it('returns 15 rows (ages 20-90 in 5-year steps)', () => {
    const result = getAgeComparisonTable(dist5k, 65)
    expect(result).toHaveLength(15)
  })

  it('returns ages from 20 to 90', () => {
    const result = getAgeComparisonTable(dist5k, 65)
    const ages = result.map((r) => r.age)
    expect(ages).toEqual([20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90])
  })

  it('returns non-null male and female times for all ages', () => {
    const result = getAgeComparisonTable(dist5k, 65)
    for (const row of result) {
      expect(row.maleTimeSecs).not.toBeNull()
      expect(row.femaleTimeSecs).not.toBeNull()
      expect(row.maleTimeSecs!).toBeGreaterThan(0)
      expect(row.femaleTimeSecs!).toBeGreaterThan(0)
    }
  })

  // Invariant: times increase with age from 30 onward
  it('has increasing times with age from 30 onward', () => {
    const result = getAgeComparisonTable(dist5k, 65)
    const from30 = result.filter((r) => r.age >= 30)
    for (let i = 1; i < from30.length; i++) {
      expect(from30[i].maleTimeSecs!).toBeGreaterThan(from30[i - 1].maleTimeSecs!)
      expect(from30[i].femaleTimeSecs!).toBeGreaterThan(from30[i - 1].femaleTimeSecs!)
    }
  })

  it('has female times slower than male times', () => {
    const result = getAgeComparisonTable(dist5k, 65)
    for (const row of result) {
      expect(row.femaleTimeSecs!).toBeGreaterThan(row.maleTimeSecs!)
    }
  })

  // Distance without age grade data
  it('returns empty array for distance with no ageGradeKey', () => {
    expect(getAgeComparisonTable(distNoAgeGrade, 65)).toEqual([])
  })

  // Times at 100% ≈ world records
  it('returns times close to world records at 100% age grading', () => {
    const result = getAgeComparisonTable(dist5k, 100)
    const age30 = result.find((r) => r.age === 30)!
    expect(age30.maleTimeSecs!).toBeCloseTo(769, -1)
  })

  // Very slow times at low percentage
  it('produces very slow times at low percentage', () => {
    const result = getAgeComparisonTable(dist5k, 20)
    const age30 = result.find((r) => r.age === 30)!
    expect(age30.maleTimeSecs!).toBeGreaterThan(3000)
  })

  // === BUG DOCUMENTATION (pure calc behavior — guarded at App.tsx level) ===

  it('BUG: >100% produces impossibly fast times', () => {
    const result = getAgeComparisonTable(dist5k, 110)
    const age30 = result.find((r) => r.age === 30)!
    expect(age30.maleTimeSecs!).toBeLessThan(769)
  })

  it('BUG: 0% produces Infinity times', () => {
    const result = getAgeComparisonTable(dist5k, 0)
    const age30 = result.find((r) => r.age === 30)!
    expect(age30.maleTimeSecs!).toBe(Infinity)
  })
})
