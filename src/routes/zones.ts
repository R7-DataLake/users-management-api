import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes';

import { ZoneModel } from '../models/zone';

export default async (fastify: FastifyInstance) => {

  const zoneModel = new ZoneModel();
  const postgrest = fastify.postgrest;

  fastify.get('/zones', {
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      const { data, error } = await zoneModel.list(postgrest);

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
