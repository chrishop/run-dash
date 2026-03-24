import type { Distance } from '../data/distances'
import type { RaceTimeEntry } from '../calc/raceTimes'
import type { TrainingPaceResult } from '../calc/trainingPaces'
import type { AgeGradingResult } from '../calc/ageGrading'
import type { AgeComparisonRow } from '../calc/ageComparison'
import { VdotScore } from './VdotScore'
import { RaceTimesTable } from './RaceTimesTable'
import { TrainingPaces } from './TrainingPaces'
import { AgeGrading } from './AgeGrading'
import { AgeComparisonTable } from './AgeComparisonTable'

export interface Results {
  distance: Distance
  timeSecs: number
  vdot: number | null
  raceTimes: RaceTimeEntry[] | null
  trainingPaces: TrainingPaceResult | null
  ageGrading: AgeGradingResult | null
  ageComparison: AgeComparisonRow[] | null
  userAge: number | null
}

interface ResultsPanelProps {
  results: Results | null
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  if (!results) {
    return (
      <div className="mt-8 text-gray-400 text-center py-12">
        Select a distance and enter your time to see results.
      </div>
    )
  }

  const { distance, vdot, raceTimes, trainingPaces, ageGrading, ageComparison, userAge } = results
  const hasAgeGradeData = distance.ageGradeKey !== null

  return (
    <div className="mt-8 space-y-6">
      <VdotScore vdot={vdot} />

      {raceTimes && raceTimes.length > 0 && (
        <RaceTimesTable raceTimes={raceTimes} currentDistanceId={distance.id} />
      )}

      {trainingPaces && trainingPaces.paces.length > 0 && (
        <TrainingPaces trainingPaces={trainingPaces} />
      )}

      <AgeGrading ageGrading={ageGrading} hasAgeGradeData={hasAgeGradeData} />

      {ageComparison && ageComparison.length > 0 && (
        <AgeComparisonTable rows={ageComparison} userAge={userAge} distanceLabel={distance.label} />
      )}
    </div>
  )
}
