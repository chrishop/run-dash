import { useTranslation } from 'react-i18next'
import type { AgeGradingResult } from '../calc/ageGrading'

interface AgeGradingProps {
  ageGrading: AgeGradingResult | null
  hasAgeGradeData: boolean
}

const BENCHMARK_KEYS = [
  { range: '100%', key: 'ageGrading.worldRecord' },
  { range: '90%+', key: 'ageGrading.worldClass' },
  { range: '80%+', key: 'ageGrading.nationalClass' },
  { range: '70%+', key: 'ageGrading.regionalClass' },
  { range: '60%+', key: 'ageGrading.localClass' },
  { range: '<60%', key: 'ageGrading.recreational' },
]

export function AgeGrading({ ageGrading, hasAgeGradeData }: AgeGradingProps) {
  const { t } = useTranslation()

  if (!hasAgeGradeData) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">{t('ageGrading.title')}</h2>
        <p className="text-gray-500">{t('ageGrading.notAvailable')}</p>
      </div>
    )
  }

  if (!ageGrading) return null

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">{t('ageGrading.title')}</h2>
      <div className="flex items-baseline gap-3 mb-4">
        <p className="text-5xl font-bold text-blue-600">{ageGrading.percentage.toFixed(2)}%</p>
        <span className={`text-lg font-semibold ${ageGrading.benchmarkColor}`}>
          {t(ageGrading.benchmarkKey)}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600 mb-2">{t('ageGrading.explainerTitle')}</h3>
        <p className="text-sm text-gray-500 mb-3">{t('ageGrading.explainerText')}</p>
        <div className="overflow-x-auto">
          <table className="text-sm">
            <tbody>
              {BENCHMARK_KEYS.map((b) => (
                <tr key={b.range} className="border-b border-gray-100">
                  <td className="py-1 pr-4 font-mono font-medium">{b.range}</td>
                  <td className="py-1 text-gray-600">{t(b.key)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
