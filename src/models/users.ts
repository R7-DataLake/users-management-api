
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

}
