import { getAllEntries, vdotKeys } from '../data/vdotTable'

/**
 * Check whether a time is outside the VDOT table range for a given distance.
 * Returns 'tooSlow' if slower than VDOT 10, 'tooFast' if faster than VDOT 85
 * (including timeSecs = 0), or null if in range.
 */
export function isTimeOutOfVdotRange(
  distanceKey: string,
  timeSecs: number,
): 'tooSlow' | 'tooFast' | null {
  const entries = getAllEntries()
  const slowestTime = entries[0][1].race_times[distanceKey]
  const fastestTime = entries[entries.length - 1][1].race_times[distanceKey]
  if (timeSecs >= slowestTime) return 'tooSlow'
  if (timeSecs <= fastestTime) return 'tooFast'
  return null
}

/**
 * Look up the VDOT value for a given distance and time.
 * Uses linear interpolation between table entries.
 * Returns null if the time is outside the table range.
 */
export function lookupVdot(vdotDistanceKey: string, timeSeconds: number): number | null {
  const entries = getAllEntries()

  // VDOT table: higher VDOT = faster times (lower seconds)
  // entries are sorted by VDOT ascending, so times are descending

  // Check bounds
  const slowestTime = entries[0][1].race_times[vdotDistanceKey]
  const fastestTime = entries[entries.length - 1][1].race_times[vdotDistanceKey]

  if (timeSeconds >= slowestTime) return vdotKeys[0] // clamp to min VDOT
  if (timeSeconds <= fastestTime) return vdotKeys[vdotKeys.length - 1] // clamp to max VDOT

  // Find the two adjacent entries that bracket this time
  for (let i = 0; i < entries.length - 1; i++) {
    const [vdotLow, entryLow] = entries[i]
    const [vdotHigh, entryHigh] = entries[i + 1]
    const timeLow = entryLow.race_times[vdotDistanceKey] // slower time, lower VDOT
    const timeHigh = entryHigh.race_times[vdotDistanceKey] // faster time, higher VDOT

    if (timeSeconds <= timeLow && timeSeconds >= timeHigh) {
      // Linear interpolation
      const fraction = (timeLow - timeSeconds) / (timeLow - timeHigh)
      const vdot = vdotLow + fraction * (vdotHigh - vdotLow)
      return Math.round(vdot * 10) / 10
    }
  }

  return null
}
