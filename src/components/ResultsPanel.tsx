import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  if (!results) {
    return (
      <div className="mt-8 bg-white border-3 border-neo-dark rounded-xl p-12 shadow-[6px_6px_0px_0px_#1A1A2E] text-center">
        <p className="text-neo-dark font-black text-lg uppercase">{t('results.prompt')}</p>
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
        <AgeComparisonTable rows={ageComparison} userAge={userAge} distanceId={distance.id} />
      )}
    </div>
  )
}
