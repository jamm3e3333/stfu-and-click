import firestore from '../database/firestore'
import { E_CODES } from '../errors'
import { ValidationError } from '../errors/classes'

const userRepository = firestore.collection('users')

interface User {
  id: string
  email: string
  clickCount: number
  teamId: string
}

export const createUser = async (user: Pick<User, 'email' | 'teamId'>) => {
  const existingUser = await userRepository
    .where('email', '==', user.email)
    .limit(1)
    .get()
  if (existingUser) {
    throw new ValidationError(E_CODES.U4000)
  }
  return userRepository.add({
    email: user.email,
    teamId: user.teamId,
  })
}

export const getUserForUserId = async (user: Pick<User, 'id'>) =>
  userRepository.where('id', '==', user.id).limit(1).get()

export const getUsersByTeamId = async (user: Pick<User, 'teamId'>) =>
  userRepository.where('teamId', '==', user.teamId).get()
