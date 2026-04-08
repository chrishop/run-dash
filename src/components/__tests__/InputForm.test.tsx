import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { InputForm } from '../InputForm'
import type { UrlParams } from '../../hooks/useUrlParams'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}))

function makeParams(overrides: Partial<UrlParams> = {}): UrlParams {
  return {
    d: null,
    t: null,
    a: null,
    g: null,
    units: 'km',
    lang: 'en',
    mode: 'time',
    vdot: null,
    ...overrides,
  }
}

describe('InputForm', () => {
  it('renders Distance + Time inputs in time mode (default)', () => {
    render(<InputForm params={makeParams()} setParams={() => {}} />)
    expect(screen.getByLabelText('input.distance')).toBeInTheDocument()
    expect(screen.getByLabelText('input.time')).toBeInTheDocument()
    expect(screen.queryByLabelText('input.vdot')).not.toBeInTheDocument()
  })

  it('renders VDOT input in vdot mode', () => {
    render(<InputForm params={makeParams({ mode: 'vdot' })} setParams={() => {}} />)
    expect(screen.getByLabelText('input.vdot')).toBeInTheDocument()
    expect(screen.queryByLabelText('input.distance')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('input.time')).not.toBeInTheDocument()
  })

  it('clicking VDOT toggle clears race-time params and sets mode', () => {
    const setParams = vi.fn()
    render(<InputForm params={makeParams()} setParams={setParams} />)
    fireEvent.click(screen.getByText('input.modeVdot'))
    expect(setParams).toHaveBeenCalledWith({ mode: 'vdot', d: null, t: null })
  })

  it('clicking Race Time toggle clears vdot param', () => {
    const setParams = vi.fn()
    render(<InputForm params={makeParams({ mode: 'vdot', vdot: 50 })} setParams={setParams} />)
    fireEvent.click(screen.getByText('input.modeRaceTime'))
    expect(setParams).toHaveBeenCalledWith({ mode: null, vdot: null })
  })

  it('age and gender visible in time mode', () => {
    render(<InputForm params={makeParams()} setParams={() => {}} />)
    expect(screen.getByLabelText('input.age')).toBeInTheDocument()
    expect(screen.getByText('input.male')).toBeInTheDocument()
    expect(screen.getByText('input.female')).toBeInTheDocument()
  })

  it('age and gender visible in vdot mode', () => {
    render(<InputForm params={makeParams({ mode: 'vdot' })} setParams={() => {}} />)
    expect(screen.getByLabelText('input.age')).toBeInTheDocument()
    expect(screen.getByText('input.male')).toBeInTheDocument()
    expect(screen.getByText('input.female')).toBeInTheDocument()
  })

  it('VDOT input has min=10 max=85 step=0.1', () => {
    render(<InputForm params={makeParams({ mode: 'vdot' })} setParams={() => {}} />)
    const input = screen.getByLabelText('input.vdot') as HTMLInputElement
    expect(input.min).toBe('10')
    expect(input.max).toBe('85')
    expect(input.step).toBe('0.1')
  })

  it('typing into VDOT input calls setParams with vdot value', () => {
    const setParams = vi.fn()
    render(<InputForm params={makeParams({ mode: 'vdot' })} setParams={setParams} />)
    fireEvent.change(screen.getByLabelText('input.vdot'), { target: { value: '50' } })
    expect(setParams).toHaveBeenCalledWith({ vdot: '50' })
  })

  it('clearing VDOT input calls setParams with vdot=null', () => {
    const setParams = vi.fn()
    render(<InputForm params={makeParams({ mode: 'vdot', vdot: 50 })} setParams={setParams} />)
    fireEvent.change(screen.getByLabelText('input.vdot'), { target: { value: '' } })
    expect(setParams).toHaveBeenCalledWith({ vdot: null })
  })

  it('Race Time button is highlighted (yellow) in time mode', () => {
    render(<InputForm params={makeParams()} setParams={() => {}} />)
    const btn = screen.getByText('input.modeRaceTime')
    expect(btn.className).toContain('bg-neo-yellow')
  })

  it('VDOT button is highlighted (yellow) in vdot mode', () => {
    render(<InputForm params={makeParams({ mode: 'vdot' })} setParams={() => {}} />)
    const btn = screen.getByText('input.modeVdot')
    expect(btn.className).toContain('bg-neo-yellow')
  })
})
