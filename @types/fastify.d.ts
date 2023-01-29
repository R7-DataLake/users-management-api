import * as jsonwebtoken from 'jsonwebtoken';
import { AxiosInstance } from 'axios';
import knex from 'knex';


declare module 'fastify' {
  interface FastifyInstance {
    jwt: jsonwebtoken
    authenticate: any
    db: knex
    reqId: any
    hashPassword: any
  }

  interface FastifyRequest {
    jwtVerify: any
    user: any
  }

}
