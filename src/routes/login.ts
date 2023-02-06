import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes'

const randomstring = require('randomstring')
import { Knex } from "knex"

import { LoginModel } from '../models/login'
import loginSchema from '../schema/login'

export default async (fastify: FastifyInstance) => {

  const loginModel = new LoginModel()
  const db: Knex = fastify.db

  fastify.post('/', {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: '1 minute'
      }
    },
    schema: loginSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body: any = request.body
    const { username, password } = body

    try {
      const data = await loginModel.adminLogin(db, username)

      if (data) {
        const hashPassword: any = data.password
        const match: any = await fastify.verifyPassword(password, hashPassword)

        if (match) {
          const payload: any = { sub: data.id }
          const token = fastify.jwt.sign(payload)
          reply
            .status(StatusCodes.OK)
            .send({
              status: 'success',
              access_token: token
            })
        } else {
          reply
            .status(StatusCodes.UNAUTHORIZED)
            .send({
              status: 'error',
              error: {
                code: StatusCodes.UNAUTHORIZED,
                message: 'Username or Password invalid.'
              }

            })
        }

      } else {
        reply
          .status(StatusCodes.UNAUTHORIZED)
          .send({
            status: 'error',
            error: {
              code: StatusCodes.UNAUTHORIZED,
              message: getReasonPhrase(StatusCodes.UNAUTHORIZED)
            }

          })
      }

    } catch (error: any) {
      request.log.error(error)
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          status: 'error',
          error: {
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
          }

        })
    }
  })

  fastify.get('/genpass', {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: '1 minute'
      }
    }
  }, async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const password: any = randomstring.generate(8)
      const hash = await fastify.hashPassword(password)
      reply.status(StatusCodes.OK).send({ password, hash })
    } catch (error: any) {
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
    }
  })

} 
