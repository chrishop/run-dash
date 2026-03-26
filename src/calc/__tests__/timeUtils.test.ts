import { describe, it, expect } from 'vitest'
import { parseTime, formatTime, formatPace } from '../timeUtils'

describe('parseTime', () => {
  // Happy path
  it('parses MM:SS', () => {
    expect(parseTime('20:30')).toBe(1230)
  })

  it('parses HH:MM:SS', () => {
    expect(parseTime('1:30:00')).toBe(5400)
  })

  it('parses hours with zero min/sec', () => {
    expect(parseTime('2:00:00')).toBe(7200)
  })

  it('parses leading zeros', () => {
    expect(parseTime('05:09')).toBe(309)
  })

  it('parses very large time', () => {
    expect(parseTime('99:59:59')).toBe(359999)
  })

  // Boundary
  it('parses seconds at boundary (59)', () => {
    expect(parseTime('20:59')).toBe(1259)
  })

  // Edge cases
  it('parses zero time 0:00', () => {
    expect(parseTime('0:00')).toBe(0)
  })

  // Validation — should return null
  it('rejects seconds >= 60', () => {
    expect(parseTime('20:60')).toBeNull()
  })

  it('rejects minutes >= 60 in HH:MM:SS', () => {
    expect(parseTime('1:60:00')).toBeNull()
  })

  it('rejects negative minutes', () => {
    expect(parseTime('-1:30')).toBeNull()
  })

  it('rejects empty string', () => {
    expect(parseTime('')).toBeNull()
  })

  it('rejects single segment', () => {
    expect(parseTime('1234')).toBeNull()
  })

  it('rejects four segments', () => {
    expect(parseTime('1:2:3:4')).toBeNull()
  })

  it('rejects non-numeric input', () => {
    expect(parseTime('ab:cd')).toBeNull()
  })
})

describe('formatTime', () => {
  it('formats time under 1 hour as M:SS', () => {
    expect(formatTime(1230)).toBe('20:30')
  })

  it('formats exactly 1 hour', () => {
    expect(formatTime(3600)).toBe('1:00:00')
  })

  it('formats over 1 hour', () => {
    expect(formatTime(5400)).toBe('1:30:00')
  })

  it('formats zero seconds', () => {
    expect(formatTime(0)).toBe('0:00')
  })

  it('rounds fractional seconds', () => {
    expect(formatTime(1230.7)).toBe('20:31')
  })

  it('formats marathon-length time (VDOT 30)', () => {
    expect(formatTime(17389)).toBe('4:49:49')
  })

  it('pads minutes and seconds with leading zeros', () => {
    expect(formatTime(3601)).toBe('1:00:01')
    expect(formatTime(3660)).toBe('1:01:00')
  })

  // Bug documentation: negative values produce garbage output
  it('documents behavior with negative input', () => {
    // This is a known edge case — negative seconds can occur if calc logic has a bug
    const result = formatTime(-60)
    // Currently produces something like "-1:00" or garbage — just document it doesn't crash
    expect(typeof result).toBe('string')
  })
})

describe('formatPace', () => {
  it('formats typical pace (5:00/km)', () => {
    expect(formatPace(300)).toBe('5:00')
  })

  it('formats fast pace (3:00/km)', () => {
    expect(formatPace(180)).toBe('3:00')
  })

  it('formats sub-minute pace', () => {
    expect(formatPace(55)).toBe('0:55')
  })

  it('formats zero pace', () => {
    expect(formatPace(0)).toBe('0:00')
  })

  it('rounds fractional seconds', () => {
    expect(formatPace(300.6)).toBe('5:01')
  })
})
