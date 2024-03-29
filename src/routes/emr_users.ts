import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes'
import { Knex } from "knex"

import { EMRUserModel } from '../models/emr_user'
import activeSchema from '../schema/user/active'
import createUserSchema from '../schema/emr_user/create'
import updateUserSchema from '../schema/emr_user/update'
import changePasswordSchema from '../schema/emr_user/change_password'
import { ICreateEMRUser, IUpdateEMRUser } from "../types/emr_user"

export default async (fastify: FastifyInstance) => {

  const userModel = new EMRUserModel()
  const db: Knex = fastify.db

  fastify.get('/', {
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const query: any = request.query
    const zone_code = query.zone_code

    try {
      const data = await userModel.list(db, zone_code)
      reply
        .status(StatusCodes.OK)
        .send(data)

    } catch (error: any) {
      request.log.error(error)
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        })
    }
  })

  fastify.get('/:id/info', {
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const params: any = request.params
    const id = params.id

    try {
      const data = await userModel.info(db, id)
      reply
        .status(StatusCodes.OK)
        .send(data)

    } catch (error: any) {
      request.log.error(error)
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        })
    }
  })

  fastify.post('/', {
    onRequest: [fastify.authenticate],
    schema: createUserSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const body: any = request.body
    const {
      cid, password,
      first_name, last_name,
      hospcode, enabled,
      email } = body

    try {
      const hash = await fastify.hashPassword(password)
      let user: ICreateEMRUser = {
        cid: cid,
        password: hash,
        first_name,
        last_name,
        hospcode,
        enabled: enabled === 'Y' ? true : false,
        email
      };

      await userModel.save(db, user)

      reply
        .status(StatusCodes.CREATED)
        .send(getReasonPhrase(StatusCodes.CREATED))

    } catch (error: any) {
      request.log.error(error)
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
  })

  fastify.put('/:id/edit', {
    onRequest: [fastify.authenticate],
    schema: updateUserSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const body: any = request.body
    const params: any = request.params
    const id = params.id
    const { first_name, last_name, hospcode, enabled, email } = body

    try {
      let user: IUpdateEMRUser = {
        first_name,
        last_name,
        hospcode,
        enabled: enabled === 'Y' ? true : false,
        email
      };

      await userModel.update(db, id, user)

      reply
        .status(StatusCodes.OK)
        .send(getReasonPhrase(StatusCodes.OK))

    } catch (error: any) {
      request.log.error(error)
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        })
    }
  })

  fastify.put('/:id/delete', {
    onRequest: [fastify.authenticate],
    schema: activeSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const params: any = request.params
    const id = params.id

    try {
      await userModel.delete(db, id)

      reply
        .status(StatusCodes.OK)
        .send(getReasonPhrase(StatusCodes.OK))

    } catch (error: any) {
      request.log.error(error)
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        })
    }
  })

  fastify.put('/:id/cancel-delete', {
    onRequest: [fastify.authenticate],
    schema: activeSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const params: any = request.params
    const id = params.id

    try {
      await userModel.cancelDelete(db, id)

      reply
        .status(StatusCodes.OK)
        .send(getReasonPhrase(StatusCodes.OK))

    } catch (error: any) {
      request.log.error(error)
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        })
    }
  })

  fastify.put('/change-password', {
    onRequest: [fastify.authenticate],
    schema: changePasswordSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const body: any = request.body
    const { id, password } = body

    try {
      const hash = await fastify.hashPassword(password)
      await userModel.changePassword(db, id, hash)

      reply
        .status(StatusCodes.OK)
        .send(getReasonPhrase(StatusCodes.OK))

    } catch (error: any) {
      request.log.error(error)
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        })
    }
  })

} 
