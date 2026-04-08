import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

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

function setUrl(search: string) {
  window.history.replaceState(null, '', search || '/')
  window.dispatchEvent(new PopStateEvent('popstate'))
}

beforeEach(() => {
  window.history.replaceState(null, '', '/')
})

describe('App integration — initial state from URL', () => {
  it('shows prompt when URL is empty', () => {
    render(<App />)
    expect(screen.getByText('results.prompt')).toBeInTheDocument()
  })

  it('hydrates results from ?d=5k&t=20:00', () => {
    window.history.replaceState(null, '', '?d=5k&t=20:00')
    render(<App />)
    expect(screen.getByText('vdot.title')).toBeInTheDocument()
    expect(screen.queryByText('results.prompt')).not.toBeInTheDocument()
  })

  it('hydrates results from ?mode=vdot&vdot=50', () => {
    window.history.replaceState(null, '', '?mode=vdot&vdot=50')
    render(<App />)
    expect(screen.getByText('50.0')).toBeInTheDocument()
    expect(screen.getByLabelText('input.vdot')).toBeInTheDocument()
  })

  it('shows nothing for ?mode=vdot with no vdot value', () => {
    window.history.replaceState(null, '', '?mode=vdot')
    render(<App />)
    expect(screen.getByText('results.prompt')).toBeInTheDocument()
  })

  it('shows nothing for ?mode=vdot&vdot=abc', () => {
    window.history.replaceState(null, '', '?mode=vdot&vdot=abc')
    render(<App />)
    expect(screen.getByText('results.prompt')).toBeInTheDocument()
  })

  it('shows nothing for vdot below 10', () => {
    window.history.replaceState(null, '', '?mode=vdot&vdot=5')
    render(<App />)
    expect(screen.getByText('results.prompt')).toBeInTheDocument()
  })

  it('shows nothing for vdot above 85', () => {
    window.history.replaceState(null, '', '?mode=vdot&vdot=100')
    render(<App />)
    expect(screen.getByText('results.prompt')).toBeInTheDocument()
  })

  it('shows nothing for negative vdot', () => {
    window.history.replaceState(null, '', '?mode=vdot&vdot=-50')
    render(<App />)
    expect(screen.getByText('results.prompt')).toBeInTheDocument()
  })

  it('renders for vdot=10 boundary', () => {
    window.history.replaceState(null, '', '?mode=vdot&vdot=10')
    render(<App />)
    expect(screen.getByText('raceTimes.title')).toBeInTheDocument()
  })

  it('renders for vdot=85 boundary', () => {
    window.history.replaceState(null, '', '?mode=vdot&vdot=85')
    render(<App />)
    expect(screen.getByText('raceTimes.title')).toBeInTheDocument()
  })

  it('renders for decimal vdot=50.5', () => {
    window.history.replaceState(null, '', '?mode=vdot&vdot=50.5')
    render(<App />)
    expect(screen.getByText('raceTimes.title')).toBeInTheDocument()
  })

  it('parses scientific notation vdot=5e1 as 50', () => {
    window.history.replaceState(null, '', '?mode=vdot&vdot=5e1')
    render(<App />)
    expect(screen.getByText('50.0')).toBeInTheDocument()
  })

  it('takes first value when vdot param appears twice', () => {
    window.history.replaceState(null, '', '?mode=vdot&vdot=50&vdot=60')
    render(<App />)
    expect(screen.getByText('50.0')).toBeInTheDocument()
  })
})

describe('App integration — mode switching', () => {
  it('switching to VDOT clears d and t but preserves a and g', () => {
    window.history.replaceState(null, '', '?d=5k&t=20:00&a=35&g=m')
    render(<App />)
    fireEvent.click(screen.getByText('input.modeVdot'))
    const url = window.location.search
    expect(url).not.toContain('d=5k')
    expect(url).not.toContain('t=20')
    expect(url).toContain('a=35')
    expect(url).toContain('g=m')
    expect(url).toContain('mode=vdot')
  })

  it('switching back to Race Time clears vdot but preserves a and g', () => {
    window.history.replaceState(null, '', '?mode=vdot&vdot=50&a=35&g=m')
    render(<App />)
    fireEvent.click(screen.getByText('input.modeRaceTime'))
    const url = window.location.search
    expect(url).not.toContain('vdot=')
    expect(url).not.toContain('mode=')
    expect(url).toContain('a=35')
    expect(url).toContain('g=m')
  })
})

describe('App integration — no age grading in VDOT mode', () => {
  it('does not render age comparison or percentile cards in vdot mode with age/gender set', () => {
    window.history.replaceState(null, '', '?mode=vdot&vdot=50&a=35&g=m')
    render(<App />)
    expect(screen.queryByText('ageComparison.title')).not.toBeInTheDocument()
    expect(screen.queryByText('percentile.title')).not.toBeInTheDocument()
  })

  it('renders age comparison in race time mode (regression)', () => {
    window.history.replaceState(null, '', '?d=5k&t=20:00&a=35&g=m')
    render(<App />)
    expect(screen.getByText('ageComparison.title')).toBeInTheDocument()
  })
})

describe('App integration — URL round-trip', () => {
  it('typing into vdot input updates the URL and re-renders results', () => {
    window.history.replaceState(null, '', '?mode=vdot')
    render(<App />)
    expect(screen.getByText('results.prompt')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('input.vdot'), { target: { value: '55' } })
    expect(window.location.search).toContain('vdot=55')
    expect(screen.getByText('55.0')).toBeInTheDocument()
  })

  it('switching units in VDOT mode preserves vdot value', () => {
    window.history.replaceState(null, '', '?mode=vdot&vdot=50')
    render(<App />)
    setUrl('?mode=vdot&vdot=50&units=mi')
    expect(window.location.search).toContain('vdot=50')
    expect(screen.getByText('50.0')).toBeInTheDocument()
  })
})
