import * as supertest from 'supertest'
import { User } from '../app/repositories/userRepository'
import * as jwt from '../app/services/jwtService'
import server from '../server'

export const request = () => supertest(server)

export const setBearer = (user: User) => ({
  Authorization: `Bearer ${jwt.generateToken({ user })}`,
})
