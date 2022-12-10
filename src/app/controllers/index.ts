import * as createCors from 'cors'
import { NotFound } from '../errors/classes'
import { Request, RequestHandler, Response, Router } from 'express'
import { defaults } from 'lodash'
import * as util from '../util'
import { authenticateToken, getBearerToken } from '../services/jwtService'

const pipeMiddleware = (...middlewares: RequestHandler[]) => {
  const router = Router({ mergeParams: true })
  middlewares.forEach(middleware => router.use(middleware))
  return router
}

const bindMiddleware: RequestHandler = async (req, res, next) => {
  try {
    req.context = await createHttpCtx({ req, res })
    next()
  } catch (error) {
    next(error)
  }
}

export type HttpContext = util.Unpromise<ReturnType<typeof createHttpCtx>>

const getBaseUrl = (req: Request) => {
  return `${req.protocol}://${req.get('host') ?? ''}`
}

const createHttpCtx = async (httpContext: { req: Request; res: Response }) => {
  const { req } = httpContext
  let user = req.headers.authorization
    ? await authenticateToken(getBearerToken(req.headers.authorization))
    : undefined
  let authenticated = !!user

  return {
    user,
    authenticated,
    params: defaults({}, req.headers, req.params, req.query) as {
      [key: string]: string
    },
    requestBody: req.body,
    baseUrl: getBaseUrl(req),
  }
}

type ServiceHandler = (context: HttpContext) => PromiseLike<any>

export const service = (
  serviceHandler: ServiceHandler,
  options = { noContent: false }
) =>
  pipeMiddleware(bindMiddleware, async (req, res, next) => {
    try {
      const responseBody = await serviceHandler(req.context)

      if (options.noContent) {
        res.statusCode = 204
        return res.json(null)
      }
      res.json(responseBody)
    } catch (error) {
      next(error)
    }
  })

export const httpFinalHandler: RequestHandler = (_req, res, next) => {
  res.status(404)
  next(new NotFound())
}

export const cors = createCors({})
