import { useTranslation } from 'react-i18next'

interface VdotScoreProps {
  vdot: number | null
}

export function VdotScore({ vdot }: VdotScoreProps) {
  const { t } = useTranslation()

  if (vdot === null) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">{t('vdot.title')}</h2>
        <p className="text-gray-500">{t('vdot.outOfRange')}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">{t('vdot.title')}</h2>
      <p className="text-5xl font-bold text-blue-600">{vdot.toFixed(1)}</p>
    </div>
  )
}
