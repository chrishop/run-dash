import { useTranslation } from 'react-i18next'
import type { AgeGradingResult } from '../calc/ageGrading'

interface AgeGradingProps {
  ageGrading: AgeGradingResult | null
  hasAgeGradeData: boolean
}

const BENCHMARK_KEYS = [
  { range: '100%', key: 'ageGrading.worldRecord', color: 'bg-neo-purple text-white' },
  { range: '90%+', key: 'ageGrading.worldClass', color: 'bg-neo-red text-white' },
  { range: '80%+', key: 'ageGrading.nationalClass', color: 'bg-neo-blue text-neo-dark' },
  { range: '70%+', key: 'ageGrading.regionalClass', color: 'bg-neo-green text-neo-dark' },
  { range: '60%+', key: 'ageGrading.localClass', color: 'bg-neo-yellow text-neo-dark' },
  { range: '<60%', key: 'ageGrading.recreational', color: 'bg-white text-neo-dark' },
]

// Map benchmark keys to neobrutalist badge colors
const BENCHMARK_BADGE_COLORS: Record<string, string> = {
  'ageGrading.worldClass': 'bg-neo-purple text-white',
  'ageGrading.nationalClass': 'bg-neo-orange text-neo-dark',
  'ageGrading.regionalClass': 'bg-neo-blue text-neo-dark',
  'ageGrading.localClass': 'bg-neo-green text-neo-dark',
  'ageGrading.recreational': 'bg-white text-neo-dark',
}

export function AgeGrading({ ageGrading, hasAgeGradeData }: AgeGradingProps) {
  const { t } = useTranslation()

  if (!hasAgeGradeData) {
    return (
      <div className="bg-neo-orange border-3 border-neo-dark rounded-xl p-6 shadow-[6px_6px_0px_0px_#1A1A2E]">
        <h2 className="text-lg font-black text-neo-dark uppercase">{t('ageGrading.title')}</h2>
        <p className="text-neo-dark font-bold mt-2">{t('ageGrading.notAvailable')}</p>
      </div>
    )
  }

  if (!ageGrading) return null

  const badgeColor = BENCHMARK_BADGE_COLORS[ageGrading.benchmarkKey] ?? 'bg-white text-neo-dark'

  return (
    <div className="bg-neo-orange border-3 border-neo-dark rounded-xl p-6 shadow-[6px_6px_0px_0px_#1A1A2E]">
      <h2 className="text-lg font-black text-neo-dark uppercase">{t('ageGrading.title')}</h2>
      <div className="flex items-center gap-4 mt-3 mb-4">
        <p className="text-6xl font-black text-neo-dark">{ageGrading.percentage.toFixed(2)}%</p>
        <span
          className={`px-3 py-1 text-sm font-black uppercase border-3 border-neo-dark rounded-md shadow-[3px_3px_0px_0px_#1A1A2E] ${badgeColor}`}
        >
          {t(ageGrading.benchmarkKey)}
        </span>
      </div>

      <div className="mt-4 bg-white/50 border-3 border-neo-dark rounded-lg p-4">
        <h3 className="text-sm font-black text-neo-dark uppercase mb-2">
          {t('ageGrading.explainerTitle')}
        </h3>
        <p className="text-sm text-neo-dark font-bold mb-3">{t('ageGrading.explainerText')}</p>
        <div className="overflow-x-auto">
          <table className="text-sm">
            <tbody>
              {BENCHMARK_KEYS.map((b) => (
                <tr key={b.range} className="border-b-2 border-neo-dark/20">
                  <td className="py-1.5 pr-3">
                    <span
                      className={`inline-block px-2 py-0.5 font-mono font-black text-xs border-2 border-neo-dark rounded ${b.color}`}
                    >
                      {b.range}
                    </span>
                  </td>
                  <td className="py-1.5 font-bold text-neo-dark">{t(b.key)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
