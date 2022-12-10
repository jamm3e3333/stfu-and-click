import { BadRequest } from 'express-openapi-validator/dist/openapi.validator'
import * as jwt from 'jsonwebtoken'
import config from '../../config'
import { NotAuthenticated, NotAuthorized } from '../errors/classes'

type UserPayload = ReturnType<typeof getUserPayload>

export const getUserPayload = (param: { userId: string; email: string }) => {
  return {
    user: { id: param.userId, email: param.email },
  }
}

export const generateToken = (payload: UserPayload) => {
  return jwt.sign(payload, config.authentication.jwtSecret, {
    expiresIn: config.authentication.tokenExpiresIn,
  })
}

export type UserJwtPayload = UserPayload & { exp: number; iat: number }

export const verifyToken = async (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret) as UserJwtPayload

    //TODO: get user from db
    const userRecord = { id: '1' }

    if (!userRecord) {
      throw new NotAuthenticated()
    }

    //TODO: translate user from db
    const user = {
      id: userRecord.id,
    }

    return { user, decoded }
  } catch (error) {
    if (error instanceof NotAuthorized) throw error
    if (error instanceof NotAuthenticated) throw error
    if (error instanceof BadRequest) throw error
    throw new NotAuthenticated()
  }
}

export const getBearerToken = (authorizationHeader: string) => {
  const [bearer, accessToken] = authorizationHeader.split(' ')
  if (!bearer || bearer.toLowerCase() !== 'bearer') {
    return
  }

  return accessToken
}

export const authenticateTokenWithSecret = async (
  token: string | undefined,
  jwtSecret: string
) => {
  if (!token) return
  const verified = await verifyToken(token, jwtSecret)
  if (verified.user) {
    return { user: verified.user, decoded: verified.decoded }
  }
  return { decoded: verified.decoded }
}

export const authenticateToken = async (token: string | undefined) => {
  return (
    await authenticateTokenWithSecret(token, config.authentication.jwtSecret)
  )?.user
}
