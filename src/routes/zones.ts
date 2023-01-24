import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes';
import { Knex } from "knex";

import { ZoneModel } from '../models/zone';

export default async (fastify: FastifyInstance) => {

  const zoneModel = new ZoneModel();
  const db: Knex = fastify.db;

  fastify.get('/zones', {
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      const data = await zoneModel.list(db);

      reply
        .status(StatusCodes.OK)
        .send(data);

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
