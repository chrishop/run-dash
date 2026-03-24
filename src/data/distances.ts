export interface Distance {
  id: string
  label: string
  vdotKey: string
  ageGradeKey: string | null
  distanceKm: number
}

export const DISTANCES: Distance[] = [
  { id: '1500m', label: '1500m', vdotKey: '1500m', ageGradeKey: null, distanceKm: 1.5 },
  { id: '1mi', label: '1 Mile', vdotKey: '1_mile', ageGradeKey: '1mi', distanceKm: 1.609344 },
  { id: '5k', label: '5K', vdotKey: '5k', ageGradeKey: '5km', distanceKm: 5.0 },
  { id: '10k', label: '10K', vdotKey: '10k', ageGradeKey: '10km', distanceKm: 10.0 },
  {
    id: 'hm',
    label: 'Half Marathon',
    vdotKey: 'half_marathon',
    ageGradeKey: 'hmar',
    distanceKm: 21.0975,
  },
  { id: 'mar', label: 'Marathon', vdotKey: 'marathon', ageGradeKey: 'mar', distanceKm: 42.195 },
]

export function getDistanceById(id: string): Distance | undefined {
  return DISTANCES.find((d) => d.id === id)
}

export function getDistanceByVdotKey(vdotKey: string): Distance | undefined {
  return DISTANCES.find((d) => d.vdotKey === vdotKey)
}
