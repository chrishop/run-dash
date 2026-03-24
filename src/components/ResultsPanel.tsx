import { useTranslation } from 'react-i18next'
import type { Distance } from '../data/distances'
import type { AgeComparisonRow } from '../calc/ageComparison'
import type { RaceTimeEntry } from '../calc/raceTimes'
import type { TrainingPaceResult } from '../calc/trainingPaces'
import { VdotScore } from './VdotScore'
import { UnifiedTrainingCard } from './UnifiedTrainingCard'
import { AgeComparisonCard } from './AgeComparisonCard'
import { FinishingTimePercentileCard } from './FinishingTimePercentileCard'

export interface Results {
  distance: Distance
  timeSecs: number
  vdot: number | null
  raceTimes: RaceTimeEntry[] | null
  trainingPaces: TrainingPaceResult | null
  ageComparison: AgeComparisonRow[] | null
  userAge: number | null
  gender: 'm' | 'f' | null
  units: 'km' | 'mi'
}

interface ResultsPanelProps {
  results: Results | null
  onUnitsChange: (units: 'km' | 'mi') => void
}

export function ResultsPanel({ results, onUnitsChange }: ResultsPanelProps) {
  const { t } = useTranslation()

  if (!results) {
    return (
      <div className="mt-8 bg-white border-3 border-neo-dark rounded-xl p-12 shadow-[6px_6px_0px_0px_#1A1A2E] text-center">
        <p className="text-neo-dark font-black text-lg uppercase">{t('results.prompt')}</p>
      </div>
    )
  }

  const { distance, timeSecs, vdot, raceTimes, trainingPaces, ageComparison, userAge, gender, units } = results

  return (
    <div className="mt-8 space-y-6">
      <VdotScore vdot={vdot} />

      {raceTimes && raceTimes.length > 0 && trainingPaces && trainingPaces.paces.length > 0 && (
        <UnifiedTrainingCard
          raceTimes={raceTimes}
          trainingPaces={trainingPaces}
          currentDistanceId={distance.id}
          units={units}
          onUnitsChange={onUnitsChange}
        />
      )}

      {ageComparison && ageComparison.length > 0 && (
        <AgeComparisonCard rows={ageComparison} userAge={userAge} distanceId={distance.id} />
      )}

      <FinishingTimePercentileCard distanceId={distance.id} timeSecs={timeSecs} gender={gender} />
    </div>
  )
}
