import firestore, { getDataFromQuerySnapshots } from '../database/firestore'
import { E_CODES } from '../errors'
import { ValidationError } from '../errors/classes'

export interface Team {
  id: string
  name: string
}

const teamRepository = firestore.collection('teams')

export const getTeamForName = (team: Pick<Team, 'name'>) =>
  getDataFromQuerySnapshots(
    teamRepository.where('name', '==', team.name).limit(1).get()
  )

export const createTeam = async (team: Pick<Team, 'name'>) => {
  const [existingTeam] = await getTeamForName({ name: team.name })
  if (existingTeam) {
    throw new ValidationError(E_CODES.T4000)
  }
  return teamRepository.add({ name: team.name })
}
