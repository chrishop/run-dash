import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import ko from './ko.json'

// Read initial language from URL params, default to 'en'
const params = new URLSearchParams(window.location.search)
const lang = params.get('lang')

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ko: { translation: ko },
  },
  lng: lang === 'ko' ? 'ko' : 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
