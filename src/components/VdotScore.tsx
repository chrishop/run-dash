import { useTranslation } from 'react-i18next'

interface VdotScoreProps {
  vdot: number | null
}

export function VdotScore({ vdot }: VdotScoreProps) {
  const { t } = useTranslation()

  if (vdot === null) {
    return (
      <div className="bg-neo-yellow border-3 border-neo-dark rounded-xl p-6 shadow-[6px_6px_0px_0px_#1A1A2E]">
        <h2 className="text-lg font-black text-neo-dark uppercase">{t('vdot.title')}</h2>
        <p className="text-neo-dark font-bold mt-2">{t('vdot.outOfRange')}</p>
      </div>
    )
  }

  return (
    <div className="bg-neo-yellow border-3 border-neo-dark rounded-xl p-6 shadow-[6px_6px_0px_0px_#1A1A2E]">
      <h2 className="text-lg font-black text-neo-dark uppercase">{t('vdot.title')}</h2>
      <p className="text-6xl font-black text-neo-dark mt-2">{vdot.toFixed(1)}</p>
    </div>
  )
}
