import firestore, { getDataFromQuerySnapshots } from '../database/firestore'
import { FieldPath } from 'firebase-admin/firestore'

export interface Team {
  id: string
  name: string
  clickCount?: number
}

const teamRepository = firestore.collection('teams')

export const getTeamForName = (team: Pick<Team, 'name'>) =>
  getDataFromQuerySnapshots<Team>(
    teamRepository.where('name', '==', team.name).limit(1).get()
  )

export const createTeam = async (team: Pick<Team, 'name'>) =>
  teamRepository.add({ name: team.name })

export const getTeams = () =>
  getDataFromQuerySnapshots<Team>(teamRepository.get())

export const getTeamForId = async (team: Pick<Team, 'id'>) =>
  getDataFromQuerySnapshots<Team>(
    teamRepository.where(FieldPath.documentId(), '==', team.id).get()
  )
