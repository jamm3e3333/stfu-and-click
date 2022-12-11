import * as express from 'express'
import * as ctrl from './app/controllers'
import * as userService from './app/services/userService'
import * as teamService from './app/services/teamService'
import * as OpenApiValidator from 'express-openapi-validator'
import logger from './logger'
import httpErrorResponder from './app/controllers/httpErrorResponder'

const validator = OpenApiValidator.middleware({
  apiSpec: './docs/api/openapi.yaml',
})

const server = express()
server.use(express.json())
server.use(ctrl.cors)
server.use(logger.express)
server.use(validator)

server.post('/api/v1/users', ctrl.service(userService.handlePostUser))
server.get('/api/v1/teams', ctrl.service(teamService.handleGetTeams))
server.get('/api/v1/teams/:teamId', ctrl.service(teamService.handleDetailTeam))
server.post(
  '/api/v1/addTeamClick/:teamId',
  ctrl.service(teamService.handlePostClickForTeam)
)

server.use(httpErrorResponder)
server.use(ctrl.httpFinalHandler)

export default server
