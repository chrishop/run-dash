/**
 * Parse a time string (MM:SS or HH:MM:SS) into total seconds.
 * Returns null if the format is invalid.
 */
export function parseTime(input: string): number | null {
  if (!input) return null

  const parts = input.split(':')
  if (parts.length < 2 || parts.length > 3) return null

  const nums = parts.map(Number)
  if (nums.some(isNaN)) return null

  if (parts.length === 2) {
    const [minutes, seconds] = nums
    if (minutes < 0 || seconds < 0 || seconds >= 60) return null
    return minutes * 60 + seconds
  }

  const [hours, minutes, seconds] = nums
  if (hours < 0 || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) return null
  return hours * 3600 + minutes * 60 + seconds
}

/**
 * Format total seconds into a time string.
 * Returns H:MM:SS if >= 1 hour, MM:SS otherwise.
 */
export function formatTime(totalSeconds: number): string {
  const rounded = Math.round(totalSeconds)
  const h = Math.floor(rounded / 3600)
  const m = Math.floor((rounded % 3600) / 60)
  const s = rounded % 60

  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')

  if (h > 0) {
    return `${h}:${mm}:${ss}`
  }
  return `${m}:${ss}`
}

/**
 * Format seconds-per-unit into a pace string (M:SS).
 */
export function formatPace(secondsPerUnit: number): string {
  const rounded = Math.round(secondsPerUnit)
  const m = Math.floor(rounded / 60)
  const s = rounded % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
