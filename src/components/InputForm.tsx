import { useTranslation } from 'react-i18next'
import { DISTANCES } from '../data/distances'
import type { UrlParams } from '../hooks/useUrlParams'

interface InputFormProps {
  params: UrlParams
  setParams: (
    updates: Partial<Record<'d' | 't' | 'a' | 'g' | 'lang' | 'mode' | 'vdot', string | null>>,
  ) => void
}

const neoInput =
  'px-3 h-[42px] border-3 border-neo-dark rounded-md bg-white text-neo-dark font-bold focus:outline-none focus:shadow-[3px_3px_0px_0px_#1A1A2E] shadow-[2px_2px_0px_0px_#1A1A2E]'

export function InputForm({ params, setParams }: InputFormProps) {
  const { t } = useTranslation()
  const isVdotMode = params.mode === 'vdot'

  return (
    <div className="bg-neo-blue border-3 border-neo-dark rounded-xl p-6 shadow-[6px_6px_0px_0px_#1A1A2E]">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-center">
        {/* Mode toggle */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-black text-neo-dark uppercase">{t('input.mode')}</label>
          <div className="flex">
            <button
              type="button"
              onClick={() => setParams({ mode: null, vdot: null })}
              className={`px-4 h-[42px] border-3 border-neo-dark text-sm font-bold rounded-l-md transition-all ${
                !isVdotMode
                  ? 'bg-neo-yellow text-neo-dark shadow-[3px_3px_0px_0px_#1A1A2E]'
                  : 'bg-white text-neo-dark hover:bg-neo-yellow/30'
              }`}
            >
              {t('input.modeRaceTime')}
            </button>
            <button
              type="button"
              onClick={() => setParams({ mode: 'vdot', d: null, t: null })}
              className={`px-4 h-[42px] border-3 border-l-0 border-neo-dark text-sm font-bold rounded-r-md transition-all ${
                isVdotMode
                  ? 'bg-neo-yellow text-neo-dark shadow-[3px_3px_0px_0px_#1A1A2E]'
                  : 'bg-white text-neo-dark hover:bg-neo-yellow/30'
              }`}
            >
              {t('input.modeVdot')}
            </button>
          </div>
        </div>

        {/* Race time mode: Distance + Time */}
        {!isVdotMode && (
          <>
            <div className="flex flex-col gap-1">
              <label htmlFor="distance" className="text-sm font-black text-neo-dark uppercase">
                {t('input.distance')}
              </label>
              <select
                id="distance"
                value={params.d ?? ''}
                onChange={(e) => setParams({ d: e.target.value || null })}
                className={`${neoInput} w-full sm:w-auto`}
              >
                <option value="">{t('input.selectDistance')}</option>
                {DISTANCES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {t(`distances.${d.id}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="time" className="text-sm font-black text-neo-dark uppercase">
                {t('input.time')}
              </label>
              <input
                id="time"
                type="text"
                value={params.t ?? ''}
                onChange={(e) => setParams({ t: e.target.value || null })}
                placeholder={t('input.timePlaceholder')}
                className={`${neoInput} w-full sm:w-44`}
              />
            </div>
          </>
        )}

        {/* VDOT mode: VDOT number input */}
        {isVdotMode && (
          <div className="flex flex-col gap-1">
            <label htmlFor="vdot-input" className="text-sm font-black text-neo-dark uppercase">
              {t('input.vdot')}
            </label>
            <input
              id="vdot-input"
              type="number"
              min={10}
              max={85}
              step={0.1}
              value={params.vdot ?? ''}
              onChange={(e) => setParams({ vdot: e.target.value || null })}
              placeholder={t('input.vdotPlaceholder')}
              className={`${neoInput} w-full sm:w-28`}
            />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="age" className="text-sm font-black text-neo-dark uppercase">
            {t('input.age')}
          </label>
          <input
            id="age"
            type="number"
            min={5}
            max={100}
            value={params.a ?? ''}
            onChange={(e) => setParams({ a: e.target.value || null })}
            placeholder={t('input.age')}
            className={`${neoInput} w-full sm:w-20`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-black text-neo-dark uppercase">{t('input.gender')}</label>
          <div className="flex">
            <button
              type="button"
              onClick={() => setParams({ g: 'm' })}
              className={`px-4 h-[42px] border-3 border-neo-dark text-sm font-bold rounded-l-md transition-all ${
                params.g === 'm'
                  ? 'bg-neo-yellow text-neo-dark shadow-[3px_3px_0px_0px_#1A1A2E]'
                  : 'bg-white text-neo-dark hover:bg-neo-yellow/30'
              }`}
            >
              {t('input.male')}
            </button>
            <button
              type="button"
              onClick={() => setParams({ g: 'f' })}
              className={`px-4 h-[42px] border-3 border-l-0 border-neo-dark text-sm font-bold rounded-r-md transition-all ${
                params.g === 'f'
                  ? 'bg-neo-pink text-neo-dark shadow-[3px_3px_0px_0px_#1A1A2E]'
                  : 'bg-white text-neo-dark hover:bg-neo-pink/30'
              }`}
            >
              {t('input.female')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
