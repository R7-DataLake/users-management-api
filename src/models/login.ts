import { Knex } from 'knex'
export class LoginModel {

  constructor () { }

  async adminLogin(db: Knex, username: any, password: any) {
    return await db
      .from('admin')
      .select('id')
      .where('username', username)
      .where('password', password)
      .where('enabled', true)
      .first()
  }

}
