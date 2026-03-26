// Approximation of the standard normal CDF using the error function
function erf(x: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(x))
  const poly =
    t *
    (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))))
  const result = 1 - poly * Math.exp(-x * x)
  return x >= 0 ? result : -result
}

export function normalCDF(x: number): number {
  return 0.5 * (1 + erf(x / Math.SQRT2))
}

// Log-normal CDF: P(T <= t) = Φ((ln(t_minutes) - mu) / sigma)
// tSecs: finish time in seconds; mu/sigma: fitted log-normal parameters (time in minutes)
export function logNormalCDF(tSecs: number, mu: number, sigma: number): number {
  const tMinutes = tSecs / 60
  if (tMinutes <= 0) return 0
  return normalCDF((Math.log(tMinutes) - mu) / sigma)
}

// Generate points along the CDF curve spanning from ~p0.5 to ~p99.5 of the distribution
// Returns array of { timeSecs, percentile } suitable for Recharts
export function generateCDFCurve(
  mu: number,
  sigma: number,
  points = 120,
): { timeSecs: number; percentile: number }[] {
  // Inverse normal: x = mu + sigma * z, covering z from -2.576 (p0.5) to +2.576 (p99.5)
  const zMin = -2.576
  const zMax = 2.576
  const result: { timeSecs: number; percentile: number }[] = []
  for (let i = 0; i <= points; i++) {
    const z = zMin + (zMax - zMin) * (i / points)
    const tMinutes = Math.exp(mu + sigma * z)
    const tSecs = tMinutes * 60
    const percentile = Math.round(normalCDF(z) * 1000) / 10 // one decimal place
    result.push({ timeSecs: Math.round(tSecs), percentile })
  }
  return result
}
