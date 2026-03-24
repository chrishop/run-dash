import { useTranslation } from 'react-i18next'
import type { AgeComparisonRow } from '../calc/ageComparison'
import { formatTime } from '../calc/timeUtils'

interface AgeComparisonTableProps {
  rows: AgeComparisonRow[]
  userAge: number | null
  distanceId: string
}

export function AgeComparisonTable({ rows, userAge, distanceId }: AgeComparisonTableProps) {
  const { t } = useTranslation()

  if (rows.length === 0) return null

  const highlightAge = userAge !== null ? Math.round(userAge / 5) * 5 : null

  return (
    <div className="bg-neo-purple border-3 border-neo-dark rounded-xl p-6 shadow-[6px_6px_0px_0px_#1A1A2E]">
      <h2 className="text-lg font-black text-white uppercase mb-2">{t('ageComparison.title')}</h2>
      <p className="text-sm text-white/80 font-bold mb-4">
        {t('ageComparison.description', { distance: t(`distances.${distanceId}`) })}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-3 border-white/40">
              <th className="text-left py-2 pr-4 font-black text-white uppercase">
                {t('ageComparison.age')}
              </th>
              <th className="text-right py-2 px-4 font-black text-white uppercase">
                {t('ageComparison.male')}
              </th>
              <th className="text-right py-2 pl-4 font-black text-white uppercase">
                {t('ageComparison.female')}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isHighlighted = row.age === highlightAge
              return (
                <tr
                  key={row.age}
                  className={`border-b-2 border-white/20 ${
                    isHighlighted
                      ? 'bg-neo-yellow text-neo-dark font-black'
                      : 'text-white font-bold'
                  }`}
                >
                  <td className="py-2 pr-4">{row.age}</td>
                  <td className="text-right py-2 px-4 font-mono">
                    {row.maleTimeSecs !== null ? formatTime(row.maleTimeSecs) : '–'}
                  </td>
                  <td className="text-right py-2 pl-4 font-mono">
                    {row.femaleTimeSecs !== null ? formatTime(row.femaleTimeSecs) : '–'}
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
