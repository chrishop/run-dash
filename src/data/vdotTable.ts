import vdotRaw from '../../data-sources/vdot_tables.json'

interface PaceEntry {
  sec_per_km: number
  sec_per_mi: number
}

export interface VdotEntry {
  race_times: Record<string, number>
  training_paces: {
    easy_slow: PaceEntry
    easy_fast: PaceEntry
    marathon: PaceEntry
    threshold: PaceEntry
    interval: PaceEntry
    repetition: PaceEntry
  }
}

const table = (vdotRaw as { table: Record<string, VdotEntry> }).table

/** Sorted VDOT keys as numbers (30.0, 30.1, ..., 85.0) */
export const vdotKeys: number[] = Object.keys(table)
  .map(Number)
  .sort((a, b) => a - b)

export function getVdotEntry(vdot: number): VdotEntry | undefined {
  const key = vdot.toFixed(1)
  return table[key]
}

export function getAllEntries(): [number, VdotEntry][] {
  return vdotKeys.map((v) => [v, table[v.toFixed(1)]])
}
