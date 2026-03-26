import { describe, it, expect } from 'vitest'
import { getRaceTimes } from '../raceTimes'
import { DISTANCES } from '../../data/distances'

describe('getRaceTimes', () => {
  // Happy path
  it('returns 6 entries for a valid VDOT', () => {
    const result = getRaceTimes(50)
    expect(result).toHaveLength(4)
  })

  it('returns entries matching all DISTANCES', () => {
    const result = getRaceTimes(50)
    const ids = result.map((r) => r.distance.id)
    expect(ids).toEqual(DISTANCES.map((d) => d.id))
  })

  it('returns positive time values', () => {
    const result = getRaceTimes(50)
    for (const entry of result) {
      expect(entry.timeSecs).toBeGreaterThan(0)
      expect(entry.pacePerKmSecs).toBeGreaterThan(0)
      expect(entry.pacePerMileSecs).toBeGreaterThan(0)
    }
  })

  // Pace calculations are correct
  it('calculates pacePerKmSecs as timeSecs / distanceKm', () => {
    const result = getRaceTimes(50)
    for (const entry of result) {
      expect(entry.pacePerKmSecs).toBeCloseTo(entry.timeSecs / entry.distance.distanceKm, 5)
    }
  })

  it('calculates pacePerMileSecs using 1.609344 conversion', () => {
    const result = getRaceTimes(50)
    for (const entry of result) {
      const expected = entry.timeSecs / (entry.distance.distanceKm / 1.609344)
      expect(entry.pacePerMileSecs).toBeCloseTo(expected, 5)
    }
  })

  // Invariant: longer distances = longer times
  it('has increasing times for increasing distances', () => {
    const result = getRaceTimes(50)
    for (let i = 1; i < result.length; i++) {
      expect(result[i].timeSecs).toBeGreaterThan(result[i - 1].timeSecs)
    }
  })

  // Boundary VDOT values
  it('returns entries at VDOT 30 (slowest)', () => {
    const result = getRaceTimes(30)
    expect(result).toHaveLength(4)
    // Marathon at VDOT 30 should be ~4:49:49
    const marathon = result.find((r) => r.distance.id === 'mar')!
    expect(marathon.timeSecs).toBeCloseTo(17389, 0)
  })

  it('returns entries at VDOT 85 (fastest)', () => {
    const result = getRaceTimes(85)
    expect(result).toHaveLength(4)
    // 5K at VDOT 85 should be ~12:37
    const fiveK = result.find((r) => r.distance.id === '5k')!
    expect(fiveK.timeSecs).toBeCloseTo(757, 0)
  })

  // Snapping behavior
  it('snaps VDOT 50.05 to 50.1', () => {
    const result = getRaceTimes(50.05)
    const resultExact = getRaceTimes(50.1)
    expect(result).toEqual(resultExact)
  })

  // Invalid VDOT — outside table range
  it('returns empty array for VDOT below range (29.9)', () => {
    expect(getRaceTimes(29.9)).toEqual([])
  })

  it('returns empty array for VDOT above range (85.1)', () => {
    expect(getRaceTimes(85.1)).toEqual([])
  })

  // Higher VDOT = faster times
  it('returns faster times at higher VDOT', () => {
    const slow = getRaceTimes(40)
    const fast = getRaceTimes(60)
    for (let i = 0; i < slow.length; i++) {
      expect(fast[i].timeSecs).toBeLessThan(slow[i].timeSecs)
    }
  })
})
