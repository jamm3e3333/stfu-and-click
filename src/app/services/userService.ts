import * as openapi from '../../openapi-gen'
import { createUser, getUserForEmail } from '../repositories/userRepository'
import * as ctrl from '../controllers'
import * as util from '../util'
import * as jwt from '../services/jwtService'
import * as teamRepo from '../repositories/teamRepository'
import { validateEmail } from '../../utils/validationUtils'
import { NotFound, ValidationError } from '../errors/classes'
import { E_CODES } from '../errors'

const validateUserEmail = (email: string) => {
  if (!validateEmail(email)) {
    throw new ValidationError(E_CODES.U4001)
  }
}

const modifyUserEmail = (email: string) => email.trim().toLowerCase()

export const handlePostUser = async (
  context: any
): Promise<openapi.OpenAPIRouteResponseBody<openapi.paths['/api/v1/users']>> =>
  util.pipe(
    () => ctrl.getContextTyped<openapi.paths['/api/v1/users']>(context),
    async context => {
      const email = modifyUserEmail(context.requestBody.email)
      validateUserEmail(email)
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
      return { token, email, id: user.id, teamId: team.id }
    }
  )(context)

export const handlePostSession = async (
  context: any
): Promise<
  openapi.OpenAPIRouteResponseBody<openapi.paths['/api/v1/sessions']>
> =>
  util.pipe(
    () => ctrl.getContextTyped<openapi.paths['/api/v1/sessions']>(context),
    async context => {
      const email = modifyUserEmail(context.requestBody.email)
      validateUserEmail(email)
      const [user] = await getUserForEmail(email)
      if (!user) {
        throw new NotFound()
      }
      const [team] = await teamRepo.getTeamForId({ id: user.teamId })
      const token = jwt.generateToken({
        user: { email: user.email, id: user.id },
      })
      return {
        token,
        teamId: team.id,
        email: user.email,
        id: user.id,
      }
    }
  )(context)
