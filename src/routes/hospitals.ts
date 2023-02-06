import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes'
import { Knex } from "knex"

import { HospitalModel } from '../models/hospital'

import removeSchema from '../schema/user/remove'
import createSchema from '../schema/hospital/create'
import updateSchema from '../schema/hospital/update'
import { ICreateHospital, IUpdateHospital } from "../types/hospital"

export default async (fastify: FastifyInstance) => {

  const hospitalModel = new HospitalModel()
  const db: Knex = fastify.db

  fastify.get('/', {
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const query: any = request.query
    const zone_code = query.zone_code

    try {
      const data = await hospitalModel.list(db, zone_code)

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
        });
    }
  })

  fastify.get('/:hospcode/info', {
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const params: any = request.params
    const hospcode = params.hospcode

    try {
      const data = await hospitalModel.info(db, hospcode)

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
        });
    }
  })

  fastify.post('/', {
    onRequest: [fastify.authenticate],
    schema: createSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const body: any = request.body
    const { hospcode, hospname, zone_code, enabled } = body

    try {
      let hospital: ICreateHospital = {
        hospcode,
        hospname,
        enabled: enabled === 'Y' ? true : false,
        zone_code
      }

      await hospitalModel.save(db, hospital)

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
        })
    }
  })

  fastify.put('/:hospcode/edit', {
    onRequest: [fastify.authenticate],
    schema: updateSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const body: any = request.body
    const params: any = request.params
    const hospcode = params.hospcode
    const { hospname, zone_code, enabled } = body

    try {
      let hospital: IUpdateHospital = {
        hospname,
        enabled: enabled === 'Y' ? true : false,
        zone_code
      };
      await hospitalModel.update(db, hospcode, hospital)
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

  fastify.delete('/:hospcode/mark-delete', {
    onRequest: [fastify.authenticate],
    schema: removeSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    const params: any = request.params
    const hospcode = params.hospcode

    try {
      await hospitalModel.delete(db, hospcode)
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
