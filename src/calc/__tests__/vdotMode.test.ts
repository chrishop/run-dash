import { describe, it, expect } from 'vitest'
import { getRaceTimes } from '../raceTimes'
import { getTrainingPaces } from '../trainingPaces'

describe('VDOT mode — getRaceTimes', () => {
  it('returns results for all 4 distances at VDOT 50', () => {
    const result = getRaceTimes(50)
    expect(result).toHaveLength(4)
  })

  it('returns positive times at VDOT 50', () => {
    const result = getRaceTimes(50)
    for (const entry of result) {
      expect(entry.timeSecs).toBeGreaterThan(0)
    }
  })

  it('race times are in reasonable range at VDOT 50', () => {
    const result = getRaceTimes(50)
    const fiveK = result.find((r) => r.distance.id === '5k')!
    // VDOT 50 5k should be roughly 19-21 minutes
    expect(fiveK.timeSecs).toBeGreaterThan(1140)
    expect(fiveK.timeSecs).toBeLessThan(1260)
  })

  it('marathon time is longer than half marathon at VDOT 50', () => {
    const result = getRaceTimes(50)
    const hm = result.find((r) => r.distance.id === 'hm')!
    const mar = result.find((r) => r.distance.id === 'mar')!
    expect(mar.timeSecs).toBeGreaterThan(hm.timeSecs)
  })

  it('returns valid results at boundary VDOT 10', () => {
    const result = getRaceTimes(10)
    expect(result).toHaveLength(4)
    for (const entry of result) {
      expect(entry.timeSecs).toBeGreaterThan(0)
    }
  })

  it('returns valid results at boundary VDOT 85', () => {
    const result = getRaceTimes(85)
    expect(result).toHaveLength(4)
    for (const entry of result) {
      expect(entry.timeSecs).toBeGreaterThan(0)
    }
  })

  it('higher VDOT produces faster race times', () => {
    const slow = getRaceTimes(40)
    const fast = getRaceTimes(60)
    for (let i = 0; i < slow.length; i++) {
      expect(fast[i].timeSecs).toBeLessThan(slow[i].timeSecs)
    }
  })

  it('returns empty array for VDOT below table range', () => {
    expect(getRaceTimes(9.9)).toEqual([])
  })

  it('returns empty array for VDOT above table range', () => {
    expect(getRaceTimes(85.1)).toEqual([])
  })
})

describe('VDOT mode — getTrainingPaces', () => {
  it('returns 6 paces at VDOT 50', () => {
    const result = getTrainingPaces(50)
    expect(result.paces).toHaveLength(6)
  })

  it('returns 6 interval distances at VDOT 50', () => {
    const result = getTrainingPaces(50)
    expect(result.intervals).toHaveLength(6)
  })

  it('paces are ordered slow to fast (sec/km descending)', () => {
    const result = getTrainingPaces(50)
    for (let i = 1; i < result.paces.length; i++) {
      expect(result.paces[i].secPerKm).toBeLessThan(result.paces[i - 1].secPerKm)
    }
  })

  it('all paces have positive km and mile values', () => {
    const result = getTrainingPaces(50)
    for (const pace of result.paces) {
      expect(pace.secPerKm).toBeGreaterThan(0)
      expect(pace.secPerMi).toBeGreaterThan(0)
    }
  })

  it('mile pace is always greater than km pace', () => {
    const result = getTrainingPaces(50)
    for (const pace of result.paces) {
      expect(pace.secPerMi).toBeGreaterThan(pace.secPerKm)
    }
  })

  it('easy slow pace is slower than threshold pace', () => {
    const result = getTrainingPaces(50)
    const easySlow = result.paces.find((p) => p.labelKey === 'trainingPaces.easySlow')!
    const threshold = result.paces.find((p) => p.labelKey === 'trainingPaces.threshold')!
    expect(easySlow.secPerKm).toBeGreaterThan(threshold.secPerKm)
  })

  it('rep times are shorter than interval times for each distance', () => {
    const result = getTrainingPaces(50)
    for (const interval of result.intervals) {
      expect(interval.repTimeSecs).toBeLessThan(interval.intervalTimeSecs)
    }
  })

  it('returns valid results at boundary VDOT 10', () => {
    const result = getTrainingPaces(10)
    expect(result.paces).toHaveLength(6)
    expect(result.intervals).toHaveLength(6)
  })

  it('returns valid results at boundary VDOT 85', () => {
    const result = getTrainingPaces(85)
    expect(result.paces).toHaveLength(6)
    expect(result.intervals).toHaveLength(6)
  })

  it('higher VDOT produces faster paces', () => {
    const slow = getTrainingPaces(40)
    const fast = getTrainingPaces(60)
    for (let i = 0; i < slow.paces.length; i++) {
      expect(fast.paces[i].secPerKm).toBeLessThan(slow.paces[i].secPerKm)
    }
  })

  it('returns empty result for VDOT below table range', () => {
    const result = getTrainingPaces(9.9)
    expect(result.paces).toEqual([])
    expect(result.intervals).toEqual([])
  })
})
