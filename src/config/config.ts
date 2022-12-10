import { createLoader, safeValues, values } from 'configuru'
import { Level } from 'pino'

const loader = createLoader({
  defaultConfigPath: '.env.json',
})

const configSchema = {
  server: {
    port: loader.number('PORT'),
    nodeEnv: loader.custom(x => x as 'development' | 'production')('NODE_ENV'),
  },
  logger: {
    defaultLevel: loader.custom(x => x as Level)('LOGGER_DEFAULT_LEVEL'),
    pretty: loader.bool('LOGGER_PRETTY'),
  },
  authentication: {
    jwtSecret: loader.string.hidden('JWT_SECRET'),
    tokenExpiresIn: 3600 * 24, // 1 day
  },
  firebase: {
    serviceAccount: loader.json.hidden('SERVICE_ACCOUNT'),
    databaseUrl: loader.string.hidden('FIREBASE_DATABASE_URL'),
  },
}

export default values(configSchema)
export const safeConfig = safeValues(configSchema)
