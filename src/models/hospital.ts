import { Knex } from 'knex'
import { ICreateHospital, IUpdateHospital } from "../types/hospital";
export class HospitalModel {

  constructor () { }

  async list(db: Knex, zone_code: any) {
    let query = db
      .from('hospitals as h')
      .select('h.hospcode', 'h.hospname', 'h.enabled', 'h.is_deleted')
      .innerJoin('zones as z', 'z.code', 'h.zone_code')
      .orderBy('h.hospname', 'asc')

    if (zone_code) {
      query.where('h.zone_code', zone_code)
    }

    return query.limit(100);
  }

  async save(db: Knex, hospital: ICreateHospital) {
    return db.from('hospitals')
      .insert(hospital)
  }

  async update(db: Knex, hospcode: any, hospital: IUpdateHospital) {
    return db.from('hospitals')
      .update(hospital)
      .where('hospcode', hospcode)
  }

  async delete(db: Knex, hospcode: any) {
    return db.from('hospitals')
      .update({ 'is_deleted': true })
      .where('hospcode', hospcode)
  }

}
