import { useCallback, useSyncExternalStore } from 'react'

export interface UrlParams {
  d: string | null
  t: string | null
  a: number | null
  g: 'm' | 'f' | null
  units: 'km' | 'mi'
  lang: 'en' | 'ko'
}

type ParamKey = 'd' | 't' | 'a' | 'g' | 'units' | 'lang'

function getSnapshot(): string {
  return window.location.search
}

function subscribe(callback: () => void): () => void {
  window.addEventListener('popstate', callback)
  return () => window.removeEventListener('popstate', callback)
}

export function parseParams(search: string): UrlParams {
  const params = new URLSearchParams(search)
  const ageStr = params.get('a')
  const gender = params.get('g')
  const lang = params.get('lang')
  const units = params.get('units')

  const parsedAge = ageStr ? parseInt(ageStr, 10) : null

  return {
    d: params.get('d'),
    t: params.get('t'),
    a: parsedAge !== null && isNaN(parsedAge) ? null : parsedAge,
    g: gender === 'm' || gender === 'f' ? gender : null,
    units: units === 'mi' ? 'mi' : 'km',
    lang: lang === 'ko' ? 'ko' : 'en',
  }
}

export function useUrlParams(): [
  UrlParams,
  (updates: Partial<Record<ParamKey, string | null>>) => void,
] {
  const search = useSyncExternalStore(subscribe, getSnapshot)
  const params = parseParams(search)

  const setParams = useCallback((updates: Partial<Record<ParamKey, string | null>>) => {
    const current = new URLSearchParams(window.location.search)

    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === undefined || value === '') {
        current.delete(key)
      } else {
        current.set(key, value)
      }
    }

    const newSearch = current.toString()
    const newUrl = newSearch ? `?${newSearch}` : window.location.pathname
    window.history.pushState(null, '', newUrl)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, [])

  return [params, setParams]
}
