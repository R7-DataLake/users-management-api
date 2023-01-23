import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes';

const bcrypt = require('bcrypt');

import { UserModel } from '../models/users'
import removeSchema from '../schema/user/remove';
import createUserSchema from '../schema/user/create';
import updateUserSchema from '../schema/user/update';
import changePasswordSchema from '../schema/user/change_password';
import { ICreateUser, IUpdateUser } from "../types/user";

export default async (fastify: FastifyInstance) => {

  const userModel = new UserModel();
  const postgrest = fastify.postgrest;

  fastify.get('/users', {
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const query: any = request.query;
    const province_code = query.province_code;

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

  fastify.post('/users', {
    onRequest: [fastify.authenticate],
    schema: createUserSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const body: any = request.body;
    const { username, password, first_name, last_name, hospcode, ingress_zone, province_code, enabled } = body;

    try {
      const hash = bcrypt.hashSync(password, 10);
      let user: ICreateUser = {
        username: username,
        password: hash,
        first_name,
        last_name,
        hospcode,
        ingress_zone,
        enabled: enabled === 'Y' ? true : false,
        province_code
      };

      const { data, error } = await userModel.save(postgrest, user);

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

  fastify.put('/users/:id/edit', {
    onRequest: [fastify.authenticate],
    schema: updateUserSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const body: any = request.body;
    const params: any = request.params;
    const id = params.id;
    const { first_name, last_name, hospcode, ingress_zone, province_code, enabled } = body;

    try {
      let user: IUpdateUser = {
        first_name,
        last_name,
        hospcode,
        ingress_zone,
        enabled: enabled === 'Y' ? true : false,
        province_code
      };

      const { data, error } = await userModel.update(postgrest, id, user);

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

  fastify.delete('/users/:id/mark-delete', {
    onRequest: [fastify.authenticate],
    schema: removeSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const params: any = request.params;
    const id = params.id;

    try {
      const { data, error } = await userModel.delete(postgrest, id);

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

  fastify.put('/users/change-password', {
    onRequest: [fastify.authenticate],
    schema: changePasswordSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const body: any = request.body;
    const { id, password } = body;

    try {
      const hash = bcrypt.hashSync(password, 10);
      const { data, error } = await userModel.changePassword(postgrest, id, hash);

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
