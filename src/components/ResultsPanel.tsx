import { useTranslation } from 'react-i18next'
import type { Distance } from '../data/distances'
import type { AgeComparisonRow } from '../calc/ageComparison'
import type { RaceTimeEntry } from '../calc/raceTimes'
import type { TrainingPaceResult } from '../calc/trainingPaces'
import type { Warning } from '../types'
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
  warnings: Warning[]
}

interface ResultsPanelProps {
  results: Results | null
  onUnitsChange: (units: 'km' | 'mi') => void
}

function WarningBanner({ warnings }: { warnings: Warning[] }) {
  const { t } = useTranslation()
  if (warnings.length === 0) return null

  const messages = warnings.map((w) => {
    if (w.type === 'vdotOutOfRange') {
      return w.direction === 'tooSlow' ? t('warnings.vdotTooSlow') : t('warnings.vdotTooFast')
    }
    return t('warnings.ageGradingSuppressed')
  })

  return (
    <div className="bg-neo-orange border-3 border-neo-dark rounded-xl p-4 shadow-[6px_6px_0px_0px_#1A1A2E]">
      {messages.map((msg, i) => (
        <p key={i} className="text-neo-dark font-bold text-sm">
          {msg}
        </p>
      ))}
    </div>
  )
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

  const {
    distance,
    timeSecs,
    vdot,
    raceTimes,
    trainingPaces,
    ageComparison,
    userAge,
    gender,
    units,
    warnings,
  } = results

  return (
    <div className="mt-8 space-y-6">
      <WarningBanner warnings={warnings} />

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
