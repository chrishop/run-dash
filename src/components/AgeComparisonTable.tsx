import type { AgeComparisonRow } from '../calc/ageComparison'
import { formatTime } from '../calc/timeUtils'

interface AgeComparisonTableProps {
  rows: AgeComparisonRow[]
  userAge: number | null
  distanceLabel: string
}

export function AgeComparisonTable({ rows, userAge, distanceLabel }: AgeComparisonTableProps) {
  if (rows.length === 0) return null

  // Find the closest 5-year age bracket to highlight
  const highlightAge = userAge !== null ? Math.round(userAge / 5) * 5 : null

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        Equivalent Performance by Age & Gender
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Times that would achieve the same age-grading percentage at {distanceLabel}, across
        different ages and genders.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 pr-4 font-medium text-gray-600">Age</th>
              <th className="text-right py-2 px-4 font-medium text-gray-600">Male</th>
              <th className="text-right py-2 pl-4 font-medium text-gray-600">Female</th>
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
