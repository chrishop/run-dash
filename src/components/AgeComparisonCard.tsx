import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import type { AgeComparisonRow } from '../calc/ageComparison'
import { formatTime } from '../calc/timeUtils'

interface AgeComparisonCardProps {
  rows: AgeComparisonRow[]
  userAge: number | null
  distanceId: string
}

interface TooltipPayloadItem {
  name: string
  value: number | null
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  label?: number
  payload?: TooltipPayloadItem[]
}

function CustomTooltip({ active, label, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="bg-neo-dark border-2 border-white rounded-lg p-3 shadow-lg">
      <p className="text-white font-black text-sm mb-1">Age {label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="font-bold text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value !== null ? formatTime(entry.value) : '–'}
        </p>
      ))}
    </div>
  )
}

export function AgeComparisonCard({ rows, userAge, distanceId }: AgeComparisonCardProps) {
  const { t } = useTranslation()
  const [tableOpen, setTableOpen] = useState(false)

  if (rows.length === 0) return null

  const highlightAge = userAge !== null ? Math.round(userAge / 5) * 5 : null

  // Build chart data — filter out rows where both values are null
  const chartData = rows
    .filter((r) => r.maleTimeSecs !== null || r.femaleTimeSecs !== null)
    .map((r) => ({
      age: r.age,
      Male: r.maleTimeSecs,
      Female: r.femaleTimeSecs,
    }))

  // Compute Y-axis domain with a bit of padding
  const allTimes = rows.flatMap((r) => [r.maleTimeSecs, r.femaleTimeSecs]).filter((v): v is number => v !== null)
  const minTime = Math.min(...allTimes)
  const maxTime = Math.max(...allTimes)
  const padding = (maxTime - minTime) * 0.08
  const yDomain: [number, number] = [Math.max(0, Math.floor(minTime - padding)), Math.ceil(maxTime + padding)]

  // Y-axis ticks — 5 evenly spaced
  const tickCount = 5
  const tickStep = Math.ceil((yDomain[1] - yDomain[0]) / tickCount / 60) * 60 // round to nearest minute
  const yTicks: number[] = []
  for (let v = Math.ceil(yDomain[0] / tickStep) * tickStep; v <= yDomain[1]; v += tickStep) {
    yTicks.push(v)
  }

  return (
    <div className="bg-neo-purple border-3 border-neo-dark rounded-xl p-6 shadow-[6px_6px_0px_0px_#1A1A2E]">
      <h2 className="text-lg font-black text-white uppercase mb-2">{t('ageComparison.title')}</h2>
      <p className="text-sm text-white/80 font-bold mb-4">
        {t('ageComparison.description', { distance: t(`distances.${distanceId}`) })}
      </p>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 20, right: 16, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
          <XAxis
            dataKey="age"
            type="number"
            domain={[20, 90]}
            ticks={[20, 30, 40, 50, 60, 70, 80, 90]}
            tick={{ fill: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.4)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.4)' }}
            label={{ value: t('ageComparison.age'), position: 'insideBottom', offset: -2, fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
          />
          <YAxis
            domain={yDomain}
            ticks={yTicks}
            tickFormatter={(v: number) => formatTime(v)}
            tick={{ fill: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.4)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.4)' }}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ color: 'white', fontWeight: 700, fontSize: 13, paddingTop: 8 }}
          />
          {highlightAge !== null && (
            <ReferenceLine
              x={highlightAge}
              stroke="#facc15"
              strokeWidth={2}
              strokeDasharray="5 3"
              label={{ value: 'You', fill: '#facc15', fontWeight: 700, fontSize: 12, position: 'top' }}
            />
          )}
          <Line
            type="monotone"
            dataKey="Male"
            stroke="#60a5fa"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="Female"
            stroke="#f472b6"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Dropdown table toggle */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setTableOpen((o) => !o)}
          className="text-sm font-black text-white/80 hover:text-white uppercase flex items-center gap-1 transition-colors"
        >
          {tableOpen ? `${t('ageComparison.hideTable')} ▴` : `${t('ageComparison.showTable')} ▾`}
        </button>

        {tableOpen && (
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-3 border-white/40">
                  <th className="text-left py-2 px-2 font-black text-white uppercase">
                    {t('ageComparison.age')}
                  </th>
                  <th className="text-right py-2 px-2 font-black text-white uppercase">
                    {t('ageComparison.male')}
                  </th>
                  <th className="text-right py-2 px-2 font-black text-white uppercase">
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
                      <td className="py-2 px-2">{row.age}</td>
                      <td className="text-right py-2 px-2 font-mono">
                        {row.maleTimeSecs !== null ? formatTime(row.maleTimeSecs) : '–'}
                      </td>
                      <td className="text-right py-2 px-2 font-mono">
                        {row.femaleTimeSecs !== null ? formatTime(row.femaleTimeSecs) : '–'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
