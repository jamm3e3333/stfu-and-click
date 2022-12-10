const setCustomErrors = <
  T extends { [X in keyof T]: { code: X; message: string } }
>(
  errors: T
) => errors

export const E_CODES = setCustomErrors({
  UNKNOWN: { code: 'UNKNOWN', message: 'Unknown error' },
} as const)
