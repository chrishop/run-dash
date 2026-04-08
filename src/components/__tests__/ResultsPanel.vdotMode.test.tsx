import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResultsPanel, type Results } from '../ResultsPanel'
import { getRaceTimes } from '../../calc/raceTimes'
import { getTrainingPaces } from '../../calc/trainingPaces'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      if (opts) return `${key}:${JSON.stringify(opts)}`
      return key
    },
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}))

vi.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
  ReferenceLine: () => <div />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CartesianGrid: () => <div />,
}))

const noop = () => {}

function makeVdotResults(overrides: Partial<Results> = {}): Results {
  return {
    distance: null,
    timeSecs: null,
    vdot: 50,
    raceTimes: getRaceTimes(50),
    trainingPaces: getTrainingPaces(50),
    ageComparison: null,
    userAge: null,
    gender: null,
    units: 'km',
    warnings: [],
    ...overrides,
  }
}

describe('ResultsPanel — VDOT mode', () => {
  it('renders without crashing when distance and timeSecs are null', () => {
    render(<ResultsPanel results={makeVdotResults()} onUnitsChange={noop} />)
    expect(screen.getByText('vdot.title')).toBeInTheDocument()
  })

  it('renders VdotScore in vdot mode', () => {
    render(<ResultsPanel results={makeVdotResults()} onUnitsChange={noop} />)
    expect(screen.getByText('50.0')).toBeInTheDocument()
  })

  it('renders UnifiedTrainingCard in vdot mode', () => {
    render(<ResultsPanel results={makeVdotResults()} onUnitsChange={noop} />)
    expect(screen.getByText('raceTimes.title')).toBeInTheDocument()
    expect(screen.getByText('trainingPaces.title')).toBeInTheDocument()
  })

  it('does not render AgeComparisonCard in vdot mode (distance null)', () => {
    render(
      <ResultsPanel
        results={makeVdotResults({ userAge: 35, gender: 'm' })}
        onUnitsChange={noop}
      />,
    )
    expect(screen.queryByText('ageComparison.title')).not.toBeInTheDocument()
  })

  it('does not render FinishingTimePercentileCard when distance is null', () => {
    render(<ResultsPanel results={makeVdotResults()} onUnitsChange={noop} />)
    expect(screen.queryByText('percentile.title')).not.toBeInTheDocument()
  })

  it('does not render FinishingTimePercentileCard when timeSecs is null even with vdot results', () => {
    render(
      <ResultsPanel
        results={makeVdotResults({ userAge: 35, gender: 'f' })}
        onUnitsChange={noop}
      />,
    )
    expect(screen.queryByText('percentile.title')).not.toBeInTheDocument()
  })

  it('renders for VDOT 10 boundary', () => {
    render(
      <ResultsPanel
        results={makeVdotResults({ vdot: 10, raceTimes: getRaceTimes(10), trainingPaces: getTrainingPaces(10) })}
        onUnitsChange={noop}
      />,
    )
    expect(screen.getByText('raceTimes.title')).toBeInTheDocument()
  })

  it('renders for VDOT 85 boundary', () => {
    render(
      <ResultsPanel
        results={makeVdotResults({ vdot: 85, raceTimes: getRaceTimes(85), trainingPaces: getTrainingPaces(85) })}
        onUnitsChange={noop}
      />,
    )
    expect(screen.getByText('raceTimes.title')).toBeInTheDocument()
  })
})
