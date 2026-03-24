import { useTranslation } from 'react-i18next'
import { DISTANCES } from '../data/distances'
import type { UrlParams } from '../hooks/useUrlParams'

interface InputFormProps {
  params: UrlParams
  setParams: (updates: Partial<Record<'d' | 't' | 'a' | 'g' | 'lang', string | null>>) => void
}

const neoInput =
  'px-3 h-[42px] border-3 border-neo-dark rounded-md bg-white text-neo-dark font-bold focus:outline-none focus:shadow-[3px_3px_0px_0px_#1A1A2E] shadow-[2px_2px_0px_0px_#1A1A2E]'

export function InputForm({ params, setParams }: InputFormProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-neo-blue border-3 border-neo-dark rounded-xl p-6 shadow-[6px_6px_0px_0px_#1A1A2E]">
      <div className="flex flex-wrap gap-4 items-end justify-center">
        <div className="flex flex-col gap-1">
          <label htmlFor="distance" className="text-sm font-black text-neo-dark uppercase">
            {t('input.distance')}
          </label>
          <select
            id="distance"
            value={params.d ?? ''}
            onChange={(e) => setParams({ d: e.target.value || null })}
            className={neoInput}
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
            className={`${neoInput} w-44`}
          />
        </div>

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
            className={`${neoInput} w-20`}
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
