import { describe, it, expect } from 'vitest'
import { normalCDF, logNormalCDF, generateCDFCurve } from '../percentile'

// 5K CDF params from the data source
const MU_5K = 3.557812
const SIGMA_5K = 0.272093

describe('normalCDF', () => {
  it('returns 0.5 at x = 0', () => {
    expect(normalCDF(0)).toBeCloseTo(0.5, 5)
  })

  it('returns ~1.0 for large positive x', () => {
    expect(normalCDF(10)).toBeCloseTo(1.0, 5)
  })

  it('returns ~0.0 for large negative x', () => {
    expect(normalCDF(-10)).toBeCloseTo(0.0, 5)
  })

  it('returns ~0.8413 at x = 1 (standard normal)', () => {
    expect(normalCDF(1)).toBeCloseTo(0.8413, 3)
  })

  it('returns ~0.1587 at x = -1 (standard normal)', () => {
    expect(normalCDF(-1)).toBeCloseTo(0.1587, 3)
  })

  it('returns ~0.9772 at x = 2', () => {
    expect(normalCDF(2)).toBeCloseTo(0.9772, 3)
  })
})

describe('logNormalCDF', () => {
  it('returns ~0.5 at the median time', () => {
    // Median of log-normal = exp(mu), in minutes → convert to seconds
    const medianSecs = Math.exp(MU_5K) * 60
    expect(logNormalCDF(medianSecs, MU_5K, SIGMA_5K)).toBeCloseTo(0.5, 2)
  })

  it('returns close to 0 for a very fast 5K (15:00)', () => {
    const result = logNormalCDF(900, MU_5K, SIGMA_5K)
    expect(result).toBeLessThan(0.05)
  })

  it('returns close to 1 for a very slow 5K (~83:00)', () => {
    const result = logNormalCDF(5000, MU_5K, SIGMA_5K)
    expect(result).toBeGreaterThan(0.95)
  })

  it('returns 0 for time = 0', () => {
    expect(logNormalCDF(0, MU_5K, SIGMA_5K)).toBe(0)
  })

  it('returns 0 for negative time', () => {
    expect(logNormalCDF(-100, MU_5K, SIGMA_5K)).toBe(0)
  })

  it('returns higher CDF for slower times (more runners finish faster)', () => {
    const fast = logNormalCDF(1200, MU_5K, SIGMA_5K) // 20:00
    const slow = logNormalCDF(1800, MU_5K, SIGMA_5K) // 30:00
    expect(slow).toBeGreaterThan(fast)
  })
})

describe('generateCDFCurve', () => {
  const curve = generateCDFCurve(MU_5K, SIGMA_5K)

  it('returns 121 data points by default (0 to 120 inclusive)', () => {
    expect(curve).toHaveLength(121)
  })

  it('returns custom number of points', () => {
    const customCurve = generateCDFCurve(MU_5K, SIGMA_5K, 50)
    expect(customCurve).toHaveLength(51)
  })

  it('has all percentiles between 0 and 100', () => {
    for (const point of curve) {
      expect(point.percentile).toBeGreaterThanOrEqual(0)
      expect(point.percentile).toBeLessThanOrEqual(100)
    }
  })

  it('has monotonically increasing percentiles', () => {
    for (let i = 1; i < curve.length; i++) {
      expect(curve[i].percentile).toBeGreaterThanOrEqual(curve[i - 1].percentile)
    }
  })

  it('has monotonically increasing times', () => {
    for (let i = 1; i < curve.length; i++) {
      expect(curve[i].timeSecs).toBeGreaterThanOrEqual(curve[i - 1].timeSecs)
    }
  })

  it('has positive time values', () => {
    for (const point of curve) {
      expect(point.timeSecs).toBeGreaterThan(0)
    }
  })

  it('has integer time values (rounded)', () => {
    for (const point of curve) {
      expect(point.timeSecs).toBe(Math.round(point.timeSecs))
    }
  })

  // BUG DOCUMENTATION: percentile display edge case
  // The FinishingTimePercentileCard computes: Math.floor((1 - CDF) * 1000) / 10
  // For CDF ≈ 0 (very fast time), this gives ≈ 100.0 which is "faster than 100% of runners"
  it('BUG: (1 - CDF) * 100 can reach 100.0 for extremely fast times', () => {
    // At 1 second, CDF is essentially 0, so (1 - 0) * 1000 = 1000, floor/10 = 100.0
    const veryFastCDF = logNormalCDF(1, MU_5K, SIGMA_5K)
    const fasterThanPct = Math.floor((1 - veryFastCDF) * 1000) / 10
    // This produces 100.0 which is logically impossible ("faster than 100% of runners")
    expect(fasterThanPct).toBe(100)
  })
})
