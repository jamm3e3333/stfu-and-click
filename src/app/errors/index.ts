const setCustomErrors = <
  T extends { [X in keyof T]: { code: X; message: string } }
>(
  errors: T
) => errors

export const E_CODES = setCustomErrors({
  UNKNOWN: { code: 'UNKNOWN', message: 'Unknown error' },
  U4000: {
    code: 'U4000',
    message: 'User already exists.',
  },
  U4001: {
    code: 'U4001',
    message: 'Invalid email.',
  },
  T4000: {
    code: 'T4000',
    message: 'Team already exists.',
  },
} as const)
