
export class UserModel {

  constructor () { }

  async list(postgrest: any, province_code: any) {
    let query = postgrest
      .from('users')
      .select('id,first_name,last_name,hospcode,username,ingress_zone,enabled,hospitals(hospname)')
      .order('first_name', { ascending: true })

    if (province_code) {
      query.eq('province_code', province_code)
    }

    return await query;
  }

  async save(postgrest: any, user: object) {
    return await postgrest.from('users')
      .insert(user)
  }

  async changePassword(postgrest: any, id: any, password: any) {
    return await postgrest.from('users')
      .update({ password })
      .eq('id', id)
  }

}
