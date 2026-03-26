import { useTranslation } from 'react-i18next'
import type { RaceTimeEntry } from '../calc/raceTimes'
import type { TrainingPaceResult } from '../calc/trainingPaces'
import { formatTime, formatPace } from '../calc/timeUtils'

interface UnifiedTrainingCardProps {
  raceTimes: RaceTimeEntry[]
  trainingPaces: TrainingPaceResult
  currentDistanceId: string
  units: 'km' | 'mi'
  onUnitsChange: (units: 'km' | 'mi') => void
}

export function UnifiedTrainingCard({
  raceTimes,
  trainingPaces,
  currentDistanceId,
  units,
  onUnitsChange,
}: UnifiedTrainingCardProps) {
  const { t } = useTranslation()
  const { paces, intervals } = trainingPaces

  return (
    <div className="bg-white border-3 border-neo-dark rounded-xl p-6 shadow-[6px_6px_0px_0px_#1A1A2E]">
      {/* Header with Units Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black text-neo-dark uppercase">{t('units.title')}</h2>
        <div className="flex">
          <button
            type="button"
            onClick={() => onUnitsChange('km')}
            className={`px-4 py-2 text-sm font-bold uppercase border-3 border-neo-dark rounded-l-md transition-all ${
              units === 'km'
                ? 'bg-neo-yellow text-neo-dark shadow-[3px_3px_0px_0px_#1A1A2E]'
                : 'bg-white text-neo-dark hover:bg-neo-yellow/30'
            }`}
          >
            km
          </button>
          <button
            type="button"
            onClick={() => onUnitsChange('mi')}
            className={`px-4 py-2 text-sm font-bold uppercase border-3 border-l-0 border-neo-dark rounded-r-md transition-all ${
              units === 'mi'
                ? 'bg-neo-yellow text-neo-dark shadow-[3px_3px_0px_0px_#1A1A2E]'
                : 'bg-white text-neo-dark hover:bg-neo-yellow/30'
            }`}
          >
            mi
          </button>
        </div>
      </div>

      {/* 2x2 Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Race Times Table */}
        <div>
          <h3 className="text-md font-black text-neo-dark uppercase mb-4">
            {t('raceTimes.title')}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-3 border-neo-dark">
                  <th className="text-left py-2 px-2 font-black text-neo-dark uppercase">
                    {t('raceTimes.distance')}
                  </th>
                  <th className="text-right py-2 px-2 font-black text-neo-dark uppercase">
                    {t('raceTimes.time')}
                  </th>
                  <th className="text-right py-2 px-2 font-black text-neo-dark uppercase">
                    {t(units === 'km' ? 'raceTimes.paceKm' : 'raceTimes.paceMi')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {raceTimes.map((rt) => {
                  const isCurrentDistance = rt.distance.id === currentDistanceId
                  return (
                    <tr
                      key={rt.distance.id}
                      className={`border-b-2 border-neo-dark/20 ${
                        isCurrentDistance ? 'bg-neo-yellow text-neo-dark font-black' : 'font-bold'
                      }`}
                    >
                      <td className="py-2 px-2">{t(`distances.${rt.distance.id}`)}</td>
                      <td className="text-right py-2 px-2 font-mono">{formatTime(rt.timeSecs)}</td>
                      <td className="text-right py-2 px-2 font-mono">
                        {formatPace(units === 'km' ? rt.pacePerKmSecs : rt.pacePerMileSecs)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Training Paces Table */}
        <div>
          <h3 className="text-md font-black text-neo-dark uppercase mb-4">
            {t('trainingPaces.title')}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-3 border-neo-dark">
                  <th className="text-left py-2 px-2 font-black text-neo-dark uppercase">
                    {t('trainingPaces.intensity')}
                  </th>
                  <th className="text-right py-2 px-2 font-black text-neo-dark uppercase">
                    {t(units === 'km' ? 'trainingPaces.paceKm' : 'trainingPaces.paceMi')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paces.map((p) => (
                  <tr key={p.labelKey} className="border-b-2 border-neo-dark/20 font-bold">
                    <td className="py-2 px-2">{t(p.labelKey)}</td>
                    <td className="text-right py-2 px-2 font-mono">
                      {formatPace(units === 'km' ? p.secPerKm : p.secPerMi)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Interval Workouts - Full Width */}
      <div>
        <h3 className="text-md font-black text-neo-dark uppercase mb-4">
          {t('trainingPaces.intervalTitle')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-3 border-neo-dark">
                <th className="text-left py-2 px-2 font-black text-neo-dark uppercase">
                  {t('trainingPaces.distance')}
                </th>
                <th className="text-right py-2 px-2 font-black text-neo-dark uppercase">
                  {t('trainingPaces.interval')}
                </th>
                <th className="text-right py-2 px-2 font-black text-neo-dark uppercase">
                  {t('trainingPaces.repetition')}
                </th>
              </tr>
            </thead>
            <tbody>
              {intervals.map((w) => (
                <tr key={w.distanceM} className="border-b-2 border-neo-dark/20 font-bold">
                  <td className="py-2 px-2">{w.label}</td>
                  <td className="text-right py-2 px-2 font-mono">
                    {formatTime(w.intervalTimeSecs)}
                  </td>
                  <td className="text-right py-2 px-2 font-mono">{formatTime(w.repTimeSecs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
