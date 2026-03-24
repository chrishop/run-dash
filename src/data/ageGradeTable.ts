import ageGradeRaw from '../../data-sources/age-grade-tables.json'

interface AgeGradeDistanceEntry {
  distanceKm: number
  worldRecordSecs: number
  factors: Record<string, number>
}

type AgeGradeData = Record<string, Record<string, AgeGradeDistanceEntry>>

const data = ageGradeRaw as AgeGradeData

export function getAgeGradeEntry(
  gender: 'm' | 'f',
  ageGradeKey: string,
): AgeGradeDistanceEntry | undefined {
  const genderKey = gender === 'm' ? 'male' : 'female'
  return data[genderKey]?.[ageGradeKey]
}
