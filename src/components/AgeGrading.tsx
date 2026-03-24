import type { AgeGradingResult } from '../calc/ageGrading'

interface AgeGradingProps {
  ageGrading: AgeGradingResult | null
  hasAgeGradeData: boolean
}

const BENCHMARK_TABLE = [
  { range: '100%', label: 'World Record' },
  { range: '90%+', label: 'World Class' },
  { range: '80%+', label: 'National Class' },
  { range: '70%+', label: 'Regional Class' },
  { range: '60%+', label: 'Local Class' },
  { range: '<60%', label: 'Recreational' },
]

export function AgeGrading({ ageGrading, hasAgeGradeData }: AgeGradingProps) {
  if (!hasAgeGradeData) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Age Grading</h2>
        <p className="text-gray-500">
          Age grading is not available for this distance. It requires standard road race distances
          (1 mile, 5K, 10K, half marathon, or marathon).
        </p>
      </div>
    )
  }

  if (!ageGrading) return null

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Age Grading</h2>
      <div className="flex items-baseline gap-3 mb-4">
        <p className="text-5xl font-bold text-blue-600">{ageGrading.percentage.toFixed(2)}%</p>
        <span className={`text-lg font-semibold ${ageGrading.benchmarkColor}`}>
          {ageGrading.benchmark}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600 mb-2">What do the percentages mean?</h3>
        <p className="text-sm text-gray-500 mb-3">
          Age grading adjusts your performance for age and sex, comparing it to the world record
          standard for your demographic. A higher percentage means a stronger performance relative
          to your age and sex.
        </p>
        <div className="overflow-x-auto">
          <table className="text-sm">
            <tbody>
              {BENCHMARK_TABLE.map((b) => (
                <tr key={b.range} className="border-b border-gray-100">
                  <td className="py-1 pr-4 font-mono font-medium">{b.range}</td>
                  <td className="py-1 text-gray-600">{b.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
