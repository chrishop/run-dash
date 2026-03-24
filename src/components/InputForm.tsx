import { useTranslation } from 'react-i18next'
import { DISTANCES } from '../data/distances'
import type { UrlParams } from '../hooks/useUrlParams'

interface InputFormProps {
  params: UrlParams
  setParams: (updates: Partial<Record<'d' | 't' | 'a' | 'g' | 'lang', string | null>>) => void
}

export function InputForm({ params, setParams }: InputFormProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex flex-col gap-1">
        <label htmlFor="distance" className="text-sm font-medium text-gray-600">
          {t('input.distance')}
        </label>
        <select
          id="distance"
          value={params.d ?? ''}
          onChange={(e) => setParams({ d: e.target.value || null })}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <label htmlFor="time" className="text-sm font-medium text-gray-600">
          {t('input.time')}
        </label>
        <input
          id="time"
          type="text"
          value={params.t ?? ''}
          onChange={(e) => setParams({ t: e.target.value || null })}
          placeholder={t('input.timePlaceholder')}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="age" className="text-sm font-medium text-gray-600">
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
          className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">{t('input.gender')}</label>
        <div className="flex">
          <button
            type="button"
            onClick={() => setParams({ g: 'm' })}
            className={`px-4 py-2 border text-sm font-medium rounded-l-md transition-colors ${
              params.g === 'm'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {t('input.male')}
          </button>
          <button
            type="button"
            onClick={() => setParams({ g: 'f' })}
            className={`px-4 py-2 border-t border-b border-r text-sm font-medium rounded-r-md transition-colors ${
              params.g === 'f'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {t('input.female')}
          </button>
        </div>
      </div>
    </div>
  )
}
