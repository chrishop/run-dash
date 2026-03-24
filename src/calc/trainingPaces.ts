import { getVdotEntry } from '../data/vdotTable'

export interface PaceLevel {
  label: string
  secPerKm: number
  secPerMi: number
}

export interface IntervalWorkout {
  distanceM: number
  label: string
  intervalTimeSecs: number
  repTimeSecs: number
}

export interface TrainingPaceResult {
  paces: PaceLevel[]
  intervals: IntervalWorkout[]
}

const INTERVAL_DISTANCES = [1200, 800, 600, 400, 300, 200]

/**
 * Get training paces and interval workout times for a given VDOT.
 */
export function getTrainingPaces(vdot: number): TrainingPaceResult {
  const snapped = Math.round(vdot * 10) / 10
  const entry = getVdotEntry(snapped)
  if (!entry) return { paces: [], intervals: [] }

  const tp = entry.training_paces

  const paces: PaceLevel[] = [
    { label: 'Easy (slow)', secPerKm: tp.easy_slow.sec_per_km, secPerMi: tp.easy_slow.sec_per_mi },
    { label: 'Easy (fast)', secPerKm: tp.easy_fast.sec_per_km, secPerMi: tp.easy_fast.sec_per_mi },
    { label: 'Marathon', secPerKm: tp.marathon.sec_per_km, secPerMi: tp.marathon.sec_per_mi },
    { label: 'Threshold', secPerKm: tp.threshold.sec_per_km, secPerMi: tp.threshold.sec_per_mi },
    { label: 'Interval', secPerKm: tp.interval.sec_per_km, secPerMi: tp.interval.sec_per_mi },
    { label: 'Repetition', secPerKm: tp.repetition.sec_per_km, secPerMi: tp.repetition.sec_per_mi },
  ]

  const intervals: IntervalWorkout[] = INTERVAL_DISTANCES.map((distanceM) => ({
    distanceM,
    label: `${distanceM}m`,
    intervalTimeSecs: tp.interval.sec_per_km * (distanceM / 1000),
    repTimeSecs: tp.repetition.sec_per_km * (distanceM / 1000),
  }))

  return { paces, intervals }
}
