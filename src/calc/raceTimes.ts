import { getVdotEntry } from '../data/vdotTable'
import { DISTANCES, type Distance } from '../data/distances'

export interface RaceTimeEntry {
  distance: Distance
  timeSecs: number
  pacePerKmSecs: number
  pacePerMileSecs: number
}

/**
 * Get predicted race times for all distances at the given VDOT.
 * Snaps to the nearest 0.1 VDOT entry.
 */
export function getRaceTimes(vdot: number): RaceTimeEntry[] {
  const snapped = Math.round(vdot * 10) / 10
  const entry = getVdotEntry(snapped)
  if (!entry) return []

  return DISTANCES.map((distance) => {
    const timeSecs = entry.race_times[distance.vdotKey]
    return {
      distance,
      timeSecs,
      pacePerKmSecs: timeSecs / distance.distanceKm,
      pacePerMileSecs: timeSecs / (distance.distanceKm / 1.609344),
    }
  })
}
