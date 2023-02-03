import { Knex } from 'knex'

export class ZoneModel {

  constructor () { }

  async list(db: Knex) {
    return await db
      .from('zones')
      .select()
      .where('enabled', true)
      .orderBy('name', 'asc')
  }

}
