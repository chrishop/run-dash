import { useMemo } from 'react'
import { useUrlParams } from './hooks/useUrlParams'
import { getDistanceById } from './data/distances'
import { parseTime } from './calc/timeUtils'
import { lookupVdot } from './calc/vdot'
import { getRaceTimes } from './calc/raceTimes'
import { getTrainingPaces } from './calc/trainingPaces'
import { getAgeGrading } from './calc/ageGrading'
import { getAgeComparisonTable } from './calc/ageComparison'
import { InputForm } from './components/InputForm'
import { ResultsPanel } from './components/ResultsPanel'

function App() {
  const [params, setParams] = useUrlParams()

  const results = useMemo(() => {
    const distance = params.d ? getDistanceById(params.d) : null
    const timeSecs = params.t ? parseTime(params.t) : null

    if (!distance || timeSecs === null) return null

    const vdot = lookupVdot(distance.vdotKey, timeSecs)
    const raceTimes = vdot !== null ? getRaceTimes(vdot) : null
    const trainingPaces = vdot !== null ? getTrainingPaces(vdot) : null

    const ageGrading =
      params.a !== null && params.g !== null
        ? getAgeGrading(distance, timeSecs, params.a, params.g)
        : null

    const ageComparison =
      ageGrading !== null && distance.ageGradeKey !== null
        ? getAgeComparisonTable(distance, ageGrading.percentage)
        : null

    return {
      distance,
      timeSecs,
      vdot,
      raceTimes,
      trainingPaces,
      ageGrading,
      ageComparison,
      userAge: params.a,
    }
  }, [params.d, params.t, params.a, params.g])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Run Dash</h1>
        <InputForm params={params} setParams={setParams} />
        <ResultsPanel results={results} />
      </div>
    </div>
  )
}

export default App
