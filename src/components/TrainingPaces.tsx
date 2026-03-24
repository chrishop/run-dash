import { useTranslation } from 'react-i18next'
import type { TrainingPaceResult } from '../calc/trainingPaces'
import { formatPace, formatTime } from '../calc/timeUtils'

interface TrainingPacesProps {
  trainingPaces: TrainingPaceResult
}

export function TrainingPaces({ trainingPaces }: TrainingPacesProps) {
  const { t } = useTranslation()
  const { paces, intervals } = trainingPaces

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">{t('trainingPaces.title')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-600">
                  {t('trainingPaces.intensity')}
                </th>
                <th className="text-right py-2 px-4 font-medium text-gray-600">
                  {t('trainingPaces.paceKm')}
                </th>
                <th className="text-right py-2 pl-4 font-medium text-gray-600">
                  {t('trainingPaces.paceMi')}
                </th>
              </tr>
            </thead>
            <tbody>
              {paces.map((p) => (
                <tr key={p.labelKey} className="border-b border-gray-100">
                  <td className="py-2 pr-4">{t(p.labelKey)}</td>
                  <td className="text-right py-2 px-4 font-mono">{formatPace(p.secPerKm)}</td>
                  <td className="text-right py-2 pl-4 font-mono">{formatPace(p.secPerMi)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-4">
          {t('trainingPaces.intervalTitle')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-600">
                  {t('trainingPaces.distance')}
                </th>
                <th className="text-right py-2 px-4 font-medium text-gray-600">
                  {t('trainingPaces.interval')}
                </th>
                <th className="text-right py-2 pl-4 font-medium text-gray-600">
                  {t('trainingPaces.repetition')}
                </th>
              </tr>
            </thead>
            <tbody>
              {intervals.map((w) => (
                <tr key={w.distanceM} className="border-b border-gray-100">
                  <td className="py-2 pr-4">{w.label}</td>
                  <td className="text-right py-2 px-4 font-mono">
                    {formatTime(w.intervalTimeSecs)}
                  </td>
                  <td className="text-right py-2 pl-4 font-mono">{formatTime(w.repTimeSecs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
