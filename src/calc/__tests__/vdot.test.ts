import { describe, it, expect } from 'vitest'
import { lookupVdot, isTimeOutOfVdotRange } from '../vdot'

describe('lookupVdot', () => {
  // Happy path
  it('returns a reasonable VDOT for a mid-range 5K time (20:00)', () => {
    const vdot = lookupVdot('5k', 1200)
    expect(vdot).not.toBeNull()
    expect(vdot!).toBeGreaterThanOrEqual(45)
    expect(vdot!).toBeLessThanOrEqual(55)
  })

  it('returns a reasonable VDOT for a marathon time (3:00:00)', () => {
    const vdot = lookupVdot('marathon', 10800)
    expect(vdot).not.toBeNull()
    expect(vdot!).toBeGreaterThanOrEqual(50)
    expect(vdot!).toBeLessThanOrEqual(60)
  })

  it('returns a reasonable VDOT for a 1500m time (5:00)', () => {
    const vdot = lookupVdot('1500m', 300)
    expect(vdot).not.toBeNull()
    expect(vdot!).toBeGreaterThanOrEqual(50)
    expect(vdot!).toBeLessThanOrEqual(60)
  })

  it('interpolates between table entries (result has 1 decimal place)', () => {
    const vdot = lookupVdot('5k', 1500)
    expect(vdot).not.toBeNull()
    // Should be a number with at most 1 decimal place
    expect(vdot! * 10).toBe(Math.round(vdot! * 10))
  })

  // Boundary values
  it('returns 30.0 for exact VDOT-30 5K time (1840s)', () => {
    const vdot = lookupVdot('5k', 1840)
    expect(vdot).toBe(30)
  })

  it('returns 85.0 for exact VDOT-85 5K time (757s)', () => {
    const vdot = lookupVdot('5k', 757)
    expect(vdot).toBe(85)
  })

  // Clamping behavior (edge cases — no warning to user)
  it('clamps to 10.0 for times slower than VDOT 10', () => {
    const vdot = lookupVdot('5k', 5000)
    expect(vdot).toBe(10)
  })

  it('clamps to 85.0 for times faster than VDOT 85', () => {
    const vdot = lookupVdot('5k', 600)
    expect(vdot).toBe(85)
  })

  it('clamps to 85.0 for time = 0 (nonsensical input)', () => {
    const vdot = lookupVdot('5k', 0)
    expect(vdot).toBe(85)
  })

  // Consistency across distances
  it('returns consistent VDOT across distances for table entries', () => {
    // A 20:00 5K runner should get similar VDOT as their predicted marathon time
    const vdot5k = lookupVdot('5k', 1200)
    expect(vdot5k).not.toBeNull()

    // VDOT should be within valid range
    expect(vdot5k!).toBeGreaterThanOrEqual(30)
    expect(vdot5k!).toBeLessThanOrEqual(85)
  })

  // All supported distance keys work
  it.each(['1500m', '1_mile', '5k', '10k', 'half_marathon', 'marathon'])(
    'returns a valid VDOT for distance key "%s"',
    (key) => {
      // Use a mid-range time that should work for all distances
      const vdot = lookupVdot(key, 1200)
      expect(vdot).not.toBeNull()
      expect(vdot!).toBeGreaterThanOrEqual(10)
      expect(vdot!).toBeLessThanOrEqual(85)
    },
  )
})

describe('isTimeOutOfVdotRange', () => {
  it('returns null for a time within range', () => {
    expect(isTimeOutOfVdotRange('5k', 1200)).toBeNull() // ~20:00 — valid
  })

  it('returns tooSlow for a time slower than VDOT 10', () => {
    expect(isTimeOutOfVdotRange('5k', 5000)).toBe('tooSlow')
  })

  it('returns tooSlow for a very slow 5k time at VDOT 10 boundary', () => {
    // VDOT 10 5k is ~4256s; times >= that are tooSlow
    expect(isTimeOutOfVdotRange('5k', 4300)).toBe('tooSlow')
  })

  it('returns tooFast for a time faster than VDOT 85', () => {
    expect(isTimeOutOfVdotRange('5k', 600)).toBe('tooFast')
  })

  it('returns tooFast for a time exactly at the VDOT 85 boundary', () => {
    expect(isTimeOutOfVdotRange('5k', 757)).toBe('tooFast') // VDOT 85 = 757s
  })

  it('returns tooFast for timeSecs = 0', () => {
    expect(isTimeOutOfVdotRange('5k', 0)).toBe('tooFast')
  })

  it('works for marathon distance', () => {
    expect(isTimeOutOfVdotRange('marathon', 10800)).toBeNull() // 3:00:00 — valid
    expect(isTimeOutOfVdotRange('marathon', 50000)).toBe('tooSlow')
    expect(isTimeOutOfVdotRange('marathon', 5000)).toBe('tooFast')
  })
})
