import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useUrlParams } from './hooks/useUrlParams'
import { getDistanceById } from './data/distances'
import { parseTime } from './calc/timeUtils'
import { lookupVdot, isTimeOutOfVdotRange } from './calc/vdot'
import { getRaceTimes } from './calc/raceTimes'
import { getTrainingPaces } from './calc/trainingPaces'
import { getAgeGrading } from './calc/ageGrading'
import { getAgeComparisonTable } from './calc/ageComparison'
import { InputForm } from './components/InputForm'
import { ResultsPanel } from './components/ResultsPanel'
import type { Warning } from './types'

function App() {
  const { t, i18n } = useTranslation()
  const [params, setParams] = useUrlParams()

  useEffect(() => {
    if (i18n.language !== params.lang) {
      i18n.changeLanguage(params.lang)
    }
  }, [params.lang, i18n])

  const results = useMemo(() => {
    // --- VDOT mode ---
    if (params.mode === 'vdot') {
      const vdot = params.vdot
      if (vdot === null || vdot < 10 || vdot > 85) return null
      return {
        distance: null,
        timeSecs: null,
        vdot,
        raceTimes: getRaceTimes(vdot),
        trainingPaces: getTrainingPaces(vdot),
        ageComparison: null,
        userAge: params.a,
        gender: params.g,
        units: params.units,
        warnings: [] as Warning[],
      }
    }

    // --- Race time mode ---
    const distance = params.d ? getDistanceById(params.d) : null
    const timeSecs = params.t ? parseTime(params.t) : null

    if (!distance || timeSecs === null) return null

    // Zero time is not meaningful input — treat as no input
    if (timeSecs === 0) return null

    const warnings: Warning[] = []

    const vdotOutOfRange = isTimeOutOfVdotRange(distance.vdotKey, timeSecs)
    if (vdotOutOfRange !== null) {
      warnings.push({ type: 'vdotOutOfRange', direction: vdotOutOfRange })
    }

    const vdot = lookupVdot(distance.vdotKey, timeSecs)
    const raceTimes = vdot !== null ? getRaceTimes(vdot) : null
    const trainingPaces = vdot !== null ? getTrainingPaces(vdot) : null

    let ageGrading =
      params.a !== null && params.g !== null
        ? getAgeGrading(distance, timeSecs, params.a, params.g)
        : null

    // Suppress age grading if percentage exceeds 100 (faster than world standard)
    // or is not finite (defensive fallback)
    if (ageGrading !== null && (ageGrading.percentage > 100 || !isFinite(ageGrading.percentage))) {
      warnings.push({ type: 'ageGradingSuppressed' })
      ageGrading = null
    }

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
      ageComparison,
      userAge: params.a,
      gender: params.g,
      units: params.units,
      warnings,
    }
  }, [params.mode, params.vdot, params.d, params.t, params.a, params.g, params.units])

  return (
    <div className="min-h-screen bg-neo-red">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black text-neo-dark uppercase tracking-tight">
            {t('app.title')}
          </h1>
          <div className="flex">
            <button
              type="button"
              onClick={() => setParams({ lang: 'en' })}
              className={`px-4 py-2 text-sm font-bold uppercase border-3 border-neo-dark rounded-l-md transition-all ${
                params.lang === 'en'
                  ? 'bg-neo-yellow text-neo-dark shadow-[3px_3px_0px_0px_#1A1A2E]'
                  : 'bg-white text-neo-dark hover:bg-neo-yellow/30'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setParams({ lang: 'ko' })}
              className={`px-4 py-2 text-sm font-bold border-3 border-l-0 border-neo-dark rounded-r-md transition-all ${
                params.lang === 'ko'
                  ? 'bg-neo-yellow text-neo-dark shadow-[3px_3px_0px_0px_#1A1A2E]'
                  : 'bg-white text-neo-dark hover:bg-neo-yellow/30'
              }`}
            >
              한국어
            </button>
          </div>
        </div>
        <InputForm params={params} setParams={setParams} />
        <ResultsPanel results={results} onUnitsChange={(units) => setParams({ units })} />
      </div>
    </div>
  )
}

export default App
