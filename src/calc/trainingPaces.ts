import { getVdotEntry } from '../data/vdotTable'

export interface PaceLevel {
  labelKey: string
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
    {
      labelKey: 'trainingPaces.easySlow',
      secPerKm: tp.easy_slow.sec_per_km,
      secPerMi: tp.easy_slow.sec_per_mi,
    },
    {
      labelKey: 'trainingPaces.easyFast',
      secPerKm: tp.easy_fast.sec_per_km,
      secPerMi: tp.easy_fast.sec_per_mi,
    },
    {
      labelKey: 'trainingPaces.marathon',
      secPerKm: tp.marathon.sec_per_km,
      secPerMi: tp.marathon.sec_per_mi,
    },
    {
      labelKey: 'trainingPaces.threshold',
      secPerKm: tp.threshold.sec_per_km,
      secPerMi: tp.threshold.sec_per_mi,
    },
    {
      labelKey: 'trainingPaces.interval',
      secPerKm: tp.interval.sec_per_km,
      secPerMi: tp.interval.sec_per_mi,
    },
    {
      labelKey: 'trainingPaces.repetition',
      secPerKm: tp.repetition.sec_per_km,
      secPerMi: tp.repetition.sec_per_mi,
    },
  ]

  const intervals: IntervalWorkout[] = INTERVAL_DISTANCES.map((distanceM) => ({
    distanceM,
    label: `${distanceM}m`,
    intervalTimeSecs: tp.interval.sec_per_km * (distanceM / 1000),
    repTimeSecs: tp.repetition.sec_per_km * (distanceM / 1000),
  }))

  return { paces, intervals }
}
