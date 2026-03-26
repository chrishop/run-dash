export type Warning =
  | { type: 'vdotOutOfRange'; direction: 'tooSlow' | 'tooFast' }
  | { type: 'ageGradingSuppressed' }
