import { describe, it, expect } from 'vitest'
import { parseParams } from '../useUrlParams'

describe('parseParams (URL parameter parsing)', () => {
  // Happy path
  it('parses a full valid URL', () => {
    const result = parseParams('?d=5k&t=20:30&a=30&g=m&units=km&lang=en')
    expect(result).toEqual({
      d: '5k',
      t: '20:30',
      a: 30,
      g: 'm',
      units: 'km',
      lang: 'en',
      mode: 'time',
      vdot: null,
    })
  })

  // Defaults
  it('returns defaults for empty search', () => {
    const result = parseParams('')
    expect(result).toEqual({
      d: null,
      t: null,
      a: null,
      g: null,
      units: 'km',
      lang: 'en',
      mode: 'time',
      vdot: null,
    })
  })

  // Gender validation
  it('accepts male gender', () => {
    expect(parseParams('?g=m').g).toBe('m')
  })

  it('accepts female gender', () => {
    expect(parseParams('?g=f').g).toBe('f')
  })

  it('rejects invalid gender', () => {
    expect(parseParams('?g=x').g).toBeNull()
  })

  it('rejects empty gender', () => {
    expect(parseParams('?g=').g).toBeNull()
  })

  // Units validation
  it('accepts km units', () => {
    expect(parseParams('?units=km').units).toBe('km')
  })

  it('accepts mi units', () => {
    expect(parseParams('?units=mi').units).toBe('mi')
  })

  it('defaults to km for invalid units', () => {
    expect(parseParams('?units=furlongs').units).toBe('km')
  })

  // Language validation
  it('accepts en language', () => {
    expect(parseParams('?lang=en').lang).toBe('en')
  })

  it('accepts ko language', () => {
    expect(parseParams('?lang=ko').lang).toBe('ko')
  })

  it('defaults to en for unsupported language', () => {
    expect(parseParams('?lang=fr').lang).toBe('en')
  })

  // Partial params
  it('handles only distance set', () => {
    const result = parseParams('?d=5k')
    expect(result.d).toBe('5k')
    expect(result.t).toBeNull()
    expect(result.a).toBeNull()
    expect(result.g).toBeNull()
  })

  // Extra unknown params are ignored
  it('ignores unknown params', () => {
    const result = parseParams('?d=5k&foo=bar&baz=123')
    expect(result.d).toBe('5k')
    expect(Object.keys(result)).toEqual(['d', 't', 'a', 'g', 'units', 'lang', 'mode', 'vdot'])
  })

  // Old distance IDs pass through (handled downstream by getDistanceById returning undefined)
  it('passes through unknown distance IDs', () => {
    expect(parseParams('?d=3km').d).toBe('3km')
  })

  // Mode parsing
  it('defaults mode to time when absent', () => {
    expect(parseParams('').mode).toBe('time')
  })

  it('parses mode=vdot', () => {
    expect(parseParams('?mode=vdot').mode).toBe('vdot')
  })

  it('defaults mode to time for unknown value', () => {
    expect(parseParams('?mode=unknown').mode).toBe('time')
  })

  // VDOT parsing
  it('returns null vdot when absent', () => {
    expect(parseParams('').vdot).toBeNull()
  })

  it('parses vdot=50 as integer', () => {
    expect(parseParams('?vdot=50').vdot).toBe(50)
  })

  it('parses vdot=48.5 as float', () => {
    expect(parseParams('?vdot=48.5').vdot).toBe(48.5)
  })

  it('returns null vdot for non-numeric value', () => {
    expect(parseParams('?vdot=abc').vdot).toBeNull()
  })

  it('parses full vdot mode URL', () => {
    const result = parseParams('?mode=vdot&vdot=50&a=35&g=m')
    expect(result.mode).toBe('vdot')
    expect(result.vdot).toBe(50)
    expect(result.a).toBe(35)
    expect(result.g).toBe('m')
    expect(result.d).toBeNull()
    expect(result.t).toBeNull()
  })

  // Age parsing
  it('parses numeric age', () => {
    expect(parseParams('?a=30').a).toBe(30)
  })

  it('returns null for missing age', () => {
    expect(parseParams('?d=5k').a).toBeNull()
  })

  it('returns null for non-numeric age (NaN bug fixed)', () => {
    expect(parseParams('?a=abc').a).toBeNull()
  })
})
