import { useTranslation } from 'react-i18next'
import type { RaceTimeEntry } from '../calc/raceTimes'
import { formatTime, formatPace } from '../calc/timeUtils'

interface RaceTimesTableProps {
  raceTimes: RaceTimeEntry[]
  currentDistanceId: string
}

export function RaceTimesTable({ raceTimes, currentDistanceId }: RaceTimesTableProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-neo-yellow border-3 border-neo-dark rounded-xl p-6 shadow-[6px_6px_0px_0px_#1A1A2E]">
      <h2 className="text-lg font-black text-neo-dark uppercase mb-4">{t('raceTimes.title')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-3 border-neo-dark">
              <th className="text-left py-2 pr-4 font-black text-neo-dark uppercase">
                {t('raceTimes.distance')}
              </th>
              <th className="text-right py-2 px-4 font-black text-neo-dark uppercase">
                {t('raceTimes.time')}
              </th>
              <th className="text-right py-2 px-4 font-black text-neo-dark uppercase">
                {t('raceTimes.paceKm')}
              </th>
              <th className="text-right py-2 pl-4 font-black text-neo-dark uppercase">
                {t('raceTimes.paceMi')}
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
                    isCurrentDistance ? 'bg-neo-green/30 font-black' : 'font-bold'
                  }`}
                >
                  <td className="py-2 pr-4">{t(`distances.${rt.distance.id}`)}</td>
                  <td className="text-right py-2 px-4 font-mono">{formatTime(rt.timeSecs)}</td>
                  <td className="text-right py-2 px-4 font-mono">{formatPace(rt.pacePerKmSecs)}</td>
                  <td className="text-right py-2 pl-4 font-mono">
                    {formatPace(rt.pacePerMileSecs)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
