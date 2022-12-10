import * as pipe from 'p-pipe'
import { HttpContext } from './controllers'

export { pipe }

export type Unpromise<T> = T extends Promise<infer U> ? U : T

export const checkAuth = (context: HttpContext) => {
  if (!context.authenticated && !context.user?.id) {
    throw new Error()
  }
  return context
}
