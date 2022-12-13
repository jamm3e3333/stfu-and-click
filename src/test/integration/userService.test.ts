import * as teamRepository from '../../app/repositories/teamRepository'
import * as userRepository from '../../app/repositories/userRepository'
import * as testing from '../setup'
import * as crypto from 'crypto'

describe('Create', () => {
  test('Create user', async () => {
    const userCtx = {
      email: getRandomEmail(),
      teamName: getRandomTeamName(),
    }
    const response = await testing.request().post('/api/v1/users').send(userCtx)
    expect(response.statusCode).toEqual(200)
    expect(response.body).toMatchObject({
      email: userCtx.email,
    })

    const [team] = await teamRepository.getTeamForId({
      id: response.body.teamId,
    })
    const [user] = await userRepository.getUserForEmail(userCtx.email)

    expect(team).toBeDefined()
    expect(team.name).toEqual(userCtx.teamName)
    expect(user.email).toEqual(userCtx.email)
    expect(user.teamId).toEqual(team.id)
  })
})

function getRandomEmail() {
  return `${crypto.randomBytes(5).toString('hex')}@gmail.com`
}

function getRandomTeamName() {
  return crypto.randomBytes(5).toString('hex')
}
