import { Knex } from 'knex'

import { ICreateUser, IUpdateUser } from "../types/user";

export class UserModel {

  constructor () { }

  async list(db: Knex, zone_code: any) {
    let query = db
      .from('users as u')
      .innerJoin('hospitals as h', 'h.hospcode', 'u.hospcode')
      .innerJoin('zones as z', 'z.code', 'h.zone_code')
      .select(
        'u.id', 'u.first_name', 'u.last_name',
        'u.username', 'u.enabled', 'u.is_deleted',
        'u.email', 'u.last_login', 'h.hospcode', 'h.hospname', 'z.name as zone_name', 'z.ingress_zone')


    if (zone_code) {
      query.where('h.zone_code', zone_code)
    }

    return await query
      .orderBy('u.first_name', 'asc')
      .limit(100);
  }

  async save(db: Knex, user: ICreateUser) {
    return await db.from('users')
      .insert(user)
  }

  async changePassword(db: Knex, id: any, password: any) {
    return await db.from('users')
      .update({ password })
      .where('id', id)
  }

  async update(db: Knex, id: any, user: IUpdateUser) {
    return await db.from('users')
      .update(user)
      .where('id', id)
  }

  async delete(db: Knex, id: any) {
    return await db.from('users')
      .update({ 'is_deleted': true })
      .where('id', id)
  }

}
