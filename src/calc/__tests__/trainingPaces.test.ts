import { describe, it, expect } from 'vitest'
import { getTrainingPaces } from '../trainingPaces'

describe('getTrainingPaces', () => {
  // Happy path
  it('returns 6 paces and 6 intervals for a valid VDOT', () => {
    const result = getTrainingPaces(50)
    expect(result.paces).toHaveLength(6)
    expect(result.intervals).toHaveLength(6)
  })

  it('returns correct interval distances', () => {
    const result = getTrainingPaces(50)
    const distances = result.intervals.map((i) => i.distanceM)
    expect(distances).toEqual([1200, 800, 600, 400, 300, 200])
  })

  it('has interval labels matching distance', () => {
    const result = getTrainingPaces(50)
    for (const interval of result.intervals) {
      expect(interval.label).toBe(`${interval.distanceM}m`)
    }
  })

  // Invariant: paces should be ordered from slowest (easy) to fastest (repetition)
  it('has paces ordered slow to fast (sec/km descending)', () => {
    const result = getTrainingPaces(50)
    for (let i = 1; i < result.paces.length; i++) {
      expect(result.paces[i].secPerKm).toBeLessThan(result.paces[i - 1].secPerKm)
    }
  })

  it('has paces ordered slow to fast (sec/mi descending)', () => {
    const result = getTrainingPaces(50)
    for (let i = 1; i < result.paces.length; i++) {
      expect(result.paces[i].secPerMi).toBeLessThan(result.paces[i - 1].secPerMi)
    }
  })

  // Invariant: rep pace is faster than interval pace → rep time < interval time
  it('has rep times shorter than interval times for same distance', () => {
    const result = getTrainingPaces(50)
    for (const interval of result.intervals) {
      expect(interval.repTimeSecs).toBeLessThan(interval.intervalTimeSecs)
    }
  })

  // Interval time calculation correctness
  it('calculates interval time as interval.sec_per_km * (distanceM / 1000)', () => {
    const result = getTrainingPaces(50)
    const intervalPace = result.paces.find((p) => p.labelKey === 'trainingPaces.interval')!
    for (const interval of result.intervals) {
      const expected = intervalPace.secPerKm * (interval.distanceM / 1000)
      expect(interval.intervalTimeSecs).toBeCloseTo(expected, 5)
    }
  })

  it('calculates rep time as repetition.sec_per_km * (distanceM / 1000)', () => {
    const result = getTrainingPaces(50)
    const repPace = result.paces.find((p) => p.labelKey === 'trainingPaces.repetition')!
    for (const interval of result.intervals) {
      const expected = repPace.secPerKm * (interval.distanceM / 1000)
      expect(interval.repTimeSecs).toBeCloseTo(expected, 5)
    }
  })

  // All paces have positive values
  it('has positive values for all paces', () => {
    const result = getTrainingPaces(50)
    for (const pace of result.paces) {
      expect(pace.secPerKm).toBeGreaterThan(0)
      expect(pace.secPerMi).toBeGreaterThan(0)
    }
  })

  // Mile pace > km pace (miles are longer)
  it('has mile pace greater than km pace for all intensities', () => {
    const result = getTrainingPaces(50)
    for (const pace of result.paces) {
      expect(pace.secPerMi).toBeGreaterThan(pace.secPerKm)
    }
  })

  // Invalid VDOT
  it('returns empty paces and intervals for invalid VDOT', () => {
    const result = getTrainingPaces(29.9)
    expect(result.paces).toEqual([])
    expect(result.intervals).toEqual([])
  })

  // Higher VDOT = faster paces
  it('returns faster paces at higher VDOT', () => {
    const slow = getTrainingPaces(40)
    const fast = getTrainingPaces(60)
    for (let i = 0; i < slow.paces.length; i++) {
      expect(fast.paces[i].secPerKm).toBeLessThan(slow.paces[i].secPerKm)
    }
  })
})
