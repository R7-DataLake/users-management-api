import fastify from 'fastify'
import path from 'path';
const autoload = require('@fastify/autoload')
const requestId = require('fastify-request-id')
const helmet = require('@fastify/helmet')
const crypto = require('crypto')

const app = fastify({
  logger: {
    transport:
      process.env.NODE_ENV === 'development'
        ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
            colorize: true
          }
        }
        : undefined
  }
})

// Plugins
app.register(require('@fastify/formbody'))
app.register(require('@fastify/cors'))
app.register(requestId());
app.register(
  helmet,
  { contentSecurityPolicy: false }
)
// Rate limit
app.register(import('@fastify/rate-limit'), {
  global: false,
  max: 100,
  timeWindow: '1 minute'
})

app.addHook('onSend', (request: any, reply: any, playload: any, next: any) => {
  reply.headers({
    'X-Powered-By': 'R7 Health Platform System',
    'X-Processed-By': process.env.R7PLATFORM_USM_SERVICE_HOSTNAME || 'dummy-server',
  });
  next();
});

// Database
app.register(require('./plugins/db'), {
  options: {
    client: 'pg',
    connection: {
      host: process.env.R7PLATFORM_USM_DB_HOST || 'localhost',
      user: process.env.R7PLATFORM_USM_DB_USER || 'postgres',
      port: Number(process.env.R7PLATFORM_USM_DB_PORT) || 5432,
      password: process.env.R7PLATFORM_USM_DB_PASSWORD || '',
      database: process.env.R7PLATFORM_USM_DB_NAME || 'test',
    },
    searchPath: [process.env.R7PLATFORM_USM_DB_SCHEMA || 'public'],
    pool: {
      min: 10,
      max: 500
    },
    debug: process.env.R7PLATFORM_USM_DB_DEBUG === "Y" ? true : false,
  }
})

// JWT
app.register(require('./plugins/jwt'), {
  secret: process.env.R7PLATFORM_USM_SECRET_KEY || '@1234567890@',
  sign: {
    iss: 'r7.moph.go.th',
    expiresIn: '1d'
  },
  messages: {
    badRequestErrorMessage: 'Format is Authorization: Bearer [token]',
    noAuthorizationInHeaderMessage: 'Autorization header is missing!',
    authorizationTokenExpiredMessage: 'Authorization token expired',
    authorizationTokenInvalid: (err: any) => {
      return `Authorization token is invalid: ${err.message}`
    }
  }
})

// hash password
app.decorate('hashPassword', async (password: any) => {
  const salt = process.env.R7PLATFORM_USM_LOGIN_PASSWORD_SALT || 'gwuqpUkUm3jv07Ui0TCqZoZBuaJLztD9'
  return await crypto
    .createHash('md5')
    .update(password + salt)
    .digest('hex')
})

// routes
app.register(autoload, {
  dir: path.join(__dirname, 'routes')
})

export default app;
