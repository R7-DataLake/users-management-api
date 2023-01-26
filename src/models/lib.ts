import { Knex } from 'knex'

export class LibModel {

  constructor () { }

  async hospitals(db: Knex, zone_code: any) {
    let query = db
      .from('hospitals as h')
      .innerJoin('zones as z', 'z.code', 'h.zone_code')
      .select('h.hospcode', 'h.hospname', 'h.zone_code', 'z.code as zone_code', 'z.ingress_zone')
      .orderBy('h.hospname', 'asc')
      .where('h.zone_code', zone_code)
      .where('h.is_deleted', false)
      .where('h.enabled', true);

    return query.limit(100);
  }

  async zones(db: Knex) {
    return db
      .from('zones')
      .select()
      .orderBy('name', 'asc')
      .where('enabled', true);
  }

}
