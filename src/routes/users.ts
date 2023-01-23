import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes';

const bcrypt = require('bcrypt');

import { UserModel } from '../models/users'
import loginSchema from '../schema/login';

export default async (fastify: FastifyInstance) => {

  const userModel = new UserModel();
  const postgrest = fastify.postgrest;

  fastify.get('/users', {
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query: any = request.query;

    const province_code = query.province_code;

    console.log(request.query);

    try {
      const { data, error } = await userModel.list(postgrest, province_code);

      if (error) {
        request.log.error(error);
        reply
          .status(StatusCodes.BAD_GATEWAY)
          .send({
            code: error.code,
            details: error.details,
            message: error.message
          })
      } else {
        reply
          .status(StatusCodes.OK)
          .send(data);
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

} 
