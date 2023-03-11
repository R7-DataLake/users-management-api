import { Knex } from 'knex'
export class LoginModel {

  constructor () { }

  async adminLogin(db: Knex, username: any) {
    return await db
      .from('admin')
      .select('id', 'password')
      .where('username', username)
      .where('enabled', true)
      .first()
  }

}
