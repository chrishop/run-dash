import { useMemo } from 'react'
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
import cdfParams from '../../data-sources/finishing-time-cfd-params.json'
import { logNormalCDF, generateCDFCurve } from '../utils/percentile'
import { formatTime } from '../calc/timeUtils'

interface FinishingTimePercentileCardProps {
  distanceId: string
  timeSecs: number
  gender: 'm' | 'f' | null
}

// Map app distance IDs to CDF JSON keys
const DISTANCE_ID_MAP: Record<string, keyof typeof cdfParams.distances> = {
  '5k': '5K',
  '10k': '10K',
  hm: 'half_marathon',
  mar: 'marathon',
}

// Distance label for display (fallback to id)
const DISTANCE_LABEL: Record<string, string> = {
  '5k': '5K',
  '10k': '10K',
  hm: 'Half Marathon',
  mar: 'Marathon',
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
  if (!active || !payload || payload.length === 0 || label === undefined) return null
  return (
    <div className="bg-neo-dark border-2 border-white rounded-lg p-3 shadow-lg">
      <p className="text-white font-black text-sm mb-1">{formatTime(label)}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="font-bold text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value !== null ? `${entry.value}%` : '–'}
        </p>
      ))}
    </div>
  )
}

export function FinishingTimePercentileCard({
  distanceId,
  timeSecs,
  gender,
}: FinishingTimePercentileCardProps) {
  const { t } = useTranslation()

  const cdfKey = DISTANCE_ID_MAP[distanceId]
  if (!cdfKey) return null

  const params = cdfParams.distances[cdfKey]

  // Compute user percentile (how many runners are FASTER = 1 - CDF)
  const overallPct = Math.round((1 - logNormalCDF(timeSecs, params.overall.mu, params.overall.sigma)) * 100)
  const genderPct =
    gender === 'm'
      ? Math.round((1 - logNormalCDF(timeSecs, params.male.mu, params.male.sigma)) * 100)
      : gender === 'f'
        ? Math.round((1 - logNormalCDF(timeSecs, params.female.mu, params.female.sigma)) * 100)
        : null

  // Generate curve data
  const { chartData, xDomain } = useMemo(() => {
    const overallCurve = generateCDFCurve(params.overall.mu, params.overall.sigma)

    // Get gender parameters if available
    const genderParams = gender === 'm' ? params.male : gender === 'f' ? params.female : null

    // Evaluate both distributions at the SAME time points (from overall curve)
    const data = overallCurve.map((pt) => {
      const overallPercentile = pt.percentile
      const genderPercentile = genderParams
        ? Math.round(logNormalCDF(pt.timeSecs, genderParams.mu, genderParams.sigma) * 1000) / 10
        : null

      return {
        timeSecs: pt.timeSecs,
        [t('percentile.overall')]: overallPercentile,
        ...(genderParams
          ? {
              [gender === 'm' ? t('percentile.male') : t('percentile.female')]: genderPercentile,
            }
          : {}),
      }
    })

    const xMin = overallCurve[0].timeSecs
    const xMax = overallCurve[overallCurve.length - 1].timeSecs

    return { chartData: data, xDomain: [xMin, xMax] as [number, number] }
  }, [params, gender, t])

  const distanceLabel = DISTANCE_LABEL[distanceId] ?? distanceId

  // X-axis ticks: ~6 evenly spaced ticks within domain
  const xTicks = useMemo(() => {
    const [min, max] = xDomain
    const range = max - min
    const approxStep = Math.ceil(range / 5 / 300) * 300 // round to nearest 5 min
    const ticks: number[] = []
    for (let v = Math.ceil(min / approxStep) * approxStep; v <= max; v += approxStep) {
      ticks.push(v)
    }
    return ticks
  }, [xDomain])

  const headlinePct = genderPct ?? overallPct

  return (
    <div className="bg-indigo-600 border-3 border-neo-dark rounded-xl p-6 shadow-[6px_6px_0px_0px_#1A1A2E]">
      <h2 className="text-lg font-black text-white uppercase mb-2">{t('percentile.title')}</h2>
      <p className="text-2xl font-black text-neo-yellow mb-4">
        {t('percentile.fasterThan', {
          pct: headlinePct,
          distance: distanceLabel,
        })}
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 20, right: 16, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
          <XAxis
            dataKey="timeSecs"
            type="number"
            domain={xDomain}
            ticks={xTicks}
            tickFormatter={(v: number) => formatTime(v)}
            tick={{ fill: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.4)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.4)' }}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tickFormatter={(v: number) => `${v}%`}
            tick={{ fill: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.4)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.4)' }}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: 'white', fontWeight: 700, fontSize: 13, paddingTop: 8 }} />

          <ReferenceLine
            x={timeSecs}
            stroke="#facc15"
            strokeWidth={2}
            strokeDasharray="5 3"
            label={{
              value: `${headlinePct}%`,
              fill: '#facc15',
              fontWeight: 700,
              fontSize: 12,
              position: 'top',
            }}
          />

          <Line
            type="monotone"
            dataKey={t('percentile.overall')}
            stroke="rgba(255,255,255,0.7)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
          {gender === 'm' && (
            <Line
              type="monotone"
              dataKey={t('percentile.male')}
              stroke="#60a5fa"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          )}
          {gender === 'f' && (
            <Line
              type="monotone"
              dataKey={t('percentile.female')}
              stroke="#f472b6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
