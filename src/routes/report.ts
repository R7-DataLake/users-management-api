import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { Knex } from 'knex';
import { DateTime } from 'luxon';

import { ReportModel } from '../models/report';

export default async (fastify: FastifyInstance) => {

  const reportModel = new ReportModel();
  const db: Knex = fastify.db;

  fastify.get('/total-users', {
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      const data = await reportModel.getTotalUsers(db);
      const results: any[] = data.rows;
      reply
        .status(StatusCodes.OK)
        .send({ results });

    } catch (error: any) {
      request.log.error(error);
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
  });

  fastify.get('/last-sending', {
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const query: any = request.query;
    let { start, end } = query;

    start = DateTime.fromFormat(start, "yyyyMMdd").toSQLDate();
    end = DateTime.fromFormat(end, "yyyyMMdd").toSQLDate();

    try {
      const data = await reportModel.getLastSending(db, start, end);
      const results: any[] = data.rows;
      reply
        .status(StatusCodes.OK)
        .send({ results })

    } catch (error: any) {
      request.log.error(error)
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        })
    }
  });

  fastify.get('/hospital-last-send', {
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      const data = await reportModel.getHospitalLastSend(db);
      const results: any[] = data.rows;
      reply
        .status(StatusCodes.OK)
        .send({ results });

    } catch (error: any) {
      request.log.error(error);
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
  });


  fastify.get('/donot-send', {
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      const data = await reportModel.getHospitalLastNotSend(db);
      const results: any[] = data.rows;
      reply
        .status(StatusCodes.OK)
        .send({ results });

    } catch (error: any) {
      request.log.error(error);
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
  });

} 
