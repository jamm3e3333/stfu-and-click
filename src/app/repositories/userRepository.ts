import firestore, { getDataFromQuerySnapshots } from '../database/firestore'
import { FieldPath } from 'firebase-admin/firestore'
import { E_CODES } from '../errors'
import { NotAuthorized, ValidationError } from '../errors/classes'

const userRepository = firestore.collection('users')

export interface User {
  id: string
  email: string
  clickCount?: number
  teamId: string
}

export const createUser = async (user: Pick<User, 'email' | 'teamId'>) => {
  const existingUser = (
    await userRepository.where('email', '==', user.email).limit(1).get()
  ).docs
  if (existingUser.length) {
    throw new ValidationError(E_CODES.U4000)
  }
  return userRepository.add({
    email: user.email,
    teamId: user.teamId,
  })
}

export const getUserForUserId = async (user: Pick<User, 'id'>) => {
  const [userData] = await getDataFromQuerySnapshots<User>(
    userRepository.where(FieldPath.documentId(), '==', user.id).limit(1).get()
  )
  return userData
}

export const getUsersForTeamIds = async (teamIds: string[]) =>
  getDataFromQuerySnapshots<User>(
    userRepository.where('teamId', 'in', teamIds).get()
  )

export const updateUserClickForTeam = async (
  userId: string,
  teamId: string
) => {
  const user = await userRepository
    .where(FieldPath.documentId(), '==', userId)
    .where('teamId', '==', teamId)
    .get()
  if (!user) {
    throw new NotAuthorized()
  }
  return user.forEach(async u => {
    await u.ref.update({
      clickCount: Number(u.data()?.clickCount) + 1 ?? 1,
    })
  })
}
