import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t, i18n } = useTranslation()
  const [params, setParams] = useUrlParams()

  // Sync i18n language with URL param
  useEffect(() => {
    if (i18n.language !== params.lang) {
      i18n.changeLanguage(params.lang)
    }
  }, [params.lang, i18n])

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{t('app.title')}</h1>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setParams({ lang: 'en' })}
              className={`px-3 py-1 text-sm rounded-l-md border transition-colors ${
                params.lang === 'en'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setParams({ lang: 'ko' })}
              className={`px-3 py-1 text-sm rounded-r-md border-t border-b border-r transition-colors ${
                params.lang === 'ko'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              한국어
            </button>
          </div>
        </div>
        <InputForm params={params} setParams={setParams} />
        <ResultsPanel results={results} />
      </div>
    </div>
  )
}

export default App
