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
    <div className="bg-neo-green border-3 border-neo-dark rounded-xl p-6 shadow-[6px_6px_0px_0px_#1A1A2E] space-y-6">
      <div>
        <h2 className="text-lg font-black text-neo-dark uppercase mb-4">
          {t('trainingPaces.title')}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-3 border-neo-dark">
                <th className="text-left py-2 pr-4 font-black text-neo-dark uppercase">
                  {t('trainingPaces.intensity')}
                </th>
                <th className="text-right py-2 px-4 font-black text-neo-dark uppercase">
                  {t('trainingPaces.paceKm')}
                </th>
                <th className="text-right py-2 pl-4 font-black text-neo-dark uppercase">
                  {t('trainingPaces.paceMi')}
                </th>
              </tr>
            </thead>
            <tbody>
              {paces.map((p) => (
                <tr key={p.labelKey} className="border-b-2 border-neo-dark/20 font-bold">
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
        <h3 className="text-md font-black text-neo-dark uppercase mb-4">
          {t('trainingPaces.intervalTitle')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-3 border-neo-dark">
                <th className="text-left py-2 pr-4 font-black text-neo-dark uppercase">
                  {t('trainingPaces.distance')}
                </th>
                <th className="text-right py-2 px-4 font-black text-neo-dark uppercase">
                  {t('trainingPaces.interval')}
                </th>
                <th className="text-right py-2 pl-4 font-black text-neo-dark uppercase">
                  {t('trainingPaces.repetition')}
                </th>
              </tr>
            </thead>
            <tbody>
              {intervals.map((w) => (
                <tr key={w.distanceM} className="border-b-2 border-neo-dark/20 font-bold">
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
