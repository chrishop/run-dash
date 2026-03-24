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
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">{t('ageComparison.title')}</h2>
      <p className="text-sm text-gray-500 mb-4">
        {t('ageComparison.description', { distance: t(`distances.${distanceId}`) })}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 pr-4 font-medium text-gray-600">
                {t('ageComparison.age')}
              </th>
              <th className="text-right py-2 px-4 font-medium text-gray-600">
                {t('ageComparison.male')}
              </th>
              <th className="text-right py-2 pl-4 font-medium text-gray-600">
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
                  className={`border-b border-gray-100 ${
                    isHighlighted ? 'bg-blue-50 font-semibold' : ''
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
