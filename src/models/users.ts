import { ICreateUser, IUpdateUser } from "../types/user";

export class UserModel {

  constructor () { }

  async list(postgrest: any, province_code: any) {
    let query = postgrest
      .from('users')
      .select('id,first_name,last_name,hospcode,username,ingress_zone,enabled,is_deleted,hospitals(hospname)')
      .order('first_name', { ascending: true })

    if (province_code) {
      query.eq('province_code', province_code)
    }

    return await query;
  }

  async save(postgrest: any, user: ICreateUser) {
    return await postgrest.from('users')
      .insert(user)
  }

  async changePassword(postgrest: any, id: any, password: any) {
    return await postgrest.from('users')
      .update({ password })
      .eq('id', id)
  }

  async update(postgrest: any, id: any, user: IUpdateUser) {
    return await postgrest.from('users')
      .update(user)
      .eq('id', id)
  }

  async delete(postgrest: any, id: any) {
    return await postgrest.from('users')
      .update({ 'is_deleted': true })
      .eq('id', id)
  }

}
