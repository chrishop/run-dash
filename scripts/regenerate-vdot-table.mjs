/**
 * Regenerate vdot_tables.json using corrected %VO2max intensity targets
 * derived from Daniels' original published tables.
 *
 * Corrections vs previous generation:
 *   E slow:  65% -> 63.0%  (constant)
 *   E fast:  74% -> 73.0%  (constant)
 *   Marathon: 84% -> 0.741119 + 0.001444 * vdot  (linear, ~78% at V30 → ~83% at V85)
 *   Threshold: 88% -> 88.0%  (unchanged)
 *   Interval: 97.5% -> 97.5%  (unchanged)
 *   Repetition: 105% -> 105%  (unchanged)
 */

import { writeFileSync } from 'fs'

// --- Daniels / Gilbert oxygen-cost model ---
function vo2cost(v) {
  // v in m/min, returns ml/kg/min
  return -4.60 + 0.182258 * v + 0.000104 * v * v
}

function pctVO2max(t) {
  // t in minutes, returns fraction (0–1)
  return (
    0.8 +
    0.1894393 * Math.exp(-0.012778 * t) +
    0.2989558 * Math.exp(-0.1932605 * t)
  )
}

function velocityFromVO2(vo2) {
  // Solve quadratic: 0.000104*v^2 + 0.182258*v + (-4.60 - vo2) = 0
  const a = 0.000104
  const b = 0.182258
  const c = -4.60 - vo2
  return (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a)
}

// --- Race time prediction ---
function predictTime(vdot, distanceM) {
  // Binary search for time where VDOT(dist, time) = vdot
  let lo = 1 // 1 second
  let hi = 60 * 60 * 12 // 12 hours
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2
    const tMin = mid / 60
    const vel = distanceM / tMin
    const cost = vo2cost(vel)
    const frac = pctVO2max(tMin)
    const v = cost / frac
    if (v > vdot) {
      lo = mid
    } else {
      hi = mid
    }
  }
  return Math.round((lo + hi) / 2)
}

// --- Training pace from %VO2max ---
function paceSecPerKm(vdot, fraction) {
  const vo2 = vdot * fraction
  const vel = velocityFromVO2(vo2) // m/min
  return Math.round((1000 / vel) * 60)
}

function paceSecPerMi(vdot, fraction) {
  const vo2 = vdot * fraction
  const vel = velocityFromVO2(vo2) // m/min
  return Math.round((1609.344 / vel) * 60)
}

// --- Intensity targets (corrected) ---
const E_SLOW_PCT = 0.63
const E_FAST_PCT = 0.73
function marathonPct(vdot) {
  return 0.741119 + 0.001444 * vdot
}
const T_PCT = 0.88
const I_PCT = 0.975
const R_PCT = 1.05

// --- Race distances ---
const RACE_DISTANCES = {
  '1500m': 1500,
  '1_mile': 1609.344,
  '3000m': 3000,
  '5k': 5000,
  '10k': 10000,
  half_marathon: 21097.5,
  marathon: 42195,
}

// --- Generate table ---
const table = {}

for (let vdot10 = 100; vdot10 <= 850; vdot10++) {
  const vdot = vdot10 / 10
  const key = vdot.toFixed(1)

  // Race times
  const race_times = {}
  for (const [name, dist] of Object.entries(RACE_DISTANCES)) {
    race_times[name] = predictTime(vdot, dist)
  }

  // Training paces
  const mPct = marathonPct(vdot)
  const training_paces = {
    easy_slow: {
      sec_per_km: paceSecPerKm(vdot, E_SLOW_PCT),
      sec_per_mi: paceSecPerMi(vdot, E_SLOW_PCT),
    },
    easy_fast: {
      sec_per_km: paceSecPerKm(vdot, E_FAST_PCT),
      sec_per_mi: paceSecPerMi(vdot, E_FAST_PCT),
    },
    marathon: {
      sec_per_km: paceSecPerKm(vdot, mPct),
      sec_per_mi: paceSecPerMi(vdot, mPct),
    },
    threshold: {
      sec_per_km: paceSecPerKm(vdot, T_PCT),
      sec_per_mi: paceSecPerMi(vdot, T_PCT),
    },
    interval: {
      sec_per_km: paceSecPerKm(vdot, I_PCT),
      sec_per_mi: paceSecPerMi(vdot, I_PCT),
    },
    repetition: {
      sec_per_km: paceSecPerKm(vdot, R_PCT),
      sec_per_mi: paceSecPerMi(vdot, R_PCT),
    },
  }

  table[key] = { race_times, training_paces }
}

const output = {
  meta: {
    source: 'Daniels, J. & Gilbert, J. (1979). Oxygen Power.',
    vdot_range: '10.0–85.0 in steps of 0.1',
    race_times_unit: 'seconds (integer, rounded)',
    pace_unit: 'seconds per km / per mile (integer, rounded)',
    intensities: {
      easy_slow: 'Easy/Long slow end (63% VO2max)',
      easy_fast: 'Easy/Long fast end (73% VO2max)',
      marathon: 'Marathon pace (~78-83% VO2max, linear function of VDOT)',
      threshold: 'Threshold/Tempo (88% VO2max)',
      interval: 'Interval (97.5% VO2max)',
      repetition: 'Repetition (105% VO2max)',
    },
    marathon_pct_formula: '0.741119 + 0.001444 * VDOT',
  },
  table,
}

writeFileSync('data-sources/vdot_tables.json', JSON.stringify(output, null, 2) + '\n')
console.log('Written vdot_tables.json with', Object.keys(table).length, 'entries')
