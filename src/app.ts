import fastify from 'fastify'
import path from 'path';
const autoload = require('@fastify/autoload')
const requestId = require('fastify-request-id')
const helmet = require('@fastify/helmet')
const bcrypt = require('bcrypt')

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
  })
  next()
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
    searchPath: [process.env.R7PLATFORM_USM_DB_SCHEMA || 'users'],
    pool: {
      min: process.env.R7PLATFORM_USM_DB_POOL_MIN ? Number(process.env.R7PLATFORM_USM_DB_POOL_MIN) : 0,
      max: process.env.R7PLATFORM_USM_DB_POOL_MAX ? Number(process.env.R7PLATFORM_USM_DB_POOL_MAX) : 10
    },
    debug: process.env.R7PLATFORM_USM_DB_DEBUG === "Y" ? true : false,
  }
})

// JWT
app.register(require('./plugins/jwt'), {
  secret: process.env.R7PLATFORM_USM_SECRET_KEY || '',
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

app.decorate('hashPassword', async (password: any) => {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
})

// verify password
app.decorate('verifyPassword', async (password: any, hash: any) => {
  return bcrypt.compare(password, hash)
})

// routes
app.register(require("./routes/health_check"), { prefix: '/health-check' })
app.register(require("./routes/hospitals"), { prefix: '/hospitals' })
app.register(require("./routes/libs"), { prefix: '/libs' })
app.register(require("./routes/login"), { prefix: '/login' })
app.register(require("./routes/users"), { prefix: '/users' })
app.register(require("./routes/zones"), { prefix: '/zones' })
app.register(require("./routes/report"), { prefix: '/reports' })

export default app;
