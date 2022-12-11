import * as openapi from '../../openapi-gen'
import { createUser } from '../repositories/userRepository'
import * as ctrl from '../controllers'
import * as util from '../util'
import * as jwt from '../services/jwtService'
import * as teamRepo from '../repositories/teamRepository'
import { validateEmail } from '../../utils/validationUtils'
import { ValidationError } from '../errors/classes'
import { E_CODES } from '../errors'

export const handlePostUser = async (
  context: any
): Promise<openapi.OpenAPIRouteResponseBody<openapi.paths['/api/v1/users']>> =>
  util.pipe(
    () => ctrl.getContextTyped<openapi.paths['/api/v1/users']>(context),
    async context => {
      const email = context.requestBody.email.trim().toLowerCase()
      if (!validateEmail(email)) {
        throw new ValidationError(E_CODES.U4001)
      }
      const teamName = context.requestBody.teamName.trim()
      if (!teamName.length) {
        throw new ValidationError(E_CODES.T4001)
      }
      const [existingTeam] = await teamRepo.getTeamForName({ name: teamName })
      const team = existingTeam?.id
        ? existingTeam
        : await teamRepo.createTeam({
            name: context.requestBody.teamName,
          })
      const user = await createUser({
        email,
        teamId: team.id,
      })
      const token = jwt.generateToken({
        user: {
          email: context.requestBody.email,
          id: (user as any).id,
        },
      })
      return { token, email, id: user.id }
    }
  )(context)
