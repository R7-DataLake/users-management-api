import { Knex } from 'knex'

import { ICreateEMRUser, IUpdateEMRUser } from "../types/emr_user";

export class EMRUserModel {

  constructor () { }

  async list(db: Knex, zone_code: any) {
    let query = db
      .from('emr_users as u')
      .innerJoin('hospitals as h', 'h.hospcode', 'u.hospcode')
      .innerJoin('zones as z', 'z.code', 'h.zone_code')
      .select(
        'u.id', 'u.first_name', 'u.last_name',
        'u.cid', 'u.enabled', 'u.is_deleted', 'u.verify_datetime', 'u.is_verified',
        'u.email', 'u.last_login', 'h.hospcode', 'h.hospname', 'z.name as zone_name', 'z.ingress_zone')

    if (zone_code) {
      query.where('h.zone_code', zone_code)
    }

    return query
      .orderByRaw('u.first_name asc, z.name asc')
      .limit(100)
  }

  async info(db: Knex, id: any) {
    return db
      .from('emr_users as u')
      .innerJoin('hospitals as h', 'h.hospcode', 'u.hospcode')
      .innerJoin('zones as z', 'z.code', 'h.zone_code')
      .select(
        'u.id', 'u.first_name', 'u.last_name',
        'u.cid', 'u.enabled', 'u.is_deleted',
        'u.email', 'u.last_login', 'h.hospcode', 'h.zone_code', 'h.hospname', 'z.name as zone_name', 'z.ingress_zone')
      .where('u.id', id)
      .first()
  }

  async save(db: Knex, user: ICreateEMRUser) {
    return db.from('emr_users')
      .insert(user)
  }

  async changePassword(db: Knex, id: any, password: any) {
    return db.from('emr_users')
      .update({ password })
      .where('id', id)
  }

  async update(db: Knex, id: any, user: IUpdateEMRUser) {
    return db.from('emr_users')
      .update(user)
      .where('id', id)
  }

  async delete(db: Knex, id: any) {
    return db.from('emr_users')
      .update({ 'is_deleted': true })
      .where('id', id)
  }

  async cancelDelete(db: Knex, id: any) {
    return db.from('emr_users')
      .update({ 'is_deleted': false })
      .where('id', id)
  }

}
