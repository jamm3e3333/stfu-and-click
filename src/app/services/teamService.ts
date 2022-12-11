import * as openapi from '../../openapi-gen'
import * as ctrl from '../controllers'
import * as util from '../util'
import * as lodash from 'lodash'
import * as teamRepo from '../repositories/teamRepository'
import * as userRepo from '../repositories/userRepository'

const createUsersFinder = (users: userRepo.User[]) => {
  const teamIdToUser = lodash.groupBy(users, x => x.teamId)
  return {
    findUsersForTeamId: (teamId: string): userRepo.User[] | [] => {
      const users = teamIdToUser[teamId]
      if (!users?.length) {
        return []
      }
      return users
    },
  }
}

const getTeamClickCount = (users: userRepo.User[] | []) => {
  if (!users.length) {
    return { clickCount: 0 }
  }
  return (users as userRepo.User[]).reduce(
    (usersClickCount: { clickCount: number }, user: userRepo.User) => {
      return {
        clickCount: usersClickCount.clickCount + Number(user?.clickCount ?? 0),
      }
    },
    { clickCount: 0 }
  )
}

type GetTeamsReseponse = openapi.OpenAPIRouteResponseBody<
  openapi.paths['/api/v1/teams']
>

const getUsersTeamsToGetTeamsResponse = (
  teams: teamRepo.Team[],
  users: userRepo.User[]
): GetTeamsReseponse => {
  const usersFinder = createUsersFinder(users)

  return teams.map(x => ({
    ...x,
    clickCount: getTeamClickCount(usersFinder.findUsersForTeamId(x.id))
      .clickCount,
    users: usersFinder.findUsersForTeamId(x.id).map(u => ({
      ...u,
      clickCount: u.clickCount ?? 0,
    })),
  }))
}

export const handleGetTeams = async (
  context: any
): Promise<GetTeamsReseponse> =>
  util.pipe(
    () => ctrl.getContextTyped<openapi.paths['/api/v1/teams']>(context),
    async () => {
      const teams = await teamRepo.getTeams()
      const users = await userRepo.getUsersForTeamIds(teams.map(x => x.id))
      return getUsersTeamsToGetTeamsResponse(teams, users)
    }
  )(context)

type DetailTeamResponse = openapi.OpenAPIRouteResponseBody<
  openapi.paths['/api/v1/teams/{teamId}']
>

const getUsersTeamToDeatilTeamResponse = (
  team: teamRepo.Team,
  users: userRepo.User[]
): DetailTeamResponse => {
  const [detailTeam] = getUsersTeamsToGetTeamsResponse([team], users)
  return detailTeam
}

export const handleDetailTeam = async (
  context: any
): Promise<DetailTeamResponse> =>
  util.pipe(
    () =>
      ctrl.getContextTyped<openapi.paths['/api/v1/teams/{teamId}']>(context),
    async context => {
      const { teamId: id } = context.param
      const [team] = await teamRepo.getTeamForId({ id })
      const users = await userRepo.getUsersForTeamIds([id])
      return getUsersTeamToDeatilTeamResponse(team, users)
    }
  )(context)

export const handlePostClickForTeam = async (
  context: any
): Promise<
  openapi.OpenAPIRouteResponseBody<
    openapi.paths['/api/v1/addTeamClick/{teamId}']
  >
> =>
  util.pipe(
    () =>
      ctrl.getContextTyped<openapi.paths['/api/v1/addTeamClick/{teamId}']>(
        context
      ),
    util.checkAuth,
    async context => {
      await Promise.all([
        userRepo.updateUserClickForTeam(
          context.user?.id ?? '-1',
          context.param.teamId
        ),
      ])
    }
  )(context)
