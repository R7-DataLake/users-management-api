import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes';

const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
import { Knex } from "knex";

import { LoginModel } from '../models/login'
import loginSchema from '../schema/login';

export default async (fastify: FastifyInstance) => {

  const loginModel = new LoginModel();
  const db: Knex = fastify.db;

  fastify.post('/login', {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: '1 minute'
      }
    },
    schema: loginSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body: any = request.body;
    const username = body.username;
    const password = body.password;

    try {
      const data = await loginModel.adminLogin(db, username);

      const hash: any = data.password;

      const isOk: any = bcrypt.compareSync(password, hash);

      if (isOk) {
        const payload: any = { sub: data.id, ingress_zone: data.ingress_zone }
        const token = fastify.jwt.sign(payload);
        reply
          .status(StatusCodes.OK)
          .send({ access_token: token });
      } else {
        reply
          .status(StatusCodes.UNAUTHORIZED)
          .send({
            code: StatusCodes.UNAUTHORIZED,
            error: getReasonPhrase(StatusCodes.UNAUTHORIZED)
          });
      }

    } catch (error: any) {
      request.log.error(error);
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
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
      const password: any = randomstring.generate(8);
      const hash = bcrypt.hashSync(password, 10);
      reply.status(StatusCodes.OK).send({ password, hash })
    } catch (e) {
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
    }
  })

} 
