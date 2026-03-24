import type { RaceTimeEntry } from '../calc/raceTimes'
import { formatTime, formatPace } from '../calc/timeUtils'

interface RaceTimesTableProps {
  raceTimes: RaceTimeEntry[]
  currentDistanceId: string
}

export function RaceTimesTable({ raceTimes, currentDistanceId }: RaceTimesTableProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Estimated Race Times</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 pr-4 font-medium text-gray-600">Distance</th>
              <th className="text-right py-2 px-4 font-medium text-gray-600">Time</th>
              <th className="text-right py-2 px-4 font-medium text-gray-600">Pace /km</th>
              <th className="text-right py-2 pl-4 font-medium text-gray-600">Pace /mi</th>
            </tr>
          </thead>
          <tbody>
            {raceTimes.map((rt) => {
              const isCurrentDistance = rt.distance.id === currentDistanceId
              return (
                <tr
                  key={rt.distance.id}
                  className={`border-b border-gray-100 ${
                    isCurrentDistance ? 'bg-blue-50 font-semibold' : ''
                  }`}
                >
                  <td className="py-2 pr-4">{rt.distance.label}</td>
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
