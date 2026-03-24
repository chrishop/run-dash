import { DISTANCES } from '../data/distances'
import type { UrlParams } from '../hooks/useUrlParams'

interface InputFormProps {
  params: UrlParams
  setParams: (updates: Partial<Record<'d' | 't' | 'a' | 'g', string | null>>) => void
}

export function InputForm({ params, setParams }: InputFormProps) {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex flex-col gap-1">
        <label htmlFor="distance" className="text-sm font-medium text-gray-600">
          Distance
        </label>
        <select
          id="distance"
          value={params.d ?? ''}
          onChange={(e) => setParams({ d: e.target.value || null })}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select distance</option>
          {DISTANCES.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="time" className="text-sm font-medium text-gray-600">
          Time
        </label>
        <input
          id="time"
          type="text"
          value={params.t ?? ''}
          onChange={(e) => setParams({ t: e.target.value || null })}
          placeholder="MM:SS or HH:MM:SS"
          className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="age" className="text-sm font-medium text-gray-600">
          Age
        </label>
        <input
          id="age"
          type="number"
          min={5}
          max={100}
          value={params.a ?? ''}
          onChange={(e) => setParams({ a: e.target.value || null })}
          placeholder="Age"
          className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">Gender</label>
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
            Male
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
            Female
          </button>
        </div>
      </div>
    </div>
  )
}
