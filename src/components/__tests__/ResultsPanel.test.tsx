import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResultsPanel, type Results } from '../ResultsPanel'
import { getRaceTimes } from '../../calc/raceTimes'
import { getTrainingPaces } from '../../calc/trainingPaces'
import { getDistanceById } from '../../data/distances'
import { getAgeComparisonTable } from '../../calc/ageComparison'
import type { Distance } from '../../data/distances'
import type { Warning } from '../../types'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      if (opts) return `${key}:${JSON.stringify(opts)}`
      return key
    },
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}))

// Mock recharts to avoid rendering issues in tests
vi.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
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

function makeResults(overrides: Partial<Results> = {}): Results {
  const dist = getDistanceById('5k')!
  return {
    distance: dist,
    timeSecs: 1500,
    vdot: 50,
    raceTimes: getRaceTimes(50),
    trainingPaces: getTrainingPaces(50),
    ageComparison: getAgeComparisonTable(dist, 65),
    userAge: 30,
    gender: 'm',
    units: 'km',
    warnings: [],
    ...overrides,
  }
}

describe('ResultsPanel', () => {
  // Empty state
  it('shows prompt message when results is null', () => {
    render(<ResultsPanel results={null} onUnitsChange={noop} />)
    expect(screen.getByText('results.prompt')).toBeInTheDocument()
  })

  // Full results
  it('shows VdotScore when results exist', () => {
    render(<ResultsPanel results={makeResults()} onUnitsChange={noop} />)
    expect(screen.getByText('vdot.title')).toBeInTheDocument()
  })

  it('shows VDOT value', () => {
    render(<ResultsPanel results={makeResults()} onUnitsChange={noop} />)
    expect(screen.getByText('50.0')).toBeInTheDocument()
  })

  it('shows "out of range" when VDOT is null', () => {
    render(<ResultsPanel results={makeResults({ vdot: null, raceTimes: null, trainingPaces: null })} onUnitsChange={noop} />)
    expect(screen.getByText('vdot.outOfRange')).toBeInTheDocument()
  })

  // UnifiedTrainingCard presence
  it('shows race times and training paces when data exists', () => {
    render(<ResultsPanel results={makeResults()} onUnitsChange={noop} />)
    expect(screen.getByText('raceTimes.title')).toBeInTheDocument()
    expect(screen.getByText('trainingPaces.title')).toBeInTheDocument()
  })

  it('hides UnifiedTrainingCard when raceTimes is null', () => {
    render(<ResultsPanel results={makeResults({ raceTimes: null })} onUnitsChange={noop} />)
    expect(screen.queryByText('raceTimes.title')).not.toBeInTheDocument()
  })

  // AgeComparison presence
  it('shows age comparison when data exists', () => {
    render(<ResultsPanel results={makeResults()} onUnitsChange={noop} />)
    expect(screen.getByText('ageComparison.title')).toBeInTheDocument()
  })

  it('hides age comparison when ageComparison is null', () => {
    render(<ResultsPanel results={makeResults({ ageComparison: null })} onUnitsChange={noop} />)
    expect(screen.queryByText('ageComparison.title')).not.toBeInTheDocument()
  })

  // Partial input scenarios
  it('hides age comparison when no age/gender', () => {
    render(
      <ResultsPanel
        results={makeResults({ ageComparison: null, userAge: null, gender: null })}
        onUnitsChange={noop}
      />,
    )
    expect(screen.queryByText('ageComparison.title')).not.toBeInTheDocument()
  })

  // Warning rendering
  it('shows no warning when warnings is empty', () => {
    render(<ResultsPanel results={makeResults({ warnings: [] })} onUnitsChange={noop} />)
    expect(screen.queryByText('warnings.vdotTooSlow')).not.toBeInTheDocument()
    expect(screen.queryByText('warnings.vdotTooFast')).not.toBeInTheDocument()
  })

  it('shows vdotTooSlow warning', () => {
    const warnings: Warning[] = [{ type: 'vdotOutOfRange', direction: 'tooSlow' }]
    render(<ResultsPanel results={makeResults({ warnings })} onUnitsChange={noop} />)
    expect(screen.getByText('warnings.vdotTooSlow')).toBeInTheDocument()
  })

  it('shows vdotTooFast warning', () => {
    const warnings: Warning[] = [{ type: 'vdotOutOfRange', direction: 'tooFast' }]
    render(<ResultsPanel results={makeResults({ warnings })} onUnitsChange={noop} />)
    expect(screen.getByText('warnings.vdotTooFast')).toBeInTheDocument()
  })

  it('shows ageGradingSuppressed warning', () => {
    const warnings: Warning[] = [{ type: 'ageGradingSuppressed' }]
    render(<ResultsPanel results={makeResults({ warnings, ageComparison: null })} onUnitsChange={noop} />)
    expect(screen.getByText('warnings.ageGradingSuppressed')).toBeInTheDocument()
    expect(screen.queryByText('ageComparison.title')).not.toBeInTheDocument()
  })

  it('shows multiple warnings', () => {
    const warnings: Warning[] = [
      { type: 'vdotOutOfRange', direction: 'tooFast' },
      { type: 'ageGradingSuppressed' },
    ]
    render(<ResultsPanel results={makeResults({ warnings, ageComparison: null })} onUnitsChange={noop} />)
    expect(screen.getByText('warnings.vdotTooFast')).toBeInTheDocument()
    expect(screen.getByText('warnings.ageGradingSuppressed')).toBeInTheDocument()
  })

  // Mock distance with no ageGradeKey to verify no crashes
  it('handles distance with no ageGradeKey gracefully', () => {
    const mockDist: Distance = {
      id: 'test',
      label: 'Test',
      vdotKey: '5k',
      ageGradeKey: null,
      distanceKm: 5,
    }
    render(
      <ResultsPanel
        results={makeResults({ distance: mockDist, ageComparison: null })}
        onUnitsChange={noop}
      />,
    )
    expect(screen.getByText('vdot.title')).toBeInTheDocument()
    expect(screen.queryByText('ageComparison.title')).not.toBeInTheDocument()
  })
})
