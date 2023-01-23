import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes';

import { HospitalModel } from '../models/hospital';

import removeSchema from '../schema/user/remove';
import createSchema from '../schema/hospital/create';
import updateSchema from '../schema/hospital/update';
import { ICreateHospital, IUpdateHospital } from "../types/hospital";

export default async (fastify: FastifyInstance) => {

  const hospitalModel = new HospitalModel();
  const postgrest = fastify.postgrest;

  fastify.get('/hospitals', {
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const query: any = request.query;
    const province_code = query.province_code;

    try {
      const { data, error } = await hospitalModel.list(postgrest, province_code);

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

  fastify.post('/hospitals', {
    onRequest: [fastify.authenticate],
    schema: createSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const body: any = request.body;
    const { hospcode, hospname, province_code, enabled } = body;

    try {
      let hospital: ICreateHospital = {
        hospcode,
        hospname,
        enabled: enabled === 'Y' ? true : false,
        province_code
      };

      const { data, error } = await hospitalModel.save(postgrest, hospital);

      if (error) {
        request.log.error(error);
        reply
          .status(StatusCodes.BAD_GATEWAY)
          .send(error)
      } else {
        reply
          .status(StatusCodes.CREATED)
          .send(getReasonPhrase(StatusCodes.CREATED));
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

  fastify.put('/hospitals/:hospcode/edit', {
    onRequest: [fastify.authenticate],
    schema: updateSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const body: any = request.body;
    const params: any = request.params;
    const hospcode = params.hospcode;
    const { hospname, province_code, enabled } = body;

    try {
      let hospital: IUpdateHospital = {
        hospname,
        enabled: enabled === 'Y' ? true : false,
        province_code
      };

      const { data, error } = await hospitalModel.update(postgrest, hospcode, hospital);

      if (error) {
        request.log.error(error);
        reply
          .status(StatusCodes.BAD_GATEWAY)
          .send(error)
      } else {
        reply
          .status(StatusCodes.OK)
          .send(getReasonPhrase(StatusCodes.OK));
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

  fastify.delete('/hospitals/:hospcode/mark-delete', {
    onRequest: [fastify.authenticate],
    schema: removeSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const params: any = request.params;
    const hospcode = params.hospcode;

    try {
      const { data, error } = await hospitalModel.delete(postgrest, hospcode);

      if (error) {
        request.log.error(error);
        reply
          .status(StatusCodes.BAD_GATEWAY)
          .send(error)
      } else {
        reply
          .status(StatusCodes.OK)
          .send(getReasonPhrase(StatusCodes.OK));
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
