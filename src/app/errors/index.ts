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
  T4001: {
    code: 'T4001',
    message: 'Invalid team name.',
  },
} as const)
