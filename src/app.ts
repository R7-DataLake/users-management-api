import fastify from 'fastify'
import path, { join } from 'path';
const autoload = require('@fastify/autoload')
const requestId = require('fastify-request-id')
const helmet = require('@fastify/helmet')

require('dotenv').config({ path: join(__dirname, '../config.conf') })

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
    'X-Processed-By': process.env.USM_R7_SERVICE_HOSTNAME || 'dummy-server',
  });
  next();
});

// PostgREST
app.register(require('./plugins/postgrest'), {
  url: process.env.USM_PGRST_URL,
  key: process.env.USM_PGRST_KEY,
  schema: process.env.USM_PGRS_SCHEMA
})

// JWT
app.register(require('./plugins/jwt'), {
  secret: process.env.USM_SECRET_KEY || '@1234567890@',
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

// routes
app.register(autoload, {
  dir: path.join(__dirname, 'routes')
})

export default app;
