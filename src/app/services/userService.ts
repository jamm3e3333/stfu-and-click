import * as util from '../util'
import * as openapi from '../../openapi-gen'
import { createUser } from '../repositories/userRepository'
import { HttpContextTyped } from '../controllers'
import * as jwt from '../services/jwtService'

export const handlePostUser = (): Promise<
  openapi.OpenAPIRouteResponseBody<openapi.paths['/api/v1/users']>
> =>
  util.pipe(
    async (context: HttpContextTyped<openapi.paths['/api/v1/users']>) => {
      const user: { id: string } = await createUser({
        email: context.requestBody.email,
        teamId: '1',
      })
      const token = jwt.generateToken({
        user: {
          email: context.requestBody.email,
          id: user.id,
        },
      })
      return { token }
    }
  )()
